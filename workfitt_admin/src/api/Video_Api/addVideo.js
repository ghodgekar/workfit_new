import axios from "axios";
import config from "../../config/config.json"

export default async function addVideo(params) {
    try {
        let resp = await axios.post(`${config.backend_url}/addVideo`, params);
        return resp.data;
    } catch (err) {
        return false
    }
}