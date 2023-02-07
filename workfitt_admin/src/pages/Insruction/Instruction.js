import React, { useEffect, useState } from "react";
import instructionList from "../../api/Instruction_Api/instruction_list";
import ViewDataTable from "../../component/ViewDataTable";
import { StyledBadge } from "../../component/Icons/StyledBadge";
import { IconButton } from "../../component/Icons/IconButton";
import { EditIcon } from "../../component/Icons/EditIcon";
import { DeleteIcon } from "../../component/Icons/DeleteIcon";
import {  Tooltip, Text, Switch } from "@nextui-org/react";
import DescriptionModal from "../../component/Modal/InstructionModal/DescriptionModal";
import AddInstructionModal from "../../component/Modal/InstructionModal/AddInstructionModal";
// import FormModal from "../../component/Modal/FormModal";
import addInstruction from "../../api/Instruction_Api/addInstruction";
import updateInstruction from "../../api/Instruction_Api/updateInstruction";
import deleteInstruction from "../../api/Instruction_Api/deleteInstruction";


let dropdownOptions = [
  { value: "adjunct", label: "Adjunct Instruction" },
  { value: "exercise", label: "Exercise Instruction" },
]
let defaultSelectedOption = { value: "", label: "" }

const columns = [
  { name: "Instruction Name", uid: "instruction_name" },
  { name: "Instruction Type", uid: "instruction_type" },
  { name: "Desc English", uid: "description_english" },
  { name: "Desc Marathi", uid: "description_marathi" },
  { name: "Desc Hindi", uid: "description_hindi" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];
const errors = {
  "instruction_name": { isError: false, msg: "Please Enter Valid Instruction Name" },
  "instruction_type": { isError: false, msg: "Please Enter Valid Instruction Type" },
  "description_english": { isError: false, msg: "Please Enter Valid Description" },
  "description_marathi": { isError: false, msg: "Please Enter Valid Description" },
  "description_hindi": { isError: false, msg: "Please Enter Valid Description" },
}

const getErrorObj = () => {
  let clone = {}; // the new empty object
  let errorObject={
    "instruction_name": { isError: false, msg: "Please Enter Valid Instruction Name" },
    "instruction_type": { isError: false, msg: "Please Enter Valid Instruction Type" },
    "description_english": { isError: false, msg: "Please Enter Valid Description" },
    "description_marathi": { isError: false, msg: "Please Enter Valid Description" },
    "description_hindi": { isError: false, msg: "Please Enter Valid Description" },
  }
  // let's copy all error properties into it
  for (let key in errorObject) {
    clone[key] = errorObject[key];
  }
  return clone
}
let err=getErrorObj()
const instructionRefObj = {
  "instruction_name": "",
  "instruction_type": "",
  "description_english": [],
  "description_marathi": [],
  "description_hindi": [],
  "errors": { ...err }
}

export default function Instruction() {
  const [isAddFormVisible, setisAddFormVisible] = useState(false);
  // const [InstructionDatacopy, setInstructionDatacopy] = useState([]);
  const [ShowMenu, setShowMenu] = useState(false)

  const [InstructionData, setInstructionData] = useState([]);
  const [descriptionModalData, setdescriptionModalData] = useState([])
  const [descriptionLang, setdescriptionLang] = useState("")
  const [showDescriptionModal, setshowDescriptionModal] = useState(false)
  const [instructionObj, setinstructionObj] = useState({ ...instructionRefObj })
  const [isEditMode, setisEditMode] = useState(false)
  const [selectedOption, setselectedOption] = useState({ ...defaultSelectedOption })


  useEffect(() => {
    async function fetchData() {
      await callListFunction()
    }
    fetchData();
  }, []);

  const callListFunction = async () => {
    const instResp = await instructionList()

    console.log("data", instResp);
    setInstructionData(instResp?.data);
    // setInstructionDatacopy(instResp?.data);
  }

  function onAddClick() {
    setisAddFormVisible(true);
  }

  const convertDescObj = async (instObj) => {
    let instData = JSON.parse(instObj)
    return Object.values(instData)
  }

  async function viewDescriptionModal(instObj, language) {
    if (instObj) {
      let descriptionData = await convertDescObj(instObj)
      setdescriptionModalData(descriptionData)
    } else {
      setdescriptionModalData([])
    }
    setdescriptionLang(language)
    setshowDescriptionModal(true)

  }
  async function updateApiCall(request) {
    let response = await updateInstruction(request)
    console.log("response", response);
    if (response.status) {
      await callListFunction()
    }
  }

  async function toggleActiveStatus(data) {
    let request = {
      "instruction_id": data.instruction_id,
      "isActive": data.isActive ? 0 : 1
    }
    await updateApiCall(request)
  }

  const deleteInstructionFunc = async (data) => {
    let request = {
      "instruction_id": data.instruction_id,
    }
    let response = await deleteInstruction(request)
    console.log("response", response);
    if (response.status) {
      await callListFunction()
    }
  }

  const openUpdateForm = async (data) => {
    console.log(data);
    let selectOpt=dropdownOptions.find((o) => { return o.value == data.instruction_type })
    setselectedOption(selectOpt)
    data.description_hindi = data.instruction_description_hindi ? await convertDescObj(data.instruction_description_hindi) : [];
    data.description_english = data.instruction_description_english ? await convertDescObj(data.instruction_description_english) : [];
    data.description_marathi = data.instruction_description_marathi ? await convertDescObj(data.instruction_description_marathi) : [];

    delete data.isActive
    let errorObj=await getErrorObj()
    data.errors = { ...errorObj }
    setinstructionObj(data)
    setisAddFormVisible(true);
    setisEditMode(true)
  }

  const closeModalHandler = () => {
    setisAddFormVisible(false)
    setinstructionObj({ ...instructionRefObj })
    setisEditMode(false)
    // console.log("closed");
  };

  const renderCell = (data, columnKey) => {
    // console.log({data});
    // console.log({ columnKey });
    const cellValue = data[columnKey];
    // console.log({cellValue});
    switch (columnKey) {
      case "instruction_name":
        return (
          <Text size={12} css={{ tt: "capitalize" }}>
            {data.instruction_name}
          </Text>
        );
      case "instruction_type":
        return (
          <Text size={12} css={{ tt: "capitalize" }}>
            {data.instruction_type}
          </Text>
        );
      case "description_english":
        return (
          <Text size={12} css={{ tt: "capitalize", color: "$blue500", }} b onClick={() => { viewDescriptionModal(data.instruction_description_english, "English") }}>
            View
          </Text>
        );
      case "description_marathi":
        return (
          <Text b size={12} css={{ tt: "capitalize", color: "$blue500", }} onClick={() => { viewDescriptionModal(data.instruction_description_marathi, "Marathi") }}>
            View
          </Text>
        );
      case "description_hindi":
        return (
          <Text size={12} css={{ tt: "capitalize", color: "$blue500", }} b onClick={() => { viewDescriptionModal(data.instruction_description_hindi, "Hindi") }}>
            View
          </Text>
        );
      case "status":
        return <StyledBadge type={data.isActive ? "active" : "inActive"}>{data.isActive ? "Active" : "In-Active"}</StyledBadge>;

      case "actions":
        return (
          <div className="action_col">
            <Tooltip content="Edit Instruction">
              <IconButton onClick={() => { openUpdateForm(data) }}>
                <EditIcon size={16} fill="#979797" />
              </IconButton>
            </Tooltip>

            <Tooltip
              content="Delete Instruction"
              color="error"
              onClick={() => { deleteInstructionFunc(data) }}
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

  const validateForm = async () => {
    let errorObj=await getErrorObj()
    setinstructionObj((instructionObj) => {
      return {
        ...instructionObj,
        errors: { ...errorObj }
      }
    })
    let errObj = { ...errorObj }
    let isError = false
    if (!instructionObj.instruction_name) {
      isError = true
      errObj.instruction_name.isError = true
    }
    if (!instructionObj.instruction_type) {
      isError = true
      errObj.instruction_type.isError = true
    }
    if(isError){
      setinstructionObj((instructionObj) => {
        return {
          ...instructionObj,
          errors: { ...errorObj }
        }
      })
    }
    return !isError
  }

  const processDescArr = async () => {
    let inst_english, inst_marathi, inst_hindi;
    if (instructionObj?.description_english?.length > 0) {
      inst_english = JSON.stringify(Object.assign({}, instructionObj.description_english))
    }

    if (instructionObj?.description_marathi?.length > 0) {
      inst_marathi = JSON.stringify(Object.assign({}, instructionObj.description_marathi))
    }

    if (instructionObj?.description_hindi?.length > 0) {
      inst_hindi = JSON.stringify(Object.assign({}, instructionObj.description_hindi))
    }

    return { inst_english, inst_marathi, inst_hindi }

  }

  const submitAddFormHandler = async (type) => {
    // console.log("submitAddFormHandler");
    let validate = await validateForm()
    console.log("validate", validate);
    if (validate) {
      let inst = await processDescArr()
      let request = {
        ...instructionObj,
        description_hindi: inst.inst_hindi,
        description_marathi: inst.inst_marathi,
        description_english: inst.inst_english
      };

      delete request.errors
      if (type == "add") {
        let resp = await addInstruction(request)
        if (resp.status) {
          await callListFunction()
        }
      }
      if (type == "update") {
        await updateApiCall(request)
      }
      setinstructionObj({ ...instructionRefObj })
      setisAddFormVisible(false);
      setisEditMode(false)
    }
  }

  const handleOptionSelect = (val) => {
    setinstructionObj(instructionObj => {
      return {
        ...instructionObj,
        instruction_type: val.value,
        errors: {
          ...instructionObj.errors,
          instruction_type: {
            ...instructionObj.errors.instruction_type,
            isError: false
          }
        }
      }
    })
    setselectedOption(val)
    console.log("Value--------", val);
    setShowMenu(false)
  }

  // const InputArray = [
  //     [
  //       {
  //       label: "Instruction Name",
  //       value: instructionObj.instruction_name,
  //       placeholder: "Enter Instruction Name",
  //       onChange: (e) => { setinstructionObj(instructionObj => { return { ...instructionObj, instruction_name: e.target.value } }) },
  //       err_msg:instructionObj.errors.instruction_name
  //     },
  //     {
  //       label: "Instruction Name",
  //       value: instructionObj.instruction_name,
  //       placeholder: "Enter Instruction Name",
  //       onChange: (e) => { setinstructionObj(instructionObj => { return { ...instructionObj, instruction_name: e.target.value } }) },
  //       err_msg:instructionObj.errors.instruction_name
  //     }
  //   ],
  // ]

  return (
    <>
      {/* Description Modal */}
      {showDescriptionModal &&
        <DescriptionModal
          descriptionLang={descriptionLang}
          descriptionModalData={descriptionModalData}
          setshowDescriptionModal={setshowDescriptionModal}
          showDescriptionModal={showDescriptionModal}
        />
      }
      {/* Description Modal */}
      {/* Add New Instruction */}
      {isAddFormVisible && (
        <AddInstructionModal
          setisAddFormVisible={setisAddFormVisible}
          isAddFormVisible={isAddFormVisible}
          instructionObj={instructionObj}
          setinstructionObj={setinstructionObj}
          submitAddFormHandler={submitAddFormHandler}
          closeModalHandler={closeModalHandler}
          isEditMode={isEditMode}
          dropdownOptions={dropdownOptions}
          selectedOption={selectedOption}
          ShowMenu={ShowMenu}
          setShowMenu={setShowMenu}
          handleOptionSelect={handleOptionSelect}
        />
      )}
      {/* {isAddFormVisible &&
        <FormModal
          setisAddFormVisible={setisAddFormVisible}
          isAddFormVisible={isAddFormVisible}
          formTitle={"Add Instruction"}
          onFormSubmit={handleAddFormSubmit}
          submitText={"Add Instruction"}
          InputArray={InputArray}
        />} */}
      {/* Add New Instruction */}
      <div className="table">
        <div className="table_header">
          <h4><i>Instruction Details</i></h4>
          <div>
            {/* <input placeholder="Search Instruction." onChange={(e) => { }} /> */}
            <button className="add_new" onClick={() => { onAddClick(); }} > {" "} + Add New </button>
          </div>
        </div>
        {InstructionData && InstructionData.length > 0 ?
          <ViewDataTable
            columns={columns}
            dataArr={InstructionData}
            renderCell={renderCell}
          />
          : <Text color="red" >No Result Found</Text>
        }

      </div>


    </>
  )
}
