import React, { useState, useEffect } from 'react'
import { Tooltip, Text, Switch } from "@nextui-org/react";
import ViewDataTable from "../../component/ViewDataTable";
import { StyledBadge } from "../../component/Icons/StyledBadge";
import { IconButton } from "../../component/Icons/IconButton";
import { EditIcon } from "../../component/Icons/EditIcon";
import { DeleteIcon } from "../../component/Icons/DeleteIcon";
import AddEmailModal from "../../component/Modal/EmailModal/AddEmailModal";
import IframeDemo from "../../component/Modal/IframeDemo";


import updateEmailTemplate from '../../api/Email_Template_Api/updateEmailTemplate';
import emailTemplateList from '../../api/Email_Template_Api/emailTemplateList';
import deleteEmailTemplate from '../../api/Email_Template_Api/deleteEmailTemplate';
import addEmailTemplate from '../../api/Email_Template_Api/addEmailTemplate';


const columns = [
  { name: "Template Code", uid: "template_code" },
  { name: "Template Name", uid: "template_name" },
  { name: "Template Content", uid: "template_content" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];
const getErrorObj = () => {
  let clone = {}; // the new empty object
  let errorObject = {
    "template_code": { isError: false, msg: "Please Enter Template Code" },
    "template_name": { isError: false, msg: "Please Enter Template Name" },
    "template_content": { isError: false, msg: "Please Enter Template Content" }
  }
  // let's copy all error properties into it
  for (let key in errorObject) {
    clone[key] = errorObject[key];
  }
  return clone
}

let err = getErrorObj()
const dataRefObj = {
  "template_code": '',
  "template_name": "",
  "template_content": "",
  "errors": { ...err }
}

export default function Email() {

  const [Data, setData] = useState([])
  const [isAddFormVisible, setisAddFormVisible] = useState(false);
  const [isEditMode, setisEditMode] = useState(false);
  const [dataObj, setdataObj] = useState({ ...dataRefObj })

  const [showIframeModal, setshowIframeModal] = useState(false)
  const [iframe, setiframe] = useState('')

  const InputArray = [
    [
      {
        type: "text",
        inputType: "text",
        label: "Template Code",
        value: dataObj.template_code,
        placeholder: "Enter Template Code",
        onChange: (e) => {
          setdataObj(dataObj => {
            return {
              ...dataObj,
              template_code: e.target.value,
              errors: {
                ...dataObj.errors,
                template_code: {
                  ...dataObj.errors.template_code,
                  isError: false
                }
              }
            }
          })
        },
        errors: dataObj.errors.template_code
      },
      {
        type: "text",
        inputType: "text",
        label: "Template Name",
        value: dataObj.template_name,
        placeholder: "Enter Template Name",
        onChange: (e) => {
          setdataObj(dataObj => {
            return {
              ...dataObj,
              template_name: e.target.value,
              errors: {
                ...dataObj.errors,
                template_name: {
                  ...dataObj.errors.template_name,
                  isError: false
                }
              }
            }
          })
        },
        errors: dataObj.errors.template_name
      },
    ],
  ];

  const changeTemplateContent = (ele) => {
    
      setdataObj(dataObj => {
        return {
          ...dataObj,
          template_content: ele,
          errors: {
            ...dataObj.errors,
            template_name: {
              ...dataObj.errors.template_content,
              isError: false
            }
          }
        }
      })
    
  }

  useEffect(() => {
    async function fetchData() {
      await callListFunction()
    }
    fetchData();
  }, []);

  const callListFunction = async () => {
    const Response = await emailTemplateList()
    console.log("data", Response);
    setData(Response?.data);
    // setInstructionDatacopy(instResp?.data);
  }

  const deleteFunc = async (data) => {
    let request = {
      "template_id": data.template_id,
    }
    let response = await deleteEmailTemplate(request)
    console.log("response", response);
    if (response.status) {
      await callListFunction()
    }
  }

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

  async function toggleActiveStatus(data) {
    let request = {
      "template_id": data.template_id,
      "isActive": data.isActive ? 0 : 1
    }
    await updateApiCall(request)
  }

  async function updateApiCall(request) {
    let response = await updateEmailTemplate(request)
    // console.log("response", response);
    if (response.status) await callListFunction()
  }

  const openUpdateForm = (data) => {
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

      delete request.errors
      if (type == "add") {
        let resp = await addEmailTemplate(request)
        if (resp.status) await callListFunction()
      }
      if (type == "update") {
        await updateApiCall(request)
      }
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

    let errObj = { ...errorObj }
    let isError = false
    if (!dataObj.template_name) {
      isError = true
      errObj.template_name.isError = true
    }
    if (!dataObj.template_code) {
      isError = true
      errObj.template_code.isError = true
    }
    if (!dataObj.template_content) {
      isError = true
      errObj.template_content.isError = true
    }

    if (isError) {
      setdataObj((dataObj) => {
        return {
          ...dataObj,
          errors: { ...errObj }
        }
      })
    }
    return { noError: !isError }
  }

  const renderCell = (data, columnKey) => {
    // console.log({data});
    // console.log({ columnKey });
    let cellValue = data[columnKey];
    // console.log({cellValue});
    switch (columnKey) {

        case "template_name":
            return (
                <Text size={12} css={{ tt: "capitalize" }}>
                    {data.template_name}
                </Text>
            );

        case "template_content":
            return (
                <Text b size={12} css={{ tt: "capitalize", color: "$blue500", }} onClick={() => { setiframe(data.template_content); setshowIframeModal(true) }}>
                    View
                </Text>
            )

        case "template_code":
            return (
                <Text size={12} css={{ tt: "capitalize" }}>
                    {data.template_code}
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
        <AddEmailModal
          setisAddFormVisible={setisAddFormVisible}
          isAddFormVisible={isAddFormVisible}
          formTitle={isEditMode ? "Update Email Template" : "Add Email Template"}
          onFormSubmit={handleFormSubmit}
          submitText={isEditMode ? "Update Email Template" : "Add Email Template"}
          InputArray={InputArray}
          closeModalHandler={closeModalHandler}
          isEditMode={isEditMode}
          templateContent={dataObj.template_content}
          changeTemplateContent={changeTemplateContent}
        />}

      <div className="table">
        <div className="table_header">
          <h4><i>Email Template Details</i></h4>
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
          title={"Template Demo"}
          showIframeModal={showIframeModal}
          iframe={iframe}
          setshowIframeModal={setshowIframeModal}
        />
      }
    </>
  )
}




