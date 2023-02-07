import axios from "axios";
import config from "../config/config.json"

export default async function doctorAdviceByType(params) {

  try {
    let query = ""
    if (params.advice_type) {
      query += "advice_type=" + params.advice_type
    }
    if (params.orderBy) {
      query += "&orderBy=" + params.orderBy
    }
    let resp = await axios.get(`${config.backend_url}/doctorAdviceByType?${query}`);
    return resp.data;
  } catch (err) {
    return false
  }
}