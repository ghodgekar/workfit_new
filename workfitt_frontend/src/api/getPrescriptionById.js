import axios from "axios";
import config from "../config/config.json"

export default async function getPrescriptionById(params) {
    let query = ""
    if (params.prescription_id) {
      query += "prescription_id=" + params.prescription_id
    }
    try {
        let resp = await axios.get(`${config.backend_url}/getPrescriptionById?${query}`);
        return resp.data;
    } catch (err) {
        return false
    }
}