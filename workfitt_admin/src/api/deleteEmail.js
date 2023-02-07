import axios from "axios";
import config from "../config/config.json"

export default async function emailDelete(params) {
  
  try {
    let resp = await axios.get(`${config.backend_url}/admin/deleteEmailTemp/${params}`);
    return resp.data;
  } catch (err) {
    return false
    }
}