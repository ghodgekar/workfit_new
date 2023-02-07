const db = require('../config/dbconnection');
const encrypt_decrypt = require('../encrypt_decrypt')
const formidable = require('formidable');
const path = require('path');
const moment = require('moment');
const fs = require('fs');


async function validateLoginRequest(req) {
    console.log("request", req);
    if (!req.doctor_username) {
        return { status: false, msg: 'Please Enter Username' };
    }

    if (!req.doctor_password) {
        return { status: false, msg: 'Please Enter Password' };
    }

    return { status: true }
}

module.exports.doctorLogin = async (req) => {
    let validation = await validateLoginRequest(req);
    if (!validation.status) return validation

    let query = `SELECT * FROM mst_doctors where doctor_username = ? and isActive = ?`;
    let values = [req.doctor_username, 1]
    let data = await db.executevaluesquery(query, values);
    if (data.length > 0) {
        let password = await encrypt_decrypt.decrypt(data[0].doctor_password)
        // console.log("password",password, req.doctor_password );
        if (password == req.doctor_password) {
            if (moment().isBefore(data[0].subscription_end_date)) {
                updateLoginStatus(1, data[0].doctor_Id)
                return ({ status: true, data: data, msg: 'Login Successful !!!' });
            } else {
                return ({ status: false, msg: 'Your Subscription Has Expired' });
            }
        } else {
            return ({ status: false, msg: 'Password does not match.' });
        }
    } else {
        return ({ status: false, msg: 'Username does not match.' });
    }

}

module.exports.doctorLogout = async (req) => {
    if (!req.doctor_id) {
        return ({ status: false, msg: 'Doctor Id Is Required' });
    }
    let logout = await updateLoginStatus(0, req.doctor_id)
    if (logout.status) {
        return ({ status: true, msg: 'Logout Successful' })
    }
    else {
        return ({ status: false, msg: 'Logout Un-Successful' })
    }

}

async function updateLoginStatus(status, doctor_id) {
    let query = `UPDATE mst_doctors SET login_status=? where doctor_Id=?`
    let values = [status, doctor_id]
    let result = await db.executevaluesquery(query, values)
    if (result.affectedRows) {
        return ({ status: true, msg: 'Doctor Status Updated Successfully' })
    }
    else {
        return ({ status: false, msg: 'Doctor Status Not Updated' })
    }
}

module.exports.doctorCheck = async (req) => {
    if (!req.doctor_cred) {
        return { status: false, msg: "Doctor username  or Doctor Email Address is required" }
    }
    let query = `SELECT * FROM mst_doctors where doctor_username = ? or doctor_email = ?`;
    let values = [req.doctor_cred, req.doctor_cred]
    let data = await db.executevaluesquery(query, values);

    if (data.length > 0) {
        return ({ status: true, data: data, msg: "We found user...Yeah." });
    }
    else {
        return ({ status: false, err: 'Credentials does not match.' });

    }
}


const getdoctorById = async (req) => {
    try {
        let query = `SELECT * FROM mst_doctors where doctor_Id = ? and isActive = ?`;
        let values = [req.doctor_id, 1]
        // console.log("query",query);
        let result = await db.executevaluesquery(query, values);
        // console.log("data", result);
        if (result.length > 0) {
            result[0].subscription_start_date = moment(result[0].subscription_start_date).utcOffset("+05:30")
            result[0].subscription_end_date = moment(result[0].subscription_end_date).utcOffset("+05:30")
            return ({ status: true, data: result[0], msg: 'Successful !!!' });
        } else {
            return { status: true, msg: "Oop's No Body Doctor Found" };
        }
    } catch (err) {
        console.log(err);
        return { status: false, err: err };
    }
}

module.exports.doctorById = getdoctorById;

