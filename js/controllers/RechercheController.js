import { CryptoModel } from "./CryptoModel"
import { CryptoView } from "./RechercheView"

/**
 * le lien entre l'utilisateur, le modèle et la vue
 */
export default class RechercheController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    init(){
        this.ecouteEvent();
    }

    ecouteEvent() {
        const searchBtn = document.getElementById('.search-btn');
        const input = document.getElementById('cryptoInput');

        if (searchBtn && input) {
            //ecoute du bouton de recherche
            searchBtn.addEventListener('click', () => {
                this.rechercher(input.value);
            });
            //ecoute de la touche entrée
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.rechercher(input.value);
                }
            });
        }
    }

    rechercher(saisie) {
        const nomCrypto = saisie.trim().toLowerCase();

        if (nomCrypto) {
            // Redirection vers la page dédiée
            window.location.href = `resultat.html?id=${nomCrypto}`;
        } else {
            alert("Entre le nom d'une crypto d'abord !");
        }
    }
}