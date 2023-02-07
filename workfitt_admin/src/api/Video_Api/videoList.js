import axios from "axios";
import config from "../../config/config.json"

export default async function videoList(params) {

  try {
    let condition = ""
    if (params && params.callFor) {
      condition = `&callFor=${params.callFor}`
    }
    if (params && params.video_id) {
      condition = `&video_id=${params.video_id}`
    }
    console.log(params);
    let url = `${config.backend_url}/videoList?sort=desc${condition}`
    console.log("url", url);
    let resp = await axios.get(url);
    return resp.data;
  } catch (err) {
    return false
  }
}