module.exports.doctorByEmailUserName = async (req) => {
    try {
        if (!req.doctor_data) {
            return { status: false, msg: 'Please Enter Username Or Email' };
        }
        let query = `SELECT * FROM mst_doctors where (doctor_email = ? OR doctor_username=? )and isActive = ?`;
        let values = [req.doctor_data, req.doctor_data, 1]
        let result = await db.executevaluesquery(query, values);
        if (result.length > 0) {
            return ({ status: true, data: result[0], msg: 'Successful !!!' });
        } else {
            return { status: false, msg: "Please Enter Valid Username or Email" };
        }
    } catch (err) {
        console.log(err);
        return { status: false, err: err };
    }
}

async function updateDoctorData(req) {
    if (!req.doctor_id) {
        return { status: false, msg: "Please Enter Doctor Id" }
    } else if (req.doctor_password && req.doctor_password.length < 8) {
        return { status: false, msg: "Password Must be Atleast 8 characters long" }
    }

    let cols = ""
    let values = []

    if (req.doctor_name) {
        cols += ` doctor_name=?,`
        values.push(req.doctor_name)
    }

    if (req.doctor_username) {
        cols += ` doctor_username=?,`
        values.push(req.doctor_username)
    }

    if (req.doctor_email) {
        cols += ` doctor_email=?,`
        values.push(req.doctor_email)
    }

    if (req.doctor_mobile) {
        cols += ` doctor_mobile=?,`
        values.push(req.doctor_mobile)
    }

    if (req.doctor_degree) {
        cols += ` doctor_degree=?,`
        values.push(req.doctor_degree)
    }

    if (req.doctor_password) {
        req.doctor_password = await encrypt_decrypt.encrypt(req.doctor_password)
        cols += ` doctor_password= ?,`
        values.push(req.doctor_password)
    }

    if (req.doctor_specialisation) {
        cols += ` specialisation=?,`
        values.push(req.doctor_specialisation)
    }

    if (req.doctor_logo) {
        cols += ` doctor_logo=?,`
        values.push(req.doctor_logo)
    }

    if (req.doctor_sign) {
        cols += ` doctor_sign=?,`
        values.push(req.doctor_sign)
    }

    if (req.doctor_address) {
        cols += ` doctor_address=?,`
        values.push(req.doctor_address)
    }

    if (req.registration_number) {
        cols += ` registration_number=?,`
        values.push(req.registration_number)
    }

    if (req.subscription) {
        let subscriptionObject = await processSubscription(req.subscription)
        cols += ` subscription_type=?,`
        values.push(subscriptionObject.subscription_type)

        cols += ` subscription_start_date=?,`
        values.push(subscriptionObject.subscription_start_date)

        cols += ` subscription_end_date=?,`
        values.push(subscriptionObject.subscription_end_date)
    }

    if (req.consultation_charge) {
        cols += ` consultation_charge=?,`
        values.push(req.consultation_charge)
    }

    if (req.treatment1_charge) {
        cols += ` treatment1_charge=?,`
        values.push(req.treatment1_charge)
    }

    if (req.treatment2_charge) {
        cols += ` treatment2_charge=?,`
        values.push(req.treatment2_charge)
    }

    if (req.treatment3_charge) {
        cols += ` treatment3_charge=?,`
        values.push(req.treatment3_charge)
    }

    if (req.isActive || req.isActive == 0) {
        cols += ` isActive=?,`
        values.push(req.isActive)
    }

    cols = cols.substring(0, cols.lastIndexOf(",")) + " " + cols.substring(cols.lastIndexOf(",") + 1);
    values.push(req.doctor_id)
    let query = "UPDATE mst_doctors SET " + cols + " where doctor_Id = ?";
    let data = await db.executevaluesquery(query, values)
    if (data.affectedRows) {
        return { status: true, msg: 'Data Updated successfully!' };
    } else {
        return { status: false, err: "Oop's Something Went Wrong !!" };
    }
}
module.exports.updateDoctor = updateDoctorData;


