import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonInput, IonPage, IonTitle, IonToolbar, IonText, } from "@ionic/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import doctorLogin from "../api/doctor_login";
import { Preferences } from '@capacitor/preferences';
import "../css/login.css"
import { useHistory } from 'react-router-dom';
import Toast from '../components/Toast';
import Loader from "../components/Loader";
import doctorByEmailUserName from "../api/doctorByEmailUserName";
import updateDoctor from "../api/updateDoctor";

export default function ForgotPassword() {
    const [errorMsg, seterrorMsg] = useState("")
    const [doctorunique, setdoctorunique] = useState("")
    const [isLoadingResult, setisLoadingResult] = useState(false)
    const [showToast, setshowToast] = useState(false)
    const [toastMessage, settoastMessage] = useState("")
    const [toastColor, settoastColor] = useState("success")
    const [formStep, setformStep] = useState(0)
    const history = useHistory();
    const [doctorData, setdoctorData] = useState({
        "doctor_Id": 0,
        "doctor_name": "",
        "doctor_username": "",
        "doctor_email": "",
        "doctor_mobile": "",
        "doctor_password": "",
        "doctor_degree": "",
        "specialisation": "",
        "doctor_logo": "",
        "doctor_sign": "",
        "doctor_address": "",
        "registration_number": "",
        "subscription_type": "",
        "subscription_start_date": "",
        "subscription_end_date": "",
        "consultation_charge": "",
        "treatment1_charge": "",
        "treatment2_charge": 0,
        "treatment3_charge": 0,
    });
    const [password, setpassword] = useState("");
    const [copyPassword, setcopyPassword] = useState("");

    async function checkUsername() {
        setisLoadingResult(true)
        if (doctorunique) {
            let checkUsername = await doctorByEmailUserName({ "doctor_data": doctorunique })
            if (checkUsername.status) {
                setdoctorData(checkUsername.data)
                setformStep(1)
            } else {
                setToastData(checkUsername.msg, "danger");
            }
        } else {
            setToastData("Please Enter Required Fields", "danger")
        }
        setisLoadingResult(false)
    }
    async function setToastData(message, color) {
        settoastColor(color);
        settoastMessage(message);
        setshowToast(true);
        setTimeout(() => { setshowToast(false) }, 2000);
    }

    async function changePassword() {
        setisLoadingResult(true)
        if (!password || !copyPassword) {
            setToastData("Please Enter Both Passwords", "danger")
        }
        else {
            if (password == copyPassword) {
                let req = {
                    doctor_id: doctorData.doctor_Id,
                    doctor_password: password
                }

                let updateResp = await updateDoctor(req)
                if (updateResp.status) {
                    await setToastData(updateResp.msg, "success")
                    setTimeout(() => { history.push("/login") }, 2000);
                    
                } else {
                    setToastData(updateResp.msg, "danger")
                }
            } else {
                setToastData("Please  Enter Both Passwords Same", "danger")
            }
        }
        setisLoadingResult(false)
    }


    return (
        <IonPage>
            <IonContent fullscreen>
                <Toast
                    showToast={showToast}
                    closeToast={(e) => { setshowToast(e) }}
                    message={toastMessage}
                    color={toastColor}
                />

                {isLoadingResult ?
                    <Loader /> :
                    <div className="login_container">
                        <img src="/assets/images/loading_old.png" className="login_img" />
                        {formStep == 0 ?
                            <React.Fragment>
                                <IonItem lines="none" className="login_item">
                                    <IonInput className="prescription_input" placeholder="Enter Username Or Email Here..." onIonChange={(e) => { setdoctorunique(e.detail.value) }} />
                                </IonItem>
                                <IonItem lines="none" className="login_item">
                                <IonButton color="success" type="submit"  onClick={() => { checkUsername() }}>Submit</IonButton>
                                </IonItem>
                            </React.Fragment>
                            :
                            null
                        }

                        {formStep == 1 ?
                            <React.Fragment>
                                <IonItem lines="none" className="login_item">
                                    <IonInput className="prescription_input" placeholder="Enter New Password ..." type="password" onIonChange={(e) => { setpassword(e.detail.value) }} />
                                </IonItem>

                                <IonItem lines="none" className="login_item">
                                    <IonInput className="prescription_input" placeholder="Confirm New Password ..." type="password" onIonChange={(e) => { setcopyPassword(e.detail.value) }} />
                                </IonItem>

                                <IonItem lines="none" className="login_item">
                                    <IonButton color="success" type="submit"  onClick={() => { changePassword() }}>Change Password</IonButton>
                                </IonItem>
                            </React.Fragment>
                            : null
                        }
                    </div>
                }
                {/* <Link to="/lostpassword" ><p >Lost your password?</p></Link> */}
            </IonContent>
        </IonPage>
    )
}
