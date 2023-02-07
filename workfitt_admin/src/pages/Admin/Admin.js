import React, { useState, useEffect } from 'react'
import { Tooltip, Text, Switch } from "@nextui-org/react";
import ViewDataTable from "../../component/ViewDataTable";
import { StyledBadge } from "../../component/Icons/StyledBadge";
import { IconButton } from "../../component/Icons/IconButton";
import { EditIcon } from "../../component/Icons/EditIcon";
import { DeleteIcon } from "../../component/Icons/DeleteIcon";
import FormModal from "../../component/Modal/FormModal";


import adminList from "../../api/Admin_Api/adminList";
import updateAdmin from '../../api/Admin_Api/updateAdmin';
import deleteAdmin from '../../api/Admin_Api/deleteAdmin';
import addAdmin from '../../api/Admin_Api/addAdmin';

const columns = [
  { name: "Admin Name", uid: "admin_name" },
  { name: "Admin Email", uid: "admin_email" },
  { name: "Admin Username", uid: "admin_username" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];



const getErrorObj = () => {
  let clone = {}; // the new empty object
  let errorObject = {
    "admin_name": { isError: false, msg: "Please Enter Admin Name" },
    "admin_email": { isError: false, msg: "Please Enter Admin Email" },
    "admin_username": { isError: false, msg: "Please Enter Admin UserName" },
    "admin_password": { isError: false, msg: "Please Enter Valid PassWord" }
  }
  // let's copy all user properties into it
  for (let key in errorObject) {
    clone[key] = errorObject[key];
  }
  return clone
}
let err = getErrorObj()

const dataRefObj = {
  "admin_name": '',
  "admin_email": "",
  "admin_username": "",
  "admin_password": "",
  "errors": { ...err }
}

export default function Admin() {
  const [Data, setData] = useState([])
  const [isAddFormVisible, setisAddFormVisible] = useState(false);
  const [isEditMode, setisEditMode] = useState(false);
  const [dataObj, setdataObj] = useState({ ...dataRefObj })
  const [isUpdateFormVisible, setisUpdateFormVisible] = useState(false)

  const updateInputArray = [
    [
      {
        type: "text",
        inputType: "text",
        label: "Admin Name",
        value: dataObj.admin_name,
        placeholder: "Enter Admin Name",
        onChange: (e) => {
          setdataObj(dataObj => {
            return {
              ...dataObj,
              admin_name: e.target.value,
              errors: {
                ...dataObj.errors,
                admin_name: {
                  ...dataObj.errors.admin_name,
                  isError: false
                }
              }
            }
          })
        },
        errors: dataObj.errors.admin_name
      },
      {
        type: "text",
        inputType: "text",
        label: "Admin Email",
        value: dataObj.admin_email,
        placeholder: "Enter Admin Email",
        onChange: (e) => {
          setdataObj(dataObj => {
            return {
              ...dataObj,
              admin_email: e.target.value,
              errors: {
                ...dataObj.errors,
                admin_email: {
                  ...dataObj.errors.admin_email,
                  isError: false
                }
              }
            }
          })
        },
        errors: dataObj.errors.admin_email
      },
    ],
    [
      {
        type: "text",
        inputType: "text",
        label: "Admin UserName",
        value: dataObj.admin_username,
        placeholder: "Enter  UserName",
        onChange: (e) => {
          setdataObj(dataObj => {
            return {
              ...dataObj,
              admin_username: e.target.value,
              errors: {
                ...dataObj.errors,
                admin_username: {
                  ...dataObj.errors.admin_username,
                  isError: false
                }
              }
            }
          })
        },
        errors: dataObj.errors.admin_username
      },

    ]
  ]
  const InputArray = [
    [
      {
        type: "text",
        inputType: "text",
        label: "Admin Name",
        value: dataObj.admin_name,
        placeholder: "Enter Admin Name",
        onChange: (e) => {
          setdataObj(dataObj => {
            return {
              ...dataObj,
              admin_name: e.target.value,
              errors: {
                ...dataObj.errors,
                admin_name: {
                  ...dataObj.errors.admin_name,
                  isError: false
                }
              }
            }
          })
        },
        errors: dataObj.errors.admin_name
      },
      {
        type: "text",
        inputType: "text",
        label: "Admin Email",
        value: dataObj.admin_email,
        placeholder: "Enter Admin Email",
        onChange: (e) => {
          setdataObj(dataObj => {
            return {
              ...dataObj,
              admin_email: e.target.value,
              errors: {
                ...dataObj.errors,
                admin_email: {
                  ...dataObj.errors.admin_email,
                  isError: false
                }
              }
            }
          })
        },
        errors: dataObj.errors.admin_email
      },
    ],
    [
      {
        type: "text",
        inputType: "text",
        label: "Admin UserName",
        value: dataObj.admin_username,
        placeholder: "Enter  UserName",
        onChange: (e) => {
          setdataObj(dataObj => {
            return {
              ...dataObj,
              admin_username: e.target.value,
              errors: {
                ...dataObj.errors,
                admin_username: {
                  ...dataObj.errors.admin_username,
                  isError: false
                }
              }
            }
          })
        },
        errors: dataObj.errors.admin_username
      },
      {
        type: "password",
        label: "Admin Password",
        value: dataObj.admin_password,
        placeholder: "Enter Admin Password",
        onChange: (e) => {
          setdataObj(dataObj => {
            return {
              ...dataObj,
              admin_password: e.target.value,
              errors: {
                ...dataObj.errors,
                admin_password: {
                  ...dataObj.errors.admin_password,
                  isError: false
                }
              }
            }
          })
        },
        errors: dataObj.errors.admin_password
      },
    ]
  ]

  useEffect(() => {
    async function fetchData() {
      await callListFunction()
    }
    fetchData();
  }, []);

  const callListFunction = async () => {
    const Response = await adminList()
    console.log("data", Response);
    setData(Response?.data);
    // setInstructionDatacopy(instResp?.data);
  }

  const deleteFunc = async (data) => {
    let request = {
      "admin_id": data.admin_id,
    }
    let response = await deleteAdmin(request)
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
      "admin_id": data.admin_id,
      "isActive": data.isActive ? 0 : 1
    }
    await updateApiCall(request)
  }

  async function updateApiCall(request) {
    let response = await updateAdmin(request)
    // console.log("response", response);
    if (response.status) await callListFunction()
  }

  const openUpdateForm = (data) => {
    delete data.admin_password
    delete data.isActive;
    let error = getErrorObj()
    data.errors = { ...error };
    setdataObj(data)
    setisUpdateFormVisible(true);
    setisEditMode(true)
  }

  const handleFormSubmit = async (type) => {
    let validate = await validateForm(type)
    console.log("validate", validate);
    if (validate.noError) {
      let request = {
        ...dataObj,
      };
      delete request.errors
      if (type == "add") {
        let resp = await addAdmin(request)
        if (resp.status) await callListFunction()
      }
      if (type == "update") {
        await updateApiCall(request)
      }
      setisUpdateFormVisible(false)
      setisAddFormVisible(false);
      setdataObj({ ...dataRefObj })
      setisEditMode(false)
    }
  }



  const validateForm = async (type) => {
    let errorObj = await getErrorObj()
    console.log("errorObj", errorObj);
    setdataObj((dataObj) => {
      return {
        ...dataObj,
        errors: { ...errorObj }
      }
    })
    let emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    console.log("regex.test(dataObj.admin_email)", emailExp.test(dataObj.admin_email));
    let errObj = { ...errorObj }
    let isError = false
    if (!dataObj.admin_name) {
      isError = true
      errObj.admin_name.isError = true
    }
    if (!dataObj.admin_username) {
      isError = true
      errObj.admin_username.isError = true
    }
    if (!dataObj.admin_email) {
      isError = true
      errObj.admin_email.isError = true
    }
    if (dataObj.admin_email && !emailExp.test(dataObj.admin_email)) {
      isError = true
      errObj.admin_email.isError = true
    }
    if (type == "add") {
      if (!dataObj.admin_password) {
        isError = true
        errObj.admin_password.isError = true
      }
      if (dataObj.admin_password && dataObj.admin_password.length < 8) {
        isError = true
        errObj.admin_password.isError = true
      }
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

      case "admin_name":
        return (
          <Text size={12} css={{ tt: "capitalize" }}>
            {data.admin_name}
          </Text>
        );

      case "admin_email":
        return (
          <Text  size={12}  >
            {data.admin_email}
          </Text>
        )

      case "admin_username":
        return (
          <Text size={12} >
            {data.admin_username}
          </Text>
        );

      case "status":
        return <StyledBadge type={data.isActive ? "active" : "inActive"}>{data.isActive ? "Active" : "In-Active"}</StyledBadge>;

      case "actions":
        return (
          <div className="action_col">
            <Tooltip content="Edit Admin">
              <IconButton onClick={() => { openUpdateForm(data) }}>
                <EditIcon size={16} fill="#979797" />
              </IconButton>
            </Tooltip>

            <Tooltip
              content="Delete Admin"
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
          formTitle={isEditMode ? "Update Admin" : "Add Admin"}
          onFormSubmit={handleFormSubmit}
          submitText={isEditMode ? "Update Admin" : "Add Admin"}
          InputArray={InputArray}
          closeModalHandler={closeModalHandler}
          isEditMode={isEditMode}
        />}

      {isUpdateFormVisible &&
        <FormModal
          setisAddFormVisible={setisUpdateFormVisible}
          isAddFormVisible={isUpdateFormVisible}
          formTitle={isEditMode ? "Update Admin" : "Add Admin"}
          onFormSubmit={handleFormSubmit}
          submitText={isEditMode ? "Update Admin" : "Add Admin"}
          InputArray={updateInputArray}
          closeModalHandler={closeModalHandler}
          isEditMode={isEditMode}
        />}

      <div className="table">
        <div className="table_header">
          <h4><i>Admin Details</i></h4>
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
  );
}
