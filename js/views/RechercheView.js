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
     * Affiche la liste des favoris sur l'accueil
     * @param {Array} favoris - Liste d'objets Crypto mis en favoris
     */
// On ajoute un 2ème paramètre : l'action à faire quand on clique
    afficherFavoris(favoris, actionClicFavori) {
        if (!this.favoriteContener) return;
        this.favoriteContener.innerHTML = "";

        if (favoris.length === 0) {
            this.favoriteContener.innerHTML = '<span class="empty-msg">(Aucune recherche favorite pour le moment)</span>';
            return;
        }

        favoris.forEach(crypto => {
            const favElement = document.createElement('div');
            favElement.classList.add('fav-badge');
            favElement.innerHTML = `
                <img src="${crypto.getThumb()}" alt="${crypto.getName()}">
                <span>${crypto.getSymbol()}</span>
            `;
            
            // LA MAGIE EST LÀ : La vue ne redirige plus ! Elle lance juste l'action du contrôleur avec l'ID.
            favElement.onclick = () => {
                actionClicFavori(crypto.getId());
            };
            
            this.favoriteContener.appendChild(favElement);
        });
    }
}
