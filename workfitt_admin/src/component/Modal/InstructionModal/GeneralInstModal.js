import { Text, Modal, Button } from '@nextui-org/react';
import React, { useState } from 'react'

export default function GeneralInstModal(props) {
    const [descriptionModalData, setdescriptionModalData] = useState(props.descriptionEnglish)
    const [descriptionLang, setdescriptionLang] = useState("English")
    const closeHandler = () => {
        props.setshowGeneralInstModal(false)
        console.log("closed");
    };
    const changeLanguage = () => {
        if (descriptionLang == "English") {
            setdescriptionLang("Hindi");
            setdescriptionModalData(props.descriptionHindi);
        } else {
            setdescriptionLang("English");
            setdescriptionModalData(props.descriptionEnglish);
        }
    }

    return (
        <div>
            <Modal
            fullScreen={props.isMobile ? true:false}
                width='900px'
                closeButton
                blur
                aria-labelledby="modal-title"
                open={props.showGeneralInstModal}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" b size={18}>
                        {descriptionLang == "Hindi" ? "निर्देश हिंदी में" : "Instruction In English"}
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    {descriptionModalData.length > 0 ?
                        descriptionModalData.map((desc, id) => {
                            return (
                                <Text key={id} css={{ tt: "capitalize", letterSpacing: "1px" }}>{id + 1} . {desc}</Text>
                            )
                        }) : <Text css={{ tt: "capitalize", letterSpacing: "1px" }} color="error" b>No Description Found</Text>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button auto color="primary" onClick={() => { changeLanguage() }}>
                        {descriptionLang == "Hindi" ? "Instruction In English" : "निर्देश हिंदी में"}
                    </Button>

                    <Button auto flat color="error" onClick={closeHandler}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal></div>
    )
}
