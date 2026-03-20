/**
 * fichier qui démarre tout au chargement de la page. Il initialise le contrôleur.
 */

import CryptoModel from './models/CryptoModel.js';
import CryptoView from './views/RechercheView.js';
import CryptoController from './controllers/RechercheController.js';

document.addEventListener('DOMContentLoaded', () => {
    const model = new CryptoModel();
    const view = new CryptoView();
    const app = new CryptoController(model, view);

    app.init();
});