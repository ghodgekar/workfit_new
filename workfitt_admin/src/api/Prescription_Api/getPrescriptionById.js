import axios from "axios";
import config from "../../config/config.json"

export default async function getPrescriptionById(params) {

  try {
    
    let resp = await axios.get(`${config.backend_url}/getPrescriptionById?prescription_id=${params.id}`);
    return resp.data;
  } catch (err) {
    return false
  }
}