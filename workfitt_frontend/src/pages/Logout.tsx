import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import Loader from "../components/Loader";
import doctorLogout from '../api/doctorLogout';
import Toast from '../components/Toast';

export default function Logout(props) {
    const [isLoadingResult, setisLoadingResult] = useState(false)
    const [showToast, setshowToast] = useState(false)
    const [toastMessage, settoastMessage] = useState("")
    const [toastColor, settoastColor] = useState("success")
    const history = useHistory();

    useEffect(() => {
        async function fetchData() {
            setisLoadingResult(true)
            const { value } = await Preferences.get({ key: 'userInfo' });
            let doctorData = JSON.parse(value);
            let logout = await doctorLogout({ doctor_id: doctorData.doctor_Id })
            setisLoadingResult(false)
            if (logout.status) {
                props.setisAuthed(false)
                await Preferences.remove({ key: 'userInfo' })
                await setToastData(logout.msg, "success")
                setTimeout(() => { history.push("/login") }, 2000);
            } else {
                await setToastData(logout.msg, "danger")
            }
        }
        fetchData()
    }, [])

    async function setToastData(message, color) {
        settoastColor(color);
        settoastMessage(message);
        setshowToast(true);
        setTimeout(() => { setshowToast(false) }, 2000);
    }

    return (
        <>
            {isLoadingResult ? <Loader /> : null}
            <Toast
                showToast={showToast}
                closeToast={(e) => { setshowToast(e) }}
                message={toastMessage}
                color={toastColor}
            />
        </>)
}
