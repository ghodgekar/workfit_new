import axios from "axios";
import config from "../config/config.json"

export default async function adminRegister(params) {
  
  try {
    let resp = await axios.post(`${config.backend_url}/admin/signup`, params);
    return resp.data;
  } catch (err) {
    return false
    }
}