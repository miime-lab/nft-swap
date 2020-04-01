import firebase  from "firebase"
const dotenv = require('dotenv')
dotenv.config({ path: '.env' });
if (!firebase.apps.length){
    var config = {
        apiKey: "AIzaSyA-xGtoOduDV5Grln5isEt_-2AM2lMTdm",
        authDomain: "https://nft-swap.firebaseio.com",
        projectId: "nft-swap",
    }
    firebase.initializeApp(config)
}
export default firebase