import axios from "axios";
import config from "../config/config.json"

export default async function getWatchVideo() {
  
  try {
    let resp = await axios.get(`${config.backend_url}/getWatchVideo`);
    return resp.data;
  } catch (err) {
    return false
    }
}