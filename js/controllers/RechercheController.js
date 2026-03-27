import Crypto from "../models/CryptoModel.js";

export default class RechercheController {
    constructor(view) {
        this.view = view;
    }

    async init() {
        this.ecouteEvent();
        this.chargerEtAfficherFavoris(); 
    }
    /**
     * Méthode pour charger et afficher les favoris dans la bonne page
     */
    async chargerEtAfficherFavoris() {
        const listeFavoris = await Crypto.retrieveFavIdToServer();
        
        this.view.afficherFavoris(
            listeFavoris, 
            (id) => { window.location.href = `resultat.html?id=${id}`; },
            (idASupprimer) => {
                let favoris = JSON.parse(localStorage.getItem('mesFavoris')) || [];
                favoris = favoris.filter(f => f.id !== idASupprimer);
                localStorage.setItem('mesFavoris', JSON.stringify(favoris));
                this.chargerEtAfficherFavoris();
            }
        );
    }

    ecouteEvent() {
        if (this.view.btnRechercher) {
            this.view.btnRechercher.addEventListener('click', () => {
                this.rechercher(this.view.getSaisie());
            });
        }
        if (this.view.barreRecherche) {
            this.view.barreRecherche.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.rechercher(this.view.getSaisie());
                }
            });
        }
    }
    /**
     * Méthode pour rechercher une crypto
     * @param {*} saisie 
     * @returns 
     */
    async rechercher(saisie) {
        if (!saisie) return; 

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
                this.view.afficherMessage("Aucune crypto trouvée.");
            }
        } catch (error) {
            console.error("Erreur interceptée par le catch :", error);
            
            if (this.view && typeof this.view.afficherErreurRateLimit === "function") {
                this.view.afficherErreurRateLimit();
            } else {
                alert("Erreur réseau ou API saturée. Attendez un peu .");
            }
        }
    }
}