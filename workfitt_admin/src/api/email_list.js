import axios from "axios";
import config from "../config/config.json"

export default async function emailList() {
  
  try {
    let resp = await axios.get(`${config.backend_url}/admin/emailTempList?limit=10&sort=desc`);
    return resp.data;
  } catch (err) {
    return false
    }
}