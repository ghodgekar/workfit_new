import axios from "axios";
import config from "../config/config.json"

export default async function addDoctor(params) {

  try {
    let resp = await axios.post(`${config.backend_url}/addDoctor`, params, { headers: { 'Content-Type': 'multipart/form-data' } });
    console.log("Response", resp);
    return resp.data;
  } catch (err) {
    return false
  }
}