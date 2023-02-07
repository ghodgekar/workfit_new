// import "./App.css";
import Login from "./pages/login/Login";
import { Routes, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
// import "./App.css"

import LandingPage from "./pages/LandingPage/LandingPage";
import PageNotfound from "./pages/pagenotfound/PageNotfound";
import MyProfile from "./component/MyProfile/MyProfile";
import Layout from "./pages/Layout";
import Doctor from "./pages/Doctor/Doctor";
import Admin from "./pages/Admin/Admin";
import Email from "./pages/Email/Email";
import Addemail from "./pages/Email/Addemail";
import Instruction from "./pages/Insruction/Instruction";
import Adjunct from "./pages/Adjunct/Adjunct";
import "./App.css";
import BodyPart from "./pages/BodyPart/BodyPart";
import BodyArea from "./pages/BodyArea/BodyArea";
import DoctorAdvice from "./pages/DoctorAdvice/DoctorAdvice";
import Video from "./pages/Video/Video";
import Exercise from "./pages/Exercise/Exercise";
import Subscription from "./pages/Subscription/Subscription";
import Logout from "./pages/Logout/Logout";
import PasswordChange from "./pages/PasswordChange/PasswordChange";
import ConfirmPassword from "./pages/PasswordChange/ConfirmPassword";
import ExerciseTrack from "./pages/ExerciseTrack/ExerciseTrack";
import Prescription from "./pages/Prescription/Prescription";
import Scale from "./pages/Scale/Scale";


function App() {

  return (
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route  path="/lostpassword" element={<PasswordChange/>} />
        <Route  path="/confirmPassword" element={<ConfirmPassword/>} />

        <Route path="/" element={<ProtectedRoute/>}>
          <Route path="/" element={<Layout />} >
            <Route index element={<LandingPage />} />

            <Route path="/myprofile" element={<MyProfile />} />
            {/* <Route path="/doctorlist" element={<DoctorList />} /> */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/email" element={<Email />} />
            <Route path="/addemail" element={<Addemail />} />
            <Route path="/instruction" element={<Instruction />} />
            <Route path="/adjunct" element={<Adjunct />} />
            <Route path="/bodyPart" element={<BodyPart />} />
            <Route path="/bodyArea" element={<BodyArea />} />
            <Route path="/doctorAdvice" element={<DoctorAdvice />} />
            <Route path="/video" element={<Video />} />
            <Route path="/exercise" element={<Exercise />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/scale" element={<Scale />} />

            <Route path="/logout" element={<Logout />} />
          </Route>
        </Route>
        <Route path="/exerciseTrack" element={<ExerciseTrack/>} />
        <Route path="/Prescription" element={<Prescription/>} />
        <Route path="*" element={<PageNotfound />} />
      </Routes>

  );
}
export default App;
