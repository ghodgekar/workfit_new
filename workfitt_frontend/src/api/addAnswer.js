import axios from "axios";
import config from "../config/config.json"

export default async function addAnswer(params) {
  try {
    let resp = await axios.post(`${config.backend_url}/forum/answer/add`, params);
    return resp.data;
  } catch (err) {
    return false
    }
}