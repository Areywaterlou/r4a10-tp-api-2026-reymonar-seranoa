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
     */
    afficherResultat(crypto) {
        // Mise à jour de l'image et du texte
        this.logo.src = crypto.getLarge();
        this.titreNom.innerHTML = `${crypto.getName()} <span class="symbol">${crypto.getSymbol().toUpperCase()}</span>`;
        this.badgeRang.textContent = `Rang #${crypto.getMarketCapRank()}`;

        // Formatage du prix
        const prixUSD = crypto.getUsd();
        this.prixAffichage.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(prixUSD);

        // Formatage du changement 24h
        const changement = crypto.getUsd24hChange();
        this.changement24h.textContent = `${changement >= 0 ? '+' : ''}${changement.toFixed(2)}% (24h)`;
        this.changement24h.className = `change ${changement >= 0 ? 'up' : 'down'}`;

        // Remplissage de la grille de données
        this.valeursCartes[0].textContent = this.formaterGrandNombre(crypto.getUsdMarketCap()) + " $";
        this.valeursCartes[1].textContent = this.formaterGrandNombre(crypto.getUsd24hVol()) + " $";
        this.valeursCartes[2].textContent = "Flux en direct";
        this.valeursCartes[3].textContent = "Donnée non dispo"; 
    }

    formaterGrandNombre(num) {
        return new Intl.NumberFormat('fr-FR').format(num);
    }
}