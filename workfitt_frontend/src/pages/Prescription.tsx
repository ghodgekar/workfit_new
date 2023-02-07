import { IonButton, IonButtons, IonCheckbox, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonListHeader, IonModal, IonPage, IonRadio, IonRadioGroup, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { useForm } from "react-hook-form";
import { format, isBefore } from "date-fns";
import { useEffect, useReducer, useState } from 'react';
import "../css/prescription.css"
import { arrowBackCircleSharp, caretDownOutline, closeCircle } from 'ionicons/icons';
import addPrescription from "../api/addPrescription";
import getPrescriptionListByDrId from "../api/getPrescriptionListByDrId";
import HumanBody from '../components/HumanBody';
import React from 'react';
import exerciseByBodyArea from '../api/exerciseByBodyArea';
import doctorAdviceByType from '../api/doctorAdviceByType';
import doctorAdviceByBodyArea from '../api/doctorAdviceByBodyArea';
import adjunctList from '../api/adjunctList';
import scaleList from '../api/scaleList';
import "../css/prescription.css";
import { Preferences } from '@capacitor/preferences';
import { addDays } from 'date-fns/esm';
import Toast from '../components/Toast';
import { Link, RouteComponentProps } from 'react-router-dom';
import Loader from '../components/Loader';
import "../css/customModal.css"
import { useHistory } from 'react-router-dom';
import getPrescriptionById from '../api/getPrescriptionById';

import {
  MediaFile,
  VideoCapturePlusOptions,
  VideoCapturePlus,
} from "@ionic-native/video-capture-plus";

let CTScanObject = { advice_name: "CT SCAN" }
let MRIObject = { advice_name: "MRI" }

const EXERCISE_ACTION = {
  ADDALL: "addAll",
  ADD: "add",
  CHANGE_REPS: "change-reps",
  CHANGE_SETS: "change-sets",
  CHANGE_HOLDS: "change-holds",
  CHANGE_RESTS: "change-rests",
  CHANGE_DAYS: "change-days",
  CHANGE_TIME: "change-time",
  CHANGE_NOTE: "change-note",
  REMOVE: "remove"
}
const ADJUNCT_ACTION = {
  ADD: "add",
  CHANGE_TIME: "change-time",
  REMOVE: "remove"
}


const adjunctReducer = (selectedAdjunctArr: any, action: any) => {
  let result = []
  switch (action.type) {
    case ADJUNCT_ACTION.ADD:
      result = action.payload.value;
      break;

    case ADJUNCT_ACTION.CHANGE_TIME:
      action.payload.setAdjunctListArr(adjunctArr => {
        return adjunctArr.map((adjunct) => {
          if (adjunct.adjunct_name == action.payload.adjunct_name) {
            return { ...adjunct, adjunct_time: action.payload.value }
          }
          return adjunct;
        })
      })

      result = selectedAdjunctArr.map((adjunct) => {
        if (adjunct.adjunct_name == action.payload.adjunct_name) {
          return { ...adjunct, adjunct_time: action.payload.value }
        }
        return adjunct;
      })
      break;

    case ADJUNCT_ACTION.REMOVE:
      result = selectedAdjunctArr.filter((adjunct) => {
        return adjunct.adjunct_name !== action.payload.adjunct_name
      })
      break;

    default:
      result = selectedAdjunctArr
      break;
  }
  return result
}

const reducer = (selectedExerciseArr: any, action: any) => {
  let exeIndex
  switch (action.type) {
    case EXERCISE_ACTION.ADDALL:
      return action.payload.value;

    case EXERCISE_ACTION.ADD:
      console.log("action.payload.value", action.payload.value);

      if (selectedExerciseArr && selectedExerciseArr.length && selectedExerciseArr.some(exercise => exercise.exercise_name == action.payload.exercise_name)) {
        return selectedExerciseArr.filter((exercise) => exercise.exercise_name != action.payload.exercise_name)
      } else {
        return [...selectedExerciseArr, action.payload.value];
      }

    case EXERCISE_ACTION.CHANGE_REPS:
      exeIndex = selectedExerciseArr.findIndex((exercise) => exercise.exercise_name == action.payload.exercise_name)
      selectedExerciseArr[exeIndex].exercise_reps = action.payload.value
      return selectedExerciseArr

    case EXERCISE_ACTION.CHANGE_NOTE:
      exeIndex = selectedExerciseArr.findIndex((exercise) => exercise.exercise_name == action.payload.exercise_name)
      selectedExerciseArr[exeIndex].exercise_note = action.payload.value
      return selectedExerciseArr


    case EXERCISE_ACTION.CHANGE_TIME:
      exeIndex = selectedExerciseArr.findIndex((exercise) => exercise.exercise_name == action.payload.exercise_name)
      selectedExerciseArr[exeIndex].exercise_time = action.payload.value
      return selectedExerciseArr

    case EXERCISE_ACTION.CHANGE_SETS:
      exeIndex = selectedExerciseArr.findIndex((exercise) => exercise.exercise_name == action.payload.exercise_name)
      selectedExerciseArr[exeIndex].exercise_sets = action.payload.value
      return selectedExerciseArr

    case EXERCISE_ACTION.CHANGE_HOLDS:
      exeIndex = selectedExerciseArr.findIndex((exercise) => exercise.exercise_name == action.payload.exercise_name)
      selectedExerciseArr[exeIndex].exercise_holds = action.payload.value
      return selectedExerciseArr



    case EXERCISE_ACTION.CHANGE_RESTS:
      exeIndex = selectedExerciseArr.findIndex((exercise) => exercise.exercise_name == action.payload.exercise_name)
      selectedExerciseArr[exeIndex].exercise_rests = action.payload.value
      return selectedExerciseArr


    case EXERCISE_ACTION.CHANGE_DAYS:
      exeIndex = selectedExerciseArr.findIndex((exercise) => exercise.exercise_name == action.payload.exercise_name)
      selectedExerciseArr[exeIndex].exercise_days = action.payload.value
      return selectedExerciseArr

    case EXERCISE_ACTION.REMOVE:
      return selectedExerciseArr.filter((exercise) => exercise.exercise_name !== action.payload.exercise_name)


    default:
      return selectedExerciseArr

  }


}

export default function Prescription(props) {
  const history = useHistory();
  let todayDate = format(new Date(), "yyyy-MM-dd")
  let oneWeekDate = format(addDays(new Date(), 7), "yyyy-MM-dd")
  const [isLoadingResult, setisLoadingResult] = useState(true)
  const [showToast, setshowToast] = useState(false)
  const [toastMessage, settoastMessage] = useState("")
  const [toastColor, settoastColor] = useState("success")
  const [bodyPart, setbodyPart] = useState([])
  const [exerciseArr, setexerciseArr] = useState([])
  const [exerciseArrCopy, setexerciseArrCopy] = useState([])
  const [exerciseInputVal, setexerciseInputVal] = useState([])
  const [formStep, setformStep] = useState(0)
  const [labWorkArr, setlabWorkArr] = useState([])
  const [imagingArr, setimagingArr] = useState([])
  const [ctScan, setctScan] = useState("")
  const [Mri, setMri] = useState("")
  const [selectedScale, setselectedScale] = useState({ scale_link: "", scale_name: "" })
  const [scalesArr, setscalesArr] = useState([])
  const [ScaleDays, setScaleDays] = useState("")

  const [selectedImaging, setselectedImaging] = useState([])
  const [selectedLabWork, setselectedLabWork] = useState([])
  const [AdjunctListArr, setAdjunctListArr] = useState([])
  // const [selectedAdjunct, setselectedAdjunct] = useState([])
  const [prescriptionReq, setprescriptionReq] = useState({})
  const [instruction_notes, setinstruction_notes] = useState("")
  const [ExpiryDate, setExpiryDate] = useState({ error: { status: false, msg: "Please Enter Valid Date" }, value: oneWeekDate })
  const [prevformStep, setprevformStep] = useState(0)
  const [billTotal, setbillTotal] = useState(0)
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
    "treatment2_charge": "",
    "treatment3_charge": "",
  })

  const [bill, setbill] = useState({
    bill_patient_name: "",
    bill_patient_age: "",
    bill_invoice_to: "",
    bill_patient_gender: "",
    bill_patient_address: "",
    bill_date_of_evaluation: todayDate,
    bill_time: format(new Date(), "hh:mm aaa'"),
    is_consultation_charge: false,
    bill_treatment_type: 0,
    bill_discount: 0,
    bill_c_o: "",
    bill_days: 1,
    bill_modality_charges: 0,
    errors: {
      bill_patient_name: { status: false, msg: "Please Enter Patient Name" },
      bill_patient_age: { status: false, msg: "Please Enter Patient Age" },
      bill_patient_gender: { status: false, msg: "Please Enter Patient Gender" },
      bill_c_o: { status: false, msg: "Please Enter Prescription C/O" }
    }
  })

  const [SearchText, setSearchText] = useState("")
  const [isModalOpen, setisModalOpen] = useState(false)
  const [vas_type, setSelectedVas] = useState<string>('VAS');

  const [prescriptionListByDrIdArr, setprescriptionListByDrIdArr] = useState([])
  const [selectedTemplate, setselectedTemplate] = useState({})

  const [displayAddExercise, setDisplayAddExercise] = useState(false)

  function dismiss() {
    setisModalOpen(false)
  }

  async function FilterOptions(value) {

    setSearchText(value)
    if (value) {
      let optionList = exerciseArr.filter((option) => option.exercise_name.toLowerCase().includes(value.toLowerCase()))
      setexerciseArrCopy(optionList)
    } else {
      setexerciseArrCopy(exerciseArr)
    }

  }




  type LabWork = typeof labWorkArr[number]
  const labWorkcompareWith = (o1: LabWork, o2: LabWork) => {
    return o1 && o2 ? o1.advice_name === o2.advice_name : o1 === o2;
  };

  type Adjunct = typeof AdjunctListArr[number]
  const adjunctcompareWith = (o1: Adjunct, o2: Adjunct) => {
    return o1 && o2 ? o1.adjunct_name === o2.adjunct_name : o1 === o2;
  };

  type Imaging = typeof imagingArr[number]
  const imagingcompareWith = (o1: Imaging, o2: Imaging) => {
    return o1 && o2 ? o1.advice_name === o2.advice_name : o1 === o2;
  };


  const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm({ mode: "all" });
  // const [selectedExerciseArr, setselectedExerciseArr] = useState<Exercise[]>([]);
  const [selectedExerciseArr, dispatch] = useReducer(reducer, [])
  const [selectedAdjunct, dispatchAdjunct] = useReducer(adjunctReducer, [])

  const onSubmit = async (data) => {

    // let value = localStorage.getItem("userInfo")
    let { value } = await Preferences.get({ key: 'userInfo' });
    let val = JSON.parse(value)
    if (val) {
      data.doctor_id = val.doctor_Id
    }
    setbill(bill => {
      return {
        ...bill,
        bill_patient_name: data.patient_name,
        bill_patient_age: data.patient_age,
        bill_patient_gender: data.patient_gender,
        bill_c_o: data.prescription_c_o,
      }
    })
    setprescriptionReq(data)

  }

  useEffect(() => {
    calculateBillTotal();
  }, [bill])


  useEffect(() => {
    async function fetchData() {
      const { value } = await Preferences.get({ key: 'userInfo' });
      let doctorData = JSON.parse(value);
      setisLoadingResult(true)
      let prescriptionListByDrId = await getPrescriptionListByDrId({ doctor_id: doctorData.doctor_Id })
      console.log("prescriptionListByDrId", prescriptionListByDrId);

      if (prescriptionListByDrId.status) {
        setprescriptionListByDrIdArr(prescriptionListByDrId.data)
      }
      setisLoadingResult(false)
    }
    fetchData();
  }, [])

  const setPrescriptionTemplateValues = async (prescriptionObj) => {
  
    setValue("prescription_goals", prescriptionObj.prescription_goals || "")
    setValue("prescription_c_o", prescriptionObj.prescription_c_o || "")
    setValue("doctor_note", prescriptionObj.doctor_note || "")
    if(prescriptionObj.body_part){
    let bodyPartObj = JSON.parse(prescriptionObj.body_part)
    let bodyPartArr = Object.values(bodyPartObj);
    setbodyPart(bodyPartArr)
    }


    let imagingAdviceArr = await doctorAdviceByBodyArea({
      "advice_type": "imaging",
      "body_area_name": "CHEST & FACE"//bodyPartArr[bodyPartArr.length - 1] 
    })

    let adviceObj = JSON.parse(prescriptionObj.doctor_advice)
    let adviceArr = Object.values(adviceObj);
    let labworkArray = []
    let imagingArray = []
    adviceArr.forEach((advice: String) => {
      if (advice.includes("CT SCAN") || advice.includes("MRI")) {
        let splitVal = advice.split("-")
        imagingArray.push(splitVal[0].trim())
      }
      let imagingElement = imagingAdviceArr.data.find((imgElement) => advice == imgElement.advice_name)
      if (imagingElement) imagingArray.push(imagingElement)

      let labWorkElement = labWorkArr.find((labElement) => advice == labElement.advice_name)
      if (labWorkElement) labworkArray.push(labWorkElement)
    })
    setselectedImaging(imagingArray)
    setselectedLabWork(labworkArray)

    let adjunct = JSON.parse(prescriptionObj.adjunct)
    let adjunctArr = Object.values(adjunct);
    dispatchAdjunct({ type: ADJUNCT_ACTION.ADD, payload: { value: adjunctArr } });

    setinstruction_notes(prescriptionObj.instruction_note)

    let exerciseObj = JSON.parse(prescriptionObj.exercise_arr)
    let exerciseArray = Object.values(exerciseObj);
    console.log("exerciseArr", exerciseArray);
    //   let exerciseResp= await exerciseByBodyArea({ "body_area_name": "CHEST & FACE"
    //   //  bodyPart[bodyPart.length - 1] 
    // })
    let exerciseNameArr=[]

    exerciseArray.forEach((exercise: any) => {
      exerciseNameArr.push(exercise.exercise_name)
      delete exercise.audioFilePath
      // delete exercise.audioFilePath
      delete exercise.videoObj
      delete exercise.instructionObj
      delete exercise.end_date
      delete exercise.start_date
    })

    setexerciseInputVal(exerciseNameArr)
    dispatch({
      type: EXERCISE_ACTION.ADDALL,
      payload: { value: exerciseArray}
    });
  }


  const callTemplateApi = async (val) => {
    console.log("val====>>>", val);

    setisLoadingResult(true)
    setselectedTemplate(val)
    let prescription = await getPrescriptionById({ prescription_id: val.prescription_id + "" })
    console.log("prescription===========>>>>", prescription);

    if (prescription.status) {
      setPrescriptionTemplateValues(prescription.data[0])
    }
    setisLoadingResult(false)
  }

  const calculateBillTotal = () => {
    let Total = 0;
    let discount = bill.bill_discount
    let modality_charges = bill.bill_modality_charges
    let treatment_charge = 0
    if (bill.bill_treatment_type == 1) {
      treatment_charge = parseInt(doctorData.treatment1_charge)
    }
    else if (bill.bill_treatment_type == 2) {
      treatment_charge = parseInt(doctorData.treatment2_charge)
    }
    else if (bill.bill_treatment_type == 3) {
      treatment_charge = parseInt(doctorData.treatment3_charge)
    }
    // console.log("bill.bill_days", bill.bill_days);

    let treatment_days = bill.bill_days ? bill.bill_days : 1
    let consultation_charge = 0;
    if (bill.is_consultation_charge) {
      consultation_charge = parseInt(doctorData.consultation_charge)
    }

    let withoutdiscount = consultation_charge + (treatment_charge * treatment_days) + ((modality_charges || 0) * treatment_days)
    let percent = withoutdiscount * (discount || 0) / 100;
    Total = withoutdiscount - percent
    setbillTotal(Total)
  }


  useEffect(() => {
    async function fetchData() {
      if (!props.isAuthed) {
        history.push("/login")
      }
      setisLoadingResult(true)
      const { value } = await Preferences.get({ key: 'userInfo' });
      setdoctorData(JSON.parse(value));

      let adjunctArr = await adjunctList()
      if (adjunctArr.status) setAdjunctListArr(adjunctArr.data)
      let labWorkAdviceArr = await doctorAdviceByType({ "advice_type": "lab work", "orderBy": "app" })
      if (labWorkAdviceArr.status) setlabWorkArr(labWorkAdviceArr.data)
      setexerciseArr([])
      setexerciseArrCopy([])
      let scaleArr = await scaleList()
      if (scaleArr.status) setscalesArr(scaleArr.data)
      setValue("date_of_evaluation", todayDate)

      setisLoadingResult(false)
    }
    fetchData();

  }, [])


  const manageBackButton = async () => {
    if (formStep == 1) {
      setformStep(0)
    } else if (formStep == 2) {
      setformStep(prevformStep == 1 ? 1 : 0)
    }
  }

  const isBeforetoday = (date) => {
    let todayDate = format(new Date(), "yyyy-MM-dd")
    // console.log("isBefore(new Date(date), new Date(todayDate))",isBefore(new Date(date), new Date(todayDate)))
    if (isBefore(new Date(date), new Date(todayDate))) {
      return true
    } else {
      return false
    }
  }


  const part_clicked = async (val) => {
    console.log(val.target.getAttribute('id'));
    if (val.target.getAttribute('id') !== null && !bodyPart.includes(val.target.getAttribute('id'))) {
      setbodyPart((bodyPart) => { return [...bodyPart, val.target.getAttribute('id')] });
    }
  }

  const callPrescriptionApi = async (generateBill: Boolean) => {
    setisLoadingResult(true)
    let doctorAdvice = [], generatePrescription = false;
    if (selectedLabWork.length || selectedImaging.length) {
      selectedLabWork.forEach((ele) => { doctorAdvice.push(ele.advice_name) })
      selectedImaging.forEach(ele => {
        if (ele.advice_name == "CT SCAN") ele.advice_name = ele.advice_name + " - " + ctScan
        if (ele.advice_name == "MRI") ele.advice_name = ele.advice_name + " - " + Mri
        doctorAdvice.push(ele.advice_name)
      })
    }
    if (doctorAdvice.length || selectedAdjunct.length || selectedExerciseArr.length) {
      generatePrescription = true
    }

    //  delete ExpiryDateObj.error
    let prescriptionRequest = {
      ...prescriptionReq,
      doctor_advice: doctorAdvice,
      adjunct: selectedAdjunct,
      instruction_note: instruction_notes,
      bill: { ...bill, billTotal },
      scales_obj: {
        ...selectedScale,
        ScaleDays
      },
      generate_bill: generateBill,
      exercise_arr: selectedExerciseArr,
      expiry_date: ExpiryDate,
      generate_prescription: generatePrescription,
      vas_type: vas_type,
      bodyPart:bodyPart
    }
    // console.log("prescriptionRequest", JSON.stringify(prescriptionRequest));
    // return
    let addPrescriptionResp = await addPrescription(prescriptionRequest)
    setisLoadingResult(false)
    // console.log("addPrescriptionResp",addPrescriptionResp);
    if (addPrescriptionResp.status) {
      settoastColor("success");
      history.push("/")
      // window.history.pushState({urlPath:'/prescription'},"",'/prescription')
    }
    else {
      settoastColor("danger");
    }
    settoastMessage(addPrescriptionResp.msg);
    setshowToast(true);
    setTimeout(() => {
      setshowToast(false)
    }, 2000);

  }

  const removeBodyPart = (part) => {
    let filteredArray = bodyPart.filter((ele) => {
      return ele !== part
    })
    setbodyPart(filteredArray)
  }

  async function processExerciseData(exerciseArray) {
    exerciseArray = exerciseArray.map((exe) => {
      if (selectedExerciseArr.some((element) => element.exercise_name == exe.exercise_name)) {
        return { ...exe, isChecked: true }
      }
      else return exe

    })
    return exerciseArray
  }

  const prescriptionAndBillClick = async () => {
    if (bodyPart && bodyPart.length > 0) {
      setisLoadingResult(true)
      let exerciseArray = await exerciseByBodyArea({ "body_area_name": bodyPart[bodyPart.length - 1] })
      let imagingAdviceArr = await doctorAdviceByBodyArea({ "advice_type": "imaging", "body_area_name": bodyPart[bodyPart.length - 1] })
      if (exerciseArray.status && imagingAdviceArr.status) {
        if (selectedExerciseArr.length) {
          exerciseArray.data = await processExerciseData(exerciseArray.data)
        }
        else if (exerciseInputVal.length) {
          exerciseArray.data = exerciseArray.data.forEach((exe) => {
            if (exerciseInputVal.some((inputVal) => inputVal == exe.exercise_name)) {
              exe = { ...exe, isChecked: true }
            }
          })
        }

        setexerciseArr(exerciseArray.data)
        setexerciseArrCopy(exerciseArray.data)
        setimagingArr(imagingAdviceArr.data)
        setformStep(1);
        setprevformStep(0)
        setisLoadingResult(false)
      } else {
        setisLoadingResult(false)
        setshowToast(true)
        settoastMessage("Please Select Body Area Again To Continue")
        settoastColor("danger")
        setTimeout(() => {
          setshowToast(false)
        }, 2000);
      }
    }
    else {
      setshowToast(true)
      settoastMessage("Please Select A Body Area To Continue")
      settoastColor("danger")
      setTimeout(() => {
        setshowToast(false)
      }, 2000);
    }
  }

  function removeExercise(exe) {

    setexerciseInputVal(input => input.filter(val => val !== exe.exercise_name))
    setexerciseArr(exerciseArr => {
      let exeIndex = exerciseArr.findIndex((exercise) => exercise.exercise_name == exe.exercise_name)
      exerciseArr[exeIndex].isChecked = false
      return exerciseArr
    })

    setexerciseArrCopy(exerciseArrCopy => {
      let exeIndex = exerciseArrCopy.findIndex((exercise) => exercise.exercise_name == exe.exercise_name)
      exerciseArrCopy[exeIndex].isChecked = false
      return exerciseArrCopy
    })

    dispatch({
      type: EXERCISE_ACTION.REMOVE,
      payload: { exercise_name: exe.exercise_name }
    });

  }

  function handleExerciseCheckbox(e) {
    if (e.target?.value?.isChecked) {
      setexerciseInputVal(input => input.filter(val => val !== e.exercise_name))
    } else {
      setexerciseInputVal(input => [...input, e.exercise_name])
    }
    setexerciseArr(exerciseArr => {
      return exerciseArr.map((exercise) => {
        if (exercise.exercise_name == e.exercise_name) {
          return { ...exercise, isChecked: exercise.isChecked ? false : true }
        }
        return exercise;
      })
    })

    setexerciseArrCopy(exerciseArrCopy => {
      return exerciseArrCopy.map((exercise) => {
        if (exercise.exercise_name == e.exercise_name) {
          return { ...exercise, isChecked: exercise.isChecked ? false : true }
        }
        return exercise;
      })
    })

    dispatch({
      type: EXERCISE_ACTION.ADD,
      payload: {
        value: e,
        exercise_name: e.exercise_name
      }
    });

  }

  useEffect(() => {
    console.log("errors", errors)
  }, [errors])

  const doMediaCapture = async () => {
    setDisplayAddExercise(true);
    let options: VideoCapturePlusOptions = { limit: 1, duration: 30 };
    let capture:any = await VideoCapturePlus.captureVideo(options);
    console.log((capture[0] as MediaFile).fullPath)
  };

  return (
    <IonPage>
      <IonContent fullscreen >
        <Toast
          showToast={showToast}
          closeToast={(e) => { setshowToast(e) }}
          message={toastMessage}
          color={toastColor}
        />
        <IonModal id="example-modal" isOpen={isModalOpen}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Select Exercises</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => dismiss()}>
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
            <IonSearchbar value={SearchText} placeholder={"Search Exercise"} onIonChange={(e) => { FilterOptions(e.detail.value) }} showCancelButton="never" className='modalSearchBar' />
          </IonHeader>
          <IonContent>
            {exerciseArrCopy && exerciseArrCopy.length ?
              <IonList>
                {exerciseArrCopy.map((opt, id) => {
                  return (
                    <IonItem key={id}>
                      <h6>{opt.exercise_name}</h6>
                      <IonCheckbox
                        slot="start"
                        value={opt}
                        onClick={(e:any) => { handleExerciseCheckbox(e.target.value) }}
                        checked={opt.isChecked}
                      />
                    </IonItem>
                  )
                })}
              </IonList>
              :
              <IonItem lines='none' className="ion-text-center" style={{ "color": "red" }}>
                <IonLabel>No Exercises Found</IonLabel>
              </IonItem>
            }

          </IonContent>
        </IonModal>
        
        {isLoadingResult ?
          <Loader /> :

          <form onSubmit={handleSubmit(onSubmit)}>
            {formStep >= 0 &&
              <section className={formStep == 0 ? "showSection" : "hideSection"}>
                <IonHeader>
                  <div className="logoImgContainer">
                    <IonIcon icon={arrowBackCircleSharp} onClick={() => { history.push("/") }} className="backBtn" />
                    <span></span>
                    <h1 className='headerTitle'>Add Prescription</h1>
                  </div>
                </IonHeader>
                <IonItem lines='none' >
                  <IonLabel className="prescription_label" position="stacked">Saved Templates</IonLabel>
                  <IonSelect value={selectedTemplate} className="prescription_dd_input" placeholder='Select Saved Template' cancelText="cancel" okText="submit" onIonChange={e => { callTemplateApi(e.detail.value) }}>
                    {prescriptionListByDrIdArr.map((template, key) => (
                      <IonSelectOption key={key} value={template}>
                        {template.prescription_c_o}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>

                {/* <Link to="/add-video" className='editLink'>
                  <IonItem lines="none" className="menuItem" >Add Video</IonItem>
                </Link> */}
                <IonItem lines='none' >
                  <IonLabel className="prescription_label" position="stacked">*Name</IonLabel>
                  <IonInput className="prescription_input" placeholder='Enter Name Here...' {...register("patient_name", { required: true })} />
                </IonItem>
                {errors.patient_name && <h6 className='prescription_error'>Patient Name is required</h6>}

                <IonItem lines='none' >
                  <IonLabel position="stacked" className="prescription_label">Phone No.</IonLabel>
                  <IonInput className="prescription_input" placeholder='Enter Phone No. Here...' {...register("patient_mobile",)} />
                </IonItem>

                <IonItem lines='none'>
                  <IonLabel className="prescription_label" position="stacked">*Email Id</IonLabel>
                  <IonInput className="prescription_input" placeholder='Enter Email Here...' {...register("patient_email", { required: true, pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/ })} />
                </IonItem>
                {errors?.patient_email?.type.toString() == "required" && <h6 className='prescription_error'>Patient Email is required</h6>}
                {errors?.patient_email?.type.toString() == "pattern" && errors?.patient_email?.type.toString() !== "required" && <h6 className='prescription_error'>Please Enter Valid Email</h6>}

                <IonItem lines='none'>
                  <IonLabel className="prescription_label" position="stacked">Secondary Email Id</IonLabel>
                  <IonInput className="prescription_input" placeholder='Enter Secondary Email Here...' {...register("patient_secondary_email", { pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/ })} />
                </IonItem>
                {/* {errors?.patient_secondary_email?.type.toString() == "required" && <h6 className='prescription_error'>Patient Email is required</h6>} */}
                {errors?.patient_secondary_email?.type.toString() == "pattern" &&
                //  errors?.patient_secondary_email?.type.toString() !== "required" && 
                <h6 className='prescription_error'>Please Enter Valid Email</h6>}


                <IonItem lines='none' >
                  <IonLabel className="prescription_label" position="stacked">*Age</IonLabel>
                  <IonInput className="prescription_input" placeholder='Enter Age Here...' type="number" {...register("patient_age", { required: true, min: 0 })} />
                </IonItem>
                {errors.patient_age?.type.toString() == "required" && <h6 className='prescription_error'>Patient Age is required</h6>}
                {errors.patient_age?.type.toString() == "pattern" && errors.patient_age?.type.toString() !== "required" && <h6 className='prescription_error'>Please Enter Valid Age</h6>}

                {/* <IonItem lines='none' > */}
                {/* <IonLabel className="prescription_label" position="stacked" >Gender</IonLabel> */}
                <div className='dropdown_container'>
                  <p className="prescription_dd_label" >Gender</p>
                  <IonSelect placeholder='Select Gender' className="prescription_dd_input" {...register("patient_gender", { required: true })}>

                    <IonSelectOption value="M">Male</IonSelectOption>
                    <IonSelectOption value="F">Female</IonSelectOption>
                    <IonSelectOption value="O">Others</IonSelectOption>
                  </IonSelect>
                </div>
                {/* </IonItem> */}
                {/* {errors.patient_gender && <IonText color="danger">Patient gender is required</IonText>} */}

                <IonItem lines='none' >
                  <IonLabel position="stacked" className="prescription_label">Date Of Evaluation</IonLabel>
                  <IonInput className="prescription_input" type="date"  {...register("date_of_evaluation", { required: true })} />
                </IonItem>
                {errors?.date_of_evaluation?.type.toString() == "validate" && <h6 className='prescription_error'>Please Enter a Valid Date</h6>}
                {/* <IonInput className="prescription_input">
                <IonText>{"Date Of Evaluation : " + todayDate}</IonText>
              </IonInput> */}

                <IonItem lines='none' >
                  <IonLabel position="stacked" className="prescription_label">Treatment Goals</IonLabel>
                  <IonTextarea autoGrow={true} className="prescription_input" placeholder='Enter Treatment Goals Here...' {...register("prescription_goals")} />
                </IonItem>

                <IonItem lines='none' >
                  <IonLabel position="stacked" className="prescription_label">*C/O</IonLabel>
                  <IonInput className="prescription_input" placeholder='Enter C/O Here...' {...register("prescription_c_o", { required: true })} />
                </IonItem>
                {errors.prescription_c_o?.type.toString() == "required" && <h6 className='prescription_error'>Prescription C/O is required</h6>}

                <IonItem lines='none' >
                  <IonLabel className="prescription_label" position="stacked">Assessment Notes</IonLabel>
                  <IonTextarea autoGrow={true} className="prescription_input" placeholder='Enter Note Here...' {...register("doctor_note")} />
                </IonItem>
                <h6 style={{
                  "textAlign": "left",
                  "paddingLeft": "18px",
                  "fontSize": "18px"
                }}>*Select affected area</h6>
                <HumanBody
                  part_clicked={part_clicked}
                />
                <div>
                  {bodyPart.map((ele, id) => {
                    return (
                      <IonChip key={id}>{ele}
                        <IonIcon icon={closeCircle} onClick={() => { removeBodyPart(ele) }} />
                      </IonChip>
                    )
                  })}
                </div>

                <IonButton
                  onClick={() => {
                    prescriptionAndBillClick()
                  }}
                  type="submit"
                  className="nextStep"
                  disabled={!isValid}
                >
                  Prescription And Bill
                </IonButton>

                <IonButton
                  onClick={() => { setformStep(2); setprevformStep(0); }}
                  type="submit"
                  className="nextStep"
                  disabled={!isValid}
                >
                  Skip To Bill
                </IonButton>
              </section>
            }



            {formStep >= 1 &&
              <section className={formStep == 1 ? "showSection" : "hideSection"}>
                <IonHeader>
                  <div className="logoImgContainer">
                    <IonIcon icon={arrowBackCircleSharp} onClick={() => { setformStep(0) }} className="backBtn" />
                    <span></span>
                  </div>
                </IonHeader>
                
                <IonItemGroup className='prescription_section'>
                  {/* <h6 className="doctorAdvice">Doctor's Advice</h6> */}
                  {/* Labwork Doctor Advice  */}
                  <div className='dropdown_container'>
                    <p className="prescription_dd_label" >Doctor's Advice</p>
                    <IonSelect value={selectedLabWork} className="prescription_dd_input" placeholder='Lab Work' multiple={true} compareWith={labWorkcompareWith} cancelText="cancel" okText="submit" onIonChange={e => { setselectedLabWork(e.detail.value) }}>
                      {labWorkArr.map((advice, key) => (
                        <IonSelectOption key={key} value={advice}>
                          {advice.advice_name}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </div>
                  {/* Labwork Doctor Advice  */}

                  {/* Imaging Doctor Advice  */}
                  <div className='dropdown_container'>
                    <IonSelect className="prescription_dd_input"
                      value={selectedImaging}
                      multiple={true}
                      compareWith={imagingcompareWith}
                      placeholder='Imaging'
                      cancelText="cancel"
                      okText="submit"
                      onIonChange={e => { setselectedImaging(e.detail.value) }}
                    >

                      <IonSelectOption value={CTScanObject}>
                        {CTScanObject.advice_name}
                      </IonSelectOption>
                      <IonSelectOption value={MRIObject}>
                        {MRIObject.advice_name}
                      </IonSelectOption>
                      {imagingArr.map((advice, key) => (
                        <IonSelectOption key={key} value={advice}>
                          {advice.advice_name}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </div>
                  {/* Imaging Doctor Advice  */}


                  {selectedImaging.findIndex((ele) => { return ele.advice_name == "CT SCAN" }) != -1 &&
                    <IonItem no-lines lines='none'>
                      <IonText>CT Scan - </IonText>
                      <IonInput
                        className='prescription_input_2'
                        placeholder="Body Area Targeted"
                        value={ctScan}
                        onIonChange={(e) => { setctScan(e.detail.value) }}
                      />
                    </IonItem>
                  }


                  {selectedImaging.findIndex((ele) => { return ele.advice_name == "MRI" }) != -1 &&
                    <IonItem lines='none'>
                      <IonText>MRI - </IonText>
                      <IonInput
                        className='prescription_input_2'
                        placeholder="Body Area Targeted"
                        value={Mri}
                        onIonChange={(e) => { setMri(e.detail.value) }} />
                    </IonItem>
                  }
                </IonItemGroup>


                {/* Adjunct Section */}
                <div className='prescription_section'>
                  <div className='dropdown_container'>
                    <p className="prescription_dd_label" >Adjunct</p>
                    <IonSelect className="prescription_dd_input" multiple={true} compareWith={adjunctcompareWith}
                      value={selectedAdjunct}
                      placeholder='Select Adjunct'
                      cancelText="cancel"
                      okText="submit"
                      onIonChange={e => {
                        dispatchAdjunct({ type: ADJUNCT_ACTION.ADD, payload: { value: e.detail.value } });
                      }}>
                      {AdjunctListArr.map((adjunct, key) => (
                        <IonSelectOption key={key} value={adjunct} style={{
                          whiteSpace: "pre-line !important",
                          textOverflow: "clip !important",
                          overflow: "visible !important"
                        }}>
                          {adjunct.adjunct_name}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </div>

                  {selectedAdjunct && selectedAdjunct.map((adjunct, key) => {

                    return (
                      <>
                        <IonItem lines='none'>
                          <IonText>
                            {`${key + 1} . ${adjunct.adjunct_name}`}{" -  "}
                          </IonText>

                          {/* <IonLabel position="floating" >{adjunct.adjunct_name !== "bracing" ? "Time" : "Body Area"}</IonLabel> */}
                          <IonInput
                            className='prescription_input_2'
                            placeholder={adjunct.adjunct_name !== "Bracing" ? "Time" : "Brace Name"}
                            // value={adjunct.adjunct_time && adjunct.adjunct_name !== "Bracing" ? adjunct.adjunct_time : ""}
                            value={adjunct.adjunct_time ?
                              adjunct.adjunct_name == "Bracing" && adjunct.adjunct_time !== '0 ' ?
                                adjunct.adjunct_time :
                                (parseInt(adjunct.adjunct_time)) ?
                                  adjunct.adjunct_time : ""
                              : ""}
                            onIonChange={(e) => {
                              dispatchAdjunct({
                                type: ADJUNCT_ACTION.CHANGE_TIME,
                                payload: { value: e.detail.value, adjunct_name: adjunct.adjunct_name, AdjunctListArr, setAdjunctListArr }
                              })
                            }}
                          ></IonInput>
                        </IonItem>
                      </>
                    )

                  })
                  }
                </div>
                {/* Adjunct Section */}

                {/* Instruction Notes */}
                <div className=''>
                  <IonItem lines='none' >
                    <IonLabel className="prescription_label" position="stacked">Instruction Notes</IonLabel>
                    <IonTextarea autoGrow={true} className="prescription_input" placeholder='Enter Instruction Note Here...' value={instruction_notes} onIonChange={(e) => { setinstruction_notes(e.detail.value) }} />
                  </IonItem>
                </div>
                {/* Instruction Notes */}

                {/* Exercise Section  */}
                  <IonGrid>
                    <IonRow>
                      <IonCol size='6'><IonLabel className="prescription_label" position="stacked" style={{ "float": "left" }}>Exercise </IonLabel></IonCol>
                      <IonCol size='6'><IonLabel className='prescription_label' position="stacked" onClick={() => doMediaCapture()}  style={{ "float": "right" }}>Add Video</IonLabel></IonCol>
                    </IonRow>
                  </IonGrid>
                <IonItemGroup className='prescription_section'>
                  <IonItem lines='none' >
                    <IonInput value={exerciseInputVal.join(", ")} placeholder='Please Select Exercise' readonly className="prescription_input exe_dd_input" onClick={() => { setisModalOpen(true) }} >
                      <IonIcon className="exe_dd_icon" icon={caretDownOutline} slot="end" /></IonInput>
                  </IonItem>

                  {/* { displayAddExercise ? 
                    return (
                      <div className="exercise">
                        <IonText>
                          <b className="exerciseName">excersice name</b>
                        </IonText>
                        {<div className="removeExercise" onClick={() => removeExercise(exercise)}>X</div> }
                        <div className="exercise_desc">
                          <div className="flexRow">
                            <div className="flexItem">
                              <IonLabel className='prescription_label' position="stacked" >Reps</IonLabel>
                              <IonInput
                                className='exercise_input_2'
                                type="number" />
                            </div>

                            {!exercise.isTimeControlled ?
                              <>
                                <div className="flexItem">
                                  <IonLabel className='prescription_label' position="stacked" >Sets</IonLabel>
                                  <IonInput className='exercise_input_2' type="number" value={exercise.exercise_sets}
                                    onIonChange={(e) => {
                                      dispatch({
                                        type: EXERCISE_ACTION.CHANGE_SETS,
                                        payload: {
                                          value: e.detail.value,
                                          exercise_name: exercise.exercise_name,
                                        }
                                      })
                                    }} />
                                </div>

                                <div className="flexItem">
                                  <IonLabel className='prescription_label' position="stacked" >Holds</IonLabel>
                                  <IonInput className='exercise_input_2' type="number" value={exercise.exercise_holds}
                                    onIonChange={(e) => {
                                      dispatch({
                                        type: EXERCISE_ACTION.CHANGE_HOLDS,
                                        payload: {
                                          value: e.detail.value,
                                          exercise_name: exercise.exercise_name,
                                        }
                                      })
                                    }}
                                  />
                                </div>
                              </> :
                              <div className="flexItem">
                                <IonLabel className='prescription_label' position="stacked" >Time</IonLabel>
                                <IonInput className='exercise_input_2' type="number" value={exercise.exercise_time}
                                  onIonChange={(e) => {
                                    dispatch({
                                      type: EXERCISE_ACTION.CHANGE_TIME,
                                      payload: {
                                        value: e.detail.value,
                                        exercise_name: exercise.exercise_name,
                                      }
                                    })
                                  }} />
                              </div>
                            }

                            <div className="flexItem">
                              <IonLabel className='prescription_label' position="stacked" >Rest</IonLabel>
                              <IonInput className='exercise_input_2' type="number" value={exercise.exercise_rests}
                                onIonChange={(e) => {
                                  dispatch({
                                    type: EXERCISE_ACTION.CHANGE_RESTS,
                                    payload: {
                                      value: e.detail.value,
                                      exercise_name: exercise.exercise_name,
                                    }
                                  })
                                }} />
                            </div>

                            <div className="flexItem">
                              <IonLabel className='prescription_label' position="stacked" >Days</IonLabel>
                              <IonInput className='exercise_input_2' type="number" value={exercise.exercise_days}
                                onIonChange={(e) => {
                                  dispatch({
                                    type: EXERCISE_ACTION.CHANGE_DAYS,
                                    payload: {
                                      value: e.detail.value,
                                      exercise_name: exercise.exercise_name,
                                    }
                                  })
                                }} />
                            </div>

                          </div>
                          <div >
                            <IonLabel className='prescription_label' style={{ "float": "left" }} position="stacked" >Special Note</IonLabel>
                            <IonInput placeholder="Enter Special Note Here..." className='exercise_input_2' style={{ "textAlign": "left" }} type="text" value={exercise.exercise_note}
                              onIonChange={(e) => {
                                dispatch({
                                  type: EXERCISE_ACTION.CHANGE_NOTE,
                                  payload: {
                                    value: e.detail.value,
                                    exercise_name: exercise.exercise_name,
                                  }
                                })
                              }} />
                          </div>

                          {exercise.isMultiDirectional ? <IonText color='danger'>*This Exercise is Multi-Directional Please Enter Reps Accordingly</IonText> : null}
                        </div>
                      </div>
                    )
                    :null
                  } */}

                  {selectedExerciseArr.length ?
                    selectedExerciseArr.map((exercise, key) => {
                      // console.log("exercise", exercise);
                      return (
                        <div className="exercise">
                          <IonText>
                            <b className="exerciseName">{`${key + 1}) ${exercise.exercise_name}`}</b>
                          </IonText>
                          <div className="removeExercise" onClick={() => removeExercise(exercise)}>X</div>
                          <div className="exercise_desc">
                            <div className="flexRow">
                              <div className="flexItem">
                                <IonLabel className='prescription_label' position="stacked" >Reps</IonLabel>
                                <IonInput
                                  className='exercise_input_2'
                                  type="number"
                                  value={exercise.exercise_reps}
                                  onIonChange={(e) => {
                                    dispatch({
                                      type: EXERCISE_ACTION.CHANGE_REPS,
                                      payload: {
                                        value: e.detail.value,
                                        exercise_name: exercise.exercise_name,
                                      }
                                    })
                                  }} />
                              </div>

                              {!exercise.isTimeControlled ?
                                <>
                                  <div className="flexItem">
                                    <IonLabel className='prescription_label' position="stacked" >Sets</IonLabel>
                                    <IonInput className='exercise_input_2' type="number" value={exercise.exercise_sets}
                                      onIonChange={(e) => {
                                        dispatch({
                                          type: EXERCISE_ACTION.CHANGE_SETS,
                                          payload: {
                                            value: e.detail.value,
                                            exercise_name: exercise.exercise_name,
                                          }
                                        })
                                      }} />
                                  </div>

                                  <div className="flexItem">
                                    <IonLabel className='prescription_label' position="stacked" >Holds</IonLabel>
                                    <IonInput className='exercise_input_2' type="number" value={exercise.exercise_holds}
                                      onIonChange={(e) => {
                                        dispatch({
                                          type: EXERCISE_ACTION.CHANGE_HOLDS,
                                          payload: {
                                            value: e.detail.value,
                                            exercise_name: exercise.exercise_name,
                                          }
                                        })
                                      }}
                                    />
                                  </div>
                                </> :
                                <div className="flexItem">
                                  <IonLabel className='prescription_label' position="stacked" >Time</IonLabel>
                                  <IonInput className='exercise_input_2' type="number" value={exercise.exercise_time}
                                    onIonChange={(e) => {
                                      dispatch({
                                        type: EXERCISE_ACTION.CHANGE_TIME,
                                        payload: {
                                          value: e.detail.value,
                                          exercise_name: exercise.exercise_name,
                                        }
                                      })
                                    }} />
                                </div>
                              }

                              <div className="flexItem">
                                <IonLabel className='prescription_label' position="stacked" >Rest</IonLabel>
                                <IonInput className='exercise_input_2' type="number" value={exercise.exercise_rests}
                                  onIonChange={(e) => {
                                    dispatch({
                                      type: EXERCISE_ACTION.CHANGE_RESTS,
                                      payload: {
                                        value: e.detail.value,
                                        exercise_name: exercise.exercise_name,
                                      }
                                    })
                                  }} />
                              </div>

                              <div className="flexItem">
                                <IonLabel className='prescription_label' position="stacked" >Days</IonLabel>
                                <IonInput className='exercise_input_2' type="number" value={exercise.exercise_days}
                                  onIonChange={(e) => {
                                    dispatch({
                                      type: EXERCISE_ACTION.CHANGE_DAYS,
                                      payload: {
                                        value: e.detail.value,
                                        exercise_name: exercise.exercise_name,
                                      }
                                    })
                                  }} />
                              </div>

                            </div>
                            <div >
                              <IonLabel className='prescription_label' style={{ "float": "left" }} position="stacked" >Special Note</IonLabel>
                              <IonInput placeholder="Enter Special Note Here..." className='exercise_input_2' style={{ "textAlign": "left" }} type="text" value={exercise.exercise_note}
                                onIonChange={(e) => {
                                  dispatch({
                                    type: EXERCISE_ACTION.CHANGE_NOTE,
                                    payload: {
                                      value: e.detail.value,
                                      exercise_name: exercise.exercise_name,
                                    }
                                  })
                                }} />
                            </div>

                            {exercise.isMultiDirectional ? <IonText color='danger'>*This Exercise is Multi-Directional Please Enter Reps Accordingly</IonText> : null}
                          </div>
                        </div>
                      )
                    }) :
                    null
                  }


                </IonItemGroup>
                {/* Exercise Section  */}

                {/* Scales Section */}


                <IonRadioGroup value={vas_type} onIonChange={e => setSelectedVas(e.detail.value)}>
                    {/* <p className="prescription_dd_label" >Select Vas Type</p> */}
                    <IonItem>
                      <IonLabel>VAS scale</IonLabel>
                      <IonRadio slot="start" value="VAS" />
                    </IonItem>

                    <IonItem>
                      <IonLabel>RPE scale</IonLabel>
                      <IonRadio slot="start" value="RPE" />
                    </IonItem>
                </IonRadioGroup>

                <IonItemGroup className='prescription_section'>
                  <div className='dropdown_container'>
                    <p className="prescription_dd_label" >OrthoToolkit Scale</p>
                    <IonSelect
                      placeholder="Select OrthoToolkit Scale"
                      className='prescription_dd_input'
                      value={selectedScale}
                      cancelText="cancel"
                      okText="submit"
                      onIonChange={e => { setselectedScale(e.detail.value) }}
                    >
                      {scalesArr.map((scale, key) => (
                        <IonSelectOption key={key} value={scale}>
                          {scale.scale_name}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </div>

                  <IonItem lines='none'>
                    <IonLabel >Fill Scale after days </IonLabel>
                    <IonInput className='prescription_input_2' placeholder='Enter Days' value={ScaleDays} onIonChange={e => { setScaleDays(e.detail.value) }}></IonInput>
                  </IonItem>
                </IonItemGroup>
                {/* Scales Section */}

                {/* Link Expiry Section */}
                <div className=''>
                  <IonItem lines='none'>
                    <IonLabel position="stacked" className="prescription_label">Link Expires On</IonLabel>
                    <IonInput className='prescription_input' type="date" value={ExpiryDate.value} onIonChange={(e) => {
                      // if (!isBeforetoday(e.detail.value)) {
                      // console.log("i am heree expiry date",e.detail.value)
                      setExpiryDate({
                        error: { status: false, msg: "Please Enter Valid Date" },
                        value: e.detail.value
                      })
                      // }
                      // console.log("changed", e.detail.value)
                    }} />
                  </IonItem>
                  {ExpiryDate.error.status && <h6 className='prescription_error'>{ExpiryDate.error.msg}</h6>}
                </div>
                {/* Link Expiry Section */}

                <IonButton
                  disabled={selectedExerciseArr.length < 0}
                  // id="add_button"
                  className="nextStep"
                  onClick={() => { setprevformStep(1); setformStep(2); }}>
                  Proceed To Billing
                </IonButton>
              </section>}

            {formStep >= 2 &&
              <section className={formStep == 2 ? "showSection" : "hideSection"}>

                <IonIcon icon={arrowBackCircleSharp} onClick={() => { manageBackButton() }} className="backBtn" />
                <div style={{ "paddingTop": "30px" }}></div>
                <IonItem lines='none' >
                  <IonLabel className="prescription_label" position="stacked">Name</IonLabel>
                  <IonInput className="prescription_input" value={bill.bill_patient_name}
                    onIonChange={(e) => {
                      setbill((bill) => {
                        return { ...bill, bill_patient_name: e.detail.value }
                      })
                    }}
                  />
                </IonItem>
                {bill.errors.bill_patient_name.status && <h6 className='prescription_error'>Patient Name is required</h6>}

                <IonItem lines='none' >
                  <IonLabel className="prescription_label" position="stacked">Invoice To</IonLabel>
                  <IonInput className="prescription_input" value={bill.bill_invoice_to}
                    onIonChange={(e) => {
                      setbill((bill) => {
                        return { ...bill, bill_invoice_to: e.detail.value }
                      })
                    }}
                  />
                </IonItem>

                <IonItem lines='none' >
                  <IonLabel className="prescription_label" position="stacked">C/O</IonLabel>
                  <IonInput
                    className="prescription_input"
                    value={bill.bill_c_o}
                    onIonChange={(e) => {
                      setbill((bill) => {
                        return { ...bill, bill_c_o: e.detail.value }
                      })
                    }}
                  />

                </IonItem>
                {bill.errors.bill_c_o.status && <h6 className='prescription_error'>Prescription C/O is required</h6>}

                <IonItem lines='none'>
                  <IonLabel className="prescription_label" position="stacked">Age</IonLabel>
                  <IonInput
                    className="prescription_input"
                    value={bill.bill_patient_age}
                    onIonChange={(e) => {
                      setbill((bill) => {
                        return { ...bill, bill_patient_age: e.detail.value }
                      })
                    }}
                  />
                </IonItem>
                {bill.errors.bill_patient_age.status && <h6 className='prescription_error'>Patient Age is required</h6>}

                <div className='dropdown_container'>
                  <p className="prescription_dd_label" >Gender</p>
                  <IonSelect
                    className="prescription_dd_input"
                    value={bill.bill_patient_gender}
                    onIonChange={(e) => {
                      setbill((bill) => {
                        return { ...bill, bill_patient_gender: e.detail.value }
                      })
                    }}
                  >
                    <IonSelectOption value="M">Male</IonSelectOption>
                    <IonSelectOption value="F">Female</IonSelectOption>
                    <IonSelectOption value="O">Others</IonSelectOption>
                  </IonSelect>
                </div>
                {bill.errors.bill_patient_gender.status && <h6 className='prescription_error'>Patient Gender is required</h6>}

                <IonItem lines='none' >
                  <IonLabel className="prescription_label" position="stacked">Address</IonLabel>
                  <IonInput
                    className="prescription_input"
                    value={bill.bill_patient_address}
                    onIonChange={(e) => {
                      setbill((bill) => {
                        return { ...bill, bill_patient_address: e.detail.value }
                      })
                    }}
                  />
                </IonItem>

                <IonItem lines='none' >
                  <IonLabel className="prescription_label doe" position="stacked" >Date Of Evaluation</IonLabel>
                  <IonInput
                    className="prescription_input"
                    type="date"
                    value={bill.bill_date_of_evaluation}
                    onIonChange={(e) => {
                      setbill((bill) => {
                        return { ...bill, bill_date_of_evaluation: e.detail.value }
                      })
                    }}
                  />
                </IonItem>

                <IonItem lines='none'>
                  <IonLabel className="prescription_label" position="stacked">Bill Timing</IonLabel>
                  <IonInput
                    className="prescription_input"
                    value={bill.bill_time}
                    onIonChange={(e) => {
                      setbill((bill) => {
                        return { ...bill, bill_time: e.detail.value }
                      })
                    }}
                  />
                </IonItem>


                <div className='consultation_container'>
                  <h5 className="charges_head">Charges</h5>
                  <IonText className="consultation_label">Consultation Charges</IonText>
                  <IonCheckbox color="primary"
                    className='consultation_check'
                    onIonChange={(e) => {
                      setbill((bill) => {
                        return { ...bill, is_consultation_charge: e.detail.checked ? true : false }
                      })
                    }}
                    checked={bill.is_consultation_charge} />
                </div>

                <IonRadioGroup
                  style={{ "padding": "0px" }}
                  onIonChange={(e) => {
                    setbill((bill) => {
                      return { ...bill, bill_treatment_type: e.detail.value }
                    })
                  }}
                >
                  <IonListHeader className="radio_group_header">
                    <IonLabel className="treatment_head">Treatment Charge</IonLabel>
                  </IonListHeader>

                  <IonItem lines='none'>
                    <IonLabel className='radioLabel'>Treatment 1</IonLabel>
                    <IonRadio value="1" slot="start" className='radioBtn' />
                  </IonItem>

                  <IonItem lines='none'>
                    <IonLabel className='radioLabel' >Treatment 2</IonLabel>
                    <IonRadio value="2" slot="start" className='radioBtn' />
                  </IonItem>

                  <IonItem lines='none'>
                    <IonLabel className='radioLabel'>Treatment 3</IonLabel>
                    <IonRadio value="3" slot="start" className='radioBtn' />
                  </IonItem>

                </IonRadioGroup>


                <IonItem lines='none' >
                  <IonLabel className="prescription_label" position="stacked">Special Modality Charges</IonLabel>
                  <IonInput
                    className="prescription_input"
                    value={bill.bill_modality_charges}
                    type="number"
                    onIonChange={(e) => {
                      setbill(bill => {
                        return { ...bill, bill_modality_charges: parseInt(e.detail.value) }
                      })
                    }}
                  />
                </IonItem>

                <IonItem lines='none'>
                  <IonLabel className="prescription_label" position="stacked">Discount (%)</IonLabel>
                  <IonInput
                    className="prescription_input"
                    value={bill.bill_discount}
                    type="number"
                    onIonChange={(e) => {
                      setbill(bill => {
                        return { ...bill, bill_discount: parseInt(e.detail.value) }
                      })
                    }}
                  />
                </IonItem>

                <IonItem lines='none'>
                  <IonLabel className="prescription_label" position="stacked">No. Of Treatment Days </IonLabel>
                  <IonInput
                    className="prescription_input"
                    value={bill.bill_days}
                    type="number"
                    onIonChange={(e) => {
                      setbill(bill => {
                        return { ...bill, bill_days: parseInt(e.detail.value) }
                      })
                    }}
                  />
                </IonItem>
                <IonItem lines='none'>
                  <h5>Bill Total - {billTotal} Rs</h5>
                </IonItem>

                <IonButton
                  onClick={() => {
                    let flag = true
                    if (!bill.bill_patient_name || !bill.bill_patient_age || !bill.bill_patient_gender) {
                      flag = false
                    }
                    setbill((bill) => {
                      return {
                        ...bill, errors: {
                          bill_patient_name: { status: bill.bill_patient_name ? false : true, msg: "Please Enter Patient Name" },
                          bill_patient_age: { status: bill.bill_patient_age ? false : true, msg: "Please Enter Patient Age" },
                          bill_patient_gender: { status: bill.bill_patient_gender ? false : true, msg: "Please Enter Patient Gender" },
                          bill_c_o: { status: bill.bill_c_o ? false : true, msg: "Please Enter Prescription C/O" },
                        }
                      }
                    })
                    if (flag) {

                      callPrescriptionApi(true)
                    }
                  }}
                  className="nextStep"
                >
                  Generate Bill
                </IonButton>
                <IonButton
                  onClick={() => { callPrescriptionApi(false) }}
                  className="nextStep"
                >
                  Do Not Generate Bill
                </IonButton>

              </section>
            }
          </form>
        }

      </IonContent>
    </IonPage>
  );
};

