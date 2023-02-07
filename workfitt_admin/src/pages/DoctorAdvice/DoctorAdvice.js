import React, { useState, useEffect } from 'react'
import { Tooltip, Text, Switch } from "@nextui-org/react";
import ViewDataTable from "../../component/ViewDataTable";
import { StyledBadge } from "../../component/Icons/StyledBadge";
import { IconButton } from "../../component/Icons/IconButton";
import { EditIcon } from "../../component/Icons/EditIcon";
import { DeleteIcon } from "../../component/Icons/DeleteIcon";
import FormModal from "../../component/Modal/FormModal";

import bodyPartList from '../../api/Body_Part_Api/bodyPartList';
import updateDoctorAdvice from '../../api/Doctor_Advice_Api/updateDoctorAdvice';
import doctorAdviceList from '../../api/Doctor_Advice_Api/doctorAdviceList';
import deleteDoctorAdvice from '../../api/Doctor_Advice_Api/deleteDoctorAdvice';
import addDoctorAdvice from '../../api/Doctor_Advice_Api/addDoctorAdvice';


const columns = [
    { name: "Doctor Advice Name", uid: "advice_name" },
    { name: "Body Part", uid: "advice_body_part_id" },
    { name: "Doctor Advice Type", uid: "advice_type" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
];

const errors = {
    "advice_name": { isError: false, msg: "Please Enter Advice Name" },
    "advice_body_part_id": { isError: false, msg: "Please Select A Body Part" },
    "advice_type": { isError: false, msg: "Please Select A Advice Type" }
}

const getErrorObj = () => {
    let clone = {}; // the new empty object
    let errorObject = {
        "advice_name": { isError: false, msg: "Please Enter Advice Name" },
        "advice_body_part_id": { isError: false, msg: "Please Select A Body Part" },
        "advice_type": { isError: false, msg: "Please Select A Advice Type" }
    }
    // let's copy all user properties into it
    for (let key in errorObject) {
        clone[key] = errorObject[key];
    }
    return clone
}
let err = getErrorObj()

const dataRefObj = {
    "advice_name": "",
    "advice_body_part_id": "",
    "advice_type": "",
    "errors": { ...err }
}

const adviceTypeOptions = [
    { value: "Lab work", label: "Lab work" },
    { value: "imaging", label: "imaging" }
]

let defaultSelectOption = { value: "1", label: "" }
export default function DoctorAdvice() {
    const [Data, setData] = useState([])
    const [isAddFormVisible, setisAddFormVisible] = useState(false);
    const [isEditMode, setisEditMode] = useState(false);
    const [dataObj, setdataObj] = useState({ ...dataRefObj })
    const [bodyPartIdArr, setbodyPartIdArr] = useState([{ ...defaultSelectOption }])
    const [SelectedBodyPartId, setSelectedBodyPartId] = useState(new Set([]))
    const [SelectedAdviceType, setSelectedAdviceType] = useState(new Set([]))

    const selectedValue = React.useMemo(
        () => {
            setdataObj(dataObj => {
                return {
                    ...dataObj,
                    errors: {
                        ...dataObj.errors,
                        advice_body_part_id: {
                            ...dataObj.errors.advice_body_part_id,
                            isError: false
                        }
                    }
                }
            })
            return Array.from(SelectedBodyPartId).join(", ").replaceAll("_", " ")
        },
        [SelectedBodyPartId]
    );
    const AdviceTypeValue = React.useMemo(
        () => {
            setdataObj(dataObj => {
                return {
                    ...dataObj,
                    errors: {
                        ...dataObj.errors,
                        advice_type: {
                            ...dataObj.errors.advice_type,
                            isError: false
                        }
                    }
                }
            })
            return Array.from(SelectedAdviceType).join(", ").replaceAll("_", " ")
        },
        [SelectedAdviceType]
    );

    const InputArray = [
        [
            {
                type: "text",
                inputType: "text",
                label: "Advice Name",
                value: dataObj.advice_name,
                placeholder: "Enter Body Area Name",
                onChange: (e) => {
                    setdataObj(dataObj => {
                        return {
                            ...dataObj,
                            advice_name: e.target.value,
                            errors: {
                                ...dataObj.errors,
                                advice_name: {
                                    ...dataObj.errors.advice_name,
                                    isError: false
                                }
                            }
                        }
                    })
                },
                errors: dataObj.errors.advice_name
            },
            {
                type: "dropdown",
                label: "Targeted Body Part",
                options: bodyPartIdArr,
                selectedValue: selectedValue,
                selectionMode: "single",
                selectedOption: SelectedBodyPartId,
                setselectedOption: setSelectedBodyPartId,
                errors: dataObj.errors.advice_body_part_id
            },
        ],
        [
            {
                type: "dropdown",
                label: "Advice Type",
                options: adviceTypeOptions,
                selectedValue: AdviceTypeValue,
                selectionMode: "single",
                selectedOption: SelectedAdviceType,
                setselectedOption: setSelectedAdviceType,
                errors: dataObj.errors.advice_type
            }
        ]
    ];

    useEffect(() => {
        async function fetchData() {
            let bodyIdResp = await bodyPartList("dropdown")
            console.log("bodyIdResp", bodyIdResp);
            if (bodyIdResp.data) {
                setbodyPartIdArr(bodyIdResp.data)
            }
            await callListFunction()
        }
        fetchData();
    }, []);

    const callListFunction = async () => {
        const Response = await doctorAdviceList()
        console.log("data", Response);
        setData(Response?.data);
        // setInstructionDatacopy(instResp?.data);
    }

    const deleteFunc = async (data) => {
        let request = {
            "advice_id": data.advice_id,
        }
        let response = await deleteDoctorAdvice(request)
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
        setSelectedBodyPartId(new Set([]))
        setSelectedAdviceType(new Set([]))
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
            "advice_id": data.advice_id,
            "isActive": data.isActive ? 0 : 1
        }
        await updateApiCall(request)
    }

    async function updateApiCall(request) {
        let response = await updateDoctorAdvice(request)
        // console.log("response", response);
        if (response.status) await callListFunction()
    }

    const openUpdateForm = (data) => {
        console.log("data advice type",data.advice_type);
        if(data.advice_type!="Lab work"){
        let selectBodyPartIdOpt = bodyPartIdArr.find((o) => { return o.value == data.advice_body_part_id })
        setSelectedBodyPartId(new Set([selectBodyPartIdOpt.label]))
        }else{
            setSelectedBodyPartId(new Set([]))
        }
        setSelectedAdviceType(new Set([data.advice_type]))
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
                ...dataObj,
            };
            console.log("request------------------", request);
            request.advice_body_part_id = validate.bodyPartId
            request.advice_type = validate.adviceType

            delete request.errors
            if (type == "add") {
                let resp = await addDoctorAdvice(request)
                if (resp.status) await callListFunction()
            }
            if (type == "update") {
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

        let bodyPartIdObj = selectedValue ? bodyPartIdArr.find(o => o.label == selectedValue) : "";
        let bodyPartId = bodyPartIdObj.value
        let adviceType = AdviceTypeValue ? AdviceTypeValue : ""
        console.log("dataObj.adjunct_time_type", dataObj.adjunct_time_type);
        let errObj = { ...errorObj }
        let isError = false
        if (!dataObj.advice_name) {
            isError = true
            errObj.advice_name.isError = true
        }
        if (adviceType=="imaging"&&!bodyPartId) {
            isError = true
            errObj.advice_body_part_id.isError = true
        }
        if (!adviceType) {
            isError = true
            errObj.advice_type.isError = true
        }
        if (isError) {
            setdataObj((dataObj) => {
                return {
                    ...dataObj,
                    errors: { ...errObj }
                }
            })
        }
        return { noError: !isError, bodyPartId, adviceType }
    }

    const renderCell = (data, columnKey) => {
        // console.log({data});
        // console.log({ columnKey });
        let cellValue = data[columnKey];
        // console.log({cellValue});
        switch (columnKey) {

            case "advice_name":
                return (
                    <Text size={12} css={{ tt: "capitalize" }}>
                        {data.advice_name}
                    </Text>
                );

            case "advice_body_part_id":
                return (
                    <Text size={12} css={{ tt: "capitalize" }}>
                        {data.body_part_name}
                    </Text>
                )

            case "advice_type":
                return (
                    <Text size={12} css={{ tt: "capitalize" }}>
                        {data.advice_type}
                    </Text>
                );

            case "status":
                return <StyledBadge type={data.isActive ? "active" : "inActive"}>{data.isActive ? "Active" : "In-Active"}</StyledBadge>;

            case "actions":
                return (
                    <div className="action_col">
                        <Tooltip content="Edit Doctor Advice">
                            <IconButton onClick={() => { openUpdateForm(data) }}>
                                <EditIcon size={16} fill="#979797" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip
                            content="Delete Doctor Advice"
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

            {isAddFormVisible &&
                <FormModal
                    setisAddFormVisible={setisAddFormVisible}
                    isAddFormVisible={isAddFormVisible}
                    formTitle={isEditMode ? "Update Doctor Advice" : "Add Doctor Advice"}
                    onFormSubmit={handleFormSubmit}
                    submitText={isEditMode ? "Update Doctor Advice" : "Add Doctor Advice"}
                    InputArray={InputArray}
                    closeModalHandler={closeModalHandler}
                    isEditMode={isEditMode}
                />}

            <div className="table">
                <div className="table_header">
                    <h4><i>Doctor Advice Details</i></h4>
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
