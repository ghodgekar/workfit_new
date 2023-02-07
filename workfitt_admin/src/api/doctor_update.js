import axios from "axios";
import config from "../config/config.json"

export default async function doctorUpdate(params) {
  
  try {
    console.log("params",params);
    let resp = await axios.post(`${config.backend_url}/doctor/update`, params);
    return resp.data;
  } catch (err) {
    return false
    }
}