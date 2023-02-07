const db = require('../config/dbconnection');
const moment = require('moment');
const XLSX = require("xlsx");

module.exports.prescriptionByMonthReport = async (req, res) => {
    const request = req.body;
    if (request.date_of_report && request.doctor_id) {
        try {
            let startOfMonth = moment(request.date_of_report).startOf('month').format('YYYY-MM-DD');
            let endOfMonth = moment(request.date_of_report).endOf('month').format('YYYY-MM-DD');
            const fileName = `${request.doctor_id}_${moment(request.date_of_report).format('MMMM')}_report`;
            const workBook = XLSX.utils.book_new();

            let prescriptionArr = await getPrescriptionData(startOfMonth, endOfMonth, request.doctor_id)
            const prescriptionSheet = XLSX.utils.json_to_sheet(prescriptionArr);
            XLSX.utils.book_append_sheet(workBook, prescriptionSheet, 'Prescription Report');

            let billArr = await getBillData(startOfMonth, endOfMonth, request.doctor_id)
            const billSheet = XLSX.utils.json_to_sheet(billArr);
            XLSX.utils.book_append_sheet(workBook, billSheet, 'Bill Report');



            const buffer = XLSX.write(workBook, { bookType: 'xlsx', bookSST: false, type: 'base64' });
            res.writeHead(200, {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                "Content-Disposition": "attachment; filename=" + `${fileName}.xlsx`
            });
            res.end(Buffer.from(buffer, 'base64'));

            // Below line doesnt work
            // res.send({status:true,data: Buffer.from(buffer, 'base64')});


        } catch (error) {
            console.log(error);
            res.send({ status: false, message: "Something went wrong." });
        }
    } else {
        res.send({ status: false, message: "Date and ID required." });
    }
}

async function getBillData(startOfMonth, endOfMonth, doctor_id) {
    let query = `SELECT
               pt.patient_name,presc.date_of_evaluation,bill.* 
               FROM mst_prescription_bill bill
               JOIN mst_prescription presc ON bill.bill_prescription_id=presc.prescription_id
               JOIN mst_patient pt ON pt.patient_id=bill.bill_patient_id 
               WHERE bill.bill_date_of_evaluation BETWEEN DATE("${startOfMonth}") AND DATE("${endOfMonth}") AND bill.bill_doctor_id = ?`
               console.log("queryy",query);
    let values = [doctor_id]
    let data = await db.executevaluesquery(query, values);
    console.log("data",data);
    if (data.length) {
        let billArray = [];
        data.forEach((element, id) => {
            let obj = {
                "Sr. No.": id + 1,
                "Patient Name": element.patient_name ? element.patient_name : "N.A",
                "Invoice Name": element.bill_invoice_to ? element.bill_invoice_to : "N.A",
                "Date": element.bill_date_of_evaluation ? element.bill_date_of_evaluation : "N.A",
                "Time": element.bill_time ? element.bill_time : "N.A",
                "Bill No": element.bill_no ? element.bill_no : "N.A",
                "Consultation Charges": element.bill_consultation_charge ? element.bill_consultation_charge : 0,
                "Treatment Charges": element.bill_treatment_charge ? element.bill_treatment_charge : 0,
                "Additional Charges": element.bill_modality_charges ? element.bill_modality_charges : 0,
                "Discount": element.bill_discount ? element.bill_discount : 0,
                "Treatment Days": element.bill_treatment_day ? element.bill_treatment_day : 1,
                "Total": element.bill_total_amount ? element.bill_total_amount : 0,
            }
            billArray.push(obj);
        })
        return billArray
    }
    return [
        {
            "Sr. No.": "",
            "Patient Name": "",
            "Invoice Name": "",
            "Date": "",
            "Time": "",
            "Bill No": "",
            "Consultation Charges": "",
            "Treatment Charges": "",
            "Additional Charges": "",
            "Discount": "",
            "Treatment Days": "",
            "Total": "",
        }
    ]
}

async function getPrescriptionData(startOfMonth, endOfMonth, doctor_id) {
    let query = `SELECT 
                MAIN.date_of_evaluation, MAIN.patient_obj, MAIN.prescription_c_o, MAIN.doctor_note, MAIN.doctor_advice, MAIN.adjunct, MAIN.exercise_arr, MD.doctor_name 
                FROM mst_prescription AS MAIN 
                JOIN mst_doctors AS MD ON MAIN.doctor_id = MD.doctor_Id 
                WHERE MAIN.date_of_evaluation BETWEEN DATE("${startOfMonth}") AND DATE("${endOfMonth}") AND MAIN.doctor_id = ?`;
    let values = [doctor_id]
    let data = await db.executevaluesquery(query, values);
    if (data.length) {
        let objData = [];
        data.forEach((element, idx) => {
            let obj = {
                "Sr. No.": idx + 1,
                "Patient name": JSON.parse(element.patient_obj).patient_name,
                "Date of evaluation": element.date_of_evaluation ? moment(element.date_of_evaluation).utcOffset("+05:30").format('YYYY-MM-DD') + "" : "N.A",
                "Age/Gender": element.patient_obj ? (JSON.parse(element.patient_obj).patient_age + "/" + JSON.parse(element.patient_obj).patient_gender) : "N.A",
                "C/O": element.prescription_c_o ? element.prescription_c_o : "N.A",
                "Doctor note": element.doctor_note ? element.doctor_note : "N.A"
            };
            if (element.doctor_advice && typeof JSON.parse(element.doctor_advice) === 'object') {
                obj["Advice"] = '';
                if (Object.values(JSON.parse(element.doctor_advice)).length) {
                    Object.values(JSON.parse(element.doctor_advice)).forEach((value, index) => {
                        if (Object.values(JSON.parse(element.doctor_advice)).length == (index + 1)) {
                            obj["Advice"] += value;
                        } else {
                            obj["Advice"] += value + ', ';
                        }
                    });
                }
            } else {
                obj["Advice"] = 'N.A';
            }
            if (element.adjunct && typeof JSON.parse(element.adjunct) === 'object') {
                obj["Adjunct"] = '';
                if (Object.values(JSON.parse(element.adjunct)).length) {
                    Object.values(JSON.parse(element.adjunct)).forEach((value, index) => {
                        if (Object.values(JSON.parse(element.adjunct)).length == (index + 1))
                            obj["Adjunct"] += value.adjunct_name;
                        else
                            obj["Adjunct"] += value.adjunct_name + ', ';
                    });
                }
            } else {
                obj["Adjunct"] = 'N.A';
            }
            if (element.exercise_arr && typeof JSON.parse(element.exercise_arr) === 'object') {
                obj["Exercise"] = '';
                if (Object.values(JSON.parse(element.exercise_arr)).length) {
                    Object.values(JSON.parse(element.exercise_arr)).forEach((value, index) => {
                        if (Object.values(JSON.parse(element.exercise_arr)).length == (index + 1)) {
                            obj["Exercise"] += value.exercise_name;
                        } else {
                            obj["Exercise"] += value.exercise_name + ', ';
                        }
                    });
                }
            } else {
                obj["Exercise"] = 'N.A';
            }
            objData.push(obj);
        });
        return objData
    }
    return [
        {
            "Sr. No.": "",
            "Patient name": "",
            "Date of evaluation": "",
            "Age/Gender": "",
            "C/O": "",
            "Doctor note": "",
            "Advice": "",
            "Adjunct": "",
            "Exercise": ""
        }
    ]


}