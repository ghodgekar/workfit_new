import React, { useState, useEffect } from 'react'
import { Tooltip, Text, Switch } from "@nextui-org/react";
import ViewDataTable from "../../component/ViewDataTable";
import { StyledBadge } from "../../component/Icons/StyledBadge";
import { IconButton } from "../../component/Icons/IconButton";
import { EditIcon } from "../../component/Icons/EditIcon";
import { DeleteIcon } from "../../component/Icons/DeleteIcon";
import FormModal from "../../component/Modal/FormModal";

import updateBodyArea from '../../api/Body_Area_Api/updateBodyArea';
import bodyAreaList from '../../api/Body_Area_Api/bodyAreaList';
import deleteBodyArea from '../../api/Body_Area_Api/deleteBodyArea';
import addBodyArea from '../../api/Body_Area_Api/addBodyArea';
import bodyPartList from '../../api/Body_Part_Api/bodyPartList';

const columns = [
  { name: "Body Area Name", uid: "body_area_name" },
  { name: "Body Parts", uid: "body_part_name_arr" },
  { name: "Body Area Used For", uid: "body_area_used_for" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const getErrorObj = () => {
  let clone = {}; // the new empty object
  let errorObject = {
    "body_area_name": { isError: false, msg: "Please Enter Valid Body Area Name" },
    "body_part_id_arr": { isError: false, msg: "Please Select A Body Part" },
    "body_area_used_for": { isError: false, msg: "Please Select A Body Area Used For" }
  }
  // let's copy all user properties into it
  for (let key in errorObject) {
    clone[key] = errorObject[key];
  }
  return clone
}

let err = getErrorObj()

const dataRefObj = {
  "body_area_name": "",
  "body_part_id_arr": [],
  "body_area_used_for": "",
  "errors": { ...err }
}
let areaUsedOptions = [
  { value: "advice", label: "advice" },
  { value: "exercise", label: "exercise" }
]
let defaultSelectOption = { value: "1", label: "" }
export default function BodyArea() {
  const [Data, setData] = useState([])
  const [isAddFormVisible, setisAddFormVisible] = useState(false);
  const [isEditMode, setisEditMode] = useState(false);
  const [dataObj, setdataObj] = useState({ ...dataRefObj })
  const [bodyPartIdArr, setbodyPartIdArr] = useState([{ ...defaultSelectOption }])
  const [SelectedBodyPartId, setSelectedBodyPartId] = useState(new Set([]))
  const [SelectedUsedFor, setSelectedUsedFor] = useState(new Set([]))

  const selectedValue = React.useMemo(
    () => {
      setdataObj(dataObj => {
        return {
          ...dataObj,
          errors: {
            ...dataObj.errors,
            body_part_id_arr: {
              ...dataObj.errors.body_part_id_arr,
              isError: false
            }
          }
        }
      })
      return Array.from(SelectedBodyPartId).join(", ").replaceAll("_", " ")
    },
    [SelectedBodyPartId]
  );

  const AreaUsedForValue = React.useMemo(
    () => {
      setdataObj(dataObj => {
        return {
          ...dataObj,
          errors: {
            ...dataObj.errors,
            body_area_used_for: {
              ...dataObj.errors.body_area_used_for,
              isError: false
            }
          }
        }
      })
      return Array.from(SelectedUsedFor).join(", ").replaceAll("_", " ")},
    [SelectedUsedFor]
  );

  const InputArray = [
    [
      {
        type: "text",
        inputType: "text",
        label: "Body Area Name",
        value: dataObj.body_area_name,
        placeholder: "Enter Body Area Name",
        onChange: (e) => {
          setdataObj(dataObj => {
            return {
              ...dataObj,
              body_area_name: e.target.value,
              errors: {
                ...dataObj.errors,
                body_area_name: {
                  ...dataObj.errors.body_area_name,
                  isError: false
                }
              }
            }
          })
        },
        errors: dataObj.errors.body_area_name
      },
      {
        type: "dropdown",
        label: "Targeted Body Parts",
        options: bodyPartIdArr,
        selectedValue: selectedValue,
        selectionMode: "multiple",
        selectedOption: SelectedBodyPartId,
        setselectedOption: setSelectedBodyPartId,
        errors: dataObj.errors.body_part_id_arr
      },
    ],
    [
      {
        type: "dropdown",
        label: "Body Area Used For",
        options: areaUsedOptions,
        selectedValue: AreaUsedForValue,
        selectionMode: "single",
        selectedOption: SelectedUsedFor,
        setselectedOption: setSelectedUsedFor,
        errors: dataObj.errors.body_area_used_for
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

  const onAddClick = () => {
    setSelectedBodyPartId(new Set([]))
    setSelectedUsedFor(new Set([]))
    setisEditMode(false)
    setisAddFormVisible(true);
    console.log("add click");
  };

  const closeModalHandler = () => {
    setSelectedBodyPartId(new Set([]))
    setSelectedUsedFor(new Set([]))
    setdataObj({ ...dataRefObj })
    setisAddFormVisible(false);
    setisEditMode(false)
    // console.log("closed");
  };

  async function toggleActiveStatus(data) {
    let request = {
      "body_area_id": data.body_area_id,
      "isActive": data.isActive ? 0 : 1
    }
    await updateApiCall(request)
  }

  async function updateApiCall(request) {
    let response = await updateBodyArea(request)
    console.log("response", response);
    if (response.status) {
      await callListFunction()
    }
  }

  const callListFunction = async () => {
    const Response = await bodyAreaList()
    console.log("data", Response);
    setData(Response?.data);
    // setInstructionDatacopy(instResp?.data);
  }

  const deleteFunc = async (data) => {
    let request = {
      "body_area_id": data.body_area_id,
    }
    let response = await deleteBodyArea(request)
    console.log("response", response);
    if (response.status) {
      await callListFunction()
    }
  }

  const handleFormSubmit = async (type) => {

    let validate = await validateForm()
    console.log("validate", validate);
    if (validate.noError) {
      let request = {
        ...dataObj,
      };
      console.log("request------------------", request);
      request.body_part_id_arr = validate.bodyPartIdObj
      request.body_area_used_for = validate.areaUsedFor

      delete request.errors
      if (type == "add") {
        let resp = await addBodyArea(request)
        if (resp.status) {
          await callListFunction()
        }
      }
      if (type == "update") {
        await updateApiCall(request)
      }
      setSelectedUsedFor(new Set([]))
      setSelectedBodyPartId(new Set([]))
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
    let bodyPartIdObj = "", finalpartArr, partArrObj, bodyPartIdArr
    if (selectedValue) {
      bodyPartIdArr = selectedValue.split(",")
      console.log("bodyPartIdArr", bodyPartIdArr);
      finalpartArr = processBodyPartArr(bodyPartIdArr, "getId")
      bodyPartIdObj = JSON.stringify(Object.assign({}, finalpartArr))
      console.log({ bodyPartIdObj });
      // bodyPartIdObj = JSON.stringify(partArrObj)
      // console.log({bodyPartIdObj});
      // return
    }


    let areaUsedFor = AreaUsedForValue ? AreaUsedForValue : ""
    console.log("dataObj.adjunct_time_type", dataObj.adjunct_time_type);
    let errObj = { ...errorObj }
    let isError = false
    if (!dataObj.body_area_name) {
      isError = true
      errObj.body_area_name.isError = true
    }
    if (!bodyPartIdObj) {
      isError = true
      errObj.body_part_id_arr.isError = true
    }
    if (!areaUsedFor) {
      isError = true
      errObj.body_area_used_for.isError = true
    }
    if (isError) {
      setdataObj((dataObj) => {
        return {
          ...dataObj,
          errors: { ...errObj }
        }
      })
    }
    return { noError: !isError, bodyPartIdObj, areaUsedFor }
  }

  let processBodyPartArr = (bodypartArr, type) => {
    for (let i = 0; i < bodypartArr.length; i++) {
      console.log("ele", bodypartArr[i]);
      let bodypartObj
      if (type == "getLabel") {
        bodypartObj = bodyPartIdArr.find((o) => { return o.value == bodypartArr[i] })

        bodypartArr[i] = bodypartObj.label
      } else {
        bodypartObj = bodyPartIdArr.find((o) => { return o.label.toLowerCase().trim() == bodypartArr[i].toLowerCase().trim() })
        bodypartArr[i] = bodypartObj.value
      }
    }
    return bodypartArr
  }

  const openUpdateForm = (data) => {
    let selectUsedForOpt = areaUsedOptions.find((o) => { return o.value == data.body_area_used_for })
    setSelectedUsedFor(new Set([selectUsedForOpt.label]))
    // console.log("data.body_part_id_arr",data.body_part_id_arr);
    let bodypartArr = getPartIdArr(data.body_part_id_arr)
    let finalpartArr = processBodyPartArr(bodypartArr, "getLabel")


    setSelectedBodyPartId(new Set(finalpartArr))
    delete data.isActive;
    let errorObj = getErrorObj()
    data.errors = { ...errorObj };
    setdataObj(data)
    setisAddFormVisible(true);
    setisEditMode(true)
  }

  const getPartIdArr = (obj) => {
    obj = JSON.parse(obj)
    let Arr = Object.values(obj);
    return Arr
  }

  const renderCell = (data, columnKey) => {
    // console.log({data});
    // console.log({ columnKey });
    let cellValue = "";
    if (columnKey == "body_part_name_arr") {
      cellValue = getPartIdArr(data[columnKey]).join(",");
    }
    // console.log({cellValue});
    switch (columnKey) {

      case "body_area_name":
        return (
          <Text size={12} css={{ tt: "capitalize" }}>
            {data.body_area_name}
          </Text>
        );

      case "body_part_name_arr":
        return (
          <Text size={12} css={{ tt: "capitalize" }}>
            {cellValue}
          </Text>
        )

      case "body_area_used_for":
        return (
          <Text size={12} css={{ tt: "capitalize" }}>
            {data.body_area_used_for}
          </Text>
        );

      case "status":
        return <StyledBadge type={data.isActive ? "active" : "inActive"}>{data.isActive ? "Active" : "In-Active"}</StyledBadge>;

      case "actions":
        return (
          <div className="action_col">
            <Tooltip content="Edit Body Area">
              <IconButton onClick={() => { openUpdateForm(data) }}>
                <EditIcon size={16} fill="#979797" />
              </IconButton>
            </Tooltip>

            <Tooltip
              content="Delete Body Area"
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
          setisAddFormVisible={setisAddFormVisible}
          isAddFormVisible={isAddFormVisible}
          formTitle={isEditMode ? "Update Body Area" : "Add Body Area"}
          onFormSubmit={handleFormSubmit}
          submitText={isEditMode ? "Update Body Area" : "Add Body Area"}
          InputArray={InputArray}
          closeModalHandler={closeModalHandler}
          isEditMode={isEditMode}
        />}
      {/* Add New Body Part */}

      <div className="table">
        <div className="table_header">
          <h4><i>Body Area Details</i></h4>
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
