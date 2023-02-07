import React from 'react'
import config from "../../../config/config.json";
import { Modal, Button, Text, Input, Row, Spacer } from "@nextui-org/react";

export default function UpdateDoctor(props) {
    const { setlogo, editlogo, visible, closeHandler, userDetails, setuserDetails, editsign, setsign, seteditsign, seteditlogo, SubmitEditData } = props
    return (
        <Modal
            width="700px"
            closeButton
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeHandler}
        >
            <Modal.Header>
                <Text id="modal-title" size={18}> Here you can Update{" "}
                    <Text b size={18}> Doctor Details </Text>
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Input
                        label="Name:"
                        clearable
                        bordered
                        fullWidth
                        value={userDetails.doctor_name}
                        onChange={(e) => {
                            //setname(e.target.value);
                            setuserDetails((userDetails) => {
                                return {
                                    ...userDetails, doctor_name: e.target.value
                                }
                            })
                        }}
                        color="primary"
                        size="lg"
                        placeholder="Name"
                    // contentLeft={<Mail fill="currentColor" />}
                    />
                    <Spacer y={0.5} />
                    <Input
                        label="Username:"
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Username"
                        value={userDetails.doctor_username}
                        onChange={(e) => {
                            // setusername(e.target.value);
                            setuserDetails((userDetails) => {
                                return {
                                    ...userDetails, doctor_username: e.target.value
                                }
                            })
                        }}
                    // contentLeft={<Password fill="currentColor" />}
                    />
                </Row>

                <Row>
                    <Input
                        label="Email:"
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Email"
                        value={userDetails.doctor_email}
                        onChange={(e) => {
                            //  setemail(e.target.value);
                            setuserDetails((userDetails) => {
                                return {
                                    ...userDetails, doctor_email: e.target.value
                                }
                            })
                        }}
                    // contentLeft={<Mail fill="currentColor" />}
                    />
                    <Spacer y={0.5} />
                    <Input
                        label="Active:"
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Active"
                        value={userDetails.isActive}
                        onChange={(e) => {
                            // setactive(e.target.value);
                            setuserDetails((userDetails) => { return { ...userDetails, isActive: e.target.value } })
                        }}
                    // contentLeft={<Password fill="currentColor" />}
                    />
                </Row>

                <Row>
                    <Input
                        label="Education Degree:"
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Degree."
                        value={userDetails.doctor_degree}
                        onChange={(e) => {
                            // seteducation(e.target.value);
                            setuserDetails((userDetails) => { return { ...userDetails, doctor_degree: e.target.value } })
                        }}
                    // contentLeft={<Mail fill="currentColor" />}
                    />
                    <Spacer y={0.5} />
                    <Input
                        label="Specialisation:"
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="specialisation"
                        value={userDetails.specialisation}
                        onChange={(e) => {
                            // setspcialization(e.target.value);
                            setuserDetails((userDetails) => {
                                return {
                                    ...userDetails, specialisation: e.target.value
                                }
                            })
                        }}
                    // contentLeft={<Password fill="currentColor" />}
                    />
                </Row>

                <Row>
                    {editlogo ? (
                        <Input
                            id="logo"
                            label="Logo:"
                            clearable
                            bordered
                            fullWidth
                            type="file"
                            color="primary"
                            size="lg"
                            placeholder="logo"
                            //   value={`${config.backend_url}/uploads/images/${logo}`}
                            onChange={(e) => { setlogo(e.target.value); }}
                        // contentLeft={<Mail fill="currentColor" />}
                        />
                    ) : (
                        <>
                            <div className="div-label">
                                <label className="logo-label">Logo:</label>
                                <img
                                    className="logoimg"
                                    src={`${config.backend_url}/uploads/images/${userDetails.doctor_logo}`}
                                    onClick={() => { seteditlogo(true); }}
                                />
                            </div>
                        </>
                    )}

                    <Spacer y={0.5} />
                    {editsign ? (
                        <Input
                            label="Sign:"
                            clearable
                            bordered
                            fullWidth
                            type="file"
                            color="primary"
                            size="lg"
                            placeholder="sign"
                            onChange={(e) => { setsign(e.target.value); }}
                        // contentLeft={<Password fill="currentColor" />}
                        />
                    ) : (
                        <>
                            <div className="div-label">
                                <label className="logo-label">Sign:</label>
                                <img
                                    className="logoimg"
                                    src={`${config.backend_url}/uploads/images/${userDetails.doctor_sign}`}
                                    onClick={() => { seteditsign(true); }}
                                />
                            </div>
                        </>
                    )}
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button auto flat color="error" onClick={closeHandler}> Close </Button>
                <Button auto onClick={SubmitEditData}> Submit </Button>
            </Modal.Footer>
        </Modal>
    )
}
