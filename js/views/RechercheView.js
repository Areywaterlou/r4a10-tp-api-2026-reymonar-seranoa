export default class RechercheView {
    constructor() {
        this.barreRecherche = document.getElementById("cryptoInput");
        this.btnRechercher = document.getElementById('searchButton');
        this.btnFavoris = document.getElementById("favoriteButton");
        this.favoriteContener = document.getElementById("favoritesList");
    }

    getSaisie() {
        return this.barreRecherche ? this.barreRecherche.value.trim() : "";
    }

    afficherMessage(message) {
        alert(message);
    }

    afficherFavoris(listeFavoris, actionClic, actionSupprimer) {
        const container = document.getElementById("favoritesList");
        if (!container) return;
        container.innerHTML = "";

        if (!listeFavoris || listeFavoris.length === 0) {
            container.innerHTML = '<span class="empty-msg">(Aucun favori pour le moment)</span>';
            return;
        }

        listeFavoris.forEach(cryptoData => {
            const favRow = document.createElement('div');
            favRow.classList.add('spotify-item');
            
            const prix = cryptoData.price || 0;
            const nbDecimales = prix < 1 ? 8 : 2;
            const formattedPrice = new Intl.NumberFormat('en-US', { 
                style: 'currency', currency: 'USD',
                minimumFractionDigits: 2, maximumFractionDigits: nbDecimales
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
                    <button class="remove-fav-btn" title="Retirer" style="background:none; border:none; cursor:pointer; font-size:1.2rem; filter: grayscale(100%); transition: 0.2s;">❌</button>
                </div>
            `;
            
            favRow.onclick = () => actionClic(cryptoData.id);

            const btnRemove = favRow.querySelector('.remove-fav-btn');
            btnRemove.onmouseover = () => btnRemove.style.filter = "none";
            btnRemove.onmouseout = () => btnRemove.style.filter = "grayscale(100%)";
            btnRemove.onclick = (e) => {
                e.stopPropagation(); 
                actionSupprimer(cryptoData.id);
            };

            container.appendChild(favRow);
        });
    }
    afficherErreurRateLimit() {
        const ancienneErreur = document.getElementById("rate-limit-error");
        if (ancienneErreur) ancienneErreur.remove();

        const box = document.createElement("div");
        box.id = "rate-limit-error";
        box.style.background = "rgba(255, 50, 50, 0.1)";
        box.style.border = "1px solid #ff4444";
        box.style.color = "#ff4444";
        box.style.padding = "15px";
        box.style.borderRadius = "12px";
        box.style.textAlign = "center";
        box.style.margin = "20px auto";
        box.style.maxWidth = "600px";
        box.style.fontWeight = "bold";

        box.innerHTML = `<strong>L'API CoinGecko est saturée.</strong><br>Merci de patienter un instant avant de réessayer.`;

        document.querySelector("main").prepend(box);
        
        setTimeout(() => {
            if (box) box.remove();
        }, 7000); 
    }
}