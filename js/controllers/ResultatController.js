import Crypto from "../models/CryptoModel.js";

export default class ResultatController {
    constructor(view) {
        this.view = view;
        console.log("ResultatController : Prêt.");
    }

    async init() {
        // 1. On récupère l'ID dans l'URL (ex: resultat.html?id=bitcoin)
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id'); 

        console.log("ResultatController : ID récupéré dans l'URL ->", id);

        if (id) {
            this.chargerDonnees(id);
        } else {
            console.error("ResultatController : Aucun ID trouvé dans l'URL !");
        }
    }

    async chargerDonnees(id) {
        try {
            console.log(`Démarrage du chargement des données pour : ${id}...`);

            // --- APPEL 1 : INFOS DE BASE (Nom, Logo, Rang) ---
            const repInfo = await fetch(`https://api.coingecko.com/api/v3/search?query=${id}`);
            const dataInfo = await repInfo.json();
            
            // On cherche la crypto exacte dans la liste renvoyée par Coingecko
            const base = dataInfo.coins.find(c => c.id === id) || dataInfo.coins[0];
            console.log("Données de base reçues (API Search) :", base);

            // --- APPEL 2 : INFOS FINANCIÈRES (Prix, Change %) ---
            const urlPrix = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;
            const repPrix = await fetch(urlPrix);
            const dataPrix = await repPrix.json();
            
            const prix = dataPrix[id];
            console.log("Données financières reçues (API Price) :", prix);

            if (!prix) {
                throw new Error("L'API n'a renvoyé aucun prix pour cet ID.");
            }

            // --- CRÉATION DU MODÈLE ---
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

            console.log("Objet Crypto créé avec succès :", maCrypto);

            // --- ENVOI À LA VUE ---
            console.log("Envoi de l'objet à la vue...");
            this.view.afficherResultat(maCrypto);

        } catch (error) {
            console.error("Erreur fatale dans chargerDonnees :", error);
            // Optionnel : on peut dire à la vue d'afficher un message d'erreur
            if (this.view.afficherMessage) {
                this.view.afficherMessage("Impossible de charger les données.");
            }
        }
    }
}