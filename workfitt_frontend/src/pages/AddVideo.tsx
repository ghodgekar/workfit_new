import { IonButton, IonContent, IonHeader, IonItemGroup, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import getBodyPart from '../api/getBodyPart';
import { useForm } from 'react-hook-form';

const AddVideo: React.FC = () => {
  const [isLoadingResult, setisLoadingResult] = useState(true)
  const [selectBodyPart, setBodyPart] = useState([])
  const [bodyPartArr, setBodyPartArr] = useState([])
  useEffect(() => {
    async function fetchData() {
      setisLoadingResult(true)
      let response = await getBodyPart("dropdown")
      if (response.data) {
        setBodyPartArr(response.data)
      }
      setisLoadingResult(false)
    }
    fetchData();
  }, [])

  const { handleSubmit, formState: { errors, isValid } } = useForm({ mode: "all" });
  // const [selectedExerciseArr, setselectedExerciseArr] = useState<Exercise[]>([]);

  const onSubmit = async (data) => {
    console.log(data.selectBodyPart)
  }

  return (
    <IonPage>
      <IonHeader>
        <div className="logoImgContainer">
          <img className="landingLogo" src="/assets/images/home.png" />
        </div>
      </IonHeader>

      <IonContent fullscreen >
        
        {isLoadingResult ?
          <Loader /> :
          <form onSubmit={handleSubmit(onSubmit)}>
          <IonItemGroup className='prescription_section'>
              <div className='dropdown_container'>
              <p className="prescription_dd_label" >Body Part</p>
              <IonSelect value={selectBodyPart} className="prescription_dd_input" placeholder='Body Part' cancelText="cancel" okText="submit" onIonChange={e =>  { setBodyPart(e.detail.value) }}>
                  {bodyPartArr.map((value, key) => (
                  <IonSelectOption key={key} value={value.value}>
                      {value.label}
                  </IonSelectOption>
                  ))}
              </IonSelect>
              </div>
          </IonItemGroup>

            
          <IonButton color="success" type="submit" className="login_btn">Submit</IonButton>
          </form>
        }
      </IonContent>
    </IonPage>
  );
};

export default AddVideo;
