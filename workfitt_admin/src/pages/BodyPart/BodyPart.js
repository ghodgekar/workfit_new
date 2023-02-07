import React, { useState, useEffect } from 'react'
import { Tooltip, Text, Switch } from "@nextui-org/react";
import ViewDataTable from "../../component/ViewDataTable";
import { StyledBadge } from "../../component/Icons/StyledBadge";
import { IconButton } from "../../component/Icons/IconButton";
import { EditIcon } from "../../component/Icons/EditIcon";
import { DeleteIcon } from "../../component/Icons/DeleteIcon";
import updateBodyPart from '../../api/Body_Part_Api/updateBodyPart';
import bodyPartList from '../../api/Body_Part_Api/bodyPartList';
import deleteBodyPart from '../../api/Body_Part_Api/deleteBodyPart';
import addBodyPart from '../../api/Body_Part_Api/addBodyPart';
import FormModal from "../../component/Modal/FormModal";

const columns = [
  { name: "Serial No.", uid: "sr_no" },
  { name: "Body Part Name", uid: "body_part_name" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const errors = {
  "body_part_name": { isError: false, msg: "Please Enter Valid Body Part Name" },
}
const getErrorObj = () => {
  let clone = {}; // the new empty object
  let errorObject = {
    "body_part_name": { isError: false, msg: "Please Enter Valid Body Part Name" },
  }
  // let's copy all properties into it
  for (let key in errorObject) {
    clone[key] = errorObject[key];
  }
  return clone
}
let err = getErrorObj()
const dataRefObj = {
  "body_part_name": "",
  "errors": { ...err }
}




export default function BodyPart() {
  const [Data, setData] = useState([])
  const [isAddFormVisible, setisAddFormVisible] = useState(false);
  const [isEditMode, setisEditMode] = useState(false);
  const [dataObj, setdataObj] = useState({ ...dataRefObj })

  const InputArray = [
    [
      {
        type: "text",
        inputType: "text",
        label: "Body Part Name",
        value: dataObj.body_part_name,
        placeholder: "Enter Body Part Name",
        onChange: (e) => {
          setdataObj(dataObj => {
            return {
              ...dataObj,
              body_part_name: e.target.value,
              errors: {
                ...dataObj.errors,
                body_part_name: {
                  ...dataObj.errors.body_part_name,
                  isError: false
                }
              }
            }
          })
        },
        errors: dataObj.errors.body_part_name
      },
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
    if (!dataObj.body_part_name) {
      isError = true
      errObj.body_part_name.isError = true
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
        let resp = await addBodyPart(request)
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
      "body_part_id": data.body_part_id,
      "isActive": data.isActive ? 0 : 1
    }
    await updateApiCall(request)
  }

  async function updateApiCall(request) {
    let response = await updateBodyPart(request)
    console.log("response", response);
    if (response.status) {
      await callListFunction()
    }
  }

  const callListFunction = async () => {
    const Response = await bodyPartList()
    console.log("data", Response);
    setData(Response?.data);
    // setInstructionDatacopy(instResp?.data);
  }

  const deleteFunc = async (data) => {
    let request = {
      "body_part_id": data.body_part_id,
    }
    let response = await deleteBodyPart(request)
    console.log("response", response);
    if (response.status) {
      await callListFunction()
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
      case "body_part_name":
        return (
          <Text size={12} css={{ tt: "capitalize" }}>
            {data.body_part_name}
          </Text>
        );
      case "status":
        return <StyledBadge type={data.isActive ? "active" : "inActive"}>{data.isActive ? "Active" : "In-Active"}</StyledBadge>;

      case "actions":
        return (
          <div className="action_col">
            <Tooltip content="Edit Body Part">
              <IconButton onClick={() => { openUpdateForm(data) }}>
                <EditIcon size={16} fill="#979797" />
              </IconButton>
            </Tooltip>

            <Tooltip
              content="Delete Body Part"
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
      {/* Add New Body Part */}
      {isAddFormVisible &&
        <FormModal
          width={"300px"}
          setisAddFormVisible={setisAddFormVisible}
          isAddFormVisible={isAddFormVisible}
          formTitle={isEditMode ? "Update Body Part" : "Add Body Part"}
          onFormSubmit={handleFormSubmit}
          submitText={isEditMode ? "Update Body Part" : "Add Body Part"}
          InputArray={InputArray}
          closeModalHandler={closeModalHandler}
          isEditMode={isEditMode}
        />}
      {/* Add New Body Part */}

      <div className="table">
        <div className="table_header">
          <h4><i>Body Part Details</i></h4>
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


