import React, { useState, useEffect } from "react";
import config from "../../config/config.json";
import "./PasswordChange.css";
import adminCheck from "../../api/checkadmin";

export default function PasswordChange() {
    const [usermane, setusermane] = useState("");
    const [email, setemail] = useState("");
    const [msgsuccess, setmsgsuccess] = useState("");

    function handleSubmit(event) {
      console.log(usermane);
  
      let request = {
        admin_cred: usermane,
      };
      console.log("request", request);
      adminCheck(request)
        .then((data) => {
          console.log("data", data);
  
        
          if (data.status == true) {
            //   setmsgsuccess(" Login successfull");
            localStorage.setItem("Login",true)
            window.open(`${config.Base_url}/confirmPassword?admin_id=${data.data[0].admin_id}`, "_self");
         
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
                <p className="form-title">Forgot Your Password?</p>
                {/* <p className="ptag">No Worries! Enter your email or username below.</p> */}
                <p className="ptag">Enter your email or username below to receive your password reset instructions</p>

                <input
                  className="input_p"
                  name="username"
                  placeholder=" Registered Username or Email"
                  type="text"
                  //  value={e.target.value}
                  onChange={(e) => {
                    setusermane(e.target.value);
                  }}
                />
    
                {/* <br></br>
                <input
                  className="input_p"
                  name="password"
                  placeholder="Password"
                  type="text"
                  onChange={(e) => {
                    setpassword(e.target.value);
                  }}
                /> */}
                <br />
                <div className="btn-login">
                  <input
                    type="submit"
                    value="Send Request"
                    className="login-form-button"
                  />
                </div>
    
                <br></br>
              </form>
              <p className="msgsuccess" id="msg">
                {msgsuccess}
              </p>
    
            </div>
          </div>
        </div>
      );
}
