import { IonContent, IonGrid, IonIcon, IonItem, IonRow, isPlatform } from '@ionic/react'
import { logInOutline, logOutOutline, logOutSharp, personCircleOutline, personCircleSharp, readerOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Preferences } from '@capacitor/preferences';
import "../css/menu.css"
import { useHistory } from 'react-router-dom';
import { Browser } from '@capacitor/browser';
import config from "../config/config.json"
import { DocumentViewer } from '@ionic-native/document-viewer';

export default function Menu(props) {
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const history = useHistory();
    useEffect(() => {
        async function fetchData() {
            const { value } = await Preferences.get({ key: 'userInfo' });
            console.log("value", value);

            if (value && JSON.parse(value) && JSON.parse(value)) {
                setisLoggedIn(true)
            }
        }
        fetchData();
    }, [])

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

    async function logOutUser() {
        history.push("/logout")
    };

    return (
        <div className='menuContainer'>
            <Link to="/myProfile" className='editLink'>
                <IonItem lines="none" className="menuItem" >My Profile <IonIcon className='menuItemIcon' icon={personCircleOutline}></IonIcon> </IonItem>
            </Link>
            {isLoggedIn ?
                <IonItem lines="none" className="menuItem logout" onClick={() => { logOutUser() }}>Log Out <IonIcon className='menuItemIcon logout' icon={logOutOutline}></IonIcon> </IonItem>
                :
                <IonItem lines="none" className="menuItem " onClick={() => { history.push("/login") }}>Log In <IonIcon className='menuItemIcon ' icon={logInOutline}></IonIcon> </IonItem>
            }
            <IonItem lines="none" className="menuItem" onClick={() => { openTnc() }} >Terms & Conditions <IonIcon className='menuItemIcon' icon={readerOutline}></IonIcon> </IonItem>
            <IonItem lines="none" className="menuItem" > <div>For support write to us on <span style={{"color":"grey"}}>workfitt.help@gmail.com</span> </div></IonItem>
        </div>
    )
}
