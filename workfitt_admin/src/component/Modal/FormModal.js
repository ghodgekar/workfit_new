import React from 'react';
import { Modal, Button, Text, Input, Row, Spacer, Col, Loading, Dropdown, Textarea } from "@nextui-org/react";
import { UnLockIcon } from "../Icons/UnLockIcon";
import { LockIcon } from "../Icons/LockIcon";



export default function FormModal(props) {

    return (
        <div>
            <Modal
                width={props.width ? props.width : "700px"}
                closeButton
                aria-labelledby="modal-title"
                open={props.isAddFormVisible}
                onClose={props.closeModalHandler}
            >

                <Modal.Header>
                    <Text b size={18} css={{ textGradient: "45deg, $blue600 -10%, $pink600 60%", }} >
                        {props.formTitle}
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    {props.InputArray.map((inputElementArr, key) => {

                        return (
                            <Row key={key}>
                                {inputElementArr.map((inputElement, id) => {
                                    console.log("inputElement?.selectedValue", inputElement?.selectedValue)
                                    switch (inputElement.type) {
                                        case "text": return (
                                            <Col key={id}>
                                                <Input
                                                    type={inputElement.inputType ? inputElement.inputType : "text"}
                                                    label={inputElement.label}
                                                    clearable={inputElement.clearable ? true : false}
                                                    placeholder={inputElement.placeholder}
                                                    value={inputElement.value}
                                                    onChange={inputElement.onChange}
                                                />
                                                {inputElement.errors.isError && (<Text small size={10} css={{ letterSpacing: "1px" }} color="error">{inputElement.errors.msg}</Text>)}
                                            </Col>
                                        )
                                        case "dropdown": return (
                                            <Col>
                                                <label className='dropdownLabel'>{inputElement.label}</label>
                                                <Dropdown>
                                                    <Dropdown.Button color="default" light css={{ tt: "capitalize", background: "#f5f5f5" }}>{inputElement?.selectedValue ? inputElement?.selectedValue : (inputElement.options && inputElement.options.length > 0) ? "Please Select A Option" : "No Options Available"}</Dropdown.Button>
                                                    <Dropdown.Menu
                                                        aria-label="Dynamic Actions"
                                                        items={inputElement.options}
                                                        disallowEmptySelection
                                                        color="success"
                                                        selectionMode={inputElement.selectionMode ? inputElement.selectionMode : "single"}
                                                        selectedKeys={inputElement.selectedOption}
                                                        onSelectionChange={inputElement.setselectedOption}
                                                    >
                                                        {(item) => (
                                                            <Dropdown.Item

                                                                key={item.label}
                                                                css={{ tt: "capitalize" }}
                                                            >
                                                                {item.label}
                                                            </Dropdown.Item>
                                                        )}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                {inputElement.errors.isError && (<Text small size={10} css={{ letterSpacing: "1px" }} color="error">{inputElement.errors.msg}</Text>)}
                                            </Col>
                                        )

                                        case "textarea": return (
                                            <Col key={id}>
                                                <Textarea
                                                    bordered
                                                    color="default"
                                                    label={inputElement.label}
                                                    placeholder={inputElement.placeholder}
                                                    minRows={inputElement.minRows ? inputElement.minRows : 4}
                                                    maxRows={inputElement.maxRows ? inputElement.maxRows : 20}
                                                    onChange={inputElement.onChange}
                                                    value={inputElement.value}
                                                    helperText={inputElement.errors.isError && (
                                                        <Text small size={10} css={{ letterSpacing: "1px" }} color="error">
                                                            {inputElement.errors.msg}
                                                        </Text>
                                                    )
                                                    }
                                                />

                                            </Col>
                                        )
                                        case "password": return (
                                            <Col key={id}>
                                                <Input.Password
                                                    label={inputElement.label}
                                                    clearable={inputElement.clearable ? true : false}
                                                    placeholder={inputElement.placeholder}
                                                    value={inputElement.value}
                                                    onChange={inputElement.onChange}
                                                    visibleIcon={<UnLockIcon fill="currentColor" />}
                                                    hiddenIcon={<LockIcon fill="currentColor" />}
                                                />
                                                {inputElement.errors.isError && (<Text small size={10} css={{ letterSpacing: "1px" }} color="error">{inputElement.errors.msg}</Text>)}
                                            </Col>
                                        )


                                    }

                                })}
                            </Row>
                        )
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={props.closeModalHandler}> Close </Button>
                    <Button auto onClick={() => { props.onFormSubmit(props.isEditMode ? "update" : "add") }}> {props.submitText} </Button>
                </Modal.Footer>

            </Modal>
        </div>
    )
}
