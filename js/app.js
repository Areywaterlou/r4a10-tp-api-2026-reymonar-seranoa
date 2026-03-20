/**
 * fichier qui démarre tout au chargement de la page. Il initialise le contrôleur.
 */

import CryptoModel from './models/CryptoModel.js';
import RechercheView from './views/RechercheView.js';
import RechercheController from './controllers/RechercheController.js';

document.addEventListener('DOMContentLoaded', () => {
    const model = new CryptoModel();
    const view = new RechercheView();
    const app = new RechercheController(model, view);

    app.init();
});