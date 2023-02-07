import React from 'react';
import { Link } from 'react-router-dom';
import SideBar from './sideBar';
// import SidebarElement from "./SidebarElement"

export default function SidebarElement(props) {
    async function expandDropDown (e) {
        // console.log("id of element selected", e)
        var dropdown = document.getElementById(e);
    
        dropdown.classList.toggle("active");
        var dropdownContent = dropdown.nextElementSibling;
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
        } else {
          dropdownContent.style.display = "block";
        }
      }
    return (
        <>
            
            {props.menuItem.child && props.menuItem.child.length ?
                <>
                    <li id ={props.menuItem.id} className="sideBarElement" onClick={()=>{expandDropDown(props.menuItem.id)}}>{props.menuItem.name} <i className="down-icon fas fa-angle-down"></i></li>
                    <div className="dropdown-container">
                      <SideBar menu={props.menuItem.child}/>
                    </div>
                </>
                : <Link to={props.menuItem.redirect} style={{ textDecoration: 'none' }}><li className='sideBarElement'>{props.menuItem.name}</li></Link>
            }
        </>
    );
}
