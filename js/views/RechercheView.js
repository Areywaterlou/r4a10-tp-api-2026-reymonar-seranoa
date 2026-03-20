/**
 * contient le code qui génère le HTML
 */
export default class RechercheView {
    constructor() {
        this.barreRecherche = document.getElementById("cryptoInput");
        this.btnRechercher = document.getElementById('searchButton');
        this.btnFavoris = document.getElementById("favoriteButton");
        this.favoriteContener = document.getElementById("favoritesList");
    }
}