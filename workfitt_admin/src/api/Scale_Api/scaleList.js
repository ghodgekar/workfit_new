import axios from "axios";
import config from "../../config/config.json"

export default async function scaleList(params) {
  
  try {
    let condition=""
    if(params){
      condition=`&callFor=${params}`
    }
    let resp = await axios.get(`${config.backend_url}/scaleList?sort=desc${condition}`);
    return resp.data;
  } catch (err) {
    return false
    }
}