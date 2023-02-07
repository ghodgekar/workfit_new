// import { App } from '@capacitor/app';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
import YouTube, { YouTubeProps } from 'react-youtube';
import getWatchVideo from '../api/getWatchVideo';
import Loader from '../components/Loader';
import NoRespFound from '../components/NoRespFound';
import "../css/watchVideo.css"

const WatchVideo: React.FC = () => {
  const [isLoadingResult, setisLoadingResult] = useState(true)
  const [videoArr, setvideoArr] = useState([])
  useEffect(() => {
    async function fetchData() {
      setisLoadingResult(true)
      let response = await getWatchVideo()
      if (response.status) {
        setvideoArr(response.data)
      }
      setisLoadingResult(false)
    }
    fetchData();
  }, [])



  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  const opts: YouTubeProps['opts'] = {
    height: '250',
    width: '360',
    className: "tutVideo",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      rel: 0,
      modestbranding: 1,
    },
  };


  // function onPauseVideo(event) {
  //   console.log("pause event target", event.target);
  //   // event.target.mute();
  //   event.target.pauseVideo();
  // }

  // function onPlayVideo(event) {
  //   console.log("play event target");
  //   // event.target.mute();
  //   event.target.playVideo();
  // }


  // {
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   margin-top: 47px;
  // }

  return (
    <IonPage>
      <IonHeader>
        {/* <IonToolbar>
          <IonTitle>Videos</IonTitle>
        </IonToolbar> */}
        <div className="logoImgContainer">
          {/* <h4>Search</h4> */}
          <img className="landingLogo" src="/assets/images/home.png" />
          {/* <IonIcon icon={menu} className="menuLogo" onClick={() => { setshowMenu(!showMenu) }} /> */}
        </div>
      </IonHeader>

      <IonContent fullscreen >
        {isLoadingResult ?
          <Loader /> :
          <>
            {videoArr.length ?
              <>
                {videoArr.map((video, id) => (
                  <>
                  <h4 style={{margin:"15px"}}><u>Introductory Video</u></h4>
                  <div className="videoContainer" key={id}>
                    <YouTube videoId={video.video_youtube_id} opts={opts} onReady={onPlayerReady} />
                  </div>
                  </>
                )
                )
                }
              </>
              : <NoRespFound message="No Videos Found !!!"/>

            }

          </>
        }
      </IonContent>
    </IonPage>
  );
};

export default WatchVideo;
