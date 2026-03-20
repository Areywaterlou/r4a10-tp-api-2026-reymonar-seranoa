/**
 * fichier qui démarre tout au chargement de la page. Il initialise le contrôleur.
 */

// Attention aux accolades pour importer "Crypto" !
import { Crypto } from './models/CryptoModel.js'; 
import RechercheView from './views/RechercheView.js';
import RechercheController from './controllers/RechercheController.js';

document.addEventListener('DOMContentLoaded', () => {
    // On instancie la vue
    const view = new RechercheView();
    
    // On instancie le contrôleur (on n'a pas besoin d'instancier le modèle Crypto ici, 
    // car le modèle est juste un "moule" pour l'API, mais on le passe si tu as créé un Manager plus tard)
    // Pour l'instant, on lance le contrôleur avec la vue !
    const app = new RechercheController(null, view); 

    app.init();
});