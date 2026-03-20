import Crypto from "../models/CryptoModel.js";
/**
 * le lien entre l'utilisateur, le modèle et la vue
 */
export default class RechercheController {

    constructor(view) {
        this.view = view;
    }

    init(){

        this.ecouteEvent();
    }

    ecouteEvent() {


        //ecoute du bouton de recherche
        this.view.btnRechercher.addEventListener('click', () => {
            console.log("bouton cliqué");
            this.rechercher(this.view.getSaisie());
        });
        //ecoute de la touche entrée
        this.view.barreRecherche.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.rechercher(this.view.getSaisie());
            }
        });
    }


    async rechercher(saisie) {

        try{

        const urlRecherche = `https://api.coingecko.com/api/v3/search?query=${saisie}`;
        const reponseRecherche = await fetch(urlRecherche);
        const donnéesCrypto = await reponseRecherche.json();
        if(donnéesCrypto.coins.length === 0){
            throw new Error ("aucune crypto trouvée");
        }
        const crypto = donnéesCrypto.coins[0];


        const urlRecherchePrix = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto.id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
        const reponseRecherchePrix = await fetch(urlRecherchePrix);
        const donnéesCryptoPrix = await reponseRecherchePrix.json();


        const infosFinancieres = donnéesCryptoPrix[crypto.id];

        const maCrypto = new Crypto(
            crypto.id,
            crypto.name,
            crypto.symbol,
            crypto.market_cap_rank,
            crypto.thumb,
            crypto.large,
            infosFinancieres.usd,
            infosFinancieres.usd_24h_change,
            infosFinancieres.usd_24h_vol,
            infosFinancieres.usd_market_cap,
            false
        );

        console.log("Voici la crypyo :", maCrypto);


        this.view.afficherResultat(maCrypto);
        
    } catch (erreur) {
        console.error("Un problème est survenu avec l'API :", erreur);
    }
}
}