
import React from 'react';
import menulist from "../menuConfig.json"
// import { useEffect, useState } from "react";
// import Interweave from "interweave";
import SideBar from '../component/Sidebar/sideBar';
import { Outlet } from 'react-router-dom';
import "./Layout.css"

export default function Layout() {
    return (
        <div className='layout'>
            <div className="sideNav">
                <SideBar menu={menulist}></SideBar>
            </div>
            <div className="dashboardContainer">
            <Outlet className="main"/>
            </div>
        </div>
        );
}