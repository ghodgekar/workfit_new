import { Text, Modal, Button } from '@nextui-org/react';
import React from 'react'

export default function DescriptionModal(props) {
    const closeHandler = () => {
        props.setshowDescriptionModal(false)
        console.log("closed");
    };
    return (
        <div>
            <Modal
                width='900px'
                closeButton
                blur
                aria-labelledby="modal-title"
                open={props.showDescriptionModal}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title"  b size={18}>
                        Description in {props.descriptionLang}
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    {props.descriptionModalData.length > 0 ?
                        props.descriptionModalData.map((desc, id) => {
                            return (
                                <Text key={id} css={{tt: "capitalize", letterSpacing:"1px"}}>{id+1} . {desc}</Text>
                                )
                        }) : <Text  css={{tt: "capitalize", letterSpacing:"1px"}} color="error" b>No Description Found</Text>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={closeHandler}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal></div>
    )
}
