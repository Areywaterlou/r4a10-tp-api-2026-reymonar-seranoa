/**
 * fichier qui démarre tout au chargement de la page. Il initialise le contrôleur.
 */

import { Crypto } from './models/CryptoModel.js'; 
import RechercheView from './views/RechercheView.js';
import RechercheController from './controllers/RechercheController.js';

document.addEventListener('DOMContentLoaded', () => {
    // On instancie la vue
    const view = new RechercheView();

    const app = new RechercheController(null, view); 

    app.init();
});