import React, { useState, useEffect } from "react";
import config from "../../config/config.json";
import "./PasswordChange.css";
import adminPassword from "../../api/adminchangepassword";

export default function ConfirmPassword() {
    const [Confirmpassword, setConfirmpassword] = useState("");
    const [password, setpassword] = useState("");
    const [msgsuccess, setmsgsuccess] = useState("");

    function handleSubmit(event) {
      if(password === Confirmpassword)
      {

      
      console.log(Confirmpassword);
      const url = new URL(window.location.href);

      let params = new URLSearchParams(url.search)
      
      let request = {
        admin_id : parseInt(params.get("admin_id"), 10) ,
        admin_password: Confirmpassword,
      };
      console.log("request", request);
      adminPassword(request)
        .then((data) => {
          console.log("data", data);
  
        
          if (data.status == true) {
            //   setmsgsuccess(" Login successfull");
            localStorage.setItem("Login",true)
            document.getElementById("msg").style.color = "green";
            setTimeout(() => {
              setmsgsuccess(data.msg);
              setmsgsuccess("");
            }, 2000);
            window.open(`${config.Base_url}/login`, "_self");
         
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
      }
      else{
        document.getElementById("msg").style.color = "red";

        setmsgsuccess("both passwords should be same !");

      }
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
                <p className="form-title">Reset Password</p>
                <p className="ptag-confirm"> Enter your new password below, we're just being extra safe </p>
          
    
                <input
                  className="input_p"
                  name="password"
                  placeholder="New Password"
                  type="text"
                  onChange={(e) => {
                    setpassword(e.target.value);
                  }}
                />
                <br></br>
                <input
                  className="input_p"
                  name="Cpassword"
                  placeholder="Confirm Password"
                  type="text"
                  onChange={(e) => {
                    setConfirmpassword(e.target.value);
                  }}
                />
                <br />
                <div className="btn-login">
                  <input
                    type="submit"
                    value="Reset Password"
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
