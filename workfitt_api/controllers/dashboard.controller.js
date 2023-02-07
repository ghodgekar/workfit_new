const db = require('../config/dbconnection');

exports.getDashboardData = async () => {
    try {


        let allDoctorquery = "select COUNT(doctor_Id) as total_doctor  from mst_doctors;"
        let result1 =db.executequery(allDoctorquery);
        let subscribedDoctorQuery = "select COUNT(doctor_Id)as subscribed_doctors from mst_doctors where subscription_end_date >= curdate();"
        let result2 = db.executequery(subscribedDoctorQuery);
        let allPrescriptionQuery = "select COUNT(prescription_id) as total_prescription from mst_prescription;"
        let result3 = db.executequery(allPrescriptionQuery);
        let activePrescriptionQuery = "select COUNT(prescription_id) as active_prescription from mst_prescription where expiry_date>=curdate();"
        let result4 = db.executequery(activePrescriptionQuery);
        let response=await Promise.all([result1,result2,result3,result4]).then(results => { return results });

        result1=response[0]
        result2=response[1]
        result3=response[2]
        result4=response[3]

        if (result1.length && result2.length && result3.length && result4.length) {
            let response = {
                "total_doctor_count": result1[0].total_doctor,
                "subscribed_doctor_count": result2[0].subscribed_doctors,
                "inActive_doctor_count": result1[0].total_doctor - result2[0].subscribed_doctors,
                "total_prescription_count": result3[0].total_prescription,
                "active_prescription_count": result4[0].active_prescription,
                "inActive_prescription_count": result3[0].total_prescription - result4[0].active_prescription,
            }
            return ({ status: true, data: response });
        } else {
            return ({ status: false, err: 'Oops Something Went Wrong !!!' });
        }
    } catch (err) {
        console.log(err);
        return ({ status: false, err: err });
    }
}