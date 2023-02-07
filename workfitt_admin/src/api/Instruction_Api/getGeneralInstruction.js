import axios from "axios";
import config from "../../config/config.json"

export default async function getGeneralInstruction(param) {
  
  try {
    let queryParam="sort=desc"
    if(param.type){
      queryParam+=`&instruction_type=${param.type}`
    }
    if(param.instruction_id){
      queryParam+=`&instruction_id=${param.instruction_id}`
    }
    let resp = await axios.get(`${config.backend_url}/getInstruction?${queryParam}`);
    return resp.data;
  } catch (err) {
    return {status:false, msg:err}
    }
}