module.exports.updateSubscribedDoctor = async (req, res) => {
    let bodyObj = {}
    var form = new formidable.IncomingForm();
    form.parse(req);

    form.on('fileBegin', function (name, file) {
        if (file.originalFilename != '' && file.originalFilename != undefined && file.originalFilename != null) {
            if (file.mimetype && file.mimetype.includes('image')) {
                let ext = file.originalFilename.split('.')[1];
                let fileName = Date.now() + '_' + file.newFilename + '.' + ext;
                file.filepath = path.join(__dirname, '../public/uploads/images/') + fileName;
                bodyObj[name] = "/uploads/images/" + fileName;
            }
        }
    });

    form.on('field', function (name, value) {
        bodyObj[name] = value;
    });
    form.on('error', (err) => {
        res.send({ status: false, err: err })
    });

    return new Promise(function (resolve, reject) {
        form.on('end', async function () {
            // let validation = await validateAddRequest(bodyObj);
            let doctorData = await getdoctorById({ "doctor_id": parseInt(bodyObj.doctor_id) })
            // console.log("validation", doctorData);
            if (doctorData.status) {
                if (!res.headersSent) {
                    if (bodyObj.doctor_logo) deleteFile(doctorData.data.doctor_logo);
                    if (bodyObj.doctor_sign) deleteFile(doctorData.data.doctor_sign);
                }
            }
            if (!res.headersSent) {
                let updateDoctor = await updateDoctorData(bodyObj)

                if (updateDoctor.status) {
                    if (bodyObj.doctor_logo) deleteFile(doctorData.data.doctor_logo);
                    if (bodyObj.doctor_sign) deleteFile(doctorData.data.doctor_sign);
                    doctorData = await getdoctorById({ "doctor_id": parseInt(bodyObj.doctor_id) })
                    resolve({ status: true, data: doctorData.data, msg: "Data Updated Successfully" })
                } else {
                    if (bodyObj.doctor_logo) deleteFile(bodyObj.doctor_logo);
                    if (bodyObj.doctor_sign) deleteFile(bodyObj.doctor_sign);
                    resolve({ status: false, msg: "Oop's Database Issue Occured" })
                }
            }
        })
    })

}


async function validateAddRequest(req) {
    // {
    //     doctor_mobile: '7208470446',
    //     doctor_logo: '/uploads/images/1656934050076_fed8e8fd9f3044ffb069b8800.png',
    //     doctor_sign: '/uploads/images/1656934050174_fed8e8fd9f3044ffb069b8801.png',
    //     doctor_name: 'Akshay Narkar',
    //     doctor_username: 'akshay1808',
    //     doctor_password: '12345678',
    //     doctor_email: 'akshaynarkar@gmail.com',
    //     consultation_charge: '200',
    //     treatment1_charge: '100',
    //     treatment2_charge: '100',
    //     treatment3_charge: '100',
    //     doctor_degree: 'MBBS',
    //     specialisation: 'Test',
    //     subscription: '6-month - 3000'
    // } 

    console.log("req.doctor_email", req);

    if (!req.doctor_mobile || req.doctor_mobile.length < 10) {
        return { status: false, msg: "Please Enter Valid Mobile Number" }
    }
    if (!req.doctor_name) {
        return { status: false, msg: "Please Enter Doctor Name" }
    }
    if (!req.doctor_username) {
        return { status: false, msg: "Please Enter Doctor Username" }
    }
    if (!req.doctor_password) {
        return { status: false, msg: "Please Enter Doctor Password" }
    }
    if (await checkUsername(req.doctor_username)) {
        return { status: false, msg: "Username is Already Present." }
    }
    if (!req.doctor_email) {
        return { status: false, msg: "Please Enter Doctor Email" }
    }
    return { status: true }
}

