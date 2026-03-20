import Crypto from "../models/CryptoModel.js";
/**
 * le lien entre l'utilisateur, le modèle et la vue
 */
export default class RechercheController {

    constructor(view) {
        this.view = view;
    }

    init(){

        this.ecouteEvent();
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
            const reponseRecherche = await fetch(urlRecherche);
            const donneesCrypto = await reponseRecherche.json();
            
            if (donneesCrypto.coins.length === 0) {
                // On utilise la méthode de la vue de ton pote pour afficher l'erreur !
                this.view.afficherMessage("Aucune crypto trouvée pour cette recherche.");
                return; // On arrête tout
            }
            
            // On récupère le bon ID officiel (ex: "bitcoin")
            const idTrouve = donneesCrypto.coins[0].id; 

            console.log("Crypto trouvée, redirection vers : resultat.html?id=" + idTrouve);

            // REDIRECTION VERS LA PAGE 2
            window.location.href = `resultat.html?id=${idTrouve}`;
            
        } catch (erreur) {
            console.error("Un problème est survenu avec l'API :", erreur);
        }
    }
}