import React, { useState, useEffect } from 'react'
import { Tooltip, Text, Switch } from "@nextui-org/react";
import ViewDataTable from "../../component/ViewDataTable";
import { StyledBadge } from "../../component/Icons/StyledBadge";
import { IconButton } from "../../component/Icons/IconButton";
import { EditIcon } from "../../component/Icons/EditIcon";
import { DeleteIcon } from "../../component/Icons/DeleteIcon";
import FormModal from "../../component/Modal/FormModal";

import updateSubscription from '../../api/Subscription_Api/updateSubscription';
import subscriptionList from '../../api/Subscription_Api/subscriptionList';
import deleteSubscription from '../../api/Subscription_Api/deleteSubscription';
import addSubscription from '../../api/Subscription_Api/addSubscription';

const columns = [
  { name: "Subscription Name", uid: "subscription_name" },
  { name: "Subscription Charges", uid: "subscription_charges" },
  { name: "Subscription Period", uid: "subscription_period" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const getErrorObj = () => {
  let clone = {}; // the new empty object
  let errorObject = {
    "subscription_name": { isError: false, msg: "Please Enter Subscription Name" },
    "subscription_charges": { isError: false, msg: "Please Enter Subscription Charges" },
    "subscription_period": { isError: false, msg: "Please Enter Subscription Period" },
    "subscription_period_type": { isError: false, msg: "Please Select A Period Type" }
  }
  // let's copy all error properties into it
  for (let key in errorObject) {
    clone[key] = errorObject[key];
  }
  return clone
}

let err = getErrorObj()

const dataRefObj = {
  "subscription_name": '',
  "subscription_charges": 0,
  "subscription_period": 0,
  "subscription_period_type": "",
  "errors": { ...err }
}

const periodOptions = [
  { value: "month", label: "month" },
  { value: "year", label: "year" }
]

export default function Subscription() {
  const [Data, setData] = useState([])
  const [isAddFormVisible, setisAddFormVisible] = useState(false);
  const [isEditMode, setisEditMode] = useState(false);
  const [dataObj, setdataObj] = useState({ ...dataRefObj })
  const [SelectedPeriodType, setSelectedPeriodType] = useState(new Set([]))

  const selectedPeriodValue = React.useMemo(
    () => Array.from(SelectedPeriodType).join(", ").replaceAll("_", " "),
    [SelectedPeriodType]
  );


  const InputArray = [
    [
      {
        type: "text",
        inputType: "text",
        label: "Subscription Name",
        value: dataObj.video_name,
        placeholder: "Enter Subscription Name",
        onChange: (e) => {
          setdataObj(dataObj => {
            return {
              ...dataObj,
              subscription_name: e.target.value,
              errors: {
                ...dataObj.errors,
                subscription_name: {
                  ...dataObj.errors.subscription_name,
                  isError: false
                }
              }
            }
          })
        },
        errors: dataObj.errors.subscription_name
      },
      {
        type: "text",
        inputType: "number",
        label: "Subscription Charges",
        value: dataObj.subscription_charges,
        placeholder: "Enter Subscription Charges",
        onChange: (e) => {
          setdataObj(dataObj => {
            return {
              ...dataObj,
              subscription_charges: e.target.value,
              errors: {
                ...dataObj.errors,
                subscription_charges: {
                  ...dataObj.errors.subscription_charges,
                  isError: false
                }
              }
            }
          })
        },
        errors: dataObj.errors.subscription_charges
      }
    ],
    [
      {
        type: "text",
        inputType: "number",
        label: "Subscription Period",
        value: dataObj.subscription_period,
        placeholder: "Enter Subscription Charges",
        onChange: (e) => {
          setdataObj(dataObj => {
            return {
              ...dataObj,
              subscription_period: e.target.value,
              errors: {
                ...dataObj.errors,
                subscription_charges: {
                  ...dataObj.errors.subscription_period,
                  isError: false
                }
              }
            }
          })
        },
        errors: dataObj.errors.subscription_period
      },
      {
        type: "dropdown",
        label: "Period Type",
        options: periodOptions,
        selectedValue: selectedPeriodValue,
        selectionMode: "single",
        selectedOption: SelectedPeriodType,
        setselectedOption: setSelectedPeriodType,
        errors: dataObj.errors.subscription_period_type
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
    const Response = await subscriptionList()
    console.log("data", Response);
    setData(Response?.data);
    // setInstructionDatacopy(instResp?.data);
  }

  const deleteFunc = async (data) => {
    let request = {
      "subscription_id": data.subscription_id,
    }
    let response = await deleteSubscription(request)
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
    setSelectedPeriodType(new Set([]))
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
      "subscription_id": data.subscription_id,
      "isActive": data.isActive ? 0 : 1
    }
    await updateApiCall(request)
  }

  async function updateApiCall(request) {
    let response = await updateSubscription(request)
    // console.log("response", response);
    if (response.status) await callListFunction()
  }

  const openUpdateForm = (data) => {
    setSelectedPeriodType(new Set([data.subscription_period_type]))
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
        subscription_name: dataObj.subscription_name,
        subscription_charges: parseInt(dataObj.subscription_charges),
        subscription_period: parseInt(dataObj.subscription_period),
        subscription_period_type: validate.subscriptionType
      }

      delete request.errors
      if (type == "add") {
        let resp = await addSubscription(request)
        if (resp.status) await callListFunction()
      }
      if (type == "update") {
        request.subscription_id = dataObj.subscription_id
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

    let subscriptionType = selectedPeriodValue ? selectedPeriodValue : ""
    // console.log("dataObj.adjunct_time_type", dataObj.adjunct_time_type);
    let errObj = { ...errorObj }
    let isError = false
    if (!dataObj.subscription_period) {
      isError = true
      errObj.subscription_period.isError = true
    }
    if (!dataObj.subscription_name) {
      isError = true
      errObj.subscription_name.isError = true
    }
    if (!dataObj.subscription_charges) {
      isError = true
      errObj.subscription_charges.isError = true
    }
    if (!subscriptionType) {
      isError = true
      errObj.subscription_period_type.isError = true
    }
    if (isError) {
      setdataObj((dataObj) => {
        return {
          ...dataObj,
          errors: { ...errObj }
        }
      })
    }
    return { noError: !isError, subscriptionType }
  }

  const renderCell = (data, columnKey) => {
    // console.log({data});
    // console.log({ columnKey });
    let cellValue = data[columnKey];
    // console.log({cellValue});
    switch (columnKey) {

      case "subscription_name":
        return (
          <Text size={12} css={{ tt: "capitalize" }}>
            {data.subscription_name}
          </Text>
        );

      case "subscription_charges":
        return (
          <Text size={12} css={{ tt: "capitalize" }}>
            {data.subscription_charges + " Rs"}
          </Text>
        )

      case "subscription_period":
        return (
          <Text size={12} css={{ tt: "capitalize" }}>
            {data.subscription_period} {data.subscription_period_type}
          </Text>
        );

      case "status":
        return <StyledBadge type={data.isActive ? "active" : "inActive"}>{data.isActive ? "Active" : "In-Active"}</StyledBadge>;

      case "actions":
        return (
          <div className="action_col">
            <Tooltip content="Edit Subscription Details">
              <IconButton onClick={() => { openUpdateForm(data) }}>
                <EditIcon size={16} fill="#979797" />
              </IconButton>
            </Tooltip>

            <Tooltip
              content="Delete Subscription"
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
          formTitle={isEditMode ? "Update Subscription" : "Add Subscription"}
          onFormSubmit={handleFormSubmit}
          submitText={isEditMode ? "Update Subscription" : "Add Subscription"}
          InputArray={InputArray}
          closeModalHandler={closeModalHandler}
          isEditMode={isEditMode}
        />}

      <div className="table">
        <div className="table_header">
          <h4><i>Subscription Details</i></h4>
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
