const express=require("express");
const router=express.Router();
const bodyParser=require("body-parser");
const middleware=require("../middleware")
const reportController = require("../controllers/report.controller");

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
router.use(express.static('public'));

// let admin = require("./admin");
// let doctor = require("./doctor");
// let forum = require("./forum");

router.get("/",(req,res)=>{res.send("workfitt api running fast >>>>>>>>>>>>")})

router.post("/adminLogin",middleware.adminLogin)
router.post("/addAdmin",middleware.addAdmin)
router.get("/adminList",middleware.adminList);
router.post("/updateAdmin",middleware.updateAdmin);
router.post("/deleteAdmin",middleware.deleteAdmin)
router.post("/adminchangepassword",middleware.adminPassword)
router.post("/admincheck",middleware.admincheck)



// Adjunct
router.post("/addAdjunct",middleware.addAdjunct);
router.get("/adjunctList",middleware.adjunctList);
router.post("/deleteAdjunct",middleware.deleteAdjunct);
router.post("/updateAdjunct",middleware.updateAdjunct);
// Adjunct

// Instruction
router.post("/addInstruction",middleware.addInstruction)
router.get("/instructionList",middleware.instructionList)
router.post("/deleteInstruction",middleware.deleteInstruction)
router.post("/updateInstruction",middleware.updateInstruction)
router.get("/instructionByType",middleware.instructionByType)
router.get("/getInstruction",middleware.getInstruction)

// Instruction

// Video
router.post("/addVideo",middleware.addVideo);
router.get("/videoList",middleware.videoList);
router.post("/deleteVideo",middleware.deleteVideo);
router.post("/updateVideo",middleware.updateVideo);
router.get("/videoByType",middleware.videoByType);
router.get("/getWatchVideo",middleware.getWatchVideo);
// Video

// Body Part 
router.post("/addBodyPart",middleware.addBodyPart);
router.get("/bodyPartList",middleware.bodyPartList);
router.post("/deleteBodyPart",middleware.deleteBodyPart);
router.post("/updateBodyPart",middleware.updateBodyPart);
// Body Part 

// Scale Part 
router.post("/addScale",middleware.addScale);
router.get("/scaleList",middleware.scaleList);
router.post("/deleteScale",middleware.deleteScale);
router.post("/updateScale",middleware.updateScale);
// Scale Part 

// Doctor's Advice
router.post("/addDoctorAdvice",middleware.addDoctorAdvice);
router.get("/doctorAdviceList",middleware.doctorAdviceList);
router.post("/deleteDoctorAdvice",middleware.deleteDoctorAdvice);
router.post("/updateDoctorAdvice",middleware.updateDoctorAdvice);
router.get("/doctorAdviceByType",middleware.doctorAdviceByType);
router.post("/doctorAdviceByBodyArea",middleware.doctorAdviceByBodyArea);
// Doctor's Advice

// Body Area
router.post("/addBodyArea",middleware.addBodyArea);
router.get("/bodyAreaList",middleware.bodyAreaList);
router.post("/deleteBodyArea",middleware.deleteBodyArea);
router.post("/updateBodyArea",middleware.updateBodyArea);
router.get("/bodyAreaByUsedFor",middleware.bodyAreaByUsedFor);
// Body Area

// Exercise
router.post("/addExercise",middleware.addExercise);
router.get("/exerciseList",middleware.exerciseList);
router.post("/deleteExercise",middleware.deleteExercise);
router.post("/updateExercise",middleware.updateExercise);
router.post("/exerciseByBodyArea",middleware.exerciseByBodyArea);
router.post("/updateExerciseTrack",middleware.updateExerciseTrack);
router.post("/exerciseByDate",middleware.exerciseByDate);
router.get("/exerciseListByBodyPartId",middleware.exerciseListByBodyPartId);
router.post("/addExerciseForDr",middleware.addExerciseForDr);
router.post("/customExerciseSave",middleware.customExerciseSave);
// Exercise

//Subscription
router.post("/addSubscription",middleware.addSubscription)
router.get("/subscriptionList",middleware.subscriptionList);
router.post("/updateSubscription",middleware.updateSubscription);
router.post("/deleteSubscription",middleware.deleteSubscription)
//Subscription

//Email Template
router.post("/addEmailTemplate",middleware.addEmailTemplate)
router.get("/emailTemplateList",middleware.emailTemplateList);
router.post("/updateEmailTemplate",middleware.updateEmailTemplate);
router.post("/deleteEmailTemplate",middleware.deleteEmailTemplate)
//Email Template

// Prescription
router.post("/addPrescription",middleware.addPrescription)
router.get("/getPrescriptionById",middleware.getPrescriptionById)
router.get("/getPrescriptionListByDrId",middleware.getPrescriptionListByDrId)
router.post("/updateVasScaleTrack",middleware.updateVasScaleTrack)
// Prescription

// Doctor
router.post("/addDoctor",middleware.addDoctor)
router.post("/doctorLogin",middleware.doctorLogin)
router.post("/doctorById",middleware.doctorById)
router.post("/doctorByEmailUserName",middleware.doctorByEmailUserName)
router.post("/updateDoctor",middleware.updateDoctor)
router.post("/updateSubscribedDoctor",middleware.updateSubscribedDoctor)
router.post("/doctorLogout",middleware.doctorLogout)
router.post("/addDoctorVideo",middleware.addDoctorVideo)
// Doctor

// Reports
router.post("/report/getPrescriptionByMonth",reportController.prescriptionByMonthReport);
// Reports

// DashBoard
router.get("/getDashboardData",middleware.getDashboardData)
// DashBoard



router.get("*",(req,res,next)=>{res.send({status:false,err:'Route not defined!'})});

module.exports=router;

