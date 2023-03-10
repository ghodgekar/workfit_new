import config from "../../config/config.json";
import React, { useEffect, useState } from 'react'
import getPrescriptionById from '../../api/Prescription_Api/getPrescriptionById'
// import getGeneralInstruction from '../../api/Prescription_Api/getGeneralInstruction'

import DescriptionModal from "../../component/Modal/InstructionModal/DescriptionModal";
import "./prescription.css"
import updateExerciseTrack from "../../api/Exercise_Api/updateExerciseTrack";
import { differenceInDays, format } from "date-fns";
import YouTube from 'react-youtube';
import doctorById from "../../api/Doctor_Api/getDoctorById";
import getGeneralInstruction from "../../api/Instruction_Api/getGeneralInstruction";
import GeneralInstModal from "../../component/Modal/InstructionModal/GeneralInstModal";
import updateVasScaleTrack from "../../api/Prescription_Api/updateVasScaleTrack";

export default function Prescription() {
    const [isLoading, setisLoading] = useState(true)
    const [prescriptionData, setprescriptionData] = useState([])
    const [adjunctData, setadjunctData] = useState([])
    const [patientData, setpatientData] = useState({})
    const [exerciseData, setexerciseData] = useState([])
    const [descriptionModalData, setdescriptionModalData] = useState([])
    const [descriptionLang, setdescriptionLang] = useState("")
    const [showDescriptionModal, setshowDescriptionModal] = useState(false)
    const [adviceData, setadviceData] = useState([])
    const [scaleObj, setscaleObj] = useState({ scale_link: "" })
    const [doctorObj, setdoctorObj] = useState("")
    const [generalInst, setgeneralInst] = useState()
    const [showGeneralInstModal, setshowGeneralInstModal] = useState(false)
    const [isMobile, setisMobile] = useState(false)
    const [ShowExpiryText, setShowExpiryText] = useState(false)
    const [expiryDays, setexpiryDays] = useState(0)
    const [dateOfEvaluation, setdateOfEvaluation] = useState("")
    const [dateOfExpiry, setdateOfExpiry] = useState("")
    const [vas_scale, setVasScale] = useState("");
    const [vas_remark, setVasRemark] = useState(null);
    // const [vasScaleTrackData, setvasScaleTrackData] = useState([])
    // const [audioText, setAudioText] = useState()

    useEffect(() => {
        const windowWidth = window.screen.availWidth
        if (windowWidth <= 468) {
            setisMobile(true)
        }
    }, [window.screen.availWidth])


    useEffect(() => {
        async function fetchData() {
            setisLoading(true)
            const url = new URL(window.location.href);


            let params = new URLSearchParams(url.search)
            // console.log("params", parseInt(params.get("prescription_id"), 10));
            let prescription = await getPrescriptionById({ id: parseInt(params.get("prescription_id")) })
            let requestBody = {
                type: "exercise",
                instruction_id: config.general_inst_id
            }
            let generalInstResp = await getGeneralInstruction(requestBody)
            if (generalInstResp.status) {

                viewGeneralInstModal(generalInstResp.data[0])
            }
            console.log("generalInstResp", generalInstResp);

            console.log("prescription", prescription);
            if (prescription.data[0].date_of_evaluation) {
                // let doef = prescription.data[0].date_of_evaluation.split("T")
                // let doe = doef[0]
                setdateOfEvaluation(prescription.data[0].date_of_evaluation)
                setdateOfExpiry(format(new Date(prescription.data[0].expiry_date), 'dd-MMM-yyyy'))
            }
            // console.log("doe",format(new Date(doe),"dd MMM yyyy"))
            if (prescription.status) {
                setprescriptionData(prescription.data[0])
                if (prescription.data[0].doctor_id) {
                    let doctorObject = await doctorById({ doctor_id: prescription.data[0].doctor_id })
                    // console.log("doctorObject", doctorObject.data);
                    setdoctorObj(doctorObject.data)
                }
                if (prescription.data[0].expiry_date) {
                    // differenceInDays(new Date(),new Date(prescription.data[0].expiry_date))
                    console.log("expiry_date", prescription.data[0].expiry_date, differenceInDays(new Date(prescription.data[0].expiry_date), new Date()))
                    let difference = differenceInDays(new Date(prescription.data[0].expiry_date), new Date())
                    setexpiryDays(difference)
                    if (difference < 3) {
                        setShowExpiryText(true)
                    }
                }
                if (prescription.data[0].adjunct) {
                    let adjunct = JSON.parse(prescription.data[0].adjunct)
                    let adjunctArr = Object.values(adjunct);
                    // console.log("adjunctArr", parseInt(adjunctArr[0].adjunct_time));
                    setadjunctData(adjunctArr)
                }
                if (prescription.data[0].doctor_advice) {
                    let advice = JSON.parse(prescription.data[0].doctor_advice)
                    let adviceArr = Object.values(advice);
                    setadviceData(adviceArr)
                }
                if (prescription.data[0].exercise_arr) {
                    let exercise = JSON.parse(prescription.data[0].exercise_arr)
                    let exerciseArr = Object.values(exercise);
                    console.log("exerciseArr", exerciseArr);
                    setexerciseData(exerciseArr)
                    // generateAudio(exerciseArr)
                }

                if (prescription.data[0].scales_obj) {
                    let scaleObject = JSON.parse(prescription.data[0].scales_obj)

                    if (scaleObject.ScaleDays.includes(",")) {
                        let daysArr = scaleObject.ScaleDays.split(",")
                        let dayStr = daysArr.join(" & ")
                        scaleObject.ScaleDays = dayStr
                    }

                    console.log("scaleObject", scaleObject)
                    setscaleObj(scaleObject)
                }

                if (prescription.data[0].patient_obj) {
                    let patientObj = JSON.parse(prescription.data[0].patient_obj)
                    setpatientData(patientObj)
                }


            }

            
            if (prescription.data[0].var_track) {
                setVasScale(prescription.data[0].var_track);
            }
            
            setisLoading(false)
        }
        fetchData();
    }, [])


    const convertDescObj = async (instObj) => {
        let instData = JSON.parse(instObj)
        return Object.values(instData)
    }
    async function viewDescriptionModal(instObj, language) {
        if (instObj) {
            let descriptionData = await convertDescObj(instObj)
            setdescriptionModalData(descriptionData)
        } else {
            setdescriptionModalData([])
        }
        setdescriptionLang(language)
        setshowDescriptionModal(true)

    }

    async function viewGeneralInstModal(instObj) {

        instObj.descriptionEnglish = await convertDescObj(instObj.instruction_description_english)

        instObj.descriptionHindi = await convertDescObj(instObj.instruction_description_hindi)

        setgeneralInst(instObj)
        setshowGeneralInstModal(true)
    }

    async function updateExercise(exe, index) {
        if (!exerciseData[index].isCompleted) {
            // console.log("i am heree", exerciseData[index], exe);
            const url = new URL(window.location.href);
            let params = new URLSearchParams(url.search)
            let ExerciseTrackReq = {
                prescription_id: parseInt(params.get("prescription_id")),
                exercise_name: exe.exercise_name,
                exercise_date: format(new Date(), "yyyy-MM-dd")
            }
            setexerciseData((exerciseData) => {
                exerciseData[index].isCompleted = 1
                return [...exerciseData]
            })
            updateExerciseTrack(ExerciseTrackReq)
        }
        else {
            return true
        }
    }

    async function toggleVideoDemo(exe, index) {
        setexerciseData((exerciseData) => {
            if (!exerciseData[index].showVideo) {
                exerciseData[index].showVideo = true
            } else {
                exerciseData[index].showVideo = false
            }
            return [...exerciseData]
        })
    }

    function onPlayerReady(event) {
        console.log("event target", event.target);
        event.target.mute();
        event.target.playVideo();
    }

    async function updateVasScale(vas_scale, vas_remark) {
        if (vas_scale) {
            const url = new URL(window.location.href);
            let params = new URLSearchParams(url.search)
            let VasTrackReq = {
                prescription_id: parseInt(params.get("prescription_id")),
                vas_type: prescriptionData.vas_type,
                vas_scale: vas_scale,
                vas_remark: vas_remark
            }
            updateVasScaleTrack(VasTrackReq);
            setVasScale(vas_scale);
            alert("VAS Scale Updated")
        }
        else {
            return true
        }
    }


    // async function generateAudio(exercise){
    //     let text = ``
    // }

    const tr = {
        queue: null,
        pause: null,
        play:  null,
        cancel:  null,
        defaultRate: 1.1,
        defaultPitch: 1,
        // voice selection to do;
    };    
    async function speakMessage(exercise, PAUSE_MS = 500, tr = 'play', key) {
        let text = ``
        let newtext = ``
        if (exercise.isTimeControlled) {
            newtext = 'test 1 , please read'
            for (let i = 1; i <= parseInt(exercise.exercise_reps); i++) {
                text += `Take your position , your time starts in 3., 2., 1., and go ,,`
                for (let j = 1; j <= parseInt(exercise.exercise_time); j++) {
                    text += `${j}. ,`
                }
                text += `and relax , `
                if (parseInt(exercise.exercise_rests) > 0) {
                    text += ` take rest for ${exercise.exercise_rests} counts ,`
                }
                for (let l = 1; l <= parseInt(exercise.exercise_rests); l++) {
                    text += `${l}.,`
                }
                if (i < parseInt(exercise.exercise_reps)) {
                    text += ` time for next round,,`
                }
            }
        } else {
            newtext = 'test 2 , please read'
            for (let i = 1; i <= parseInt(exercise.exercise_sets); i++) {
                text += `Take your position , and start in 3., 2., 1.,,`
                for (let j = 1; j <= parseInt(exercise.exercise_reps); j++) {
                    if (parseInt(exercise.exercise_holds)) {
                        text += `${j}. hold `
                        for (let k = 1; k <= parseInt(exercise.exercise_holds); k++) {
                            text += `${k}. , `
                        }
                    } else {
                        text += `${j}. ,`
                    }
                    text += ` relax ,`
                }
                if (i < parseInt(exercise.exercise_sets)) {
                    if (parseInt(exercise.exercise_rests) > 0) {
                        text += `rest for ${exercise.exercise_rests} counts ,,`
                    }
                    for (let l = 1; l <= parseInt(exercise.exercise_rests); l++) {
                        text += `${l},,`
                    }
                }
            }
        }
        text += `play the next exercise `
        console.log(newtext)
        try {
            const messageParts = text.split(',')
            let currentIndex = 0
            const speak = (textToSpeak) => {
            const msg = new SpeechSynthesisUtterance();
            const voices = window.speechSynthesis.getVoices();
            msg.voice = voices[1];
            msg.volume = 1; // 0 to 1
            msg.rate = 1; // 0.1 to 10
            msg.pitch = .1; // 0 to 2
            msg.text = textToSpeak;
            msg.lang = 'en-US';

            msg.onend = function() {
                currentIndex++;
                if (currentIndex < messageParts.length) {
                setTimeout(() => {
                    speak(messageParts[currentIndex])
                }, PAUSE_MS)
                }else{
                    console.log(exercise)
                    console.log(key)
                    updateExercise(exercise, key)
                    //update audio track here
                }
            };
            speechSynthesis.speak(msg);
            
            }
            speak(messageParts[0])
            if(tr == 'pause'){
                speechSynthesis.pause();
            }
            else if(tr == 'play'){
                speechSynthesis.play();
            }
            else{
                speechSynthesis.cancel();
            }

        } catch (e) {
            console.error(e)
        }
    }

    // function run(pause) {
    //     speakMessage('Testing 1,2,3', pause)
    // }

    return (
        <>
            {/* {isLoading ?
                <> */}
            {prescriptionData && doctorObj ?
                <>
                    {expiryDays >= 0 ?
                        <>
                            {/* Description Modal */}
                            {showDescriptionModal &&
                                <DescriptionModal
                                    descriptionLang={descriptionLang}
                                    descriptionModalData={descriptionModalData}
                                    setshowDescriptionModal={setshowDescriptionModal}
                                    showDescriptionModal={showDescriptionModal}
                                />
                            }
                            {/* Description Modal */}
                            {showGeneralInstModal &&
                                <GeneralInstModal
                                    isMobile={isMobile}
                                    descriptionLang={"English"}
                                    descriptionEnglish={generalInst.descriptionEnglish}
                                    descriptionHindi={generalInst.descriptionHindi}
                                    setshowGeneralInstModal={setshowGeneralInstModal}
                                    showGeneralInstModal={showGeneralInstModal}
                                />
                            }
                            {ShowExpiryText ? <h6 className="expiryLink">Link will Expire in {expiryDays > 0 ? expiryDays > 1 ? ` ${expiryDays} days` : ` ${expiryDays} day` : "today"}. Please take screenshots for your reference in future</h6> : null}
                            <div className='emailTemplate'>
                                <div className="poweredText">
                                    <h5 id="poweredText">Powered By WorkFitt</h5>
                                </div>
                                <div class="flexClass templateHead">
                                    <img src={config.backend_url + doctorObj.doctor_logo} id="doctor_logo" />
                                    <div className="seprator" style={{ "color": "#665e5e" }}></div>
                                    <div className="doctor_details">
                                        <h1 className="doctor_name_top">Dr. {prescriptionData.doctor_name}{" (PT)"}</h1>
                                        <p className="doctor_name_top" style={{ color: "#817d7d" }}>{doctorObj.doctor_degree}</p>
                                        <p>{prescriptionData.doctor_address} </p>
                                        {prescriptionData.doctor_mobile ? <p>Cell: {prescriptionData.doctor_mobile} </p> : null}
                                        {prescriptionData.doctor_email ? <p>Email: {prescriptionData.doctor_email}</p> : null}
                                    </div>
                                </div>
                                <div class="prescriptionBody">
                                    <div class="bodyElement">
                                        <p><b>Name:</b>  {patientData.patient_name}</p>
                                        {prescriptionData.patient_mobile ? <p><b>Phone No.:</b> {prescriptionData.patient_mobile}</p> : null}
                                        <p><b>Age:</b>  {patientData.patient_age}</p>
                                        <p><b>Gender:</b> {patientData.patient_gender}</p>
                                        <p><b>Date Of Evaluation:</b>  {dateOfEvaluation}</p>
                                        <p><b>Duration Date:</b>  {dateOfExpiry}</p>
                                        <p><b>C/O:</b> {prescriptionData.prescription_c_o}</p>
                                        {prescriptionData.prescription_goals ? <p><b>Prescription Goals:</b> {prescriptionData.prescription_goals}</p> : null}
                                    </div>

                                    {prescriptionData.doctor_note ?
                                        <div class="bodyElement">
                                            <p><b>Assessment Notes:</b>  {prescriptionData.doctor_note}</p>
                                        </div>
                                        :
                                        null
                                    }

                                    {adviceData && adviceData.length > 0 ?
                                        <div class="bodyElement">
                                            <div class="adjunct">
                                                <p><b>Advice:</b></p>
                                                <ul>
                                                    {adviceData.map((advice, key) => {
                                                        return (
                                                            <li class="adjunct_li" key={key}>
                                                                <div className="liElement">{key + 1}{".  "}{advice} {"Suggested"}</div>
                                                            </li>
                                                        )
                                                    }
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                        :
                                        null
                                    }
                                    {prescriptionData.instruction_note ?
                                        <div class="bodyElement">
                                            <p><b>Instructions:</b> {prescriptionData.instruction_note}</p>
                                        </div>
                                        :
                                        null
                                    }

                                    {adjunctData && adjunctData.length > 0 ?
                                        <div class="bodyElement">
                                            <div class="adjunct">
                                                <p><b>Adjunct:</b></p>
                                                <ul>
                                                    {adjunctData.map((adj, key) => {
                                                        return (
                                                            <li class="adjunct_li flexClass" key={key}> <div className="liElement">{key + 1}{".  "}{adj.adjunct_name}
                                                                {adj.adjunct_time ?
                                                                    adj.adjunct_name == "Bracing" ?
                                                                        " - " + adj.adjunct_time :
                                                                        (parseInt(adj.adjunct_time)) ?
                                                                            " - " + adj.adjunct_time : ""
                                                                    : ""}{" "}</div>
                                                                <div className="liElement">
                                                                    <span className="instructionSpace" onClick={() => { viewDescriptionModal(adj.instruction_description_english, "English") }}>[Instruction English]</span>{" "}
                                                                    <span className="instructionSpace" onClick={() => { viewDescriptionModal(adj.instruction_description_hindi, "Hindi") }}>[????????????????????? ??????????????? ?????????]</span>
                                                                </div>
                                                            </li>
                                                        )
                                                    }

                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                        : null}

                                    <div class="bodyElement">
                                        {exerciseData.length > 0 ? <h2 id="exerciseHead">Exercise Prescription</h2> : null}
                                        
                                        {exerciseData.map((exercise, key) => {
                                            {/* console.log("exercise", exercise)  */ }
                                            let audioPath = config.backend_url + exercise.audioFilePath
                                            {/* audioPath = "/akshaynarkar31@gmail_com_push-ups_June_25_2022_audio.mp3" */ }

                                            return (
                                                <div className="exercise" key={key}>
                                                    {exercise.showVideo ?
                                                        <>
                                                            {/* <div className="exercise_video" dangerouslySetInnerHTML={{ __html: exercise.videoObj.video_iframe }} style={{ position: "relative" }}></div> */}
                                                            {exercise.videoObj.is_youtube_link == 0 ? (
                                                                // <video src={config.backend_url + exercise.videoObj.video_youtube_id}></video>
                                                                <video width="301" height="175" className="exercise_video" controls autoPlay>
                                                                    <source src={config.backend_url + exercise.videoObj.video_youtube_id} type="video/mp4"/>
                                                                </video>
                                                            ) : (
                                                                <YouTube
                                                                    videoId={exercise.videoObj.video_youtube_id}
                                                                    className="exercise_video"
                                                                    style={{ position: "relative" }}
                                                                    opts={{
                                                                        "height": '175',
                                                                        "width": '301',
                                                                        "playerVars": {
                                                                            // https://developers.google.com/youtube/player_parameters
                                                                            "autoplay": 1,
                                                                            "loop": 1,
                                                                            "controls": 0,
                                                                            "disablekb": 1,
                                                                            "modestbranding": 1,
                                                                            "playsinline": 1,
                                                                            "rel": 0
                                                                        },
                                                                    }}
                                                                    onReady={(e) => { onPlayerReady(e) }}
                                                                    onEnd={(e) => { e.target.playVideo(); }}
                                                                />
                                                            )}
                                                        </>
                                                        : null
                                                    }
                                                    <div className=" exercise_heading">
                                                        <h5> {key + 1}{") "} {exercise.exercise_name}
                                                            {/* <div className="exerciseInfo"> */}
                                                            <b>
                                                                {exercise.exercise_reps ? ` - ${exercise.exercise_reps} Reps ` : ""}
                                                                {exercise.exercise_holds ? `x ${exercise.exercise_holds} Holds ` : ""}
                                                                {exercise.exercise_rests ? `x ${exercise.exercise_rests} Rests ` : ""}
                                                                {exercise.exercise_sets ? `x ${exercise.exercise_sets} Sets ` : ""}
                                                                {exercise.exercise_time ? `x ${exercise.exercise_time} Seconds ` : ""}
                                                            </b>
                                                            {/* </div> */}
                                                        </h5>
                                                    </div>
                                                    <div className="instContainer">
                                                        <span className="instructionSpace" onClick={() => { toggleVideoDemo(exercise, key) }}>[Demo Video]</span> {" "}
                                                        <span className="instructionSpace" onClick={() => { viewDescriptionModal(exercise.instructionObj.instruction_description_english, "English") }}>[Instruction English]</span> {" "}
                                                        <span className="instructionSpace" onClick={() => { viewDescriptionModal(exercise.instructionObj.instruction_description_hindi, "Hindi") }}>[????????????????????? ??????????????? ?????????]</span>
                                                    </div>

                                                    {/* <audio controls onEnded={() => { updateExercise(exercise, key) }}>
                                                        <source src={audioPath} type="audio/mp3" />
                                                    </audio> */}
                                                    {/* <br></br> */}
                                                    <button className="button-7" onClick={() => {speakMessage(exercise,700, 'play', key)}}>Start Exercise</button>
                                                    {/* <button className="vasScaleUpdate" onClick={() => { updateVasScale(vas_scale) }}>Save</button> */}

                                                    <button type="button" className="button-7"  onClick={() => {speakMessage(exercise,700, 'pause', key)}}>Pause Exercise</button>
                                                    {/* <button type="button"  onClick={() => {speakMessage(exercise,700,'cancel')}}>cancel</button> */}
                                                    <br></br>
                                                    {exercise.exercise_note ?
                                                        <p className="splNote"><br></br><b>Special Note : </b>{exercise.exercise_note}</p>
                                                        : null}
                                                </div>
                                            )
                                        })}

                                    </div>
                                    {scaleObj && scaleObj.scale_link ?
                                        <div class="bodyElement">
                                            <br></br>
                                            <p>{`Please Fill Out The form available on the link below after ${scaleObj.ScaleDays} days and send the reports to the
                                therapist. Thankyou`}</p>
                                            <a href={scaleObj.scale_link} target="_blank"> {scaleObj.scale_link}</a>
                                        </div>
                                        : null
                                    }

                                    <div className="vasScale">
                                        <h2 id="exerciseHead">{prescriptionData.vas_type} Scale</h2>
                                        <span>Please rate the level of your {prescriptionData.vas_type == 'VAS' ? 'pain' : 'tiredness'} as of today. Where 0 is no {prescriptionData.vas_type == 'VAS' ? 'pain' : 'tiredness'} at all and 10 is maximum {prescriptionData.vas_type == 'VAS' ? 'pain' : 'tiredness'}.</span><br></br>
                                        <span>??????????????? ?????? ?????? ?????????????????? ???????????? {prescriptionData.vas_type == 'VAS' ? '????????????' : '????????????'}  ?????? ???????????? ?????? ??????????????????????????? ??????????????? ???????????? ??? ???????????? ????????????????????? ?????? {prescriptionData.vas_type == 'VAS' ? '????????????' : '????????????'}  ???????????? ?????? ?????? ?????? ???????????? ?????????????????? {prescriptionData.vas_type == 'VAS' ? '????????????' : '????????????'}  ?????????</span>
                                        <br></br>
                                        <span>0 </span>
                                        <input type="range" id="rangeinput" className="custom-range" min="0" max="10"  value={vas_scale}
                                        onChange={(event) => setVasScale(event.target.value)} />
                                        <span> 10</span>
                                        <p><b>Vas Scale {vas_scale}</b></p>
                                        <div class="form-group">
                                            <label for="comment">Remark:</label><br></br>
                                            <textarea className="custom-vas-textarea"
                                        onChange={(event) => setVasRemark(event.target.value)}>{vas_remark}</textarea><br></br>
                                        </div>
                                        <button className="btn btn-primary vasScaleUpdate" onClick={() => { updateVasScale(vas_scale, vas_remark) }}>Save</button>
                                    </div>

                                    <div class="footer">
                                        <div></div>
                                        <div>
                                            <p><b>Verified and electronically signed by</b></p>
                                            <img src={config.backend_url + doctorObj.doctor_sign} alt="Sign" id="sign" />
                                            <h3 id="doctorName">Dr. {prescriptionData.doctor_name} {" (PT)"}</h3>
                                            <p id="doctorName">
                                                <span>Registration No. -</span><br />
                                                <span>{doctorObj.registration_number}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        <div className="NoRespContainer">
                            <h6>Oop's this link is expired</h6>
                        </div>
                    }
                </>
                :
                null
            }
            {/* </>
                :
                null
            } */}
        </>
    )
}
