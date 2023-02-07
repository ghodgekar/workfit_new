import React, { useState, useEffect } from 'react'
import { Tooltip, Text, Switch } from "@nextui-org/react";
import ViewDataTable from "../../component/ViewDataTable";
import { StyledBadge } from "../../component/Icons/StyledBadge";
import { IconButton } from "../../component/Icons/IconButton";
import { EditIcon } from "../../component/Icons/EditIcon";
import { DeleteIcon } from "../../component/Icons/DeleteIcon";
import FormModal from "../../component/Modal/FormModal";

import updateExercise from '../../api/Exercise_Api/updateExercise';
import exerciseList from '../../api/Exercise_Api/exerciseList';
import deleteExercise from '../../api/Exercise_Api/deleteExercise';
import addExercise from '../../api/Exercise_Api/addExercise';

import getInstructionByType from '../../api/Instruction_Api/getInstructionByType';
import bodyPartList from '../../api/Body_Part_Api/bodyPartList';
import videoList from '../../api/Video_Api/videoList';

const columns = [
    { name: "Execise Name", uid: "exercise_name" },
    { name: "Reps", uid: "exercise_reps" },
    { name: "Holds", uid: "exercise_holds" },
    { name: "Sets", uid: "exercise_sets" },
    { name: "Rests", uid: "exercise_rests" },
    { name: "Time", uid: "exercise_time" },
    { name: "Multi-directional", uid: "isMultidirectional" },
    { name: "Body Part", uid: "body_part_name" },
    { name: "Instruction", uid: "instruction_name" },
    { name: "Video ", uid: "video_name" },
    { name: "Status", uid: "status" },
    { name: "Actions", uid: "actions" },
];

const getErrorObj = () => {
    let clone = {}; // the new empty object
    let errorObject = {
        "exercise_name": { isError: false, msg: "Please Enter Exercise Name" },
        "exercise_reps": { isError: false, msg: "Please Enter Exercise Reps" },
        "exercise_holds": { isError: false, msg: "Please Enter Exercise Holds" },
        "exercise_sets": { isError: false, msg: "Please Enter Exercise Sets" },
        "exercise_rests": { isError: false, msg: "Please Enter Exercise Rest" },
        "body_part_name": { isError: false, msg: "Please Select Body Part" },
        "instruction_name": { isError: false, msg: "Please Select A Instruction" },
        "video_name": { isError: false, msg: "Please Select A Video" },
        "isMultidirectional": { isError: false, msg: "Please Select Multidirectional" },
        "exercise_time": { isError: false, msg: "Please Enter Exercise Time" },
        "isTimeControlled": { isError: false, msg: "Please Enter is Exercise Time Controlled" }
    }
    // let's copy all error properties into it
    for (let key in errorObject) {
        clone[key] = errorObject[key];
    }
    return clone
}
let err = getErrorObj()
const dataRefObj = {
    "exercise_name": '',
    "exercise_reps": 0,
    "exercise_holds": 0,
    "exercise_sets": 0,
    "exercise_rests": 0,
    "body_part_name": "",
    "instruction_name": "",
    "video_name": "",
    "isMultidirectional": 0,
    "exercise_time": 0,
    "isTimeControlled": 0,
    "errors": { ...err }
}

let defaultSelectedOption = { value: "", label: "" }

let MultiDirectionOption = [{ value: 1, label: "Yes" }, { value: 0, label: "No" }]
let TimeControlOption = [{ value: 1, label: "Yes" }, { value: 0, label: "No" }]

