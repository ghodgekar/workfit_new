import axios from "axios";
import config from "../config/config.json"

export default async function getPrescriptionListByDrId(params) {
    let query = ""
    if (params.doctor_id) {
      query += "doctor_id=" + params.doctor_id
    }
    try {
        let resp = await axios.get(`${config.backend_url}/getPrescriptionListByDrId?${query}`);
        return resp.data;
    } catch (err) {
        return false
    }
}