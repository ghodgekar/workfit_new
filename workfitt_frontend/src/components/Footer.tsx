import { IonIcon, IonLabel, IonTabBar, IonTabButton } from "@ionic/react"
import { ellipse, square, triangle } from "ionicons/icons"
import React from "react"

const Footer: React.FC = () => {
    return (
        <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/">
                <IonIcon icon={triangle} />
                <IonLabel>Hello</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/">
                <IonIcon icon={ellipse} />
            </IonTabButton>
            <IonTabButton tab="tab3" href="/">
                <IonIcon icon={square} />
            </IonTabButton>
        </IonTabBar>
    )
}

export default Footer
