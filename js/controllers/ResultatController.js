import Crypto from "../models/CryptoModel.js";

export default class ResultatController {
    constructor(view) {
        this.view = view;
    }

    async init() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id'); 

        if (id) {
            this.chargerDonnees(id);
        }
    }

    async chargerDonnees(id) {
    try {

        const repInfo = await fetch(`https://api.coingecko.com/api/v3/search?query=${id}`);
        const dataInfo = await repInfo.json();
        
        if (!dataInfo.coins || dataInfo.coins.length === 0) return;

        const base = dataInfo.coins.find(c => c.id === id) || dataInfo.coins[0];

        const idOfficiel = base.id;

        const suggerees = dataInfo.coins.filter(c => c.id !== idOfficiel).slice(0, 5); 

        const repPrix = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${idOfficiel}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`);
        const dataPrix = await repPrix.json();
        const prix = dataPrix[idOfficiel];

        if (prix && base) {
            const maCrypto = new Crypto(
                idOfficiel,
                base.name,
                base.symbol,
                base.market_cap_rank,
                base.thumb,
                base.large,
                prix.usd,
                prix.usd_24h_change,
                prix.usd_24h_vol,
                prix.usd_market_cap,
                false
            );

            this.view.afficherResultat(maCrypto);
            this.view.afficherSuggestions(suggerees);
        }

    } catch (error) {
        console.error("Erreur :", error);
    }
}
}