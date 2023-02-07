import axios from "axios";
import config from "../../config/config.json"

export default async function addAdmin(params) {
    try {
        let resp = await axios.post(`${config.backend_url}/addAdmin`, params);
        return resp.data;
    } catch (err) {
        return false
    }
}