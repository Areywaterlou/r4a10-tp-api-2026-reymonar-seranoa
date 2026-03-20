/**
 * fichier qui démarre tout au chargement de la page. Il initialise le contrôleur.
 */

import RechercheView from './views/RechercheView.js';
import RechercheController from './controllers/RechercheController.js';

import ResultatView from './views/ResultatView.js';
import ResultatController from './controllers/ResultatController.js';

document.addEventListener('DOMContentLoaded', () => {
    const barreRecherche = document.getElementById("cryptoInput");
    const logoResultat = document.querySelector(".main-logo");

    if (barreRecherche) {
        // ---> ON EST SUR LA PAGE ACCUEIL (index.html)
        console.log("Démarrage du mode Recherche...");
        const view = new RechercheView();
        const app = new RechercheController(view); 
        app.init();
    } 
    else if (logoResultat) {
        // ---> ON EST SUR LA PAGE RÉSULTAT (resultat.html)
        console.log("Démarrage du mode Résultat...");
        const view = new ResultatView();
        const app = new ResultatController(view);
        app.init();
    }
});