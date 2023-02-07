import axios from "axios";
import config from "../../config/config.json"

export default async function adminList() {
  
  try {
    let resp = await axios.get(`${config.backend_url}/adminList?sort=desc`);
    return resp.data;
  } catch (err) {
    return false
    }
}