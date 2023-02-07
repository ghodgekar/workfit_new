import axios from "axios";
import config from "../../config/config.json"

export default async function subscriptionList() {

    try {
        let resp = await axios.get(`${config.backend_url}/subscriptionList?sort=desc`);
        return resp.data;
    } catch (err) {
        return false
    }
}