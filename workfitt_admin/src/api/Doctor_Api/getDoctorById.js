import axios from "axios";
import config from "../../config/config.json"

export default async function doctorById(params) {
    try {
        let resp = await axios.post(`${config.backend_url}/doctorById`, params);
        console.log("doctorById",resp);
        return resp.data;
    } catch (err) {
        return false
    }
}