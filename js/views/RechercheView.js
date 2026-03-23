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
     * Affiche le favori sous forme de mini-carte riche (Image, Nom, Prix)
     * @param {Object} cryptoData - Les données du favori (id, name, symbol, thumb, price, is_favorite)
     * @param {Function} actionClic - La fonction de redirection
     */
    afficherFavoris(listeFavoris, actionClic) {
        const container = document.getElementById("favoritesList");
        if (!container) return;
        container.innerHTML = "";

        if (!listeFavoris || listeFavoris.length === 0) {
            container.innerHTML = '<span class="empty-msg">(Aucun favori)</span>';
            return;
        }

        listeFavoris.forEach(cryptoData => {
            const favRow = document.createElement('div');
            favRow.classList.add('spotify-item');
            
            const prix = cryptoData.price || 0;
            const formattedPrice = new Intl.NumberFormat('en-US', { 
                style: 'currency', currency: 'USD' 
            }).format(prix);

            favRow.innerHTML = `
                <div class="spot-left">
                    <img src="${cryptoData.thumb}" alt="${cryptoData.name}">
                    <div class="spot-info">
                        <span class="spot-name">${cryptoData.name}</span>
                        <span class="spot-symbol">${cryptoData.symbol.toUpperCase()}</span>
                    </div>
                </div>
                <div class="spot-right">
                    <span class="spot-price">${formattedPrice}</span>
                    <span class="spot-arrow">→</span>
                </div>
            `;
            
            favRow.onclick = () => actionClic(cryptoData.id);
            container.appendChild(favRow);
        });
    }
}