export default function Exercise() {
    const [Data, setData] = useState([])
    const [isAddFormVisible, setisAddFormVisible] = useState(false);
    const [isEditMode, setisEditMode] = useState(false);
    const [dataObj, setdataObj] = useState({ ...dataRefObj })

    const [instOptions, setinstOptions] = useState([])
    const [selectedInstOption, setselectedInstOption] = useState(new Set([]))
    const selectedInstValue = React.useMemo(
        () => {
            setdataObj(dataObj => {
                return {
                    ...dataObj,
                    errors: {
                        ...dataObj.errors,
                        instruction_name: {
                            ...dataObj.errors.instruction_name,
                            isError: false
                        }
                    }
                }
            })
            return Array.from(selectedInstOption).join(", ").replaceAll("_", " ")
        },
        [selectedInstOption]
    );

    const [bodyPartIdOptions, setbodyPartIdOptions] = useState([])
    const [SelectedBodyPartId, setSelectedBodyPartId] = useState(new Set([]))
    const selectedPartIdValue = React.useMemo(
        () => {
            setdataObj(dataObj => {
                return {
                    ...dataObj,
                    errors: {
                        ...dataObj.errors,
                        body_part_name: {
                            ...dataObj.errors.body_part_name,
                            isError: false
                        }
                    }
                }
            })
            return Array.from(SelectedBodyPartId).join(", ").replaceAll("_", " ")
        },
        [SelectedBodyPartId]
    );

    const [videoOptions, setvideoOptions] = useState([])
    const [SelectedVideo, setSelectedVideo] = useState(new Set([]))
    const selectedVideoValue = React.useMemo(
        () => {
            setdataObj(dataObj => {
                return {
                    ...dataObj,
                    errors: {
                        ...dataObj.errors,
                        video_name: {
                            ...dataObj.errors.video_name,
                            isError: false
                        }
                    }
                }
            })
            return Array.from(SelectedVideo).join(", ").replaceAll("_", " ")
        },
        [SelectedVideo]
    );


    const [SelectedMultiDirection, setSelectedMultiDirection] = useState(new Set([]))

    const selectedMultiDirectionValue = React.useMemo(
        () => {
            setdataObj(dataObj => {
                return {
                    ...dataObj,
                    errors: {
                        ...dataObj.errors,
                        isMultidirectional: {
                            ...dataObj.errors.isMultidirectional,
                            isError: false
                        }
                    }
                }
            })
            return Array.from(SelectedMultiDirection).join(", ").replaceAll("_", " ")
        },
        [SelectedMultiDirection]
    );

    const [SelectedTimeControl, setSelectedTimeControl] = useState(new Set([]))

    const selectedTimeControlValue = React.useMemo(
        () => {
            setdataObj(dataObj => {
                return {
                    ...dataObj,
                    errors: {
                        ...dataObj.errors,
                        isTimeControlled: {
                            ...dataObj.errors.isTimeControlled,
                            isError: false
                        }
                    }
                }
            })
            return Array.from(SelectedTimeControl).join(", ").replaceAll("_", " ")
        },
        [SelectedTimeControl]
    );

    const InputArray = [
        [
            {
                type: "text",
                inputType: "text",
                label: "Exercise Name",
                value: dataObj.exercise_name,
                placeholder: "Enter Exercise Name",
                onChange: (e) => {
                    setdataObj(dataObj => {
                        return {
                            ...dataObj,
                            exercise_name: e.target.value,
                            errors: {
                                ...dataObj.errors,
                                exercise_name: {
                                    ...dataObj.errors.exercise_name,
                                    isError: false
                                }
                            }
                        }
                    })
                },
                errors: dataObj.errors.exercise_name
            },
            {
                type: "dropdown",
                label: "Targeted Body Part",
                options: bodyPartIdOptions,
                selectedValue: selectedPartIdValue,
                selectionMode: "single",
                selectedOption: SelectedBodyPartId,
                setselectedOption: setSelectedBodyPartId,
                errors: dataObj.errors.body_part_name
            },
        ],
        [
            {
                type: "text",
                inputType: "number",
                label: "Reps",
                value: dataObj.exercise_reps,
                placeholder: "Enter Exercise Reps",
                clearable: false,
                onChange: (e) => {
                    setdataObj(dataObj => {
                        return {
                            ...dataObj,
                            exercise_reps: e.target.value,
                        }
                    })
                },
                errors: dataObj.errors.exercise_reps
            },
            {
                type: "text",
                inputType: "number",
                label: "Holds",
                value: dataObj.exercise_holds,
                placeholder: "Enter Exercise Holds",
                clearable: false,
                onChange: (e) => {
                    setdataObj(dataObj => {
                        return {
                            ...dataObj,
                            exercise_holds: e.target.value,
                        }
                    })
                },
                errors: dataObj.errors.exercise_holds
            }
        ],
        [
            {
                type: "text",
                inputType: "number",
                label: "Sets",
                value: dataObj.exercise_sets,
                placeholder: "Enter Exercise Sets",
                clearable: false,
                onChange: (e) => {
                    setdataObj(dataObj => {
                        return {
                            ...dataObj,
                            exercise_sets: e.target.value,
                        }
                    })
                },
                errors: dataObj.errors.exercise_sets
            },
            {
                type: "text",
                inputType: "number",
                label: "Rests",
                value: dataObj.exercise_rests,
                placeholder: "Enter Exercise Rests",
                clearable: false,
                onChange: (e) => {
                    setdataObj(dataObj => {
                        return {
                            ...dataObj,
                            exercise_rests: e.target.value,
                        }
                    })
                },
                errors: dataObj.errors.exercise_rests
            }
        ],
        [
            {
                type: "dropdown",
                label: "Instruction Name",
                options: instOptions,
                selectedValue: selectedInstValue,
                selectionMode: "single",
                selectedOption: selectedInstOption,
                setselectedOption: setselectedInstOption,
                errors: dataObj.errors.instruction_name
            },
            {
                type: "dropdown",
                label: "Video Name",
                options: videoOptions,
                selectedValue: selectedVideoValue,
                selectionMode: "single",
                selectedOption: SelectedVideo,
                setselectedOption: setSelectedVideo,
                errors: dataObj.errors.video_name
            }
        ],
        [
            {
                type: "dropdown",
                label: "Is Time Controlled",
                options: TimeControlOption,
                selectedValue: selectedTimeControlValue,
                selectionMode: "single",
                selectedOption: SelectedTimeControl,
                setselectedOption: setSelectedTimeControl,
                errors: dataObj.errors.isTimeControlled
            },
            {
                type: "text",
                inputType: "number",
                label: "Exercise Time",
                value: dataObj.exercise_time,
                placeholder: "Enter Exercise Time",
                clearable: false,
                onChange: (e) => {
                    setdataObj(dataObj => {
                        return {
                            ...dataObj,
                            exercise_time: e.target.value,
                        }
                    })
                },
                errors: dataObj.errors.exercise_time
            }
        ],

        [
            {
                type: "dropdown",
                label: "Is Multidirectional",
                options: MultiDirectionOption,
                selectedValue: selectedMultiDirectionValue,
                selectionMode: "single",
                selectedOption: SelectedMultiDirection,
                setselectedOption: setSelectedMultiDirection,
                errors: dataObj.errors.isMultidirectional
            }
        ]
    ]



    useEffect(() => {
        async function fetchData() {
            let instResp = await getInstructionByType("exercise")
            console.log("instResp", instResp);
            if (instResp.data) {
                setinstOptions(instResp.data)
            }

            let bodyIdResp = await bodyPartList("dropdown")
            console.log("bodyIdResp", bodyIdResp);
            if (bodyIdResp.data) {
                setbodyPartIdOptions(bodyIdResp.data)
            }

            let videoResp = await videoList({ callFor: "dropdown" })
            console.log("videoResp", videoResp);
            if (videoResp.data) {
                setvideoOptions(videoResp.data)
            }

            await callListFunction()
        }
        fetchData();
    }, []);

    const callListFunction = async () => {
        const Response = await exerciseList()
        console.log("data", Response);
        setData(Response?.data);
    }

    const deleteFunc = async (data) => {
        let request = {
            "exercise_id": data.exercise_id,
        }
        let response = await deleteExercise(request)
        console.log("response", response);
        if (response.status) {
            await callListFunction()
        }
    }

    const onAddClick = () => {
        resetDropdownValues()
        setisEditMode(false)
        setisAddFormVisible(true);
        console.log("add click");
    };

    const resetDropdownValues = () => {
        setselectedInstOption(new Set([]))
        setSelectedBodyPartId(new Set([]))
        setSelectedVideo(new Set([]))
        setSelectedTimeControl(new Set([]))
        setSelectedMultiDirection(new Set([]))
    }

    const closeModalHandler = () => {
        resetDropdownValues()
        setdataObj({ ...dataRefObj })
        setisAddFormVisible(false);
        setisEditMode(false)
        // console.log("closed");
    };

    async function toggleActiveStatus(data) {
        let request = {
            "exercise_id": data.exercise_id,
            "isActive": data.isActive ? 0 : 1
        }
        await updateApiCall(request)
    }

    async function updateApiCall(request) {
        let response = await updateExercise(request)
        // console.log("response", response);
        if (response.status) await callListFunction()
    }

    const openUpdateForm = (data) => {
        console.log("update form", data)
        setselectedInstOption(new Set([data.instruction_name]))
        setSelectedBodyPartId(new Set([data.body_part_name]))
        setSelectedVideo(new Set([data.video_name]))
        setSelectedMultiDirection(new Set([data.isMultidirectional ? "Yes" : "No"]))
        setSelectedTimeControl(new Set([data.isTimeControlled ? "Yes" : "No"]))
        delete data.isActive;
        let errorObj = getErrorObj()
        data.errors = { ...errorObj };
        setdataObj(data)
        setisAddFormVisible(true);
        setisEditMode(true)
    }

    const handleFormSubmit = async (type) => {
        let validate = await validateForm()
        console.log("validate", validate);
        if (validate.noError) {

            let request = {
                "exercise_name": dataObj.exercise_name,
                "exercise_reps": parseInt(dataObj.exercise_reps),
                "exercise_holds": parseInt(dataObj.exercise_holds),
                "exercise_sets": parseInt(dataObj.exercise_sets),
                "exercise_rests": parseInt(dataObj.exercise_rests),
                "exercise_body_part_id": validate.bodyPartId,
                "exercise_video_id": validate.videoId,
                "exercise_instruction_id": validate.instructionId,
                "exercise_time": parseInt(dataObj.exercise_time),
                "isMultidirectional": validate.MultiDirection,
                "isTimeControlled": validate.isTimeControlled,
            }

            delete request.errors
            if (type == "add") {
                let resp = await addExercise(request)
                if (resp.status) await callListFunction()
            }
            if (type == "update") {
                request.exercise_id = dataObj.exercise_id
                await updateApiCall(request)
            }
            resetDropdownValues()
            setdataObj({ ...dataRefObj })
            setisAddFormVisible(false);
            setisEditMode(false)
        }
    }

    const validateForm = async () => {
        let errorObj = await getErrorObj()
        setdataObj((dataObj) => {
            return {
                ...dataObj,
                errors: { ...errorObj }
            }
        })

        let bodyPartIdObj = selectedPartIdValue ? bodyPartIdOptions.find(o => o.label == selectedPartIdValue) : "";
        let bodyPartId = bodyPartIdObj.value
        let instructionIdObj = selectedInstValue ? instOptions.find(o => o.label == selectedInstValue) : "";
        let instructionId = instructionIdObj.value
        let videoIdObj = selectedVideoValue ? videoOptions.find(o => o.label == selectedVideoValue) : "";
        let videoId = videoIdObj.value
        let MultiDirectionObj = selectedMultiDirectionValue ? MultiDirectionOption.find(o => o.label == selectedMultiDirectionValue) : "";
        let MultiDirection = MultiDirectionObj.value
        let isTimeControlledObj = selectedTimeControlValue ? TimeControlOption.find(o => o.label == selectedTimeControlValue) : "";
        let isTimeControlled = isTimeControlledObj.value
        let errObj = { ...errorObj }
        let isError = false
        if (!dataObj.exercise_name) {
            isError = true
            errObj.exercise_name.isError = true
        }
        if (!bodyPartId) {
            isError = true
            errObj.body_part_name.isError = true
        }
        if (!instructionId) {
            isError = true
            errObj.instruction_name.isError = true
        }
        if (!videoId) {
            isError = true
            errObj.video_name.isError = true
        }
        if (isError) {
            setdataObj((dataObj) => {
                return {
                    ...dataObj,
                    errors: { ...errObj }
                }
            })
        }
        return { noError: !isError, bodyPartId, instructionId, videoId, MultiDirection, isTimeControlled }
    }

    const renderCell = (data, columnKey) => {
        // console.log({data});
        // console.log({ columnKey });
        let cellValue = data[columnKey];
        // console.log({cellValue});
        switch (columnKey) {

            case "exercise_name":
                return (
                    <Text size={12} css={{ tt: "capitalize" }}>
                        {data.exercise_name}
                    </Text>
                );

            case "exercise_reps":
                return (
                    <Text size={12} css={{ tt: "capitalize", }} >
                        {data.exercise_reps}
                    </Text>
                )

            case "exercise_holds":
                return (
                    <Text size={12} css={{ tt: "capitalize", }} >
                        {data.exercise_holds}
                    </Text>
                )

            case "exercise_sets":
                return (
                    <Text size={12} css={{ tt: "capitalize", }} >
                        {data.exercise_sets}
                    </Text>
                )

            case "exercise_rests":
                return (
                    <Text size={12} css={{ tt: "capitalize", }} >
                        {data.exercise_rests}
                    </Text>
                )

            case "exercise_time":
                return (
                    <Text size={12} css={{ tt: "capitalize", }} >
                        {data.exercise_time}
                    </Text>
                )

            case "isMultidirectional":
                return (
                    <Text size={12} css={{ tt: "capitalize", }} >
                        {data.isMultidirectional ? "Yes" : "No"}
                    </Text>
                )

            case "body_part_name":
                return (
                    <Text size={12} css={{ tt: "capitalize" }}>
                        {data.body_part_name}
                    </Text>
                );

            case "instruction_name":
                return (
                    <Text size={12} css={{ tt: "capitalize" }}>
                        {data.instruction_name}
                    </Text>
                );

            case "video_name":
                return (
                    <Text size={12} css={{ tt: "capitalize" }}>
                        {data.video_name}
                    </Text>
                );

            case "status":
                return <StyledBadge type={data.isActive ? "active" : "inActive"}>{data.isActive ? "Active" : "In-Active"}</StyledBadge>;

            case "actions":
                return (
                    <div className="action_col">
                        <Tooltip content="Edit Exercise">
                            <IconButton onClick={() => { openUpdateForm(data) }}>
                                <EditIcon size={16} fill="#979797" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip
                            content="Delete Exercise"
                            color="error"
                            onClick={() => { deleteFunc(data) }}
                        >
                            <IconButton >
                                <DeleteIcon size={16} fill="#FF0080" />
                            </IconButton>
                        </Tooltip>
                        <Switch size="xs" color="success" shadow checked={data.isActive ? true : false} onChange={() => { toggleActiveStatus(data) }} />
                    </div>

                );
            default:
                return cellValue;
        }
    };



    return (
        <>
            {/* Add New Exercise */}
            {isAddFormVisible &&
                <FormModal
                    // width={"300px"}
                    setisAddFormVisible={setisAddFormVisible}
                    isAddFormVisible={isAddFormVisible}
                    formTitle={isEditMode ? "Update Exercise" : "Add Exercise"}
                    onFormSubmit={handleFormSubmit}
                    submitText={isEditMode ? "Update Exercise" : "Add Exercise"}
                    InputArray={InputArray}
                    closeModalHandler={closeModalHandler}
                    isEditMode={isEditMode}
                />}
            {/* Add New Exercise */}

            <div className="table">
                <div className="table_header">
                    <h4><i>Exercise Details</i></h4>
                    <div>
                        <button className="add_new" onClick={() => { onAddClick(); }} > {" "} + Add New </button>
                    </div>
                </div>
                {Data && Data.length > 0 ?
                    <ViewDataTable
                        columns={columns}
                        dataArr={Data}
                        renderCell={renderCell}
                    />
                    : <Text color="red" >No Result Found</Text>
                }

            </div>
        </>
    )
}
