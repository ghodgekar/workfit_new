import React from 'react'
import "../css/humanBody.css"

export default function HumanBody(props) {
    return (
        <div className="human-body">
            <img src="/assets/images/Body_chart.png" alt="" useMap="#image-map"/>
            <map name="image-map" onClick={(e)=>{props.part_clicked(e)}}>
                <area target="" id="CHEST & FACE" alt="CHEST & FACE" title="CHEST & FACE" coords="72,16,53,38,61,61,54,71,48,90,43,107,44,120,68,120,98,118,94,92,84,75,77,55,85,38" shape="poly" />
                <area target="" id="ABDOMEN" alt="ABDOMEN" title="ABDOMEN" coords="42,120,46,142,46,173,95,170,94,142,99,120" shape="poly" />
                <area target="" id="HIP" alt="HIP" title="HIP" coords="42,171,38,235,98,233,97,173" shape="poly" />
                <area target="" id="KNEE" alt="KNEE" title="KNEE" coords="40,234,46,317,92,317,98,237" shape="poly" />
                <area target="" id="ANKLE & FOOT" alt="ANKLE & FOOT" title="ANKLE & FOOT" coords="50,319,56,349,46,375,93,377,85,348,91,318" shape="poly" />
                <area target="" id="NECK & UPPER BACK" alt="NECK & UPPER BACK" title="NECK & UPPER BACK" coords="216,17,211,42,217,70,204,79,199,110,256,110,251,77,238,70,240,19" shape="poly" />
                <area target="" id="LOW BACK & FLANK" alt="LOW BACK & FLANK" title="LOW BACK & FLANK" coords="199,111,201,174,254,175,257,110" shape="poly" />
                <area target="" id="HIP" alt="HIP" title="HIP" coords="196,176,198,238,257,238,254,177" shape="poly" />
                <area target="" id="KNEE" alt="KNEE" title="KNEE" coords="199,235,206,326,247,324,255,238" shape="poly" />
                <area target="" id="ANKLE & FOOT" alt="ANKLE & FOOT" title="ANKLE & FOOT" coords="209,327,212,352,201,375,253,376,241,352,247,326" shape="poly" />
                <area target="" id="SHOULDER" alt="SHOULDER" title="SHOULDER Left" coords="49,79,28,82,24,123,41,124" shape="poly" />
                <area target="" id="ELBOW" alt="ELBOW" title="ELBOW Left" coords="25,125,18,156,36,158,39,126" shape="poly" />
                <area target="" id="WRIST" alt="WRIST" title="WRIST Left" coords="17,156,15,184,25,188,36,160" shape="poly" />
                <area target="" id="FINGERS" alt="FINGERS" title="FINGERS" coords="16,190,2,200,13,226,25,207,24,192" shape="poly" />
                <area target="" id="SHOULDER" alt="SHOULDER" title="SHOULDER" coords="90,78,100,120,117,120,111,85" shape="poly" />
                <area target="" id="ELBOW" alt="ELBOW" title="ELBOW" coords="100,122,106,162,122,162,116,121" shape="poly" />
                <area target="" id="WRIST" alt="WRIST" title="WRIST" coords="106,163,116,192,125,189,122,160" shape="poly" />
                <area target="" id="FINGERS" alt="FINGERS" title="FINGERS" coords="116,194,117,212,128,226,138,204,126,188" shape="poly" />
                <area target="" id="SHOULDER" alt="SHOULDER" title="SHOULDER" coords="205,79,198,125,181,123,183,84" shape="poly" />
                <area target="" id="ELBOW" alt="ELBOW" title="ELBOW" coords="181,125,173,164,191,167,198,125" shape="poly" />
                <area target="" id="WRIST" alt="WRIST" title="WRIST" coords="174,163,172,188,181,197,190,167" shape="poly" />
                <area target="" id="FINGERS" alt="FINGERS" title="FINGERS" coords="169,190,159,203,170,223,181,213,180,199" shape="poly" />
                <area target="" id="SHOULDER" alt="SHOULDER" title="SHOULDER" coords="249,78,257,125,273,122,268,82" shape="poly" />
                <area target="" id="ELBOW" alt="ELBOW" title="ELBOW" coords="257,127,262,164,280,161,274,125" shape="poly" />
                <area target="" id="WRIST" alt="WRIST" title="WRIST" coords="265,165,273,192,282,189,279,163" shape="poly" />
                <area target="" id="FINGERS" alt="FINGERS" title="FINGERS" coords="274,191,273,214,284,225,296,202,284,189" shape="poly" />
            </map>
        </div>
    )
}
