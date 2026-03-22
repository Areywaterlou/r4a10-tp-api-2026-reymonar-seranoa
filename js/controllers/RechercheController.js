import Crypto from "../models/CryptoModel.js";
/**
 * le lien entre l'utilisateur, le modèle et la vue
 */
export default class RechercheController {

    constructor(view) {
        this.view = view;
    }

async init() {
    this.ecouteEvent();
    
    try {
        const fav = await Crypto.retrieveFavIdToServer();
        this.view.afficherFavoris(fav, (id) => {
            window.location.href = `resultat.html?id=${id}`;
        });
    } catch (e) {
        console.log("Erreur chargement favoris accueil");
    }
}

    ecouteEvent() {


        //ecoute du bouton de recherche
        this.view.btnRechercher.addEventListener('click', () => {
            console.log("bouton cliqué");
            this.rechercher(this.view.getSaisie());
        });
        //ecoute de la touche entrée
        this.view.barreRecherche.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.rechercher(this.view.getSaisie());
            }
        });
    }


async rechercher(saisie) {
    try {
        const urlRecherche = `https://api.coingecko.com/api/v3/search?query=${saisie}`;
        const reponse = await fetch(urlRecherche);
        const donnees = await reponse.json();
        
        if (donnees.coins && donnees.coins.length > 0) {
            
            const idOfficiel = donnees.coins[0].id; 
            window.location.href = `resultat.html?id=${idOfficiel}`;
        } else {
            this.view.afficherMessage("Aucune crypto trouvée.");
        }
    } catch (erreur) {
        console.error("Erreur recherche :", erreur);
    }
}
}