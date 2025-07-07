import React from "react";
import { NavbarRoutes } from "./navbar-routes";
import MobileSideBar from "./mobile-side-bar";
export const Navbar=()=>{

    return (<div className="p-4 border-b flex items-center bg-white shadow-sm">
        
        
        {/* <MobileSideBar */}
        <MobileSideBar />
        {/* sidebar routes */}
        <NavbarRoutes />
    </div>
    )

}