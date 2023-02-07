import axios from "axios";
import config from "../config/config.json"

export default async function getPrescriptionByMonth(params) {
  try {
    let options={
      url: `${config.backend_url}/report/getPrescriptionByMonth`,
      method: 'POST',
      responseType: 'blob', // important
      data: params
    }
    let resp = await axios(options);
    // console.log("resp",resp)
    return resp.data;
  } catch (err) {
    return false
    }
}