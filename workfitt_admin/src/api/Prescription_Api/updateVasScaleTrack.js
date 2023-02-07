import axios from "axios";
import config from "../../config/config.json"

export default async function updateVasScaleTrack(params) {
  try {
    let resp = await axios.post(`${config.backend_url}/updateVasScaleTrack`,params);
    return resp;
  } catch (err) {
    return false
    }
}