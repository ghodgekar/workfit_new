import axios from "axios";
import config from "../config/config.json"

export default async function forumQNA(params) {
  
  try {
    let resp = await axios.get(`${config.backend_url}/forum/questionWithAnswers?sort=desc`);
    return resp.data;
  } catch (err) {
    return false
    }
}