import { IonBadge, IonButton, IonContent, IonPage, IonSearchbar, IonText, IonIcon } from '@ionic/react';
import { useEffect, useState } from 'react';
import { addCircleOutline, star } from 'ionicons/icons'
import { Link } from 'react-router-dom';
import ForumModal from "../components/ForumModal";
import forumQNA from "../api/forumQNA";
import "../css/forum.css"
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Preferences } from '@capacitor/preferences';
import React from 'react';

function Forum() {
  const [searchText, setsearchText] = useState("");
  const [qnaArray, setqnaArray] = useState<any>([]);
  const [qnaCopy, setqnaCopy] = useState<any>([])
  const [Error, setError] = useState(false);
  const [doctorId, setdoctorId] = useState(0)
  const [showModal, setshowModal] = useState(false)
  const [isQuestion, setisQuestion] = useState(false)
  const [questionId, setquestionId] = useState(0)
  const [myquestion, setmyquestion] = useState(true)

  useEffect(() => {
    async function fetchData() {
     
      openWebview('https://orthotoolkit.com/')
    }
    fetchData();
  }, [])

  const openWebview = async (fullUrl: string) => {
    InAppBrowser.create(fullUrl);
  };

  return (<h2>abc</h2>
 );
};

export default Forum;



let arr = [
  {
    "question_id": 1,
    "question_desc": "best way to loose weight",
    "question_active": 1,
    "question_created": "2022-05-01T11:20:23.000Z",
    "doctor_Id": 1,
    "doctor_name": "conrad",
    "doctor_username": "conrad3",
    "doctor_email": "conrad3@test.com",
    "doctor_degree": "B.Sc",
    "specialisation": "I.T",
    "doctor_logo": "logo",
    "doctor_sign": "sign",
    "subscription_type": "type",
    "subscription_start_date": "2022-10-13T18:30:00.000Z",
    "subscription_end_date": "2022-10-13T18:30:00.000Z",
    "doctor_active": 1,
    "answers": [
      {
        "answer_id": 1,
        "answer_desc": "walk 10k steps daily",
        "question_id": 1,
        "answer_active": 1,
        "answer_created": "2022-05-01T11:21:45.000Z",
        "doctor_Id": 1,
        "doctor_name": "conrad",
        "doctor_username": "conrad3",
        "doctor_email": "conrad3@test.com",
        "doctor_degree": "B.Sc",
        "specialisation": "I.T",
        "doctor_logo": "logo",
        "doctor_sign": "sign",
        "subscription_type": "type",
        "subscription_start_date": "2022-10-13T18:30:00.000Z",
        "subscription_end_date": "2022-10-13T18:30:00.000Z",
        "doctor_active": 1
      },
      {
        "answer_id": 2,
        "answer_desc": "follow a calorie deficit diet",
        "question_id": 1,
        "answer_active": 1,
        "answer_created": "2022-05-01T11:22:23.000Z",
        "doctor_Id": 2,
        "doctor_name": "asdfgh",
        "doctor_username": "asdfg",
        "doctor_email": "asdfg@gmail.com",
        "doctor_degree": "bsc",
        "specialisation": "asdfg",
        "doctor_logo": "1651320632735_d0d838d8366f6312c026c2700.png",
        "doctor_sign": "1651320632742_d0d838d8366f6312c026c2701.png",
        "subscription_type": "3 month",
        "subscription_start_date": "2022-10-13T18:30:00.000Z",
        "subscription_end_date": "2022-10-13T18:30:00.000Z",
        "doctor_active": 1
      }
    ]
  },
  {
    "question_id": 1,
    "question_desc": "best way to loose weight",
    "question_active": 1,
    "question_created": "2022-05-01T11:20:23.000Z",
    "doctor_Id": 1,
    "doctor_name": "conrad",
    "doctor_username": "conrad3",
    "doctor_email": "conrad3@test.com",
    "doctor_degree": "B.Sc",
    "specialisation": "I.T",
    "doctor_logo": "logo",
    "doctor_sign": "sign",
    "subscription_type": "type",
    "subscription_start_date": "2022-10-13T18:30:00.000Z",
    "subscription_end_date": "2022-10-13T18:30:00.000Z",
    "doctor_active": 1,
    "answers": [
      {
        "answer_id": 1,
        "answer_desc": "walk 10k steps daily and follow a proper dieat given by your doctor or dietician",
        "question_id": 1,
        "answer_active": 1,
        "answer_created": "2022-05-01T11:21:45.000Z",
        "doctor_Id": 1,
        "doctor_name": "conrad",
        "doctor_username": "conrad3",
        "doctor_email": "conrad3@test.com",
        "doctor_degree": "B.Sc",
        "specialisation": "I.T",
        "doctor_logo": "logo",
        "doctor_sign": "sign",
        "subscription_type": "type",
        "subscription_start_date": "2022-10-13T18:30:00.000Z",
        "subscription_end_date": "2022-10-13T18:30:00.000Z",
        "doctor_active": 1
      },
      {
        "answer_id": 2,
        "answer_desc": "follow a calorie deficit diet",
        "question_id": 1,
        "answer_active": 1,
        "answer_created": "2022-05-01T11:22:23.000Z",
        "doctor_Id": 2,
        "doctor_name": "asdfgh",
        "doctor_username": "asdfg",
        "doctor_email": "asdfg@gmail.com",
        "doctor_degree": "bsc",
        "specialisation": "asdfg",
        "doctor_logo": "1651320632735_d0d838d8366f6312c026c2700.png",
        "doctor_sign": "1651320632742_d0d838d8366f6312c026c2701.png",
        "subscription_type": "3 month",
        "subscription_start_date": "2022-10-13T18:30:00.000Z",
        "subscription_end_date": "2022-10-13T18:30:00.000Z",
        "doctor_active": 1
      }
    ]
  },
  {
    "question_id": 1,
    "question_desc": "best way to loose weight",
    "question_active": 1,
    "question_created": "2022-05-01T11:20:23.000Z",
    "doctor_Id": 1,
    "doctor_name": "conrad",
    "doctor_username": "conrad3",
    "doctor_email": "conrad3@test.com",
    "doctor_degree": "B.Sc",
    "specialisation": "I.T",
    "doctor_logo": "logo",
    "doctor_sign": "sign",
    "subscription_type": "type",
    "subscription_start_date": "2022-10-13T18:30:00.000Z",
    "subscription_end_date": "2022-10-13T18:30:00.000Z",
    "doctor_active": 1,
    "answers": [
      {
        "answer_id": 1,
        "answer_desc": "walk 10k steps daily",
        "question_id": 1,
        "answer_active": 1,
        "answer_created": "2022-05-01T11:21:45.000Z",
        "doctor_Id": 1,
        "doctor_name": "conrad",
        "doctor_username": "conrad3",
        "doctor_email": "conrad3@test.com",
        "doctor_degree": "B.Sc",
        "specialisation": "I.T",
        "doctor_logo": "logo",
        "doctor_sign": "sign",
        "subscription_type": "type",
        "subscription_start_date": "2022-10-13T18:30:00.000Z",
        "subscription_end_date": "2022-10-13T18:30:00.000Z",
        "doctor_active": 1
      },
      {
        "answer_id": 2,
        "answer_desc": "follow a calorie deficit diet",
        "question_id": 1,
        "answer_active": 1,
        "answer_created": "2022-05-01T11:22:23.000Z",
        "doctor_Id": 2,
        "doctor_name": "asdfgh",
        "doctor_username": "asdfg",
        "doctor_email": "asdfg@gmail.com",
        "doctor_degree": "bsc",
        "specialisation": "asdfg",
        "doctor_logo": "1651320632735_d0d838d8366f6312c026c2700.png",
        "doctor_sign": "1651320632742_d0d838d8366f6312c026c2701.png",
        "subscription_type": "3 month",
        "subscription_start_date": "2022-10-13T18:30:00.000Z",
        "subscription_end_date": "2022-10-13T18:30:00.000Z",
        "doctor_active": 1
      }
    ]
  },
  {
    "question_id": 1,
    "question_desc": "best way to loose weight",
    "question_active": 1,
    "question_created": "2022-05-01T11:20:23.000Z",
    "doctor_Id": 1,
    "doctor_name": "conrad",
    "doctor_username": "conrad3",
    "doctor_email": "conrad3@test.com",
    "doctor_degree": "B.Sc",
    "specialisation": "I.T",
    "doctor_logo": "logo",
    "doctor_sign": "sign",
    "subscription_type": "type",
    "subscription_start_date": "2022-10-13T18:30:00.000Z",
    "subscription_end_date": "2022-10-13T18:30:00.000Z",
    "doctor_active": 1,
    "answers": [
      {
        "answer_id": 1,
        "answer_desc": "walk 10k steps daily",
        "question_id": 1,
        "answer_active": 1,
        "answer_created": "2022-05-01T11:21:45.000Z",
        "doctor_Id": 1,
        "doctor_name": "conrad",
        "doctor_username": "conrad3",
        "doctor_email": "conrad3@test.com",
        "doctor_degree": "B.Sc",
        "specialisation": "I.T",
        "doctor_logo": "logo",
        "doctor_sign": "sign",
        "subscription_type": "type",
        "subscription_start_date": "2022-10-13T18:30:00.000Z",
        "subscription_end_date": "2022-10-13T18:30:00.000Z",
        "doctor_active": 1
      },
      {
        "answer_id": 2,
        "answer_desc": "follow a calorie deficit diet",
        "question_id": 1,
        "answer_active": 1,
        "answer_created": "2022-05-01T11:22:23.000Z",
        "doctor_Id": 2,
        "doctor_name": "asdfgh",
        "doctor_username": "asdfg",
        "doctor_email": "asdfg@gmail.com",
        "doctor_degree": "bsc",
        "specialisation": "asdfg",
        "doctor_logo": "1651320632735_d0d838d8366f6312c026c2700.png",
        "doctor_sign": "1651320632742_d0d838d8366f6312c026c2701.png",
        "subscription_type": "3 month",
        "subscription_start_date": "2022-10-13T18:30:00.000Z",
        "subscription_end_date": "2022-10-13T18:30:00.000Z",
        "doctor_active": 1
      }
    ]
  }
]