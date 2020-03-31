import firebase  from "firebase"
const dotenv = require('dotenv')
dotenv.config({ path: '.env' });
if (!firebase.apps.length){
    var config = {
        apiKey: "AIzaSyCwfDEAz5zJ1jmdQxom3LS-LxqLc1IetFQ",
        authDomain: "https://nft-swap.firebaseio.com",
        projectId: "nft-swap",
    }
    firebase.initializeApp(config)
}
export default firebase