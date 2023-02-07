import React, { useState, useEffect } from 'react'
import { Tooltip, Text, Switch } from "@nextui-org/react";
import ViewDataTable from "../../component/ViewDataTable";
import { StyledBadge } from "../../component/Icons/StyledBadge";
import { IconButton } from "../../component/Icons/IconButton";
import { EditIcon } from "../../component/Icons/EditIcon";
import { DeleteIcon } from "../../component/Icons/DeleteIcon";
import FormModal from "../../component/Modal/FormModal";

import updateVideo from '../../api/Video_Api/updateVideo';
import videoList from '../../api/Video_Api/videoList';
import deleteVideo from '../../api/Video_Api/deleteVideo';
import addVideo from '../../api/Video_Api/addVideo';
import IframeDemo from '../../component/Modal/IframeDemo';



const columns = [
    { name: "Video", uid: "video_youtube_id" },
    { name: "Video Name", uid: "video_name" },
    { name: "Video Type", uid: "video_type" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
];

const errors = {
    "video_youtube_id": { isError: false, msg: "Please Enter Video Id" },
    "video_name": { isError: false, msg: "Please Enter Video Name" },
    "video_type": { isError: false, msg: "Please Select A Video Type" }
}
const getErrorObj = () => {
    let clone = {}; // the new empty object
    let errorObject = {
        "video_youtube_id": { isError: false, msg: "Please Enter Video Iframe" },
        "video_name": { isError: false, msg: "Please Enter Video Name" },
        "video_type": { isError: false, msg: "Please Select A Video Type" }
    }
    // let's copy all error properties into it
    for (let key in errorObject) {
        clone[key] = errorObject[key];
    }
    return clone
}
let err = getErrorObj()
const dataRefObj = {
    "video_youtube_id": '',
    "video_name": "",
    "video_type": "",
    "errors": { ...err }
}

const videoTypeOptions = [
    { value: "exercise", label: "exercise" },
    { value: "tutorial", label: "tutorial" }
]

export default function Video() {
    const [Data, setData] = useState([])
    const [isAddFormVisible, setisAddFormVisible] = useState(false);
    const [isEditMode, setisEditMode] = useState(false);
    const [dataObj, setdataObj] = useState({ ...dataRefObj })
    const [SelectedVideoType, setSelectedVideoType] = useState(new Set([]))

    const [showIframeModal, setshowIframeModal] = useState(false)
    const [videoYoutubeId, setvideoYoutubeId] = useState('')



    const selectedTypeValue = React.useMemo(
        () => Array.from(SelectedVideoType).join(", ").replaceAll("_", " "),
        [SelectedVideoType]
    );

    const InputArray = [
        [
            {
                type: "text",
                inputType: "text",
                label: "Video Name",
                value: dataObj.video_name,
                placeholder: "Enter Video Name",
                onChange: (e) => {
                    setdataObj(dataObj => {
                        return {
                            ...dataObj,
                            video_name: e.target.value,
                            errors: {
                                ...dataObj.errors,
                                video_name: {
                                    ...dataObj.errors.video_name,
                                    isError: false
                                }
                            }
                        }
                    })
                },
                errors: dataObj.errors.video_name
            },
            {
                type: "dropdown",
                label: "Video Type",
                options: videoTypeOptions,
                selectedValue: selectedTypeValue,
                selectionMode: "single",
                selectedOption: SelectedVideoType,
                setselectedOption: setSelectedVideoType,
                errors: dataObj.errors.video_type
            }
        ],
        [
            {
                type: "text",
                inputType: "text",
                label: "Video ID",
                value: dataObj.video_youtube_id,
                placeholder: "Enter Video ID",
                onChange: (e) => {
                    setdataObj(dataObj => {
                        return {
                            ...dataObj,
                            video_youtube_id: e.target.value,
                            errors: {
                                ...dataObj.errors,
                                video_youtube_id: {
                                    ...dataObj.errors.video_youtube_id,
                                    isError: false
                                }
                            }
                        }
                    })
                },
                errors: dataObj.errors.video_youtube_id
            }

        ]
    ];

    useEffect(() => {
        async function fetchData() {
            await callListFunction()
        }
        fetchData();
    }, []);

    const callListFunction = async () => {
        const Response = await videoList()
        console.log("data", Response);
        setData(Response?.data);
        // setInstructionDatacopy(instResp?.data);
    }

    const deleteFunc = async (data) => {
        let request = {
            "video_id": data.video_id,
        }
        let response = await deleteVideo(request)
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
        setSelectedVideoType(new Set([]))
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
            "video_id": data.video_id,
            "isActive": data.isActive ? 0 : 1
        }
        await updateApiCall(request)
    }

    async function updateApiCall(request) {
        let response = await updateVideo(request)
        // console.log("response", response);
        if (response.status) await callListFunction()
    }

    const openUpdateForm = (data) => {
        setSelectedVideoType(new Set([data.video_type]))
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
            console.log("request------------------", request.video_youtube_id);
            console.log("split");
            // let videoIframe = await processIframe(request.video_iframe)

            request.video_type = validate.videoType

            delete request.errors
            if (type == "add") {
                let resp = await addVideo(request)
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

    const processIframe = async (iframe) => {
        let splitVal = iframe.split(" ");
        let srcIndex = splitVal.findIndex((val) => { return val.includes("src=") });
        let srcArr = splitVal.find((val) => { return val.includes("src=") });
        console.log("srcArr", srcArr);
        let url = srcArr.split("=")
        let splitSrc = url[1].split("?");
        console.log("srcArr", splitSrc);

        console.log(" url[1]", typeof url[1]);
        splitSrc[0] = splitSrc[0].slice(1, -1)
        let videoStrArr = splitSrc[0].split("/")
        let videoId = videoStrArr[videoStrArr.length - 1]
        let urlString = splitSrc[0] + "?rel=0&autoplay=1&controls=0&disablekb=1&loop=1" + "&playlist=" + videoId + "&playsinline=1&iv_load_policy=3&mute=1&modestbranding=1&related=0&showinfo=0"
        // concat("?autoplay=1&loop=1&modestbranding=1&rel=0")
        console.log("srcArr2222222", urlString);
        let finalSrc = 'src="' + urlString + '"';
        console.log("finalSrc", finalSrc);
        splitVal[srcIndex] = finalSrc;
        let iFrame = splitVal.join(" ")
        console.log("iFrame", iFrame);
        return iFrame
    }

    const validateForm = async () => {
        let errorObj = await getErrorObj()
        setdataObj((dataObj) => {
            return {
                ...dataObj,
                errors: { ...errorObj }
            }
        })

        let videoType = selectedTypeValue ? selectedTypeValue : ""
        // console.log("dataObj.adjunct_time_type", dataObj.adjunct_time_type);
        let errObj = { ...errorObj }
        let isError = false
        if (!dataObj.video_name) {
            isError = true
            errObj.video_name.isError = true
        }
        if (!dataObj.video_name) {
            isError = true
            errObj.video_name.isError = true
        }
        if (!videoType) {
            isError = true
            errObj.video_type.isError = true
        }
        if (isError) {
            setdataObj((dataObj) => {
                return {
                    ...dataObj,
                    errors: { ...errObj }
                }
            })
        }
        return { noError: !isError, videoType }
    }

    function onPlayerReady(event) {
        console.log("event target", event.target);
        event.target.mute();
        event.target.playVideo();
        // event.target.setLoop(100)

    }


    const renderCell = (data, columnKey) => {
        // console.log({data});
        // console.log({ columnKey });
        let cellValue = data[columnKey];
        // console.log({cellValue});
        switch (columnKey) {

            case "video_name":
                return (
                    <Text size={12} css={{ tt: "capitalize" }}>
                        {data.video_name}
                    </Text>
                );

            case "video_youtube_id":
                return (
                    <Text b size={12} css={{ tt: "capitalize", color: "$blue500", }} onClick={() => {setvideoYoutubeId(data.video_youtube_id); setshowIframeModal(true) }}>
                        View
                    </Text>
                )

            case "video_type":
                return (
                    <Text size={12} css={{ tt: "capitalize" }}>
                        {data.video_type}
                    </Text>
                );

            case "status":
                return <StyledBadge type={data.isActive ? "active" : "inActive"}>{data.isActive ? "Active" : "In-Active"}</StyledBadge>;

            case "actions":
                return (
                    <div className="action_col">
                        <Tooltip content="Edit Video Details">
                            <IconButton onClick={() => { openUpdateForm(data) }}>
                                <EditIcon size={16} fill="#979797" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip
                            content="Delete Video Details"
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
                    formTitle={isEditMode ? "Update Video" : "Add Video"}
                    onFormSubmit={handleFormSubmit}
                    submitText={isEditMode ? "Update Video" : "Add Video"}
                    InputArray={InputArray}
                    closeModalHandler={closeModalHandler}
                    isEditMode={isEditMode}
                />}

            <div className="table">
                <div className="table_header">
                    <h4><i>Video Details</i></h4>
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

            {showIframeModal &&
                <IframeDemo
                    showIframeModal={showIframeModal}
                    videoId={videoYoutubeId}
                    title={"Video Demo"}
                    onPlayerReady={onPlayerReady}
                    setshowIframeModal={setshowIframeModal}
                />
            }
        </>
    )
}
