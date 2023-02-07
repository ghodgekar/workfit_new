import React, { useEffect } from "react";
import { Modal, Button, Text, Input, Textarea, Spacer, Row, Col } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import config from "../../../config/config.json";
import emailtemplateAdd from "../../../api/addEmail";

export default function AddEmailModal(props) {




  // function Viewtemplate(ele) {
  //   let iframe = document.getElementById("preview_iframe")
  //   //     iframe.innerHTML = ele
  //   //     console.log("aarti",ele);
  //   // let iframe = $('iframe')[0]
  //   iframe.contentWindow.document.open();
  //   iframe.contentDocument.write(ele);
  //   iframe.contentWindow.document.close();

  // }


  return (
    <div>
      <Modal
        width="100"
        closeButton
        aria-labelledby="modal-title"
        open={props.isAddFormVisible}
        onClose={props.closeModalHandler}
      >
        <Modal.Header>
          <Text b size={28} css={{ textGradient: "45deg, $blue600 -10%, $pink600 60%", }} >
            {props.formTitle}
          </Text>
        </Modal.Header>
        <Modal.Body>
          {props.InputArray.map((inputElementArr, key) => {
            return (
              <Row key={key}>
                {inputElementArr.map((inputElement, id) => {
                  console.log("inputElement?.selectedValue", inputElement?.selectedValue)
                  return (
                    <Col key={id} style={{display:"flex",flexDirection:"column"}}>
                      <Input
                        width="300px"
                        type={inputElement.inputType ? inputElement.inputType : "text"}
                        label={inputElement.label}
                        clearable={inputElement.clearable ? true : false}
                        placeholder={inputElement.placeholder}
                        value={inputElement.value}
                        onChange={inputElement.onChange}
                      />
                      {inputElement.errors.isError && (<Text small size={10} css={{ letterSpacing: "1px" }} color="error">{inputElement.errors.msg}</Text>)}
                    </Col>)
                })}
              </Row>
            )
          })}
          <Row>
            <Col>
              <label className='dropdownLabel'>Template Content</label>
              <textarea value={props.templateContent} className="view-template" rows="40" cols="40" onChange={(e) => { props.changeTemplateContent(e.target.value); }} />
            </Col>
            <Col>
              <label className='dropdownLabel'>Template Preview</label>
              <iframe id="preview_iframe" className="view-template"
                srcdoc={props.templateContent ? props.templateContent : ""}
                width="300" height="938" >
              </iframe>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={props.closeModalHandler}> Close </Button>
          <Button auto onClick={() => { props.onFormSubmit(props.isEditMode ? "update" : "add") }}> {props.submitText} </Button>
        </Modal.Footer>
      </Modal>
    </div >
  );
}
