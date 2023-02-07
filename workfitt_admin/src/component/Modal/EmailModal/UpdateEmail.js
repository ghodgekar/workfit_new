import React from "react";
import {
  Modal,
  Button,
  Text,
  Input,
  Textarea,
  Spacer,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
export default function UpdateEmail(props) {
  const {
    visible,
    closeHandler,
    userDetails,
    setuserDetails,
    SubmitEditData,
  } = props;

  return (
    <Modal
      width="700px"
      closeButton
      aria-labelledby="modal-title"
      open={visible}
      onClose={closeHandler}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          {" "}
          Here you can Update{" "}
          <Text b size={18}>
            {" "}
            Email Details{" "}
          </Text>
        </Text>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Input
            label=" Template Name:"
            clearable
            bordered
            fullWidth
            placeholder="Enter your template name."
            value={userDetails.template_name}
            onChange={(e) => {
              setuserDetails((userDetails) => {
                return {
                  ...userDetails,
                  template_name: e.target.value,
                };
              });
            }}
            color="primary"
            size="lg"
          />
          <Spacer y={0.5} />
          <Input
            label="Template Code:"
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Enter Template your code."
            value={userDetails.template_code}
            onChange={(e) => {
              // setusername(e.target.value);
              setuserDetails((userDetails) => {
                return {
                  ...userDetails,
                  template_code: e.target.value,
                };
              });
            }}
          />

          <Spacer y={0.5} />

          <Textarea
            label="Template Content:"
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Enter your template content."
            value={userDetails.template_content}
            onChange={(e) => {
              setuserDetails((userDetails) => {
                return {
                  ...userDetails,
                  template_content: e.target.value,
                };
              });
            }}
          />
          <Spacer y={0.5} />
          <Input
            label="Active:"
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Active"
            value={userDetails.isActive}
            onChange={(e) => {
              // setactive(e.target.value);
              setuserDetails((userDetails) => {
                return { ...userDetails, isActive: e.target.value };
              });
            }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={closeHandler}>
          {" "}
          Close{" "}
        </Button>
        <Button auto onClick={SubmitEditData}>
          {" "}
          Submit{" "}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
