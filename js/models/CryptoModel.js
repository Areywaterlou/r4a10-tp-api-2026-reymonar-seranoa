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
    /**
     * Constructeur
     */
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
    //Gestteurs et setter
    getId() { return this.#id; }
    getName() { return this.#name; }
    getSymbol() { return this.#symbol; }
    getMarketCapRank() { return this.#market_cap_rank; }
    getThumb() { return this.#thumb; }
    getLarge() { return this.#large; }
    getUsd() { return this.#usd; }
    getUsd24hChange() { return this.#usd_24h_change; }
    getUsd24hVol() { return this.#usd_24h_vol; }
    getUsdMarketCap() { return this.#usd_market_cap; }
    isFav() { return this.#fav; }

    setFav(fav) { this.#fav = fav; }

    /**
     * méthode pour sauvegarder les drecherche favorites
     */
    saveFavToServer() {
        let favoris = JSON.parse(localStorage.getItem('mesFavoris')) || [];

        if (this.#fav) {

            const cryptoData = {
                id: this.#id,
                name: this.#name,
                symbol: this.#symbol,
                thumb: this.#thumb,
                price: this.#usd, 
                is_favorite: true
            };
            

        const existeDeja = favoris.find(f => f.id === this.#id);
        if (!existeDeja) {
            favoris.push(cryptoData); //on ajoute cryptoData à la fin du tableau favoris
        }
            } else {
            favoris = favoris.filter(f => f.id !== this.#id); // on supprime  du tableau de favoris
        }

        localStorage.setItem('mesFavoris', JSON.stringify(favoris));
    }
    /**
     * récupérer les favoris stockés dans le navigateur
     * @returns 
     */
    static async retrieveFavIdToServer() {
        const data = localStorage.getItem('mesFavoris');
        return data ? JSON.parse(data) : []; 
    }
}