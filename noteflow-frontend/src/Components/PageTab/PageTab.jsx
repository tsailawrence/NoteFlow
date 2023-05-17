import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import { styled, createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { Toolbar, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { FaHome } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import instance from "../../API/api";
import { useApp } from "../../hooks/useApp";
import { usePageTab } from "../../hooks/usePageTab";
import { FaPen, FaBook, FaCalendarAlt } from "react-icons/fa";

export default function PageTab() {
  const { tabList, addTab, closeTab, toTab, activeTab } = usePageTab();
  const { user } = useApp();
  const navigate = useNavigate();
  const TabButton = styled(Button)(({ theme }) => ({
    backgroundColor: grey[700],
    border: "0px",
    borderColor: grey[700],
    "&:hover": {
      backgroundColor: grey[600],
      border: "0px",
    },
    width: 120,
    height: 35,
  }));

  const CloseButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[100]),
    backgroundColor: grey[700],
    border: "0px",
    "&:hover": {
      backgroundColor: grey[600],
      border: "0px",
    },
    width: 40,
    height: 35,
  }));
  const backToHome = () => {
    navigate("/home");
  };

  const addNewFlow = () => {
    instance
      .post("flows/create", { user })
      .then(async (res) => {
        if (res.status === 200) {
          navigate(`/flow?id=${res.data}`);
          addTab({ type: "flow", objectId: res.data, name: "undefined" }); // name 應該在 flows/create 拿
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      {/* {changeTab && <Navigate to="/flow" state={{ flowNow }}/>} */}
      <Toolbar
        sx={{
          backgroundColor: "black",
          paddingBottom: 0,
          height: "7%",
          maxHeight: "30px",
        }}
        className="toolbar"
        direction="row"
        spacing={2}
      >
        <IconButton
          size="medium"
          onClick={backToHome}
          style={{ marginRight: "10px" }}
        >
          <FaHome color="white" size={20} />
        </IconButton>
        <Stack direction="row" spacing={1}>
          {tabList.map((tab, i) => {
            let tabTitle = tab.name;
            if (tabTitle?.length > 15) {
              tabTitle = tabTitle.substring(0, 14) + "...";
            }

            return (
              <ButtonGroup color="primary" variant="outlined" key={i}>
                <TabButton
                  onClick={() => {
                    toTab(tab.tabId);
                  }}
                  style={{
                    backgroundColor: tab.tabId == activeTab && "#ffffff",
                    position: "relative",
                  }}
                >
                  <Typography
                    color={tab.tabId == activeTab ? "black" : "white"}
                  >
                    {tabTitle}
                  </Typography>
                  <div
                    className="tabIcon"
                    style={{
                      position: "absolute",
                      top: "20%",
                      right: "3px",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {tab.type == "node" ? <FaBook /> : <FaPen />}
                  </div>
                </TabButton>
                <CloseButton
                  size="small"
                  style={{
                    backgroundColor: tab.tabId == activeTab && "#ffffff",
                  }}
                  onClick={() => closeTab(tab.tabId)}
                >
                  <RxCross2
                    color={tab.tabId == activeTab ? "black" : "white"}
                    size={15}
                  />
                </CloseButton>
              </ButtonGroup>
            );
          })}
        </Stack>
        <IconButton size="medium" onClick={addNewFlow}>
          <FaPlus color="white" size={15} />
        </IconButton>
      </Toolbar>
    </>
  );
}
