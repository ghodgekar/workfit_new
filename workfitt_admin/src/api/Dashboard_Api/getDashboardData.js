import axios from "axios";
import config from "../../config/config.json"

export default async function getDashboardData() {
  
  try {
    let resp = await axios.get(`${config.backend_url}/getDashboardData`);
    return resp.data;
  } catch (err) {
    return false
    }
}