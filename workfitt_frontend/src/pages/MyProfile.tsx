
import React, { useEffect, useState } from 'react'
import { Preferences } from '@capacitor/preferences';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/react';
import { register } from '../serviceWorkerRegistration';
import { useForm } from 'react-hook-form';
import config from '../config/config.json';
import { format } from "date-fns"
import "../css/editProfile.css"
import { Link } from 'react-router-dom';
import { closeCircleOutline, createOutline, createSharp, pencil, pencilOutline } from 'ionicons/icons';
import updateSubscribedDoctor from '../api/updateSubscribedDoctor';
import Toast from '../components/Toast';
import Loader from '../components/Loader';

// interface DoctorArray {
//   "doctor_id": Number,
//   "doctor_username": { changed: Boolean, value: string },
//   "doctor_mobile": { changed: Boolean, value: string },
//   "doctor_logo": { changed: Boolean, value: any },
//   "doctor_sign": { changed: Boolean, value: any },
//   "consultation_charge": { changed: Boolean, value: number },
//   "treatment1_charge": { changed: Boolean, value: number },
//   "treatment2_charge": { changed: Boolean, value: number },
//   "treatment3_charge": { changed: Boolean, value: number },

// }
export default function Profile() {
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
  })
  const [EditRequest, setEditRequest] = useState({
    "doctor_username": { changed: false, value: "" },
    "doctor_mobile": { changed: false, value: "" },
    "doctor_address": { changed: false, value: "" },
    "doctor_logo": {} as { changed: Boolean, value: any, isError: Boolean },
    "doctor_sign": {} as { changed: Boolean, value: any, isError: Boolean },
    "consultation_charge": { changed: false, value: 0 },
    "treatment1_charge": { changed: false, value: 0 },
    "treatment2_charge": { changed: false, value: 0 },
    "treatment3_charge": { changed: false, value: 0 },
  }
  )

  const [isLoadingResult, setisLoadingResult] = useState(false)
  const [showToast, setshowToast] = useState(false)
  const [toastMessage, settoastMessage] = useState("")
  const [toastColor, settoastColor] = useState("danger")

  const lessThan2MB = (files) => { return files?.size < 2000000; }
  // const { register, handleSubmit, formState: { errors } } = useForm({ mode: "all" });

  useEffect(() => {
    async function fetchData() {
      setisLoadingResult(true)
      const { value } = await Preferences.get({ key: 'userInfo' });
      let doctorJson = JSON.parse(value)
      if (doctorJson.subscription_end_date) {
        let subscriptionDate = doctorJson.subscription_end_date.split("T")
        doctorJson.subscription_end_date = subscriptionDate[0]
      }
      setdoctorData(doctorJson);
      setisLoadingResult(false)
    }
    fetchData();
  }, [])

  const editChangeHandler = async (field) => {
    console.log("field", field)
    setEditRequest((Request) => {
      Request[field] = { changed: !Request[field]["changed"], value: "" }
      return { ...Request }
    })
  }

  const inputChangeHandler = async (field, value) => {
    // console.log("field", field, "value", value);

    if (field == "doctor_logo" || field == "doctor_sign") {
      let isValid = await lessThan2MB(value)
      // console.log("isValid", isValid);

      setEditRequest(Request => {
        Request[field] = { changed: true, value: isValid ? value : "", isError: isValid ? false : true }
        return { ...Request }
      })
    }
    else {
      setEditRequest((Request) => {
        Request[field] = { changed: true, value }
        return { ...Request }
      })
    }

  }

  const editDoctorData = async () => {
    setisLoadingResult(true)
    const formData = new FormData();
    for (var key in EditRequest) {
      if (EditRequest.hasOwnProperty(key)) {
        if (EditRequest[key] && EditRequest[key].value) {
          formData.append(key, EditRequest[key].value);
        }
      }
    }

    formData.append("doctor_id", doctorData.doctor_Id.toString());

    let updateDoctorData = await updateSubscribedDoctor(formData)
    if (updateDoctorData.status) {
      let subscriptionDate = updateDoctorData.data.subscription_end_date.split("T")
      updateDoctorData.data.subscription_end_date = subscriptionDate[0]
      setdoctorData(updateDoctorData.data)
      setEditRequest({
        "doctor_username": { changed: false, value: "" },
        "doctor_mobile": { changed: false, value: "" },
        "doctor_address": { changed: false, value: "" },
        "doctor_logo": {} as { changed: Boolean, value: any, isError: Boolean },
        "doctor_sign": {} as { changed: Boolean, value: any, isError: Boolean },
        "consultation_charge": { changed: false, value: 0 },
        "treatment1_charge": { changed: false, value: 0 },
        "treatment2_charge": { changed: false, value: 0 },
        "treatment3_charge": { changed: false, value: 0 },
      })
      await Preferences.set({
        key: 'userInfo',
        value: JSON.stringify(updateDoctorData.data),
      });
      settoastColor("success")
    }
    else {
      settoastColor("danger")
    }

    setisLoadingResult(false)
    settoastMessage(updateDoctorData.msg ? updateDoctorData.msg : "Oop's Something went wrong");
    setshowToast(true);
    setTimeout(() => { setshowToast(false) }, 2000);

  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <Toast
          showToast={showToast}
          closeToast={(e) => { setshowToast(e) }}
          message={toastMessage}
          color={toastColor}
        />

        {isLoadingResult ?
          <Loader />
          :
          <React.Fragment>
            {/* Doctor Name */}
            <div className="editItem">
              <b>Name  <small className="editSubscribeText">  (Editable on Subscription)</small> </b>
              <p className='editDesc'>Dr. {doctorData.doctor_name} {" (PT)"}</p>
            </div>
            {/* Doctor Name */}

            {/* Doctor UserName */}
            <div className="editItem">
              <b>Username <IonIcon className='editIcon' onClick={() => editChangeHandler("doctor_username")} icon={EditRequest?.doctor_username?.changed ? closeCircleOutline : createOutline} /> </b>
              <div className="editFlex">
                {EditRequest?.doctor_username?.changed ?
                  <IonInput className="edit_profile_input" placeholder="New Username" onIonChange={e => inputChangeHandler("doctor_username", e.detail.value!)} value={EditRequest?.doctor_username?.value}></IonInput>
                  :
                  <p className='editDesc'> {doctorData.doctor_username} </p>
                }
              </div>
            </div>
            {/* Doctor UserName */}

            {/* Subscription End Date */}
            <div className="editItem">
              <b>Subscription End Date</b>
              <p className='editDesc'> {doctorData.subscription_end_date} </p>
            </div>
            {/* Subscription End Date */}

            {/* Email Id */}
            <div className="editItem">
              <b>Email Id <small className="editSubscribeText">  (Editable on Subscription)</small></b>
              <p className='editDesc'> {doctorData.doctor_email} </p>
            </div>
            {/* Email Id */}

            {/* Mobile Number */}
            <div className="editItem">
              <b>Mobile No. <IonIcon className='editIcon' onClick={() => editChangeHandler("doctor_mobile")} icon={EditRequest?.doctor_mobile?.changed ? closeCircleOutline : createOutline} /></b>
              <div className="editFlex">
                {EditRequest?.doctor_mobile?.changed ?
                  <IonInput type="text" className="edit_profile_input" placeholder="New Mobile No." onIonChange={e => inputChangeHandler("doctor_mobile", e.detail.value!)} value={EditRequest?.doctor_mobile?.value}></IonInput>
                  :
                  <p className='editDesc'> {doctorData.doctor_mobile} </p>
                }
                
              </div>
            </div>
            {/* Mobile Number */}

            {/* Doctor Degree */}
            <div className="editItem">
              <b>Education Degree <small className="editSubscribeText">  (Editable on Subscription)</small></b>
              <p className='editDesc'> {doctorData.doctor_degree} </p>
            </div>
            {/* Doctor Degree */}

            {/* Doctor Logo */}
            <div className="editItem">
              <b>Your Logo <IonIcon className='editIcon' onClick={() => editChangeHandler("doctor_logo")} icon={EditRequest?.doctor_logo?.changed ? closeCircleOutline : createOutline} /></b>
              <div className="editFlex editImg">
                {EditRequest?.doctor_logo?.changed ?
                  <input type="file" onChange={e => inputChangeHandler("doctor_logo", e.target.files[0])} ></input>
                  :
                  <img src={`${config.backend_url}${doctorData.doctor_logo}`} className="myProfileImg editDesc" />
                }
              </div>

              {EditRequest?.doctor_logo?.changed ?
                <>
                  {EditRequest?.doctor_logo?.isError ? <h6 className='prescription_error'>Please upload file of less than 2 mb</h6> : null}
                  <h6 className='edit_input_desc'>(*Upload logo 450 x 380 less than 2 mb with white background)</h6>
                </> : null
              }
            </div>
            {/* Doctor Logo */}

            {/* Doctor Sign */}
            <div className="editItem">
              <b>Your Sign  <IonIcon className='editIcon' onClick={() => editChangeHandler("doctor_sign")} icon={EditRequest?.doctor_sign?.changed ? closeCircleOutline : createOutline} /></b>
              <div className="editFlex editImg">
                {EditRequest?.doctor_sign?.changed ?
                  <input type="file" onChange={e => inputChangeHandler("doctor_sign", e.target.files[0])}   ></input>
                  :
                  <img src={`${config.backend_url}${doctorData.doctor_sign}`} className="myProfileImg editDesc" />
                }
              </div>

              {EditRequest?.doctor_sign?.changed ?
                <>
                  {EditRequest?.doctor_sign?.isError ? <h6 className='prescription_error'>Please upload file of less than 2 mb</h6> : null}
                  <h6 className='edit_input_desc'>(*Upload sign 450 x 380 less than 2 mb with white background)</h6>
                </> : null
              }
            </div>
            {/* Doctor Sign */}

            {/* Clinic Address */}
            {/* <div className="editItem">
              <b>Clinic Address <small className="editSubscribeText">  (Editable on Subscription)</small></b>
              <p className='editDesc'> {doctorData.doctor_address}  </p>
            </div> */}

            <div className="editItem">
              <b>Clinic Address <IonIcon className='editIcon' onClick={() => editChangeHandler("doctor_address")} icon={EditRequest?.doctor_address?.changed ? closeCircleOutline : createOutline} /> </b>
              <div className="editFlex">

                {EditRequest?.doctor_address?.changed ?
                  <IonInput className="edit_profile_input" placeholder="Clinic Address" onIonChange={e => inputChangeHandler("doctor_address", e.detail.value!)} value={EditRequest?.doctor_address?.value}></IonInput>
                  :
                  <p className='editDesc'> {doctorData.doctor_address}</p>
                }
                
              </div>
            </div>
            {/* Clinic Address */}

            {/* Registration Number */}
            <div className="editItem">
              <b>Registration No. </b>
              <p className='editDesc'> {doctorData.registration_number} </p>

            </div>
            {/* Registration Number */}

            {/* Consultation Charges */}
            <div className="editItem">
              <b>Consultation Charges <IonIcon className='editIcon' onClick={() => editChangeHandler("consultation_charge")} icon={EditRequest?.consultation_charge?.changed ? closeCircleOutline : createOutline} /> </b>
              <div className="editFlex">

              {EditRequest?.consultation_charge?.changed ?
                <IonInput type="number" className="edit_profile_input" placeholder="Consultation Fees" onIonChange={e => inputChangeHandler("consultation_charge", e.detail.value!)} value={EditRequest?.consultation_charge?.value}></IonInput>
                :
                <p className='editDesc'> {doctorData.consultation_charge} Rs</p>
              }
              
            </div>
            </div>
            {/* Consultation Charges */}

            {/* Treatment 1 Charges */}
            <div className="editItem">
              <b>Treatment 1 Charges <IonIcon className='editIcon' onClick={() => editChangeHandler("treatment1_charge")} icon={EditRequest?.treatment1_charge?.changed ? closeCircleOutline : createOutline} /> </b>
              <div className="editFlex">
              {EditRequest?.treatment1_charge?.changed ?
                <IonInput type="number" className="edit_profile_input" placeholder="Treatment 1 Fees" onIonChange={e => inputChangeHandler("treatment1_charge", e.detail.value!)} value={EditRequest?.treatment1_charge?.value}></IonInput>
                :
                <p className='editDesc'> {doctorData.treatment1_charge} Rs </p>
              }
              
            </div>
            </div>
            {/* Treatment 1 Charges */}

            {/* Treatment 2 Charges */}
            <div className="editItem">
              <b>Treatment 2 Charges <IonIcon className='editIcon' onClick={() => editChangeHandler("treatment2_charge")} icon={EditRequest?.treatment2_charge?.changed ? closeCircleOutline : createOutline} /> </b>
              <div className="editFlex">
              {EditRequest?.treatment2_charge?.changed ?
                <IonInput type="number" className="edit_profile_input" placeholder="Treatment 2 Fees" onIonChange={e => inputChangeHandler("treatment2_charge", e.detail.value)} value={EditRequest?.treatment2_charge?.value}></IonInput>
                :
                <p className='editDesc'> {doctorData.treatment2_charge} Rs </p>
              }
              
            </div>
            </div>
            {/* Treatment 2 Charges */}

            {/* Treatment 3 Charges */}
            <div className="editItem">
              <b>Treatment 3 Charges <IonIcon className='editIcon' onClick={() => editChangeHandler("treatment3_charge")} icon={EditRequest?.treatment3_charge?.changed ? closeCircleOutline : createOutline} /> </b>
              <div className="editFlex">
              {EditRequest?.treatment3_charge?.changed ?
                <IonInput type="number" className="edit_profile_input" placeholder="Treatment 3 Fees" onIonChange={e => inputChangeHandler("treatment3_charge", e.detail.value!)} value={EditRequest?.treatment3_charge?.value}></IonInput>
                :
                <p className='editDesc'> {doctorData.treatment3_charge} Rs </p>
              }
              
            </div>
            </div>
            {/* Treatment 3 Charges */}

            <IonItem lines="none" >

              <IonButton color="success" className='editProfileBtn' onClick={() => { editDoctorData() }}>Edit Profile</IonButton>

              <Link to="/presubscription" >
                <IonButton color="primary" className='editProfileBtn'>Renew Subscription</IonButton>
              </Link>

            </IonItem>
          </React.Fragment>
        }

      </IonContent>
    </IonPage>
  )
}
