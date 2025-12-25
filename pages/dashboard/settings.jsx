import React from "react";
import DashBoardNavBar from "../../components/DashBoardNavBar/DashBoardNavBar";
import DashBoardSidebar from "../../components/DashBoardSidebar/DashBoardSidebar";
import Settings from "../../components/Settings/Settings";

const SettingsPage = () => {
  return (
    <div>
      <DashBoardNavBar />
      <DashBoardSidebar>
        <Settings />
      </DashBoardSidebar>
    </div>
  );
};

export default SettingsPage;
