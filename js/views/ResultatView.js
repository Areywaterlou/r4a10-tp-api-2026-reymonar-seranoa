/**
 * Gère l'affichage des détails d'une crypto (Manipulation du HTML)
 */
export default class ResultatView {
    constructor() {
        this.logo = document.querySelector(".main-logo");
        this.titreNom = document.querySelector(".coin-main-info h1");
        this.badgeRang = document.querySelector(".badge");
        this.prixAffichage = document.querySelector(".price-val");
        this.changement24h = document.querySelector(".change");
        this.btnFavori = document.getElementById("favoriteButton");
        this.nomSimilaire = document.getElementById("currentCoinName");
        this.listeSimilaire = document.getElementById("similarCoinsList");
        this.valeursCartes = document.querySelectorAll(".data-card p");

        this.barreRecherche = document.getElementById("cryptoInput");
        this.btnRechercher = document.getElementById("searchButton");
    }

    getSaisie() {
        return this.barreRecherche ? this.barreRecherche.value.trim() : "";
    }

    afficherResultat(crypto) {
        try {
            if (this.logo) this.logo.src = crypto.getLarge();
            if (this.titreNom) this.titreNom.innerHTML = `${crypto.getName()} <span class="symbol">${crypto.getSymbol().toUpperCase()}</span>`;
            if (this.nomSimilaire) this.nomSimilaire.textContent = crypto.getName();
            if (this.badgeRang) this.badgeRang.textContent = `Rang #${crypto.getMarketCapRank() || 'N/A'}`;

            const prixUSD = crypto.getUsd();
            if (this.prixAffichage) {
                const nbDecimales = prixUSD < 1 ? 8 : 2;
                this.prixAffichage.textContent = new Intl.NumberFormat('en-US', { 
                    style: 'currency', currency: 'USD',
                    minimumFractionDigits: 2, maximumFractionDigits: nbDecimales
                }).format(prixUSD);
            }

            if (this.valeursCartes.length >= 2) {
                this.valeursCartes[0].textContent = this.formaterNombre(crypto.getUsdMarketCap()) + " $";
                this.valeursCartes[1].textContent = this.formaterNombre(crypto.getUsd24hVol()) + " $";
            }
            
            const modif = crypto.getUsd24hChange();
            if (this.changement24h) {
                this.changement24h.textContent = `${modif >= 0 ? '+' : ''}${modif.toFixed(2)}% (24h)`;
                this.changement24h.className = `change ${modif >= 0 ? 'up' : 'down'}`;
            }
        } catch (error) {
            console.error("Erreur injection données :", error);
        }
    }

    afficherSuggestions(liste) {
        if (!this.listeSimilaire) return;
        this.listeSimilaire.innerHTML = "";
        liste.forEach(coin => {
            const div = document.createElement("div");
            div.classList.add("fav-badge"); 
            div.style.cursor = "pointer";
            div.innerHTML = `<img src="${coin.thumb}" alt="${coin.name}"><span>${coin.symbol.toUpperCase()}</span>`;
            div.onclick = () => window.location.href = `resultat.html?id=${coin.id}`;
            this.listeSimilaire.appendChild(div);
        });
    }

    formaterNombre(num) {
        if (!num || isNaN(num)) return "0";
        return new Intl.NumberFormat('en-US').format(Math.floor(num));
    }
    
    majBoutonFavori(estFavori) {
        if (!this.btnFavori) return;
        const cheminSVG = estFavori ? "images/etoile-pleine.svg" : "images/etoile-vide.svg";
        const texteAlt = estFavori ? "Retirer des favoris" : "Ajouter aux favoris";
        this.btnFavori.innerHTML = `<img src="${cheminSVG}" alt="${texteAlt}" class="fav-icon-svg">`;
        estFavori ? this.btnFavori.classList.add("active") : this.btnFavori.classList.remove("active");
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

        box.innerHTML = `⏳ <strong>Oups ! L'API CoinGecko est saturée.</strong><br>Merci de patienter un instant et de rafraîchir la page.`;

        document.querySelector("main").prepend(box);
        

        if (this.titreNom) this.titreNom.innerHTML = "Erreur réseau <span class='symbol'>API</span>";
        if (this.prixAffichage) this.prixAffichage.textContent = "---";
        const loader = document.querySelector(".loader-gif");
        if (loader) loader.style.display = "none"; 

        setTimeout(() => {
            if (box) box.remove();
        }, 7000); 
    }
}