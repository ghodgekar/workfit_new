import axios from "axios";
import config from "../config/config.json"

export default async function doctorList() {
  
  try {
    let resp = await axios.get(`${config.backend_url}/doctor/list?limit=10&sort=asce`);
    return resp.data;
  } catch (err) {
    return false
    }
}