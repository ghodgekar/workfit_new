import React, { useState, useEffect } from 'react'
import { Tooltip, Text, Switch } from "@nextui-org/react";
import ViewDataTable from "../../component/ViewDataTable";
import { StyledBadge } from "../../component/Icons/StyledBadge";
import { IconButton } from "../../component/Icons/IconButton";
import { EditIcon } from "../../component/Icons/EditIcon";
import { DeleteIcon } from "../../component/Icons/DeleteIcon";
import updateScale from '../../api/Scale_Api/updateScale';
import scaleList from '../../api/Scale_Api/scaleList';
import deleteScale from '../../api/Scale_Api/deleteScale';
import addScale from '../../api/Scale_Api/addScale';
import FormModal from "../../component/Modal/FormModal";

const columns = [
    { name: "Serial No.", uid: "sr_no" },
    { name: "Scale Name", uid: "scale_name" },
    { name: "Scale Link", uid: "scale_link" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
];

const getErrorObj = () => {
    let clone = {}; // the new empty object
    let errorObject = {
        "scale_name": { isError: false, msg: "Please Enter Valid Scale Name" },
        "scale_link": { isError: false, msg: "Please Enter Valid Scale Link" },
    }
    // let's copy all properties into it
    for (let key in errorObject) {
        clone[key] = errorObject[key];
    }
    return clone
}
let errors= getErrorObj()
let err = getErrorObj()
const dataRefObj = {
    "scale_name": "",
    "errors": { ...err }
}

export default function Scale() {
    const [Data, setData] = useState([])
    const [isAddFormVisible, setisAddFormVisible] = useState(false);
    const [isEditMode, setisEditMode] = useState(false);
    const [dataObj, setdataObj] = useState({ ...dataRefObj })


    const InputArray = [
        [
            {
                type: "text",
                inputType: "text",
                label: "Scale Name",
                value: dataObj.scale_name,
                placeholder: "Enter Scale Name",
                onChange: (e) => {
                    setdataObj(dataObj => {
                        return {
                            ...dataObj,
                            scale_name: e.target.value,
                            errors: {
                                ...dataObj.errors,
                                scale_name: {
                                    ...dataObj.errors.scale_name,
                                    isError: false
                                }
                            }
                        }
                    })
                },
                errors: dataObj.errors.scale_name
            },
            {
                type: "text",
                inputType: "text",
                label: "Scale Link",
                value: dataObj.scale_link,
                placeholder: "Enter Scale Link",
                onChange: (e) => {
                    setdataObj(dataObj => {
                        return {
                            ...dataObj,
                            scale_link: e.target.value,
                            errors: {
                                ...dataObj.errors,
                                scale_link: {
                                    ...dataObj.errors.scale_link,
                                    isError: false
                                }
                            }
                        }
                    })
                },
                errors: dataObj.errors.scale_link
            }
        ]
    ];

    useEffect(() => {
        async function fetchData() {
            await callListFunction()
        }
        fetchData();
    }, []);

    const onAddClick = () => {
        setisEditMode(false)
        setisAddFormVisible(true);
        console.log("add click");
    };

    const closeModalHandler = () => {
        setdataObj({ ...dataRefObj })
        setisAddFormVisible(false);
        setisEditMode(false)
        // console.log("closed");
    };

    const openUpdateForm = (data) => {
        delete data.isActive;
        data.errors = { ...errors };
        setdataObj(data)
        setisAddFormVisible(true);
        setisEditMode(true)
    }

    async function toggleActiveStatus(data) {
        let request = {
            "scale_id": data.scale_id,
            "isActive": data.isActive ? 0 : 1
        }
        await updateApiCall(request)
    }

    async function updateApiCall(request) {
        let response = await updateScale(request)
        console.log("response", response);
        if (response.status) {
            await callListFunction()
        }
    }

    const callListFunction = async () => {
        const Response = await scaleList()
        console.log("data", Response);
        setData(Response?.data);
        // setInstructionDatacopy(instResp?.data);
    }

    const deleteFunc = async (data) => {
        let request = {
            "scale_id": data.scale_id,
        }
        let response = await deleteScale(request)
        console.log("response", response);
        if (response.status) {
            await callListFunction()
        }
    }

    let validateForm = async () => {
        let errorObj = await getErrorObj()
        setdataObj((dataObj) => {
            return {
                ...dataObj,
                errors: { ...errorObj }
            }
        })
        let errObj = { ...errorObj }
        let isError = false

        if (!dataObj.scale_name) {
            isError = true
            errObj.scale_name.isError = true
        }

        if (!dataObj.scale_link) {
            isError = true
            errObj.scale_link.isError = true
        }

        if (isError) {
            setdataObj((dataObj) => {
                return {
                    ...dataObj,
                    errors: { ...errObj }
                }
            })
        }
        return !isError
    }

    const handleFormSubmit = async (type) => {
        console.log("submit form");
        let validate = await validateForm()
        if (validate) {
            let request = {
                ...dataObj,
            };
            delete request.errors
            if (type == "add") {
                let resp = await addScale(request)
                if (resp.status) {
                    await callListFunction()
                }
            }
            if (type == "update") {
                await updateApiCall(request)
            }
            setdataObj({ ...dataRefObj })
            setisAddFormVisible(false);
            setisEditMode(false)
        }
    }


    const renderCell = (data, columnKey) => {
        // console.log({data});
        // console.log({ columnKey });
        const cellValue = data[columnKey];
        // console.log({cellValue});
        switch (columnKey) {
            case "sr_no":
                return (
                    <Text size={12} css={{ tt: "capitalize" }}>
                        {data.id}
                    </Text>
                );

            case "scale_name":
                return (
                    <Text size={12} css={{ tt: "capitalize" }}>
                        {data.scale_name}
                    </Text>
                );

            case "scale_link":
                return (
                    <Text size={12} css={{ tt: "capitalize" }}>
                        {data.scale_link}
                    </Text>
                );

            case "status":
                return <StyledBadge type={data.isActive ? "active" : "inActive"}>{data.isActive ? "Active" : "In-Active"}</StyledBadge>;

            case "actions":
                return (
                    <div className="action_col">
                        <Tooltip content="Edit Scale">
                            <IconButton onClick={() => { openUpdateForm(data) }}>
                                <EditIcon size={16} fill="#979797" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip
                            content="Delete Scale"
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
            {/* Add New Scale */}
            {isAddFormVisible &&
                <FormModal
                    width={"600px"}
                    setisAddFormVisible={setisAddFormVisible}
                    isAddFormVisible={isAddFormVisible}
                    formTitle={isEditMode ? "Update Scale" : "Add Scale"}
                    onFormSubmit={handleFormSubmit}
                    submitText={isEditMode ? "Update Scale" : "Add Scale"}
                    InputArray={InputArray}
                    closeModalHandler={closeModalHandler}
                    isEditMode={isEditMode}
                />}
            {/* Add New Scale */}

            <div className="table">
                <div className="table_header">
                    <h4><i>Ortho-Toolkit Scales Details</i></h4>
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
