import axios from "axios";
import config from "../../config/config.json"

export default async function getInstructionByType(type) {
  
  try {
    let resp = await axios.get(`${config.backend_url}/instructionByType?sort=desc&instruction_type=${type}`);
    return resp.data;
  } catch (err) {
    return {status:false, msg:err}
    }
}