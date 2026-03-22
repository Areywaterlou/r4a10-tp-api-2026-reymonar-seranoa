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
 * Affiche le favori stocké dans le JSON
 * @param {Object} cryptoData - L'objet récupéré du serveur
 * @param {Function} actionClic - La redirection à effectuer au clic
 */
afficherFavoris(cryptoData, actionClic) {
    const container = document.getElementById("favoritesList");
    if (!container) return;

        container.innerHTML = "";

        if (!cryptoData || !cryptoData.is_favorite) {
                container.innerHTML = '<span class="empty-msg">(Aucun favori pour le moment)</span>';
                return;
            }

    const favElement = document.createElement('div');
    favElement.classList.add('fav-badge');
        favElement.style.cursor = "pointer";
        
        // On utilise les données du JSON (id, symbol, name)
        favElement.innerHTML = `<span>${cryptoData.symbol.toUpperCase()}</span>
        `;
        
        favElement.onclick = () => actionClic(cryptoData.id);
        container.appendChild(favElement);
    }
}
