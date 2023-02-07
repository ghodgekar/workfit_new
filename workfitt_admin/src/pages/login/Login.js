import "./login.css";
import React, { useState, useEffect } from "react";
import config from "../../config/config.json";

import adminLogin from "../../api/login";
import { Link } from "react-router-dom";
export default function Login() {
  const [usermane, setusermane] = useState("");
  const [password, setpassword] = useState("");
  const [msgsuccess, setmsgsuccess] = useState("");

  function handleSubmit(event) {
    console.log(usermane, password);

    let request = {
      admin_username: usermane,
      admin_password: password,
    };
    console.log("request", request);
    adminLogin(request)
      .then((data) => {
        console.log("data", data);

      
        if (data.status == true) {
          //   setmsgsuccess(" Login successfull");
          localStorage.setItem("Login",true)
          window.open(`${config.Base_url}`, "_self");
       
        } else {
          document.getElementById("msg").style.color = "red";

          setmsgsuccess("Something went wrong !");
          setTimeout(() => {
            setmsgsuccess("");
          }, 2000);
        }
      })
      .catch((err) => {
        console.error("login error >>>>>>>>>", err);
      });
    event.preventDefault();
  }

function Changepassword(){
  // localStorage.setItem("Login",true)
  window.open(`${config.Base_url}/lostpassword`, "_self");

}

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
          <img

        //    src ="/images/doctor.jpg" 
           src ="/images/logoimg.png"
          //  src="https://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700"
            alt="Login"
          />
        </div>
        <div className="login">
          <form
            name="login-form"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <p className="form-title">Welcome back</p>
            <p className="ptag">Login to the Dashboard</p>
            <input
              className="input_p"
              name="username"
              placeholder="Username"
              type="text"
              //  value={e.target.value}
              onChange={(e) => {
                setusermane(e.target.value);
              }}
            />

            <br></br>
            <input
              className="input_p"
              name="password"
              placeholder="Password"
              type="text"
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
            <br />
            <div className="btn-login">
              <input
                type="submit"
                value=" Log in "
                className="login-form-button"
              />
            </div>

            <br></br>
          </form>
          <p className="msgsuccess" id="msg">
            {msgsuccess}
          </p>
       <a> <p  onClick={()=>{Changepassword()}}>Lost your password?</p></a>

        </div>
      </div>
    </div>
  );
}
