import { Crypto } from "../models/CryptoModel.js";

export default class ResultatController {
    constructor(view) {
        this.view = view;
    }

    async init() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id'); // On récupère l'id depuis l'URL

        if (id) {
            this.chargerDonnees(id);
        }
    }

    async chargerDonnees(id) {
        try {

            const repInfo = await fetch(`https://api.coingecko.com/api/v3/search?query=${id}`);
            const dataInfo = await repInfo.json();
            const base = dataInfo.coins.find(c => c.id === id) || dataInfo.coins[0];


            const repPrix = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`);
            const dataPrix = await repPrix.json();
            const prix = dataPrix[id];

            const maCrypto = new Crypto(
                id,
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

            // On envoie à la vue
            this.view.afficherResultat(maCrypto);

        } catch (error) {
            console.error("Erreur de chargement :", error);
        }
    }
}