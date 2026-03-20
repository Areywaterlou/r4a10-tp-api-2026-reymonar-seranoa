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
        
        // Cible les <p> dans les cartes de données (Cap, Volume, etc.)
        this.valeursCartes = document.querySelectorAll(".data-card p");
    }

    /**
     * Remplit la page avec les données de l'objet Crypto
     * @param {Crypto} crypto - L'instance du modèle Crypto
     */
    afficherResultat(crypto) {
        this.logo.src = crypto.getLarge();
        this.logo.alt = crypto.getName();
        this.titreNom.innerHTML = `${crypto.getName()} <span class="symbol">${crypto.getSymbol().toUpperCase()}</span>`; //
        this.badgeRang.textContent = `Rang #${crypto.getMarketCapRank()}`; //

        const prixUSD = crypto.getUsd(); //
        this.prixAffichage.textContent = new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD' 
        }).format(prixUSD);

        const changement = crypto.getUsd24hChange(); //
        this.changement24h.textContent = `${changement >= 0 ? '+' : ''}${changement.toFixed(2)}% (24h)`;
        
        this.changement24h.className = `change ${changement >= 0 ? 'up' : 'down'}`;

        // Market Cap
        this.valeursCartes[0].textContent = this.formaterGrandNombre(crypto.getUsdMarketCap()) + " $"; //
        // Volume 24h
        this.valeursCartes[1].textContent = this.formaterGrandNombre(crypto.getUsd24hVol()) + " $"; //
        
        // on laisse des placeholders ou des flux statiques.
        this.valeursCartes[2].textContent = "Flux en direct";
        this.valeursCartes[3].textContent = "Donnée non dispo"; 
    }

    /**
     * Utilitaire de formatage pour la lisibilité (ex: 1 234 567)
     */
    formaterGrandNombre(num) {
        return new Intl.NumberFormat('fr-FR').format(num);
    }
}