import axios from "axios";
import config from "../config/config.json"

export default async function doctorDelete(params) {
  
  try {
    let resp = await axios.get(`${config.backend_url}/doctor/delete/${params}`);
    return resp.data;
  } catch (err) {
    return false
    }
}