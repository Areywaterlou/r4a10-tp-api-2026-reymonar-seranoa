import RechercheView from './views/RechercheView.js';
import RechercheController from './controllers/RechercheController.js';

import ResultatView from './views/ResultatView.js';
import ResultatController from './controllers/ResultatController.js';

document.addEventListener('DOMContentLoaded', () => {

    const cheminActuel = window.location.pathname;

    if (cheminActuel.includes("resultat.html")) {
        console.log("🚀 Démarrage du mode Résultat...");
        const view = new ResultatView();
        const app = new ResultatController(view);
        app.init();
    } else {
        console.log("🏠 Démarrage du mode Accueil...");
        const view = new RechercheView();
        const app = new RechercheController(view); 
        app.init();
    }
});