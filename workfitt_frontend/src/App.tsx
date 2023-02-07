import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import {
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import Landing from './pages/Landing';
import Register from './pages/Register'
import { Browser } from '@capacitor/browser';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import Login from './pages/Login';
import Search from "./pages/Search";
import Forum from "./pages/Forum";
import Prescription from "./pages/Prescription";
import Calendar from "./pages/Calendar";
import EditProfile from "./pages/EditProfile";
import WatchVideo from './pages/WatchVideo';
import AddVideo from './pages/AddVideo';
import { Preferences } from '@capacitor/preferences';
import ForgotPassword from './pages/ForgotPassword';
import { App as Back } from '@capacitor/app';
import { isAfter } from 'date-fns';
import MyProfile from './pages/MyProfile';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';
import config from "./config/config.json"
import Logout from './pages/Logout';





setupIonicReact({
  hardwareBackButton: false,
  scrollPadding:false
})





const App: React.FC = () => {
  const [isAuthed, setisAuthed] = useState(false);
  // const [isSubscribed, setisSubscribed] = useState(true)
  const history = useHistory();

  async function redirectToHome() {
    history.push("/")
  }

  useEffect(() => {
    async function fetch() {

      // console.log("subscription date", new Date("2022-07-27T18:30:00.000Z"), isBefore(new Date(), new Date("2022-07-27T18:30:00.000Z")))

      Back.addListener("backButton", (e) => {
        if (window.location.pathname === "/") {
          // Show A Confirm Box For User to exit app or not
          console.log("fired 111111111111111")
          let ans = window.confirm("Are you sure ?");
          if (ans) {
            Back.exitApp();
          }
        } else if (window.location.pathname === "/prescription") {
          console.log("fired 222222222222222")
        } else {
          console.log("fired 3333333333333333")
          redirectToHome()
        }
      });
      // AdMob.initialize();

      await initialize()



      const { value } = await Preferences.get({ key: 'userInfo' });
      if (value && JSON.parse(value)) {
        let doctorData = JSON.parse(value);
        console.log("doctorData", doctorData);
        if (isAfter(new Date(), new Date(doctorData.subscription_end_date))) {
          await Preferences.remove({ key: 'userInfo' });
        } else {
          setisAuthed(true)
        }
      }
    }
    fetch();
  }, [])


  async function initialize(): Promise<void> {
    const { status } = await AdMob.trackingAuthorizationStatus();

    if (status === 'notDetermined') {
      /**
       * If you want to explain TrackingAuthorization before showing the iOS dialog,
       * you can show the modal here.
       * ex)
       * const modal = await this.modalCtrl.create({
       *   component: RequestTrackingPage,
       * });
       * await modal.present();
       * await modal.onDidDismiss();  // Wait for close modal
       **/
    }

    await AdMob.initialize({
      requestTrackingAuthorization: true,
      // initializeForTesting: true,
    });
    await showAdBanner()
  }

  async function showAdBanner(): Promise<void> {
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
    });

    AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
      let appMargin =size.height;
      if (appMargin > 0) {
        const app: HTMLElement = document.querySelector('ion-tab-bar');
        app.style.marginBottom = appMargin + 'px';
      }
    });

    const options: BannerAdOptions = {
      adId: config.google_ad_id,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      // isTesting: true
      // npa: true
    };
    AdMob.showBanner(options);
  }

  async function openWebview(fullUrl: string) {
    await Browser.open({ url: fullUrl, windowName: '_self' });
    // InAppBrowser.create(fullUrl);
  }



  return (

    <IonTabs>
      <IonRouterOutlet>
        <Switch>
          <Route
            path="/"
            component={Landing}
            exact />

          <Route
            path="/login"
            exact ><Login setisAuthed={setisAuthed} /></Route>

          <Route
            path="/logout"
            exact ><Logout setisAuthed={setisAuthed} /></Route>

          <Route
            path="/calendar"
            render={() => { return isAuthed ? <Calendar /> : <Login setisAuthed={setisAuthed} />; }}
            exact />

          <Route
            path="/tutorial"
            render={() => { return isAuthed ? <WatchVideo /> : <Login setisAuthed={setisAuthed} />; }}
            exact />

          <Route
            path="/editProfile"
            render={() => { return isAuthed ? <EditProfile /> : <Login setisAuthed={setisAuthed} /> }}
            exact />

          <Route
            path="/myProfile"
            render={() => { return isAuthed ? <MyProfile /> : <Login setisAuthed={setisAuthed} /> }}
            exact />

          <Route path="/prescription" exact ><Prescription isAuthed={isAuthed}/></Route>

          <Route
            path="/forum"
            render={() => { return isAuthed ? <Forum /> : <Login setisAuthed={setisAuthed} />; }}
            exact />

          <Route
            path="/search"
            render={() => { return isAuthed ? <Search /> : <Login setisAuthed={setisAuthed} />; }}
            exact />

            <Route
              path="/add-video"
              render={() => { return isAuthed ? <AddVideo /> : <Login setisAuthed={setisAuthed} />; }}
              exact />

          <Route
            path="/register"
            component={Register}
            exact />
          <Route
            path="/forgotPassword"
            component={ForgotPassword}
            exact />
        </Switch>
      </IonRouterOutlet>
      {/* <Footer/> */}


      <IonTabBar slot="bottom" className='ion-tab-bar'>
        <IonTabButton tab="calendar" href="/calendar">
          <img className="img-icon" src="/assets/icon/calendar.png" />
        </IonTabButton>

        <IonTabButton tab="watchvideo" href="/tutorial">
          <img className="img-icon" src="/assets/icon/videos.png" />
        </IonTabButton>

        <IonTabButton tab="prescription" href="/prescription">
          <img className="img-icon" src="/assets/icon/prescription.png" />
        </IonTabButton>


        <IonTabButton tab="forum" href="/">
          <div onClick={() => { openWebview('https://orthotoolkit.com/') }}>
            <img className="img-icon" src="/assets/icon/scales.png" />
          </div>
        </IonTabButton>

        <IonTabButton tab="search" href="/search">
          <img className="img-icon" src="/assets/icon/search.png" />

        </IonTabButton>

      </IonTabBar>
    </IonTabs>

  );
};

export default App;
