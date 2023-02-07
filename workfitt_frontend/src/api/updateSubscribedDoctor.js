import axios from "axios";
import config from "../config/config.json"

export default async function updateSubscribedDoctor(params) {

  try {
    let resp = await axios.post(`${config.backend_url}/updateSubscribedDoctor`, params, { headers: { 'Content-Type': 'multipart/form-data' } });
    return resp.data;
  } catch (err) {
    return false
  }
}