import axios from "axios";
import config from "../config/config.json"

export default async function emailtemplateAdd(params) {
  
  try {
    let resp = await axios.post(`${config.backend_url}/admin/addEmailTemp`, params);
    return resp.data;
  } catch (err) {
    return false
    }
}