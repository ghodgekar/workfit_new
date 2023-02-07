import React, { useEffect } from "react";
import { Modal, Button, Text, Input, Row, Spacer} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import doctorRegister from "../../../api/doctor_register";
import config from "../../../config/config.json";
import '../modal.css'
export default function AddDoctor(props) {
  // const [visible, setVisible] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    //  console.log("props form", props);
  }, []);

  const onSubmit = async (data) => {
    //  console.log("data", data);
    const formData = new FormData();
    formData.append("doctor_logo", data.doctor_logo[0]);
    formData.append("doctor_sign", data.doctor_sign[0]);
    formData.append("doctor_name", data.doctor_name);
    formData.append("doctor_username", data.doctor_username);
    formData.append("doctor_password", data.doctor_password);
    formData.append("doctor_email", data.doctor_email);
    formData.append("doctor_degree", data.doctor_degree);
    formData.append("specialisation", data.specialisation);
    formData.append("subscription_type", data.subscription);
    formData.append("subscription_start_date", "2022-10-14");
    formData.append("subscription_end_date", "2022-10-14");
    formData.append("doctor_mob", 1234567890);
    formData.append("isActive", "1");
    let registerResponse = await doctorRegister(formData);
    console.log("registerResponse", registerResponse);
    if (registerResponse.status) {
      //props.closeHandlerForm()
      window.open(`${config.Base_url}/doctorlist`, "_self");
    }
  };

  return (
    <div>
      <Modal
        width="700px"
        closeButton
        aria-labelledby="modal-title"
        open={props.visible}
        onClose={props.closeHandlerForm}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header>
            <Text id="modal-title"
              h1
              size={30}
              css={{ textGradient: "45deg, $blue600 -10%, $pink600 60%", }}
              weight="bold">
              Add Doctor
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <div>
                <Input
                  label="Name:"
                  clearable
                  bordered
                  fullWidth
                  placeholder="Enter your name."
                  {...register("doctor_name", { required: true })}
                  color="primary"
                  size="lg"
                // placeholder="Name"
                // contentLeft={<Mail fill="currentColor" />}
                />
                <Spacer y={0.4} />
                {errors.doctor_name && (<Text color="error">Name is required</Text>)}

              </div>

              <Spacer y={0.5} />
              <div>
                <Input
                  label="Username:"
                  clearable
                  bordered
                  fullWidth
                  color="primary"
                  size="lg"
                  placeholder="Enter your Username."
                  {...register("doctor_username", { required: true })}
                />
                <Spacer y={0.4} />
                {errors.doctor_username && (<Text color="error">Username is required</Text>)}
              </div>
            </Row>

            <Row>
              <div>
                <Input
                  label="Email:"
                  clearable
                  bordered
                  fullWidth
                  color="primary"
                  size="lg"
                  placeholder="Enter your Email."
                  {...register("doctor_email", { required: true })}
                />
                <Spacer y={0.4} />
                {errors.doctor_email && (<Text color="error">Email Address is required</Text>)}
              </div>
              <Spacer y={0.5} />
              <div>
                <Input
                  label="Password:"
                  clearable
                  bordered
                  fullWidth
                  color="primary"
                  size="lg"
                  placeholder="Enter your Password."
                  type="text"
                  {...register("doctor_password", {
                    required: true,
                    minLength: 8,
                  })}
                // contentLeft={<Password fill="currentColor" />}
                />
                <Spacer y={0.4} />
                {errors?.doctor_password?.type == "required" && (<Text color="error">Password is required</Text>)}
                {errors?.doctor_password?.type == "minLength" && (<Text color="error">Password must be atleast 8 character long</Text>)}
              </div>
            </Row>

            <Row>
              <div>
                <Input
                  label="Education Degree:"
                  clearable
                  bordered
                  fullWidth
                  color="primary"
                  size="lg"
                  placeholder="Degree."
                  {...register("doctor_degree", { required: true })}
                />
                <Spacer y={0.4} />
                {errors.doctor_degree && (<Text color="error">Education Degree is required</Text>)}
              </div>
              <Spacer y={0.5} />
              <div>
                <Input
                  label="Specialisation:"
                  clearable
                  bordered
                  fullWidth
                  color="primary"
                  size="lg"
                  placeholder="specialisation"
                  // value={userDetails.specialisation}
                  {...register("specialisation", { required: true })}

                // contentLeft={<Password fill="currentColor" />}
                />
                <Spacer y={0.4} />
                {errors.specialisation && (<Text color="error">Specialization is required</Text>)}
              </div>
            </Row>

            <Row>
              <div>
                <Input
                  label="Mobile No:"
                  clearable
                  bordered
                  fullWidth
                  color="primary"
                  size="lg"
                  placeholder="Mobile no."
                  // value={userDetails.doctor_degree}
                  {...register("doctor_mob", { required: true })}

                // contentLeft={<Mail fill="currentColor" />}
                />
                <Spacer y={0.4} />
                {errors.doctor_mob && (<Text color="error">Mobile Number is required</Text>)}
              </div>
              <Spacer y={0.5} />
              <div>

                <label className="input-select"> Subscription</label><br></br>
                <select className="drop" {...register("subscription", { required: true })}>
                  <option value="3-month">3 months - 699</option>
                  <option value="6-month">6 months - 999</option>
                  <option value="12-month">12 months - 1299</option>
                </select>

                <Spacer y={0.4} />
                {errors.subscription_type && (
                  <Text color="error">subscription type is required</Text>
                )}
              </div>
            </Row>


            <Row>
              <div>
                <Input
                  id="logo"
                  label="Your Sign:"
                  clearable
                  bordered
                  fullWidth
                  type="file"
                  color="primary"
                  size="lg"
                  placeholder="Sign"
                  accept="image/*"
                  {...register("doctor_sign", { required: true })}

                // contentLeft={<Mail fill="currentColor" />}
                />
                <Spacer y={0.4} />
                {errors.doctor_logo && (
                  <Text color="error">Please upload a logo</Text>
                )}
              </div>
              <Spacer y={0.5} />
              <div>
                <Input
                  label="Your Logo:"
                  clearable
                  bordered
                  fullWidth
                  type="file"
                  color="primary"
                  size="lg"
                  placeholder="logo"
                  accept="image/*"
                  {...register("doctor_logo", { required: true })}

                // contentLeft={<Password fill="currentColor" />}
                />
                <Spacer y={0.4} />
                {errors.doctor_logo && (
                  <Text color="error">Please upload a logo</Text>
                )}
              </div>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button auto flat color="error" onClick={props.closeHandlerForm}>
              Close
            </Button>
            <Button auto type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
