/**
 * Lien avec l'API CoinGecko
 */
export class Crypto{
    /**
     * @type {string}
     */
    #id;
    /**
     * @type {string}
     */
    #name;
    /**
     * @type {string}
     */
    #symbol;
    /**
     * @type {float}
     */
    #market_cap_rank;
    /**
     * @type {string}
     */
    #thumb;
    /**
     * @type {string}
     */
    #large;
    /**
     * @type {float}
     */
    #usd;
    /**
     * @type {float}
     */
    #usd_24h_change;
    /**
     * @type {float}
     */
    #usd_24h_vol;
    /**
     * @type {float}
     */
    #usd_market_cap;
    /**
     * @type {boolean}
     */
    #fav;

    constructor(id,name,symbol,market_cap_rank,thumb,large,usd,usd_24h_change,usd_24h_vol,usd_market_cap,fav){
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

    get id() {return this.#id;}
    getName() {return this.#name;}
    getSymbol() {return this.#symbol;}
    getMarketCapRank() {return this.#market_cap_rank;}
    getThumb() {return this.#thumb;}
    getLarge() {return this.#large;}
    getUsd() {return this.#usd;}
    getUsd24hChange() {return this.#usd_24h_change;}
    getUsd24hVol() {return this.#usd_24h_vol;}
    getUsdMarketCap() {return this.#usd_market_cap;}
    isFav(){
        return this.#fav;
    }

    saveFavToServer() {
    let editableButtonsObj = {};
    for (let idBtn of this.getIdsEditablesButtons()) {
      editableButtonsObj[idBtn] = this.getValueEditableButton(idBtn);
    }

    let memory = this.#memory;

    let calculatorState = { 
      editableButtons: editableButtonsObj, 
      memory: memory 
    };
    let jsonString = JSON.stringify(calculatorState);

    fetch("api/save-calculator-state.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "state=" + encodeURIComponent(jsonString)
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Erreur HTTP " + response.status);
        }
    })
    .catch((error) => {
        console.error("Erreur d'envoi", error);
    });
  }

}