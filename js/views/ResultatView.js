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

            if (this.prixAffichage) {
                this.prixAffichage.textContent = new Intl.NumberFormat('en-US', { 
                    style: 'currency', currency: 'USD' 
                }).format(crypto.getUsd());
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

        liste.forEach(coin => {
            const div = document.createElement("div");
            div.classList.add("fav-badge");
            div.style.cursor = "pointer";
            div.innerHTML = `
                <img src="${coin.thumb}" alt="${coin.name}">
                <span>${coin.symbol}</span>
            `;
            
            // Au clic, on recharge la page de résultat avec le nouvel ID
            div.onclick = () => window.location.href = `resultat.html?id=${coin.id}`;
            this.listeSimilaire.appendChild(div);
        });
    }

    formaterNombre(num) {
        if (!num || isNaN(num)) return "0";
        return new Intl.NumberFormat('en-US').format(Math.floor(num));
    }
}