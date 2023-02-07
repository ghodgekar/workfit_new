import axios from "axios";
import config from "../../config/config.json"

export default async function doctorAdviceList() {
  
  try {
    let resp = await axios.get(`${config.backend_url}/doctorAdviceList?sort=desc`);
    return resp.data;
  } catch (err) {
    return false
    }
}