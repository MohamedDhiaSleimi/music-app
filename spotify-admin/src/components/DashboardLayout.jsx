import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex items-start min-h-screen">
      <Sidebar />
      <div className="flex-1 h-screen overflow-y-scroll bg-[#fcfffd]">
        <Navbar />
        <div className="pt-8 pl-5 sm:pt-12 sm:pl-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