exports.deleteDoctor = async (req, res) => {
    try {
        let id = req.params.id;
        let query = `UPDATE mst_doctors SET isActive = 2 WHERE doctor_Id = ${id}`;
        let data = await db.executequery(query);
        if (data.affectedRows) {
            return ({ status: true, msg: 'Doctor Data Deleted Successfully.' });
        } else {
            return ({ status: false, err: 'There was some DB issue.' });
        }
    } catch (err) {
        console.log(err);
        res.send({ status: false, err: err });
    }
}

module.exports.addDoctor = async (req, res) => {
    let bodyObj = {}
    var form = new formidable.IncomingForm();
    form.parse(req);

    form.on('fileBegin', function (name, file) {
        if (file.originalFilename != '' && file.originalFilename != undefined && file.originalFilename != null) {
            if (file.mimetype && file.mimetype.includes('image')) {
                let ext = file.originalFilename.split('.')[1];
                let fileName = Date.now() + '_' + file.newFilename + '.' + ext;
                file.filepath = path.join(__dirname, '../public/uploads/images/') + fileName;
                bodyObj[name] = "/uploads/images/" + fileName;
            }
        }
    });

    form.on('field', function (name, value) {
        bodyObj[name] = value;
    });
    form.on('error', (err) => {
        res.send({ status: false, err: err })
    });

    return new Promise(function (resolve, reject) {
        form.on('end', async function () {
            let validation = await validateAddRequest(bodyObj);
            console.log("validation", validation);
            if (!validation.status) {
                if (!res.headersSent) {
                    if (bodyObj.doctor_logo) await deleteFile(bodyObj.doctor_logo);

                    if (bodyObj.doctor_sign) await deleteFile(bodyObj.doctor_sign);


                    res.send(validation)
                }
            } else {
                if (!res.headersSent) {

                    bodyObj.doctor_password = await encrypt_decrypt.encrypt(bodyObj.doctor_password)
                    bodyObj.doctor_mobile = parseInt(bodyObj.doctor_mobile)
                    let subscriptionObject = await processSubscription(bodyObj.subscription)
                    let query = `INSERT INTO mst_doctors
                                (doctor_name, doctor_username, doctor_address, doctor_email, doctor_mobile, doctor_password, doctor_degree, specialisation, doctor_logo, doctor_sign, 
                                subscription_type, subscription_start_date, subscription_end_date, registration_number, consultation_charge, treatment1_charge, treatment2_charge, treatment3_charge, isActive) 
                                VALUES 
                                (?,?,?,?,?,?,?,?,?,?,
                                 ?,?,?,?,?,?,?,?,?)`;//19

                    let values = [
                        bodyObj.doctor_name, bodyObj.doctor_username, bodyObj.doctor_address, bodyObj.doctor_email, bodyObj.doctor_mobile, bodyObj.doctor_password, bodyObj.doctor_degree, bodyObj.specialisation, bodyObj.doctor_logo, bodyObj.doctor_sign, subscriptionObject.subscription_type,
                        subscriptionObject.subscription_start_date, subscriptionObject.subscription_end_date, bodyObj.registration_number, parseInt(bodyObj.consultation_charge), parseInt(bodyObj.treatment1_charge), parseInt(bodyObj.treatment2_charge), parseInt(bodyObj.treatment3_charge), 1
                    ]//20

                    let result = await db.executevaluesquery(query, values)
                    if (result.insertId) {
                        resolve({ status: true, msg: "Data inserted successfully" })
                    } else {
                        if (bodyObj.doctor_logo) {
                            deleteFile(bodyObj.doctor_logo);
                        }
                        if (bodyObj.doctor_sign) {
                            deleteFile(bodyObj.doctor_sign);
                        }
                        resolve({ status: false, msg: "Oop's Database Issue Occured" })
                    }

                }

            }
        })
    })

    // console.log("resp",resp);

    // console.log("form",form);

}


