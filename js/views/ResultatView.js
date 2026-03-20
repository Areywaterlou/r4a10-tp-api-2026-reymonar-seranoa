
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
        console.log("Données reçues pour affichage :", crypto);

        try {
            // Image et Titre
            if (this.logo) this.logo.src = crypto.getLarge();
            
            if (this.titreNom) {
                this.titreNom.innerHTML = `${crypto.getName()} <span class="symbol">${crypto.getSymbol().toUpperCase()}</span>`;
            }

            if (this.badgeRang) {
                this.badgeRang.textContent = `Rang #${crypto.getMarketCapRank() || 'N/A'}`;
            }

            // Prix Formaté (Vérifie si le prix est bien un nombre)
            const prixUSD = crypto.getUsd();
            console.log("Prix brut reçu :", prixUSD);
            
            if (this.prixAffichage) {
                this.prixAffichage.textContent = new Intl.NumberFormat('en-US', { 
                    style: 'currency', currency: 'USD' 
                }).format(prixUSD);
            }

            // Changement 24h (couleur dynamique)
            const modif = crypto.getUsd24hChange();
            if (this.changement24h) {
                this.changement24h.textContent = `${modif > 0 ? '+' : ''}${modif.toFixed(2)}% (24h)`;
                this.changement24h.className = `change ${modif >= 0 ? 'up' : 'down'}`;
            }

            // Cartes du bas (Capitalisation et Volume)
            if (this.valeursCartes.length >= 2) {
                this.valeursCartes[0].textContent = this.formaterNombre(crypto.getUsdMarketCap()) + " $";
                this.valeursCartes[1].textContent = this.formaterNombre(crypto.getUsd24hVol()) + " $";
            }

            console.log("Affichage réussi !");

        } catch (error) {
            console.error("Erreur lors de l'injection des données dans la vue :", error);
        }
    }

    formaterNombre(num) {
        if (!num || isNaN(num)) return "0";
        return new Intl.NumberFormat('en-US').format(Math.floor(num));
    }
}