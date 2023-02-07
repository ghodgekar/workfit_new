import axios from "axios";
import config from "../config/config.json"

export default async function addQuestion(params) {
  
  try {
    let resp = await axios.post(`${config.backend_url}/forum/question/add`, params);
    return resp.data;
  } catch (err) {
    return false
    }
}