import { Text, Modal, Button } from '@nextui-org/react';
import React from 'react'
import YouTube from 'react-youtube';


export default function IframeDemo(props) {
    const closeHandler = () => {
        props.setshowIframeModal(false)
        console.log("closed");
    };
    return (
        <div>
            <Modal
                closeButton
                blur
                width='700px'
                aria-labelledby="modal-title"
                open={props.showIframeModal}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" b size={18}>
                        {props.title}
                    </Text>
                </Modal.Header>
                <Modal.Body css={{ margin: "auto" }}>
                    {props.videoId ?
                        <YouTube
                            videoId={props.videoId}
                            style={{ position: "relative" }}
                            opts={{
                                "height": '200',
                                "width": '400',
                                "playerVars": {
                                    // https://developers.google.com/youtube/player_parameters
                                    "autoplay": 1,
                                    "loop": 1,
                                    "controls": 0,
                                    "disablekb": 1,
                                    "modestbranding": 1,
                                    "playsinline": 1,
                                    "rel": 0
                                },
                            }}                     // defaults -> { }
                            onReady={(e) => { props.onPlayerReady(e) }}
                            onEnd={(e) => { e.target.playVideo(); }}
                        /> :
                        <div dangerouslySetInnerHTML={{ __html: props.iframe }}></div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={closeHandler}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
