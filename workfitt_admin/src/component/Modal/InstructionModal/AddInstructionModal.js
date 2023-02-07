import React, { useState } from 'react'
import { Modal, Button, Text, Input, Row, Spacer, Col } from "@nextui-org/react";
import config from "../../../config/config.json";
import "./Instruction.css"

import { IconButton } from "../../Icons/IconButton";

import { DeleteIcon } from "../../Icons/DeleteIcon";


export default function AddInstructionModal(props) {
    const [instruction_english, setinstruction_english] = useState("")
    const [instruction_hindi, setinstruction_hindi] = useState("")
    const [instruction_marathi, setinstruction_marathi] = useState("")

    const addInstruction = (lang) => {
        if (lang == "english") {
            if (instruction_english) {
                // console.log("i am hereee ", props.instructionObj.description_english.length)
                props.setinstructionObj(instructionObj => {
                    // console.log("instructionObj", instructionObj)
                    let arr = instructionObj.description_english
                    arr.push(instruction_english)
                    return {
                        ...instructionObj,
                        description_english: arr
                    }
                })
                setinstruction_english("")
            }
        }
        if (lang == "marathi") {
            if (instruction_marathi) {
                // console.log("i am hereee ", props.instructionObj.description_english.length)
                props.setinstructionObj(instructionObj => {
                    // console.log("instructionObj", instructionObj)
                    let arr = instructionObj.description_marathi
                    arr.push(instruction_marathi)
                    return {
                        ...instructionObj,
                        description_marathi: arr
                    }
                })
                setinstruction_marathi("")
            }
        }
        if (lang == "hindi") {
            if (instruction_hindi) {
                // console.log("i am hereee ", props.instructionObj.description_english.length)
                props.setinstructionObj(instructionObj => {
                    // console.log("instructionObj", instructionObj)
                    let arr = instructionObj.description_hindi
                    arr.push(instruction_hindi)
                    return {
                        ...instructionObj,
                        description_hindi: arr
                    }
                })
                setinstruction_hindi("")
            }
        }
    }

    const removeInstruction = (lang, index) => {
        if (lang == "english") {
            props.setinstructionObj(instructionObj => {
                // console.log("instructionObj", instructionObj)
                let arr = instructionObj.description_english
                // console.log("before",arr);
                arr.splice(index, 1)
                // console.log("index",index);
                // console.log("after",arr);
                return {
                    ...instructionObj,
                    description_english: arr
                }
            })
        }
        if (lang == "marathi") {
            props.setinstructionObj(instructionObj => {
                // console.log("instructionObj", instructionObj)
                let arr = instructionObj.description_marathi
                arr.splice(index, 1)
                return {
                    ...instructionObj,
                    description_marathi: arr
                }
            })
        }
        if (lang == "hindi") {
            props.setinstructionObj(instructionObj => {
                // console.log("instructionObj", instructionObj)
                let arr = instructionObj.description_hindi
                arr.splice(index, 1)
                return {
                    ...instructionObj,
                    description_hindi: arr
                }
            })
        }
    }

    return (
        <div>
            <Modal
                width="700px"
                closeButton
                aria-labelledby="modal-title"
                open={props.isAddFormVisible}
                onClose={props.closeModalHandler}
            >

                <Modal.Header>
                    <Text b size={18} css={{ textGradient: "45deg, $blue600 -10%, $pink600 60%", }} >
                    {props.isEditMode ? "Update" : "Add"} Instruction
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Input label="Instruction Name" clearable placeholder="Instruction Name"
                                value={props.instructionObj.instruction_name}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        props.setinstructionObj(instructionObj => {
                                            return {
                                                ...instructionObj,
                                                instruction_name: e.target.value,
                                                errors: {
                                                    ...instructionObj.errors,
                                                    instruction_name: {
                                                        ...instructionObj.errors.instruction_name,
                                                        isError: false
                                                    }
                                                }
                                            }
                                        })
                                    }
                                }
                                }
                            />

                            {props.instructionObj.errors.instruction_name.isError && (<Text small size={10} css={{ letterSpacing: "1px" }} color="error">{props.instructionObj.errors.instruction_name.msg}</Text>)}
                        </Col>
                        <Col>
                            {/* <Input label="Instruction Type" clearable placeholder="Instruction Type"
                                value={props.instructionObj.instruction_type} onChange={(e) => {
                                    props.setinstructionObj(instructionObj => {
                                        return {
                                            ...instructionObj,
                                            instruction_type: e.target.value,
                                            errors: {
                                                ...instructionObj.errors,
                                                instruction_type: {
                                                    ...instructionObj.errors.instruction_type,
                                                    isError: false
                                                }
                                            }
                                        }
                                    })
                                }}
                            /> */}
                            <label for="inst_type" className='dropdownLabel'>Instruction Type</label>
                            <div className='dropdownSelect' label="Instruction Type" onClick={() => { props.setShowMenu(!props.ShowMenu) }} >{props.selectedOption.label ? props.selectedOption.label : "Please Select A Option"}</div>
                            {props.ShowMenu &&
                                <div className='dropdownMenu'>
                                    {props.dropdownOptions.map((option) => {
                                        return (
                                            <span className="dropdownOption" onClick={() => { props.handleOptionSelect(option) }}>{option.label}</span>
                                        )
                                    })
                                    }
                                </div>
                            }

                            {props?.instructionObj?.errors?.instruction_type?.isError && (<Text small size={10} css={{ letterSpacing: "1px" }} color="error">{props?.instructionObj?.errors?.instruction_type?.msg}</Text>)}
                        </Col>
                    </Row>

                    {/* Instruction English */}
                    <Row>
                        <Col>
                            <Input label="Description English"  placeholder="Description English"
                                value={instruction_english}
                                onChange={(e) => { setinstruction_english(e.target.value) }}
                                contentClickable
                                contentLeft={
                                    <Text b small css={{ tt: "capitalize", color: "$blue500" }} size={10} onClick={() => { addInstruction("english") }}>
                                        Add
                                    </Text>
                                }
                            />
                            {props.instructionObj?.errors?.description_english?.isError && (<Text small size={10} css={{ letterSpacing: "1px" }} color="error">{props?.instructionObj?.errors?.description_english?.msg}</Text>)}
                        </Col>
                        <Col>
                            <div className='description_list'>
                                <Text >Description English</Text>
                                {
                                    props?.instructionObj?.description_english.map((desc, key) => {
                                        return (
                                            <Text className="desc_list_item" size={12} key={key} >{key + 1} . {desc}
                                                <IconButton onClick={() => { removeInstruction("english", key) }}>
                                                    <DeleteIcon size={16} fill="#FF0080" />
                                                </IconButton>
                                            </Text>
                                        )
                                    })
                                }
                            </div>
                        </Col>
                    </Row>
                    {/* Instruction English */}


                    {/* Instruction Marathi */}
                    <Row>
                        <Col>
                            <Input label="Description Marathi" placeholder="Description Marathi"
                                value={instruction_marathi}
                                onChange={(e) => { setinstruction_marathi(e.target.value) }}
                                contentClickable
                                contentLeft={
                                    <Text b small css={{ tt: "capitalize", color: "$blue500" }} size={10} onClick={() => { addInstruction("marathi") }}>
                                        Add
                                    </Text>
                                }
                            />
                            {props?.instructionObj?.errors?.description_marathi?.isError && (<Text small size={10} css={{ letterSpacing: "1px" }} color="error">{props?.instructionObj?.errors?.description_marathi?.msg}</Text>)}
                        </Col>
                        <Col>
                            <div className='description_list'>
                                <Text >Description Marathi</Text>
                                {
                                    props.instructionObj.description_marathi.map((desc, key) => {
                                        return (
                                            <Text className="desc_list_item" size={12} key={key} >
                                                {key + 1} . {desc}
                                                <IconButton onClick={() => { removeInstruction("marathi", key) }}>
                                                    <DeleteIcon size={16} fill="#FF0080" />
                                                </IconButton>
                                            </Text>
                                        )
                                    })
                                }
                            </div>
                        </Col>
                    </Row>
                    {/* Instruction Marathi */}


                    {/* Instruction Hindi */}
                    <Row>
                        <Col>
                            <Input label="Description Hindi" placeholder="Description Hindi"
                                value={instruction_hindi}
                                onChange={(e) => { setinstruction_hindi(e.target.value) }}
                                contentClickable
                                contentLeft={
                                    <Text b small css={{ tt: "capitalize", color: "$blue500" }} size={10}
                                        onClick={() => {
                                            addInstruction("hindi")
                                        }}>
                                        Add
                                    </Text>
                                }
                            />
                            {props?.instructionObj?.errors?.description_hindi?.isError && (<Text small size={10} css={{ letterSpacing: "1px" }} color="error">{props?.instructionObj?.errors?.description_hindi?.msg}</Text>)}
                        </Col>
                        <Col>
                            <div className='description_list'>
                                <Text >Description Hindi</Text>
                                {
                                    props.instructionObj.description_hindi.map((desc, key) => {
                                        return (
                                            <Text className="desc_list_item" size={12} key={key} >
                                                {key + 1} . {desc}
                                                <IconButton onClick={() => { removeInstruction("hindi", key) }}>
                                                    <DeleteIcon size={16} fill="#FF0080" />
                                                </IconButton>
                                            </Text>
                                        )
                                    })
                                }
                            </div>
                        </Col>
                    </Row>
                    {/* Instruction Hindi */}


                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={props.closeModalHandler}> Close </Button>
                    <Button auto onClick={() => { props.submitAddFormHandler(props.isEditMode ? "update" : "add") }}> {props.isEditMode ? "Update" : "Add"} Instruction </Button>
                </Modal.Footer>

            </Modal>
        </div>

    )
}
