/**
 * Gère l'affichage des détails d'une crypto
 */
export default class ResultatView {
    constructor() {
        this.logo = document.querySelector(".main-logo");
        this.titreNom = document.querySelector(".coin-main-info h1");
        this.badgeRang = document.querySelector(".badge");
        this.prixAffichage = document.querySelector(".price-val");
        this.changement24h = document.querySelector(".change");
        
        this.valeursCartes = document.querySelectorAll(".data-card p");
    }
    /**
     * Remplit la page avec les données de l'objet Crypto
     */
    afficherResultat(crypto) {
        ththis.titreNom.innerHTML = `${crypto.getName()} <span class="symbol">${crypto.getSymbol().toUpperCase()}</span>`;
        this.badgeRang.textContent = `Rang #${crypto.getMarketCapRank()}`;

        const prixUSD = crypto.getUsd();
        this.prixAffichage.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(prixUSD);

        const changement = crypto.getUsd24hChange();
        this.changement24h.textContent = `${changement >= 0 ? '+' : ''}${changement.toFixed(2)}% (24h)`;

        // Grille de données
        this.valeursCartes[0].textContent = this.formaterGrandNombre(crypto.getUsdMarketCap()) + " $";
        this.valeursCartes[1].textContent = this.formaterGrandNombre(crypto.getUsd24hVol()) + " $";
        this.valeursCartes[2].textContent = "Flux en direct";
        this.valeursCartes[3].textContent = "69,045.00 $"; 
    }

    formaterGrandNombre(num) {
        return new Intl.NumberFormat('fr-FR').format(num);
    }
}