import React, { useEffect, useState } from 'react'
import getPrescriptionById from '../../api/Prescription_Api/getPrescriptionById'
import videoList from '../../api/Video_Api/videoList'

import updateExerciseTrack from '../../api/Exercise_Api/updateExerciseTrack';
import "./exerciseTrack.css"
let src = ""
export default function ExerciseTrack() {
    const [isLoading, setisLoading] = useState(true)
    const [prescriptionData, setprescriptionData] = useState([])
    const [videoData, setvideoData] = useState([])

    useEffect(() => {
        async function fetchData() {
            setisLoading(true)
            let params = new URLSearchParams(window.location.href)
            console.log("params", params.get("prescription_id"));
            let prescription = await getPrescriptionById({ id: parseInt(params.get("prescription_id")) })
            let video = await videoList({ video_id: parseInt(params.get("video_id")) })

            if (prescription.status) {
                setprescriptionData(prescription.data)
            }
            if (video.status) {
                
                console.log("videoData", video.data[0]?.video_iframe);
                // let arr = video.data[0]?.video_iframe.split(" ")
                // let width = arr.findIndex((val) => { return val.includes("width=") });
                // arr[width]= "width=100vw"

                // let iFrame = arr.join(" ")
                // video.data[0].video_iframe=iFrame

                setvideoData(video.data)
            }


            setisLoading(false)
            let ExerciseTrackReq = {
                prescription_id: parseInt(params.get("prescription_id")),
                exercise_name: params.get("exercise_name"),
                // exercise_date: format(new Date(), "YYYY-MM-DD")
            }
            updateExerciseTrack(ExerciseTrackReq)
        }

        fetchData();
    }, [])

    return (
        <div>
            {
                isLoading & !videoData[0]?.video_iframe ?
                    <div>Loading.........</div> :
                    <>
                        <div className="watch_exercise_video" dangerouslySetInnerHTML={{ __html: videoData[0]?.video_iframe }}></div> 
                        {/* <div className="watch_exercise_video">
                            <iframe title="YouTube video player" src="https://www.youtube-nocookie.com/embed/3Zg4CRxyH4I?rel=0&autoplay=1&controls=0&disablekb=1&loop=1&playlist=3Zg4CRxyH4I&playsinline=1&iv_load_policy=3&mute=1&widgetid=1&widget_referrer" width="100%" height="100%" frameborder="0" allowfullscreen=""></iframe>
                        </div> */}
                    </>


            }
        </div >
    )
}
