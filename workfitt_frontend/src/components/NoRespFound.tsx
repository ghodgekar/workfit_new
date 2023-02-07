import { IonText } from '@ionic/react'
import React from 'react'
import "../css/noResp.css"

export default function NoRespFound({message}) {
  return (
    <div className="NoRespContainer">
        <IonText color="danger">{message ? message : "No Result Found"}</IonText>
    </div>
  )
}
