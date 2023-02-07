import React, { useEffect } from 'react'
import { IonToast, IonContent, IonButton } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';

export default function Toast(props) {
  useEffect(() => {
    console.log("toast Props",props);
    
  
    
  }, [])
  
  return (
    <IonToast
        isOpen={props.showToast}
        onDidDismiss={() => props.closeToast(false)}
        message={props.message}
        duration={800}
        animated={true}
        color={props.color}
        // icon={closeCircleOutline}
        position={'top'}
        buttons={[
          {
            side: 'end',
            icon: closeCircleOutline,
            // text: 'Favorite',
            handler: () => {props.closeToast(false)}
          },]}
      />
  )
}


