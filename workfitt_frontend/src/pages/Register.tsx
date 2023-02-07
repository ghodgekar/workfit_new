import {  IonButton, IonCheckbox, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, isPlatform } from '@ionic/react';
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import addDoctor from "../api/doctor_register";
import "../css/register.css"
import subscriptionList from '../api/getSubscriptionList';
import Toast from '../components/Toast';
import Loader from '../components/Loader';
import { DocumentViewer } from '@ionic-native/document-viewer';

function Register(props) {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({ mode: "all" });
  const [subscriptionArr, setsubscriptionArr] = useState([])
  const [isLoadingResult, setisLoadingResult] = useState(false)
  const [showToast, setshowToast] = useState(false)
  const [toastMessage, settoastMessage] = useState("")
  const [toastColor, settoastColor] = useState("danger")
  const [TnC, setTnC] = useState(false)


  const openTnc = () => {
    DocumentViewer.viewDocument(figureOutFile("Agreement.pdf"), "application/pdf", {
      title: 'My PDF'
    })
  }

  function figureOutFile(file: String) {
    if (isPlatform("ios") || isPlatform("iphone") || isPlatform("ipad")) {
      const baseUrl = window.location.href.replace('/index.html', '');
      return baseUrl + `/public/assets/${file}`;
    }
    else {
      return `file:///android_asset/public/assets/${file}`;
    }
  }

  useEffect(() => {
    async function fetchData() {
      // App.addListener('backButton', () => { window.location.href = `${window.location.origin}` })

      setisLoadingResult(true)
      let subscriptionRes = await subscriptionList()
      if (subscriptionRes.status) {
        setsubscriptionArr(subscriptionRes.data)
      }
      setisLoadingResult(false)
    }
    fetchData();
  }, [])



  const onSubmit = async (data: any) => {
    if (!TnC) {
      settoastColor("danger")
      settoastMessage("Please accept Terms and Conditions");
      setshowToast(true);
      setTimeout(() => {
        setshowToast(false)
      }, 2000);

      return false
    } else {

      setisLoadingResult(true)
      const formData = new FormData();
      formData.append("doctor_mobile", data.doctor_mobile);
      formData.append("doctor_address", data.doctor_address);
      formData.append("doctor_logo", data.doctor_logo[0]);
      formData.append("doctor_sign", data.doctor_sign[0]);
      formData.append("doctor_name", data.doctor_name);
      formData.append("doctor_username", data.doctor_username);
      formData.append("doctor_password", data.doctor_password);
      formData.append("doctor_email", data.doctor_email);
      formData.append("consultation_charge", data.consultation_charge);
      formData.append("treatment1_charge", data.treatment1_charge);
      formData.append("treatment2_charge", data.treatment2_charge);
      formData.append("treatment3_charge", data.treatment3_charge);
      formData.append("doctor_degree", data.doctor_degree);
      formData.append("specialisation", data.specialisation);
      formData.append("subscription", data.subscription);
      formData.append("registration_number", data.registration_number);

      let registerResponse = await addDoctor(formData)

      console.log("registerResponse", registerResponse);
      setisLoadingResult(false)
      if (registerResponse.status) {
        props.history.push('/login');
      }
      else {
        settoastColor("danger")
        settoastMessage(registerResponse.msg ? registerResponse.msg : "Oop's Something went wrong");
        setshowToast(true);
        setTimeout(() => {
          setshowToast(false)
        }, 2000);
      }
    }

  }

  useEffect(() => {
    console.log("validation error", errors)


  }, [errors])


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
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
          <Loader /> :

          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem lines='none'>
              <IonLabel className="prescription_label" position="stacked" >Your Name</IonLabel>
              <div id="doctorNameInput">
                <span id="drInput">Dr. </span>
                <IonInput className="prescription_input" placeholder='Enter Name Here....' {...register("doctor_name", { required: true })} />
                <span id="ptInput"> {" (PT)"}</span>
              </div>
            </IonItem>
            {errors.doctor_name && <h6 className='prescription_error'>Name is required</h6>}

            <IonItem lines='none'>
              <IonLabel className="prescription_label" position="stacked" >Clinic Address</IonLabel>
              <IonInput className="prescription_input" placeholder='Enter Clinic Address Here....' {...register("doctor_address")} />
            </IonItem>

            <IonItem lines='none'>
              <IonLabel className="prescription_label" position="stacked" >Registration Number </IonLabel>
              <IonInput className="prescription_input" placeholder='Enter Registration Number Here....' {...register("registration_number")} />
            </IonItem>
            {/* {errors.registration_number && <h6 className='prescription_error'>Registration Number is required</h6>} */}


            <IonItem lines='none'>
              <IonLabel className="prescription_label" position="stacked" >Username</IonLabel>
              <IonInput className="prescription_input" placeholder='Enter Username Here....' {...register("doctor_username", { required: true })} />

            </IonItem>
            {errors.doctor_username && <h6 className='prescription_error'>Username is required</h6>}

            <IonItem lines='none'>
              <IonLabel className="prescription_label" position="stacked" >Password</IonLabel>
              <IonInput className="prescription_input" placeholder='Enter Password Here....' type="password" {...register("doctor_password", { required: true, minLength: 8 })} />
            </IonItem>
            {errors?.doctor_password?.type.toString() == "required" && <h6 className='prescription_error'>Password is required</h6>}
            {errors?.doctor_password?.type.toString() != "required" && errors?.doctor_password?.type.toString() == "minLength" && <h6 className='prescription_error'>Password must be atleast 8 character long</h6>}

            <IonItem lines='none'>
              <IonLabel className="prescription_label" position="stacked" >Confirm Password</IonLabel>
              <IonInput className="prescription_input" placeholder='Enter Password Here....' type="password"
                {...register("doctor_confirm_password",
                  {
                    required: true, minLength: 8,
                    validate: {
                      matchPassword: (e) => {
                        console.log("eeee", getValues("doctor_password"));
                        return e == getValues("doctor_password") || false;
                      }
                    }
                  })} />
            </IonItem>
            {errors?.doctor_confirm_password?.type.toString() == "required" && <h6 className='prescription_error'>Password is required</h6>}
            {/* {errors?.doctor_confirm_password?.type.toString() != "required" && errors?.doctor_confirm_password?.type.toString() == "minLength" && <h6 className='prescription_error'>Password must be atleast 8 character long</h6>} */}
            {errors.doctor_confirm_password?.type.toString() == "matchPassword" && errors.doctor_confirm_password?.type.toString() !== "required" && <h6 className='prescription_error'>Confirm Password and Password must be same</h6>}

            <IonItem lines='none'>
              <IonLabel position="stacked" className="prescription_label"> Email Address</IonLabel>
              <IonInput className="prescription_input" placeholder='Enter Email Here....' {...register("doctor_email", { required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ })} />
            </IonItem>
            {errors.doctor_email?.type.toString() == "required" && <h6 className='prescription_error'>Email Address is required</h6>}
            {errors.doctor_email?.type.toString() != "required" && errors.doctor_email?.type.toString() == "pattern" && <h6 className='prescription_error'>Email Address is required</h6>}

            <IonItem lines='none'>
              <IonLabel position="stacked" className="prescription_label">Mobile No</IonLabel>
              <IonInput type="number" className="prescription_input" placeholder='Enter Mobile No. Here....'  {...register("doctor_mobile", { required: true, pattern: /^\d{10}$/ })} />
            </IonItem>
            {errors.doctor_mobile?.type.toString() == "required" && <h6 className='prescription_error'>Mobile No is required</h6>}
            {errors?.doctor_mobile?.type.toString() != "required" &&
              (errors.doctor_mobile?.type.toString() == "pattern" || errors.doctor_mobile?.type.toString() == "valueAsNumber") &&
              <h6 className='prescription_error'>Please Enter Valid Mobile No</h6>
            }

            <IonItem lines='none'>
              <IonLabel position="stacked" className="prescription_label">Consultation Charges</IonLabel>
              <IonInput type="number" className="prescription_input" placeholder='Enter Consultation Charges Here....' {...register("consultation_charge", { required: true, valueAsNumber: true, })} />
            </IonItem>
            {errors?.consultation_charge?.type.toString() == "required" && <h6 className='prescription_error'>Consultation Charges is required</h6>}
            {errors?.consultation_charge?.type.toString() != "required" &&
              errors?.consultation_charge?.type.toString() == "valueAsNumber" &&
              <h6 className='prescription_error'>Please Enter Valid Consultation Charges</h6>
            }

            <IonItem lines='none'>
              <IonLabel position="stacked" className="prescription_label">Treatment 1 Charges</IonLabel>
              <IonInput type="number" className='prescription_input' placeholder='Enter Treatment 1 Charges Here....'  {...register("treatment1_charge", { required: true, valueAsNumber: true, })} />
            </IonItem>
            {errors?.treatment1_charge?.type.toString() == "required" && <h6 className='prescription_error'>Treatment 1 Charges is required</h6>}
            {errors?.treatment1_charge?.type.toString() != "required" &&
              errors?.treatment1_charge?.type.toString() == "pattern" &&
              <h6 className='prescription_error'>Please Enter Valid Treatment 1 Charges</h6>
            }

            <IonItem lines='none'>
              <IonLabel position="stacked" className="prescription_label">Treatment 2 Charges</IonLabel>
              <IonInput type="number" className="prescription_input" placeholder='Enter Treatment 2 Charges Here....' {...register("treatment2_charge", { required: true, valueAsNumber: true, })} />
            </IonItem>
            {errors?.treatment2_charge?.type.toString() == "required" && <h6 className='prescription_error'>Treatment 2 Charges is required</h6>}
            {errors?.treatment2_charge?.type.toString() != "required" &&
              errors?.treatment2_charge?.type.toString() == "pattern" &&
              <h6 className='prescription_error'>Please Enter Valid Treatment 2 Charges</h6>
            }

            <IonItem lines='none'>
              <IonLabel position="stacked" className="prescription_label">Treatment 3 Charges</IonLabel>
              <IonInput type="number" className="prescription_input" placeholder='Enter Treatment 3 Charges Here....' {...register("treatment3_charge", { required: true, valueAsNumber: true })} />
            </IonItem>
            {errors?.treatment3_charge?.type.toString() == "required" && <h6 className='prescription_error'>Treatment 3 Charges is required</h6>}
            {errors?.treatment3_charge?.type.toString() != "required" &&
              errors?.treatment3_charge?.type.toString() == "pattern" &&
              <h6 className='prescription_error'>Please Enter Valid Treatment 3 Charges</h6>
            }

            <IonItem lines='none'>
              <IonLabel position="stacked" className="prescription_label"> Education Degree</IonLabel>
              <IonInput onIonChange={(e) => { console.log("heree", e.detail.value) }} className="prescription_input" placeholder='Enter Education Degree Here....'  {...register("doctor_degree", { required: true, })} />
            </IonItem>
            {errors.doctor_degree && <h6 className='prescription_error'>Education Degree is required</h6>}

            <IonItem lines='none'>
              <IonLabel position="stacked" className="prescription_label"> Specialization</IonLabel>
              <IonInput className="prescription_input" placeholder='Enter Specialization Here....' {...register("specialisation", { required: true })} />
            </IonItem>
            {errors.specialisation && <h6 className='prescription_error'>Specialization is required</h6>}

            <IonItem lines='none'>
              <IonLabel position="stacked" className="prescription_label">Your Sign</IonLabel>

              <input
                id="doctor_sign"
                type='file'
                accept="image/*"
                {...register("doctor_sign", {
                  required: true,
                  validate: {
                    lessThan2MB: (files) => { return files[0]?.size < 2000000 || 'Max 2MB'; }
                  }
                })}
              />
            </IonItem>
            {/* {errors.doctor_sign && <h6 className='prescription_error'>please upload a sign</h6>} */}
            {errors.doctor_sign?.type.toString() == "required" && <h6 className='prescription_error'>Please upload a sign</h6>}
            {errors.doctor_sign?.type.toString() == "lessThan2MB" && errors.doctor_sign?.type.toString() !== "required" && <h6 className='prescription_error'>Please upload file of less than 2 mb</h6>}
            <h6 className='input_desc'>(*Upload sign 450 x 380 less than 2 mb with white background)</h6>

            <IonItem lines='none'>
              <IonLabel position="stacked" className="prescription_label">Your Logo</IonLabel>
              <input type='file' accept="image/*" {...register("doctor_logo",
                {
                  required: true,
                  validate: {
                    lessThan2MB: (files) => { return files[0]?.size < 2000000 || 'Max 2MB'; }
                  }
                })} />
            </IonItem>
            {errors.doctor_logo?.type.toString() == "required" && <h6 className='prescription_error'>Please upload a logo</h6>}
            {errors.doctor_logo?.type.toString() == "lessThan2MB" && errors.doctor_logo?.type.toString() !== "required" && <h6 className='prescription_error'>Please upload file of less than 2 mb</h6>}
            <h6 className='input_desc'>(*Upload logo 450 x 380 less than 2 mb with white background)</h6>

            <div className='dropdown_container'>
              <p className="prescription_dd_label" >Subscription</p>
              <IonSelect className="prescription_dd_input" placeholder='Select Subscription' {...register("subscription", { required: true })}>
                {
                  subscriptionArr.map((subscription, key) => {
                    return <IonSelectOption value={subscription.subscription_period + "-" + subscription.subscription_period_type + " - " + subscription.subscription_charges} key={key}>
                      {subscription.subscription_period + " " + subscription.subscription_period_type + " - " + subscription.subscription_charges}
                    </IonSelectOption>
                  })
                }
              </IonSelect>
            </div>
            {errors.subscription && <h6 className='prescription_error'>Subscription is required</h6>}

            <IonItem lines='none'>
              <IonText>I accept Workfitt Terms and Condition.
                <a onClick={() => { openTnc() }} >Read full terms and condition.</a>
              </IonText>
              <IonCheckbox
                color="primary"
                className='consultation_check'
                slot='start'
                onIonChange={(e) => {
                  setTnC(!TnC)
                }}
                checked={TnC}
              />
            </IonItem>

            <IonButton type="submit" expand="block" id="register_button">Register</IonButton>
          </form>
        }

      </IonContent>
    </IonPage>
  );
};

export default Register;
