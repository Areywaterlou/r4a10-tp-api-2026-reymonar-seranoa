export default class ResultatController {
    constructor(manager, view) {
        this.manager = manager;
        this.view = view;
    }

    async initialiser() {

        const params = new URLSearchParams(window.location.search);
        const idCrypto = params.get('id');

        if (!idCrypto) {
            window.location.href = "index.html"; 
            return;
        }

        const cryptoObjet = await this.manager.obtenirDetailsComplets(idCrypto);

        if (cryptoObjet) {
            this.view.afficherDonnees(cryptoObjet);
        } else {
            alert("Impossible de charger les infos de " + idCrypto);
        }
    }
}