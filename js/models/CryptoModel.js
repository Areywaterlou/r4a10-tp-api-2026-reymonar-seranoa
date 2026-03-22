/**
 * Modèle représentant une Crypto-monnaie et gérant sa persistance
 */
export default class Crypto {
    /** @type {string} */
    #id;
    /** @type {string} */
    #name;
    /** @type {string} */
    #symbol;
    /** @type {number} */
    #market_cap_rank;
    /** @type {string} */
    #thumb;
    /** @type {string} */
    #large;
    /** @type {number} */
    #usd;
    /** @type {number} */
    #usd_24h_change;
    /** @type {number} */
    #usd_24h_vol;
    /** @type {number} */
    #usd_market_cap;
    /** @type {boolean} */
    #fav;

    constructor(id, name, symbol, market_cap_rank, thumb, large, usd, usd_24h_change, usd_24h_vol, usd_market_cap, fav) {
        this.#id = id;
        this.#name = name;
        this.#symbol = symbol;
        this.#market_cap_rank = market_cap_rank;
        this.#thumb = thumb;
        this.#large = large;
        this.#usd = usd;
        this.#usd_24h_change = usd_24h_change;
        this.#usd_24h_vol = usd_24h_vol;
        this.#usd_market_cap = usd_market_cap;
        this.#fav = fav;
    }

    /** @returns {string} */
    getId() { return this.#id; }
    
    /** @returns {string} */
    getName() { return this.#name; }
    
    /** @returns {string} */
    getSymbol() { return this.#symbol; }
    
    /** @returns {number} */
    getMarketCapRank() { return this.#market_cap_rank; }
    
    /** @returns {string} */
    getThumb() { return this.#thumb; }
    
    /** @returns {string} */
    getLarge() { return this.#large; }
    
    /** @returns {number} */
    getUsd() { return this.#usd; }
    
    /** @returns {number} */
    getUsd24hChange() { return this.#usd_24h_change; }
    
    /** @returns {number} */
    getUsd24hVol() { return this.#usd_24h_vol; }
    
    /** @returns {number} */
    getUsdMarketCap() { return this.#usd_market_cap; }

    /** @returns {boolean} */
    isFav() { return this.#fav; }

    /** @param {boolean} fav */
    setFav(fav) { this.#fav = fav; }

    /**
     * Envoie l'état de favori au serveur PHP
     * @returns {Promise<void>|null}
     */
    saveFavToServer() {
        
            const cryptoData = {
            id: this.#id,
            name: this.#name,
            symbol: this.#symbol,
            is_favorite: this.#fav
        };

        const jsonString = JSON.stringify(cryptoData);

        return fetch("api/save-fav-state.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "state=" + encodeURIComponent(jsonString)
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erreur serveur : " + response.status);
            }
        })
        .catch((error) => {
            console.error("Erreur d'envoi des favoris :", error);
        });
    }

    /**
     * Récupère la liste des IDs favoris depuis le serveur
     * @static
     * @returns {Promise<Object>} Données des favoris
     */
    static async retrieveFavIdToServer() {
        try {
            const reponse = await fetch("api/get-fav-state.php");
            
            if (!reponse.ok) {
                throw new Error("Erreur réseau lors de la récupération");
            }

            return await reponse.json();
        } catch (error) {
            throw new Error("Impossible de récupérer les favoris : " + error.message);
        }
    }
}