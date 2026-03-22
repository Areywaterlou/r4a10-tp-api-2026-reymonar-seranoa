import Crypto from "../models/CryptoModel.js";

export default class ResultatController {
    constructor(view) {
        this.view = view;
    }

    async init() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id'); 

        if (id) {
            this.chargerDonnees(id);
        }
    }

    async chargerDonnees(id) {
        try {

            const repInfo = await fetch(`https://api.coingecko.com/api/v3/search?query=${id}`);
            
            if (repInfo.status === 429) {
                alert("L'API a besoin de souffler. Attends 1 minute !");
                return;
            }

            const dataInfo = await repInfo.json();
            
            if (!dataInfo.coins || dataInfo.coins.length === 0) return;

            const base = dataInfo.coins.find(c => c.id === id) || dataInfo.coins[0];
            const idOfficiel = base.id;

            let estFavoriActuel = false;
            try {
                const favEnregistre = await Crypto.retrieveFavIdToServer();

                if (favEnregistre && favEnregistre.id === idOfficiel) {
                    estFavoriActuel = true;
                }
            } catch (e) {
                console.log("Pas encore de favori enregistré");
            }

            const suggerees = dataInfo.coins.filter(c => c.id !== idOfficiel).slice(0, 5); 

            
            const repPrix = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${idOfficiel}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`);
            
            if (repPrix.status === 429) {
                alert("Trop de recherches ! Patiente un instant...");
                return;
            }

            const dataPrix = await repPrix.json();
            const prix = dataPrix[idOfficiel];

            if (prix && base) {
                const maCrypto = new Crypto(
                    idOfficiel,
                    base.name,
                    base.symbol,
                    base.market_cap_rank,
                    base.thumb,
                    base.large,
                    prix.usd,
                    prix.usd_24h_change,
                    prix.usd_24h_vol,
                    prix.usd_market_cap,
                    estFavoriActuel
                );
                
                const favStocke = await Crypto.retrieveFavIdToServer();
                this.view.afficherFavoris(favStocke, (id) => {
                    window.location.href = `resultat.html?id=${id}`;
                });

                this.view.afficherResultat(maCrypto);
                this.view.afficherSuggestions(suggerees);
                this.view.majBoutonFavori(estFavoriActuel);

                // Gestion du bouton favori
                this.view.btnFavori.onclick = () => {
                    const nouvelEtat = !maCrypto.isFav();
                    maCrypto.setFav(nouvelEtat);
                    this.view.majBoutonFavori(nouvelEtat);
                    maCrypto.saveFavToServer();
                };

                //affichage des favoris
                this.view.btnFavori.onclick = async () => {
                    const nouvelEtat = !maCrypto.isFav();
                    maCrypto.setFav(nouvelEtat);
                    this.view.majBoutonFavori(nouvelEtat);
                    
                    await maCrypto.saveFavToServer(); 

                    // On rafraîchit la liste "Mes Favoris" en bas de page
                    const updatedFav = await Crypto.retrieveFavIdToServer();

                    this.view.afficherFavoris(updatedFav, (id) => {
                        window.location.href = `resultat.html?id=${id}`;
                    });
                };
            }
        } catch (error) {
            console.error("Erreur :", error);
        }
    }
}