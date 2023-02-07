import { IonBadge, IonButton, IonContent, IonPage, IonSearchbar, IonText, IonIcon } from '@ionic/react';
import { useEffect, useState } from 'react';
import { addCircleOutline, star } from 'ionicons/icons'
import { Link } from 'react-router-dom';
import ForumModal from "../components/ForumModal";
import forumQNA from "../api/forumQNA";
import "../css/forum.css"
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
      let forumresponse = await forumQNA()
      let value = localStorage.getItem("userInfo")
      // let { value } = await Preferences.get({ key: 'userInfo' });
      let val = JSON.parse(value)
      if (val && val !== '') {
        setdoctorId(val.doctor_Id)
      }
      console.log("forumresponse", forumresponse);
      if (forumresponse.status && forumresponse.data && forumresponse.data.length) {
        setqnaArray(forumresponse.data);
        setqnaCopy(forumresponse.data);
        // setqnaArray(arr)
      } else {
        setqnaArray([])
        setqnaCopy([]);
        setError(true)
      }
    }
    fetchData();
  }, [showModal])

  const searchQuestion = (e) => {
    setsearchText(e.detail.value!)
    console.log("e.detail.value!", e.detail.value!);
    if (e.detail.value!) {
      let searchresp = qnaCopy.filter((ele) => { return ele.question_desc.toLowerCase().includes(e.detail.value!.toLowerCase()) })
      setqnaArray(searchresp)
      if (searchresp.length > 0) {
        setError(false)
      } else {
        setError(true)
      }
    } else {
      setError(false)
      setqnaArray(qnaCopy)
    }
  }

  const getMyQuestions = () => {
    let searchresp = qnaCopy.filter((ele) => { return ele.doctor_Id == doctorId })
    setqnaArray(searchresp)
    if (searchresp.length > 0) {
      setError(false)
    } else {
      setError(true)
    }
    setmyquestion(false)
  }

  const getAllQuestions = () => {
    setError(false)
    setqnaArray(qnaCopy)
    setmyquestion(true)
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonSearchbar value={searchText} onIonChange={e => searchQuestion(e)} showCancelButton="never" placeholder="Search Question" style={{ padding: "0px", height: "50px" }}></IonSearchbar>
        <div className="button-container">
          <IonButton color="primary" className='forum_btn' onClick={() => { setisQuestion(true); setshowModal(true); }}>Add Question</IonButton>
          {myquestion ?
            <IonButton color="dark" className='forum_btn' onClick={() => { getMyQuestions() }}>My Questions</IonButton>
            :
            <IonButton color="dark" className='forum_btn' onClick={() => { getAllQuestions() }}>All Questions</IonButton>
          }
        </div>
        <ForumModal
          setshowModal={setshowModal}
          showModal={showModal}
          isQuestion={isQuestion}
          questionId={questionId}
          doctorId={doctorId}
        />
        {Error ?
          <IonText>No Questions Found </IonText>
          :
          <>
            {qnaArray.map((item, key) => {
              return (
                <div className="questionContainer">
                  <IonText>
                    <div className="forumQA">
                      <h4 className="forum_question">Q{key + 1}. </h4>
                      <div>
                        <h4 className="forum_question">{item.question_desc}</h4>
                        <small className="forum_doc_name">{item.doctor_name}</small>
                      </div>
                    </div>
                  </IonText>

                  <div className="forumQA">
                    <div className="forumAns">Ans.</div>
                    <div>
                      {item.answers.map((answer, id) => {
                        return (
                          <IonText >
                            <div className="forum_answer">
                              <p className="forum_answer_desc">{answer.answer_desc} </p>
                              <small className="forum_doc_name">{answer.doctor_name}</small>
                            </div>
                          </IonText>
                        )
                      })}
                      <small className="addAnswer" onClick={() => { setquestionId(item.question_id); setisQuestion(false); setshowModal(true) }}> <span>Add Answer</span></small>
                    </div>
                  </div>

                </div>
              )
            })
            }
          </>

        }
      </IonContent>
    </IonPage>
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