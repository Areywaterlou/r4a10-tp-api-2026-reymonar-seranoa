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

    /**
     * Récupère ce qui est écrit dans le champ texte
     */
    getSaisie() {
        return this.barreRecherche.value;
    }

    /**
     * Affiche un message d'erreur si besoin
     */
    afficherMessage(message) {
        alert(message);
    }

    /**
     * Affiche la liste des favoris sur l'accueil
     * @param {Array} favoris - Liste d'objets Crypto mis en favoris
     */
    afficherFavoris(favoris) {
        if (!this.favoriteContener) return;

        if (favoris.length === 0) {
            this.favoriteContener.innerHTML = '<span class="empty-msg">(Aucune recherche favorite pour le moment)</span>';
            return;
        }

        this.favoriteContener.innerHTML = "";

        // On génère le HTML pour chaque favori
        favoris.forEach(crypto => {
            const favElement = document.createElement('div');
            favElement.classList.add('fav-badge');
            favElement.innerHTML = `
                <img src="${crypto.getThumb()}" alt="${crypto.getName()}">
                <span>${crypto.getSymbol()}</span>
            `;
            // rends le favori clicable
            favElement.onclick = () => window.location.href = `resultat.html?id=${crypto.id}`;
            
            this.favoriteContener.appendChild(favElement);
        });
    }
}
