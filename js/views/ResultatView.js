import { Crypto } from "../models/CryptoModel.js";

export default class ResultatController {
    constructor(view) {
        this.view = view;
    }

    init() {
        // 1. Lire l'URL pour trouver l'ID (ex: ?id=bitcoin)
        const parametresUrl = new URLSearchParams(window.location.search);
        const cryptoId = parametresUrl.get("id");

        if (cryptoId) {
            // 2. Si on a un ID, on lance la recherche des détails !
            this.chargerDetailsCrypto(cryptoId);
        } else {
            console.error("Aucun ID de crypto fourni dans l'URL");
        }
    }

    async chargerDetailsCrypto(id) {
        try {
            // Ici, on fait les DEUX requêtes (search pour le logo/nom, et price pour l'argent)
            // Car on a besoin de tout pour remplir la ResultatView de ton pote !
            
            const urlBase = `https://api.coingecko.com/api/v3/search?query=${id}`;
            const repBase = await fetch(urlBase);
            const dataBase = await repBase.json();
            const infosBase = dataBase.coins[0];

            const urlPrix = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;
            const repPrix = await fetch(urlPrix);
            const dataPrix = await repPrix.json();
            const infosFinancieres = dataPrix[id];

            // On fabrique l'objet complet
            const maCrypto = new Crypto(
                infosBase.id,
                infosBase.name,
                infosBase.symbol,
                infosBase.market_cap_rank,
                infosBase.thumb,
                infosBase.large,
                infosFinancieres.usd,
                infosFinancieres.usd_24h_change,
                infosFinancieres.usd_24h_vol,
                infosFinancieres.usd_market_cap,
                false
            );

            // ON AFFICHE LE RÉSULTAT GRÂCE À LA VUE DE TON POTE !
            this.view.afficherResultat(maCrypto);

        } catch (erreur) {
            console.error("Erreur lors du chargement des détails :", erreur);
        }
    }
}