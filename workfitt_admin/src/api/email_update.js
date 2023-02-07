import axios from "axios";
import config from "../config/config.json"

export default async function emailUpdate(params) {
  
  try {
    console.log("params",params);
    let resp = await axios.post(`${config.backend_url}/admin/updateEmailTemp`, params);
    return resp.data;
  } catch (err) {
    return false
    }
}