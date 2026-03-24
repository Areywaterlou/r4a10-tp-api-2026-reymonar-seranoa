import Crypto from "../models/CryptoModel.js";

export default class ResultatController {
    constructor(view) {
        this.view = view;
    }

    async init() {
        if (this.view.btnRechercher && this.view.barreRecherche) {
            this.view.btnRechercher.addEventListener('click', () => {
                this.lancerNouvelleRecherche(this.view.getSaisie());
            });
            this.view.barreRecherche.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.lancerNouvelleRecherche(this.view.getSaisie());
                }
            });
        }

        const params = new URLSearchParams(window.location.search);
        const id = params.get('id'); 
        if (id) {
            this.chargerDonnees(id);
        }
    }

    async lancerNouvelleRecherche(saisie) {
        if(!saisie) return;
        try {
            const urlRecherche = `https://api.coingecko.com/api/v3/search?query=${saisie}`;
            const reponse = await fetch(urlRecherche);
            
            if (reponse.status === 429) {
                this.view.afficherErreurRateLimit();
                return;
            }
            
            const donnees = await reponse.json();
            
            if (donnees.coins && donnees.coins.length > 0) {
                const rechercheMinuscule = saisie.toLowerCase();
                const tokenExact = donnees.coins.find(c => c.symbol && c.symbol.toLowerCase() === rechercheMinuscule);
                const idOfficiel = tokenExact ? tokenExact.id : donnees.coins[0].id; 
                
                window.location.href = `resultat.html?id=${idOfficiel}`;
            } else {
                alert("Aucune crypto trouvée.");
            }
        } catch (error) {
            console.error("Erreur interceptée par le catch :", error);
            
            if (this.view && typeof this.view.afficherErreurRateLimit === "function") {
                this.view.afficherErreurRateLimit();
            } else {
                alert("Erreur réseau ou API saturée. Attendez un peu.");
            }
        }
    }

    async chargerDonnees(id) {
        try {
            const repInfo = await fetch(`https://api.coingecko.com/api/v3/search?query=${id}`);
            
            if (repInfo.status === 429) {
                this.view.afficherErreurRateLimit();
                return;
            }

            const dataInfo = await repInfo.json();
            if (!dataInfo.coins || dataInfo.coins.length === 0) return;

            const base = dataInfo.coins.find(c => c.id === id) || dataInfo.coins[0];
            const idOfficiel = base.id;

            let estFavoriActuel = false;
            try {
                const favEnregistre = await Crypto.retrieveFavIdToServer();
                if (favEnregistre && favEnregistre.find(f => f.id === idOfficiel)) {
                    estFavoriActuel = true;
                }
            } catch (e) {
                console.log("Erreur lecture favoris");
            }

            const suggerees = dataInfo.coins.filter(c => c.id !== idOfficiel).slice(0, 5); 

            const repPrix = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${idOfficiel}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`);
            
            if (repPrix.status === 429) {
                this.view.afficherErreurRateLimit();
                return;
            }

            const dataPrix = await repPrix.json();
            const prix = dataPrix[idOfficiel];

            if (prix && base) {
                const maCrypto = new Crypto(
                    idOfficiel, base.name, base.symbol, base.market_cap_rank, base.thumb, base.large,
                    prix.usd, prix.usd_24h_change, prix.usd_24h_vol, prix.usd_market_cap, estFavoriActuel
                );
                
                this.view.afficherResultat(maCrypto);
                this.view.afficherSuggestions(suggerees);
                this.view.majBoutonFavori(estFavoriActuel);

                this.rafraichirListeFavoris(idOfficiel, maCrypto);

                this.view.btnFavori.onclick = async () => {
                    const nouvelEtat = !maCrypto.isFav();
                    maCrypto.setFav(nouvelEtat);
                    this.view.majBoutonFavori(nouvelEtat);
                    maCrypto.saveFavToServer(); 
                    this.rafraichirListeFavoris(idOfficiel, maCrypto);
                };
            }
        } catch (error) {
            console.error("Erreur interceptée par le catch :", error);
            
            if (this.view && typeof this.view.afficherErreurRateLimit === "function") {
                this.view.afficherErreurRateLimit();
            } else {
                alert("Erreur réseau ou API saturée. Attendez un peu.");
            }
        }
    }
    
    async rafraichirListeFavoris(idOfficielActuel, objetCryptoActuel) {
        const favStocke = await Crypto.retrieveFavIdToServer();
        this.view.afficherFavoris(
            favStocke, 
            (id) => { window.location.href = `resultat.html?id=${id}`; },
            (idASupprimer) => {
                let favoris = JSON.parse(localStorage.getItem('mesFavoris')) || [];
                favoris = favoris.filter(f => f.id !== idASupprimer);
                localStorage.setItem('mesFavoris', JSON.stringify(favoris));
                
                if (idASupprimer === idOfficielActuel && objetCryptoActuel) {
                    objetCryptoActuel.setFav(false);
                    this.view.majBoutonFavori(false);
                }
                
                this.rafraichirListeFavoris(idOfficielActuel, objetCryptoActuel); 
            }
        );
    }
}