async function processSubscription(subscription) {
    let arr = subscription.split("-")
    let subscriptionObj = {}
    subscriptionObj.subscription_start_date = moment().utcOffset("+05:30").format('YYYY-MM-DD')
    if (arr[1].trim() == 'month') {
        subscriptionObj.subscription_end_date = moment().add(Number(arr[0]), 'M').utcOffset("+05:30").format('YYYY-MM-DD');
    } else if (arr[1].trim() == 'year') {
        subscriptionObj.subscription_end_date = moment().add(Number(arr[0]), 'y').utcOffset("+05:30").format('YYYY-MM-DD');
    }
    subscriptionObj.subscription_type = arr[0] + " " + arr[1]

    return subscriptionObj
}

async function checkUsername(value) {
    let query = `SELECT doctor_username from mst_doctors where doctor_username = '${value}'`;
    let data = await db.executequery(query);
    if (data.length > 0) {
        return true;
    } else {
        return false;
    }
}

function deleteFile(fName) {
    let filePath = path.join(__dirname, '../public') + fName;
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log(err);
            }
            console.log('deleted');
        });
    }
}


module.exports.addDoctorVideo = async (req, res) => {
    let bodyObj = {}
    var form = new formidable.IncomingForm();
    form.parse(req);

    form.on('fileBegin', function (name, file) {
        if (file.originalFilename != '' && file.originalFilename != undefined && file.originalFilename != null) {
            if (file.mimetype && file.mimetype.includes('video')) {
                let ext = file.originalFilename.split('.')[1];
                let fileName = Date.now() + '_' + file.newFilename + '.' + ext;
                file.filepath = path.join(__dirname, '../public/videos/') + fileName;
                bodyObj[name] = "/videos/" + fileName;
            }
        }
    });

    form.on('field', function (name, value) {
        bodyObj[name] = value;
    });
    form.on('error', (err) => {
        res.send({ status: false, err: err })
    });

    return new Promise(function (resolve, reject) {
        form.on('end', async function () {
            let validation = await validateAddDoctorVideoRequest(bodyObj);
            console.log("validation", validation);
            if (!validation.status) {
                if (!res.headersSent) {
                    if (bodyObj.doctor_logo) await deleteFile(bodyObj.doctor_logo);


                    res.send(validation)
                }
            } else {
                if (!res.headersSent) {
                    let query = `INSERT INTO mst_videos
                                (video_name, video_type, video_youtube_id, is_youtube_link, isActive) 
                                VALUES 
                                (?,?,?,?,?)`;//19

                    let values = [
                        bodyObj.video_name, 'exercise', bodyObj.video_youtube_id, 0, 1
                    ]//20

                    let result = await db.executevaluesquery(query, values)
                    if (result.insertId) {
                            
                        let query1 = `INSERT INTO mst_dr_videos
                        (doctor_id, exercise_id, video_id, isActive) 
                        VALUES 
                        (?,?,?,?)`;//19

                        let values1 = [
                            bodyObj.doctor_id, bodyObj.exercise_id, result.insertId, 1
                        ]//20

                        let Videoresult = await db.executevaluesquery(query1, values1)
                        if (Videoresult.insertId) {
                            resolve({ status: true, msg: "Data inserted successfully" })
                        }
                    } else {
                        if (bodyObj.doctor_logo) {
                            deleteFile(bodyObj.doctor_logo);
                        }
                        if (bodyObj.doctor_sign) {
                            deleteFile(bodyObj.doctor_sign);
                        }
                        resolve({ status: false, msg: "Oop's Database Issue Occured" })
                    }

                }

            }
        })
    })

    // console.log("resp",resp);

    // console.log("form",form);

}


async function validateAddDoctorVideoRequest(req) {

    if (!req.exercise_id) {
        return { status: false, msg: "Please Enter Exercise Name" }
    }
    if (!req.video_name) {
        return { status: false, msg: "Please Enter Video Name" }
    }
    if (!req.video_youtube_id) {
        return { status: false, msg: "Please Enter Video Path" }
    }
    if (!req.doctor_id) {
        return { status: false, msg: "Please Enter Doctor Name" }
    }
    return { status: true }
}