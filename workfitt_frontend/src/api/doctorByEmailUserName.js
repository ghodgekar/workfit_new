import axios from "axios";
import config from "../config/config.json"

export default async function doctorByEmailUserName(params) {
  
  try {
    let resp = await axios.post(`${config.backend_url}/doctorByEmailUserName`, params);
    return resp.data;
  } catch (err) {
    return false
    }
}