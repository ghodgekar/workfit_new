import { IonPage, IonContent, IonItem, IonHeader, IonTitle, IonToolbar, IonAlert, IonIcon, IonList, IonMenu } from "@ionic/react";
import React, { useEffect, useState } from "react";
import '../css/about.css';
import { menu } from "ionicons/icons";
import Menu from "../components/Menu";




const Landing: React.FC = () => {
  const [showMenu, setshowMenu] = useState(false)



  return (
    <IonPage>
      <IonHeader style={{ "backgroundColor": "white" }}>
        <div className="logoImgContainer" >
          <img className="landingLogo" src="/assets/images/home.png" />
          <IonIcon icon={menu} className="menuLogo" onClick={() => { setshowMenu(!showMenu) }} />
        </div>

      </IonHeader>
      <IonContent fullscreen>
        {showMenu ?
          <Menu
            setshowMenu={setshowMenu}
          />
          : null
        }

        <div className="aboutCard">
          <div className="cardHeader">
            <h5 className="aboutHeading">Professional e-prescriptions</h5>
            <img className="img-icon-about" src="/assets/icon/prescription.png" />
          </div>
          <ul className="aboutList">
            <li>Tailor the exercise program as per your needs with 350+ exercises!</li>
            <li>Benefits the clients with videos, instructions and rep guidance! </li>
            <li>Give the prescription a professional look with your logo and signature!</li>
            <li>No need for the client to download any app!</li>
            <li>Download your patient data in a spreadsheet format monthly/yearly!</li>
            <li>Your patient data can be viewed and downloaded by no-one but you!</li>

          </ul>
        </div>


        <div className="aboutCard">
          <div className="cardHeader">
            <h5 className="aboutHeading">Bill Generation</h5>
            <img className="img-icon-about" src="/assets/icon/prescription.png" />
          </div>
          <ul className="aboutList">
            <li> Give professional bills to your patients! </li>
            <li>Select your own consultation, treatment and additional charges!</li>
            <li>Auto apply your selected discounts to the patients!</li>
            <li>View and download your data in a spreadsheet format!</li>
            <li>Your bill data can be viewed and downloaded by no-one but you!</li>

          </ul>
        </div>

        <div className="aboutCard">
          <div className="cardHeader">
            <h5 className="aboutHeading">Informative Calender </h5>
            <img className="img-icon-about" src="/assets/icon/calendar.png" />
          </div>
          <ul className="aboutList">
            <li>Check on your clients completion of Daily home exercise program </li>
            <li>Notifications of prescription expiration</li>
          </ul>
        </div>

        <div className="aboutCard">
          <div className="cardHeader">
            <h5 className="aboutHeading">Access to informative videos</h5>
            <img className="img-icon-about" src="/assets/icon/videos.png" />
          </div>
          <ul className="aboutList">
            <li>Watch weekly informative videos at your convenience!</li>
            <li>Critical appraisals of articles and much more!</li>
          </ul>
        </div>



        <div className="aboutCard">
          <div className="cardHeader">
            <h5 className="aboutHeading">Outcome Measures</h5>
            <img className="img-icon-about" src="/assets/icon/scales.png" />
          </div>
          <ul className="aboutList">
            <li>Use various scales for objective measures!</li>
            <li>Download and share the results!</li>
            <li>Send scale links with prescription for progress tracking</li>

          </ul>
        </div>

        <div className="aboutCard">
          <div className="cardHeader">
            <h5 className="aboutHeading">Find articles</h5>
            <img className="img-icon-about" src="/assets/icon/search.png" />
          </div>
          <ul className="aboutList">
            <li>Search for articles made easy just for you!</li>
            <li>Get results from your desired platform</li>

          </ul>
        </div>

        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-7636991991852722"
          data-ad-slot="6867576277"
          data-full-width-responsive="true"
          data-adtest="on"
        ></ins>

      </IonContent>
    </IonPage>
  );
};

export default Landing;
