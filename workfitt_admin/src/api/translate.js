import axios from "axios";
import config from "../config/config.json"

export default async function translate(params) {
    let data = {
        q: params,
        source: 'en',
        target: 'hi'
    }
  try {
    let resp = await axios.post(`https://libretranslate.de/translate`, data);
    return resp.data;
  } catch (err) {
    return false
    }
}