/**
 * Gère l'affichage des détails d'une crypto (Manipulation du HTML)
 */
export default class ResultatView {
    constructor() {
        console.log("Initialisation de ResultatView...");

        this.logo = document.querySelector(".main-logo");
        this.titreNom = document.querySelector(".coin-main-info h1");
        this.badgeRang = document.querySelector(".badge");
        this.prixAffichage = document.querySelector(".price-val");
        this.changement24h = document.querySelector(".change");
        this.btnFavori = document.getElementById("favoriteButton");
        this.nomSimilaire = document.getElementById("currentCoinName");
        this.listeSimilaire = document.getElementById("similarCoinsList");
        
        // Cible les <p> dans les cartes de données (Cap, Volume, etc.)
        this.valeursCartes = document.querySelectorAll(".data-card p");

        console.log("Éléments HTML ciblés :", {
            logo: this.logo,
            titre: this.titreNom,
            prix: this.prixAffichage,
            nbCartes: this.valeursCartes.length
        });
    }

    /**
     * Remplit la page avec les données de l'objet Crypto
     * @param {Crypto} crypto - L'instance du modèle Crypto reçue du Controller
     */
    afficherResultat(crypto) {
        try {
            if (this.logo) this.logo.src = crypto.getLarge();
            
            if (this.titreNom) {
                this.titreNom.innerHTML = `${crypto.getName()} <span class="symbol">${crypto.getSymbol().toUpperCase()}</span>`;
            }

            if (this.nomSimilaire) {
                this.nomSimilaire.textContent = crypto.getName();
            }

            if (this.badgeRang) {
                this.badgeRang.textContent = `Rang #${crypto.getMarketCapRank() || 'N/A'}`;
            }

            const prixUSD = crypto.getUsd();
            
            if (this.prixAffichage) {
               
                const nbDecimales = prixUSD < 1 ? 8 : 2;

                this.prixAffichage.textContent = new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: nbDecimales
                }).format(prixUSD);
            }

            const modif = crypto.getUsd24hChange();
            if (this.changement24h) {
                this.changement24h.textContent = `${modif > 0 ? '+' : ''}${modif.toFixed(2)}% (24h)`;
                this.changement24h.className = `change ${modif >= 0 ? 'up' : 'down'}`;
            }

            if (this.valeursCartes.length >= 2) {
                this.valeursCartes[0].textContent = this.formaterNombre(crypto.getUsdMarketCap()) + " $";
                this.valeursCartes[1].textContent = this.formaterNombre(crypto.getUsd24hVol()) + " $";
            }
        } catch (error) {
            console.error("Erreur injection données :", error);
        }
    }

    /**
     * Affiche les petites vignettes des cryptos suggérées
     */
    afficherSuggestions(liste) {
        if (!this.listeSimilaire) return;
        this.listeSimilaire.innerHTML = "";

        if (liste.length === 0) {
            this.listeSimilaire.innerHTML = '<span class="empty-msg">Aucune suggestion trouvée.</span>';
            return;
        }

        liste.forEach(coin => {
            const coinId = coin.id; 

            const div = document.createElement("div");
            div.classList.add("fav-badge"); 
            div.style.cursor = "pointer";
            div.innerHTML = `
                <img src="${coin.thumb}" alt="${coin.name}">
                <span>${coin.symbol.toUpperCase()}</span>
            `;

            div.onclick = () => {
                if (coinId) {
                    window.location.href = `resultat.html?id=${coinId}`;
                } else {
                    console.error("ID introuvable pour cette suggestion", coin);
                }
            };

            this.listeSimilaire.appendChild(div);
        });
    }

    formaterNombre(num) {
        if (!num || isNaN(num)) return "0";
        return new Intl.NumberFormat('en-US').format(Math.floor(num));
    }
    
    /**
     * Change l'apparence de l'étoile selon l'état favori en utilisant des SVG
     * @param {boolean} estFavori 
     */
    majBoutonFavori(estFavori) {
        if (!this.btnFavori) return;

        const cheminSVG = estFavori ? "images/etoile-pleine.svg" : "images/etoile-vide.svg";
        const texteAlt = estFavori ? "Retirer des favoris" : "Ajouter aux favoris";

        this.btnFavori.innerHTML = `<img src="${cheminSVG}" alt="${texteAlt}" class="fav-icon-svg">`;
        
        if (estFavori) {
            this.btnFavori.classList.add("active");
        } else {
            this.btnFavori.classList.remove("active");
        }
    }
    
    /**
     * Affiche le favori sous forme de mini-carte riche (Image, Nom, Prix)
     * @param {Object} cryptoData - Les données du favori (id, name, symbol, thumb, price, is_favorite)
     * @param {Function} actionClic - La fonction de redirection
     */
    afficherFavoris(cryptoData, actionClic) {
        const container = document.getElementById("favoritesList");
        if (!container) return;
        container.innerHTML = "";

        if (!cryptoData || !cryptoData.is_favorite) {
            container.innerHTML = '<span class="empty-msg">(Aucun favori pour le moment)</span>';
            return;
        }

        const favRow = document.createElement('div');
        favRow.classList.add('spotify-item');
        
        const formattedPrice = cryptoData.price ? cryptoData.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A';
        
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
    }
}