import React from 'react';
import SidebarElement from './SidebarElement';
import { Text } from "@nextui-org/react";

// import { useEffect } from "react";

export default function SideBar(props) {
  // useEffect(() => {
  //   console.log("menuBar",props.menu);
  // }, []);

  return (
    <>
      <div className='userName'>
        <Text
          css={{
            fontSize: "19px",
            fontFamily: "Lobster",
            letterSpacing: "8px",
            color: "#d2f3c5"
          }}
          b>
          WorkFitt
        </Text>
      </div>
      <ul className='sidebarUl'>

        {
          props.menu.map((element) => {
            return (
              <SidebarElement menuItem={element} />
            )
          })
        }
      </ul>
    </>
  );

}