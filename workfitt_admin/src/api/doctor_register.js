import axios from "axios";
import config from "../config/config.json"

export default async function doctorRegister(params) {
  
  try {
    let resp = await axios.post(`${config.backend_url}/doctor/signup`, params);
    return resp.data;
  } catch (err) {
    return false
    }
}