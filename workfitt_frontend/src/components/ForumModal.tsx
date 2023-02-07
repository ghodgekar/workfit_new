import {  IonItem, IonLabel,  IonButton, IonTextarea, IonIcon, IonPopover } from '@ionic/react'
import { addCircleOutline } from 'ionicons/icons'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import "../css/forum.css"
import addQuestion from "../api/addQuestion"
import addAnswer from "../api/addAnswer"
import React from 'react'


function ForumModal(props) {
    const [errorMsg, seterrorMsg] = useState("")
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = async (data: any) => {

        let request = {
            "question_desc": data.question,
            "doctor_id": props.doctorId,
            "isActive": 1,
            "answer_desc": data.question,
            "question_id": props.questionId
        }
        let response
        if (props.isQuestion) {
            delete request.answer_desc
            delete request.question_id
            response = await addQuestion(request)
        } else {
            delete request.question_desc
            response = await addAnswer(request)
        }
        if (response.status) {
            props.setshowModal(false)
        }

    }
    return (
        <IonPopover
            // cssClass='my-custom-class'
            isOpen={props.showModal}
            alignment="center"
            onDidDismiss={() => props.setshowModal(false)}
            animated
            backdrop-dismiss
        >
            <form onSubmit={handleSubmit(onSubmit)} className="forum_modal">
                <IonItem>
                    <IonLabel position="stacked" className="question_input">Your {props.isQuestion ? "Question" : "Answer"}</IonLabel>
                    <IonTextarea placeholder={`Start Writing Your ${props.isQuestion ? "Question" : "Answer"} Here`}  {...register("question", { required: true })}></IonTextarea>
                </IonItem>
                <IonButton color="success" expand="block" className='addQuestionBtn' type="submit"><IonIcon slot="icon-only" icon={addCircleOutline} className="addQuestionIcon" /><b>Add {props.isQuestion ? "Question" : "Answer"}</b></IonButton>
            </form>
        </IonPopover>
    )
}

export default ForumModal