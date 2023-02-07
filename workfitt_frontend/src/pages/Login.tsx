import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonInput, IonPage, IonTitle, IonToolbar, IonText, } from "@ionic/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { toast } from "../toast";
import { useForm } from "react-hook-form";
import doctorLogin from "../api/doctor_login";
import { Preferences } from '@capacitor/preferences';
import "../css/login.css"
import { useHistory } from 'react-router-dom';
import Toast from '../components/Toast';
import Loader from "../components/Loader";
// import loginImg from "/assets/images/loading.png";


function Login(props) {
    const [errorMsg, seterrorMsg] = useState("")
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [isLoadingResult, setisLoadingResult] = useState(false)
    const [showToast, setshowToast] = useState(false)
    const [toastMessage, settoastMessage] = useState("")
    const [toastColor, settoastColor] = useState("success")
    const history = useHistory();
    const onSubmit = async (data: any) => {
        setisLoadingResult(true)
        let loginResp = await doctorLogin(data)
        // console.log("resp", loginResp);
        if (loginResp?.status && loginResp?.data && loginResp?.data?.length) {
            seterrorMsg("")
            props.setisAuthed(true)
            // localStorage.setItem('userInfo', JSON.stringify(loginResp.data[0]))
            await Preferences.set({
                key: 'userInfo',
                value: JSON.stringify(loginResp.data[0]),
            });

            // console.log("insidee iff");
            history.push("/")
            // window.location.href = `${window.location.origin}`


        } else {
            settoastColor("danger");
            settoastMessage(loginResp.msg);
            setshowToast(true);
            setTimeout(() => {
                setshowToast(false)
            }, 2000);
            reset()
            setisLoadingResult(false)
        }

    }
    return (
        <IonPage>
            {/* <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader> */}
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
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <IonItem lines="none" className="login_item">
                                <IonLabel className="prescription_label" position="stacked">Username</IonLabel>
                                <IonInput className="prescription_input" placeholder="Enter Username Here..." {...register("doctor_username", { required: true })} />
                            </IonItem>

                            <IonItem lines="none" className="login_item">
                                <IonLabel className="prescription_label" position="stacked"> Password</IonLabel>
                                <IonInput className="prescription_input" placeholder="Enter Password Here..." type="password" {...register("doctor_password", { required: true })} />
                            </IonItem>

                            <IonItem lines="none" className="login_item">
                                <IonButton color="success" type="submit" className="login_btn">Login</IonButton>
                                <Link to="/register" >
                                    <IonButton className="login_btn" color="primary">Register</IonButton>
                                </Link>
                            </IonItem>
                            <Link to="/forgotPassword" >
                                <IonText color="primary">Forgot your password ?</IonText>
                            </Link>
                        </form>
                    </div>
                }
                {/* <Link to="/lostpassword" ><p >Lost your password?</p></Link> */}
            </IonContent>
        </IonPage>
    );
};

export default Login;