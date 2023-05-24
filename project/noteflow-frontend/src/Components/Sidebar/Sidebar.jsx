import React, { useEffect, useState } from "react";
import "./Sidebar.scss";
import { FaPen, FaBook, FaCalendarAlt } from "react-icons/fa";
import { AiTwotoneSetting } from "react-icons/ai";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useFlowStorage } from "../../storage/Storage";
// import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "../../hooks/useApp";

const Sidebar = () => {
  //rwd
  const { isMobile } = useApp();

  const { t } = useTranslation();
  const changeMode = useFlowStorage((state) => state.changeMode);
  const mode = useFlowStorage((state) => state.mode);
  // const tabList = useFlowStorage((state) => state.tabList);
  // const location = useLocation();

  const SideBarItem = styled(Box)(({ selected }) => ({
    cursor: "pointer",
    color: selected ? "black" : "white",
    // color: selected ? "white" : "grey",
    width: "70%",
    height: "8px",
    marginTop: isMobile ? "0px" : "10px",
    padding: isMobile ? "0px" : "20px",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderTopRightRadius: "50px",
    borderBottomRightRadius: "50px",
    backgroundColor: "black",
    backgroundColor: selected ? "white" : "black",

    ...(isMobile && {
      color: selected ? "white" : "grey",
      borderTopRightRadius: "",
      borderBottomRightRadius: "",
      backgroundColor: "",
      marginTop: "",
    }),
  }));

  const SideBarText = styled("div")(() => ({
    lineHeight: "2",
    width: "55%",
  }));

  // useEffect(() => {
  //   console.log("change color");
  //   const all = document.querySelectorAll(".sidebar-item");
  //   for (let index = 0; index < all.length; index++) {
  //     // 按鈕顏色互斥
  //     if (index === mode) {
  //       all[index].style.backgroundColor = "white";
  //       all[index].style.color = "black";
  //       // all[index].firstChild.style.color = "black";
  //     }
  //   }
  // }, [mode, tabList, location, t]);

  // useEffect(() => {
  //   const all = document.querySelectorAll(".sidebar-item-mobile");
  //   for (let index = 0; index < all.length; index++) {
  //     // 按鈕顏色互斥
  //     if (index === mode) {
  //       all[index].style.backgroundColor = "white";
  //       all[index].style.color = "black";
  //       // all[index].firstChild.style.color = "black";
  //     }
  //   }
  // }, [mode, tabList, location, t]);

  return (
    <>
      {isMobile ? (
        <Stack direction="row" className="sidebar-mobile">
          <SideBarItem
            className="sidebar-item-mobile"
            onClick={() => changeMode(0)}
            selected={mode === 0}
          >
            <FaPen size={20} />
            {/* <SideBarText className="sidebar-text-mobile">
              {t("Flows")}
            </SideBarText> */}
          </SideBarItem>
          <SideBarItem
            className="sidebar-item-mobile"
            onClick={() => changeMode(1)}
            selected={mode === 1}
          >
            <FaBook size={20} />
            {/* <SideBarText className="sidebar-text-mobile">
              {t("Library")}
            </SideBarText> */}
          </SideBarItem>

          <a className="logo" href="/home">
            <img src="assets/logo.png" alt="" />
          </a>

          <SideBarItem
            className="sidebar-item-mobile"
            onClick={() => changeMode(2)}
            selected={mode === 2}
          >
            <FaCalendarAlt size={20} />
            {/* <SideBarText className="sidebar-text-mobile">
              {t("Calendar")}
            </SideBarText> */}
          </SideBarItem>
          <SideBarItem
            className="sidebar-item-mobile"
            onClick={() => changeMode(3)}
            selected={mode === 3}
          >
            <AiTwotoneSetting size={20} />
            {/* <SideBarText className="sidebar-text-mobile">
              {t("Settings")}
            </SideBarText> */}
          </SideBarItem>
        </Stack>
      ) : (
        <Stack className="sidebar">
          <a className="logo" href="/home">
            <img src="assets/logo.png" alt="" width="60" height="60" />
          </a>
          <SideBarItem
            className="sidebar-item"
            onClick={() => changeMode(0)}
            selected={mode === 0}
          >
            <FaPen size={20} style={{ width: "45%" }} />
            <SideBarText>{t("Flows")}</SideBarText>
          </SideBarItem>
          <SideBarItem
            className="sidebar-item"
            onClick={() => changeMode(1)}
            selected={mode === 1}
          >
            <FaBook size={20} style={{ width: "45%" }} />
            <SideBarText>{t("Library")}</SideBarText>
          </SideBarItem>
          <SideBarItem
            className="sidebar-item"
            onClick={() => changeMode(2)}
            selected={mode === 2}
          >
            <FaCalendarAlt size={20} style={{ width: "45%" }} />
            <SideBarText>{t("Calendar")}</SideBarText>
          </SideBarItem>
          <SideBarItem
            className="sidebar-item"
            onClick={() => changeMode(3)}
            selected={mode === 3}
          >
            <AiTwotoneSetting size={20} style={{ width: "45%" }} />
            <SideBarText>{t("Settings")}</SideBarText>
          </SideBarItem>
        </Stack>
      )}
    </>
  );
};

export default Sidebar;
