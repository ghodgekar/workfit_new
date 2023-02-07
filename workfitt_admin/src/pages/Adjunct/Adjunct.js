import React, { useState, useEffect } from 'react'
import adjunctList from '../../api/Adjunct_Api/adjunctList';
import ViewDataTable from "../../component/ViewDataTable";
import { StyledBadge } from "../../component/Icons/StyledBadge";
import { IconButton } from "../../component/Icons/IconButton";
import { EditIcon } from "../../component/Icons/EditIcon";
import { DeleteIcon } from "../../component/Icons/DeleteIcon";
import { Tooltip, Text, Switch } from "@nextui-org/react";
import FormModal from "../../component/Modal/FormModal";
import getInstructionByType from '../../api/Instruction_Api/getInstructionByType';
import addAdjunct from '../../api/Adjunct_Api/addAdjunct';
import updateAdjunct from '../../api/Adjunct_Api/updateAdjunct';
import deleteAdjunct from '../../api/Adjunct_Api/deleteAdjunct';

const columns = [
  { name: "Adjunct Name", uid: "adjunct_name" },
  { name: "Adjunct Time", uid: "adjunct_time" },
  { name: "Instruction Name", uid: "instruction_name" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const getErrorObj = () => {
  let clone = {}; // the new empty object
  let errorObject = {
    "adjunct_name": { isError: false, msg: "Please Enter Valid Adjunct Name" },
    "adjunct_time": { isError: false, msg: "Please Enter Valid Adjunct Time" },
    "adjunct_time_type": { isError: false, msg: "Please Select A Valid Time Type" },
    "instruction_name": { isError: false, msg: "Please Select A Valid Instruction Name" },
  }
  // let's copy all user properties into it
  for (let key in errorObject) {
    clone[key] = errorObject[key];
  }
  return clone
}

let err = getErrorObj()
const adjunctRefObj = {
  "adjunct_name": "",
  "adjunct_time": 0,
  "instruction_name": "",
  "adjunct_time_type": "",
  "errors": { ...err }
}
let adjTimeOptions = [
  { value: "seconds", label: "seconds" },
  { value: "minutes", label: "minutes" },
  { value: "hours", label: "hours" }
]
let defaultSelectedOption = { value: "", label: "" }
export default function Adjunct() {
  const [isAddFormVisible, setisAddFormVisible] = useState(false);
  const [AdjunctData, setAdjunctData] = useState([])
  const [isEditMode, setisEditMode] = useState(false)
  const [adjunctObj, setadjunctObj] = useState({ ...adjunctRefObj })
  const [selectedInstOption, setselectedInstOption] = useState(new Set([]))
  const [instOptions, setinstOptions] = useState([{ ...defaultSelectedOption }])

  const [selectedAdjTimeOption, setselectedAdjTimeOption] = useState(new Set([]))

  useEffect(() => {
    async function fetchData() {
      let instResp = await getInstructionByType("adjunct")
      console.log("instResp", instResp);
      if (instResp.data) {
        setinstOptions(instResp.data)
      }
      await callAdjunctList()
    }
    fetchData();
  }, []);

  const selectedInstValue = React.useMemo(
    () => {
      setadjunctObj(adjunctObj => {
        return {
          ...adjunctObj,
          errors: {
            ...adjunctObj.errors,
            instruction_name: {
              ...adjunctObj.errors.instruction_name,
              isError: false
            }
          }
        }
      })
      return Array.from(selectedInstOption).join(", ").replaceAll("_", " ")
    },
    [selectedInstOption]
  );

  const selectedTimeTypeValue = React.useMemo(
    () => {
      setadjunctObj(adjunctObj => {
        return {
          ...adjunctObj,
          errors: {
            ...adjunctObj.errors,
            adjunct_time_type: {
              ...adjunctObj.errors.adjunct_time_type,
              isError: false
            }
          }
        }
      })
      return Array.from(selectedAdjTimeOption).join(", ").replaceAll("_", " ")
    },
    [selectedAdjTimeOption]
  );

  const callAdjunctList = async () => {
    const Response = await adjunctList()

    console.log("data", Response);
    setAdjunctData(Response?.data);
    // setInstructionDatacopy(instResp?.data);
  }

  const validateForm = async () => {
    let errorObj = await getErrorObj()
    setadjunctObj((adjunctObj) => {
      return {
        ...adjunctObj,
        errors: { ...errorObj }
      }
    })
    let instructionName = selectedInstValue ? instOptions.find(o => o.label == selectedInstValue) : "";
    instructionName = instructionName.value
    let AdjTimeType = selectedTimeTypeValue ? selectedTimeTypeValue : ""
    console.log("adjunctObj.adjunct_time_type", adjunctObj.adjunct_time_type);
    let errObj = { ...errorObj }
    let isError = false
    if (!adjunctObj.adjunct_name) {
      isError = true
      errObj.adjunct_name.isError = true
    }
    if (!instructionName) {
      isError = true
      errObj.instruction_name.isError = true
    }
    if (!adjunctObj.adjunct_time && adjunctObj.adjunct_time != 0) {
      isError = true
      errObj.adjunct_time.isError = true
    }
    if (!AdjTimeType) {
      isError = true
      errObj.adjunct_time_type.isError = true
    }
    if (isError) {
      setadjunctObj((adjunctObj) => {
        return {
          ...adjunctObj,
          errors: { ...errObj }
        }
      })
    }
    return { noError: !isError, instructionName, AdjTimeType }
  }

  async function updateApiCall(request) {
    let response = await updateAdjunct(request)
    console.log("response", response);
    if (response.status) {
      await callAdjunctList()
    }
  }

  async function toggleActiveStatus(data) {
    let request = {
      "ajunct_id": data.ajunct_id,
      "isActive": data.isActive ? 0 : 1
    }
    await updateApiCall(request)
  }


  const handleAddFormSubmit = async (type) => {

    let validate = await validateForm()
    console.log("validate", validate);
    if (validate.noError) {
      let request = {
        ...adjunctObj,
      };
      console.log("request------------------", request);
      request.adjunct_instruction_id = validate.instructionName
      request.adjunct_time = request.adjunct_time + " " + validate.AdjTimeType

      delete request.errors
      if (type == "add") {
        let resp = await addAdjunct(request)
        if (resp.status) {
          await callAdjunctList()
        }
      }
      if (type == "update") {
        await updateApiCall(request)
      }
      setselectedAdjTimeOption(new Set([]))
      setselectedInstOption(new Set([]))
      setadjunctObj({ ...adjunctRefObj })
      setisAddFormVisible(false);
      setisEditMode(false)
    }
  }

  const onAddClick = () => {
    setselectedAdjTimeOption(new Set([]))
    setselectedInstOption(new Set([]))
    setisEditMode(false)
    setisAddFormVisible(true);
    console.log("add click");
  };

  const openUpdateForm = async (data) => {
    console.log(data);
    let data1 = data;
    let selectInstOpt = instOptions.find((o) => { return o.value == data.adjunct_instruction_id })
    setselectedInstOption(new Set([selectInstOpt.label]))

    let timeArr = data.adjunct_time.split(" ");
    console.log("timeArr", timeArr);
    let selectTimeOpt = adjTimeOptions.find((o) => { return o.value == timeArr[1] })
    setselectedAdjTimeOption(new Set([selectTimeOpt.label]))
    data1.adjunct_time = parseInt(timeArr[0]);
    data1.adjunct_time_type = timeArr[1];
    console.log("data1", data1.adjunct_time);

    delete data1.isActive;
    let errorObj = await getErrorObj()
    data1.errors = { ...errorObj };
    setadjunctObj(data1)
    setisAddFormVisible(true);
    setisEditMode(true)
  }

  const deleteFunc = async (data) => {
    let request = {
      "adjunct_id": data.adjunct_id,
    }
    let response = await deleteAdjunct(request)
    console.log("response", response);
    if (response.status) {
      await callAdjunctList()
    }

  }

  const renderCell = (data, columnKey) => {
    // console.log({data});
    // console.log({ columnKey });
    const cellValue = data[columnKey];
    // console.log({cellValue});
    switch (columnKey) {
      case "adjunct_name":
        return (
          <Text size={12} css={{ tt: "capitalize" }}>
            {data.adjunct_name}
          </Text>
        );
      case "adjunct_time":
        return (
          <Text size={12} css={{ tt: "capitalize" }}>
            {data.adjunct_time}
          </Text>
        );
      case "instruction_name":
        return (
          <Text size={12} css={{ tt: "capitalize", }}  >
            {data.instruction_name}
          </Text>
        );
      case "status":
        return <StyledBadge type={data.isActive ? "active" : "inActive"}>{data.isActive ? "Active" : "In-Active"}</StyledBadge>;

      case "actions":
        return (
          <div className="action_col">
            <Tooltip content="Edit Adjunct">
              <IconButton onClick={() => { openUpdateForm(data) }}>
                <EditIcon size={16} fill="#979797" />
              </IconButton>
            </Tooltip>

            <Tooltip
              content="Delete Adjunct"
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

  const closeModalHandler = () => {
    setadjunctObj({ ...adjunctRefObj })
    setselectedInstOption({ ...defaultSelectedOption })
    setselectedAdjTimeOption({ ...defaultSelectedOption })
    setisAddFormVisible(false);
    setisEditMode(false)
    // console.log("closed");
  };

  const InputArray = [
    [
      {
        type: "text",
        inputType: "text",
        label: "Adjunct Name",
        value: adjunctObj.adjunct_name,
        placeholder: "Enter Adjunct Name",
        clearable: true,
        onChange: (e) => {
          setadjunctObj(adjunctObj => {
            return {
              ...adjunctObj,
              adjunct_name: e.target.value,
              errors: {
                ...adjunctObj.errors,
                adjunct_name: {
                  ...adjunctObj.errors.adjunct_name,
                  isError: false
                }
              }
            }
          })
        },
        errors: adjunctObj.errors.adjunct_name
      },
      {
        type: "dropdown",
        label: "Instruction Name",
        options: instOptions,
        selectedValue: selectedInstValue,
        selectionMode: "single",
        selectedOption: selectedInstOption,
        setselectedOption: setselectedInstOption,
        errors: adjunctObj.errors.instruction_name
      },

    ],
    [
      {
        type: "text",
        inputType: "number",
        label: "Adjunct Time",
        value: adjunctObj.adjunct_time,
        placeholder: "Enter Adjunct Time",
        clearable: false,
        onChange: (e) => {
          setadjunctObj(adjunctObj => {
            return {
              ...adjunctObj,
              adjunct_time: e.target.value,
              errors: {
                ...adjunctObj.errors,
                adjunct_time: {
                  ...adjunctObj.errors.adjunct_time,
                  isError: false
                }
              }
            }
          })
        },
        errors: adjunctObj.errors.adjunct_time
      },
      {
        type: "dropdown",
        label: "Time Type",
        options: adjTimeOptions,
        selectedValue: selectedTimeTypeValue,
        selectionMode: "single",
        selectedOption: selectedAdjTimeOption,
        setselectedOption: setselectedAdjTimeOption,
        errors: adjunctObj.errors.adjunct_time_type
      },

    ],
  ]

  return (
    <>
      {/* Add New Adjunct */}
      {isAddFormVisible &&
        <FormModal
          setisAddFormVisible={setisAddFormVisible}
          isAddFormVisible={isAddFormVisible}
          formTitle={"Add Adjunct"}
          onFormSubmit={handleAddFormSubmit}
          submitText={isEditMode ? "Update Adjunct" : "Add Adjunct"}
          InputArray={InputArray}
          closeModalHandler={closeModalHandler}
          isEditMode={isEditMode}
        />}
      {/* Add New Adjunct */}

      <div className="table">
        <div className="table_header">
          <h4><i>Adjunct Details</i></h4>
          <div>
            {/* <input placeholder="Search Instruction." onChange={(e) => { }} /> */}
            <button className="add_new" onClick={() => { onAddClick(); }} > {" "} + Add New </button>
          </div>
        </div>
        {AdjunctData && AdjunctData.length > 0 ?
          <ViewDataTable
            columns={columns}
            dataArr={AdjunctData}
            renderCell={renderCell}
          />
          : <Text color="red" >No Result Found</Text>
        }

      </div>
    </>
  )
}
