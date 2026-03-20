import { CryptoModel } from "./CryptoModel"
import { CryptoView } from "./RechercheView"

/**
 * le lien entre l'utilisateur, le modèle et la vue
 */
export default class RechercheController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    init(){
        this.ecouteEvent();
    }

    ecouteEvent() {
        const searchBtn = document.getElementById('.search-btn');
        const input = document.getElementById('cryptoInput');

        if (searchBtn && input) {
            //ecoute du bouton de recherche
            searchBtn.addEventListener('click', () => {
                this.rechercher(input.value);
            });
            //ecoute de la touche entrée
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.rechercher(input.value);
                }
            });
        }
    }

    async rechercher(saisie) {
        urlRecherche = `https://api.coingecko.com/api/v3/search?query=${saisie}`;
        reponseRecherche = await fetch(urlRecherche);
        donnéesCrypto = await reponseRecherche.json();
        if(donnéesCrypto.coins.lenght() === 0){
            throw new Error ("aucune crypto trouvée");
        }
        crypto = donnéesCrypto.coins[0];


        urlRecherchePrix = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto.id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
        reponseRecherchePrix = await fetch(urlRecherchePrix);
        donnéesCryptoPrix = await reponseRecherche.json();


        const infosFinancieres = donnéesCryptoPrix[crypto.id];

        const maCrypto = new Crypto(
            donnéesCrypto.id,
            donnéesCrypto.name,
            donnéesCrypto.symbol,
            donnéesCrypto.market_cap_rank,
            donnéesCrypto.thumb,
            donnéesCrypto.large,
            infosFinancieres.usd,
            infosFinancieres.usd_24h_change,
            infosFinancieres.usd_24h_vol,
            infosFinancieres.usd_market_cap,
            false // fav à false par défaut
        );

        console.log("Voici la crypyo :", maCrypto);


        CryptoView.afficherResultat(maCrypto);

    } catch (erreur) {
        console.error("Un problème est survenu avec l'API :", erreur);
    }

}