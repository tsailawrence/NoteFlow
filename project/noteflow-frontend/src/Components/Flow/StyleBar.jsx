import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import "./FlowEditor.scss";

const drawerWidth = 250;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export default function StyleBar({ isOpen, data }) {
  const theme = useTheme();
  const [open, setOpen] = useState(isOpen);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Box className="styleBar">
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List>
          <ListItem sx={{ fontSize: "20px", marginBottom: "10px" }}>
            Border Style
          </ListItem>
          <Grid container spacing={2}>
            <Grid sx={{ justifyContent: "flex-start" }} item xs={6}>
              <p>Color</p>
            </Grid>
            <Grid item xs={6}>
              <input
                className="borderColorSelector"
                type="color"
                // onChange={data.onChange}
                // defaultValue={data.color}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid sx={{ justifyContent: "flex-start" }} item xs={6}>
              <p>Width</p>
            </Grid>
            <Grid item xs={6}>
              <Select sx={{ height: "25px", width: "50px" }}>
                <MenuItem>1</MenuItem>
                <MenuItem>2</MenuItem>
                <MenuItem>3</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Divider variant="middle" />
          <ListItem sx={{ fontSize: "20px", marginBottom: "10px" }}>
            Node Color
          </ListItem>
          <Grid container spacing={2}>
            <Grid sx={{ justifyContent: "flex-start" }} item xs={6}>
              <p>Color</p>
            </Grid>
            <Grid item xs={6}>
              <input
                className="borderCåolorSelector"
                type="color"
                // onChange={data.onChange}
                // defaultValue={data.color}
              />
            </Grid>
          </Grid>
          <Divider />
          <ListItem sx={{ fontSize: "20px", marginBottom: "10px" }}>
            Node Style
          </ListItem>
          <div onDragStart={(event) => onDragStart(event, "input")} draggable>
            <p>Left Right Handler</p>
            <img src="src/assets/left_right_node.png" width="250" />
          </div>
          <div onDragStart={(event) => onDragStart(event, "input")} draggable>
            <p>Top Down Handler</p>
            <img src="src/assets/top_down_node.png" width="250" />
          </div>
          <div onDragStart={(event) => onDragStart(event, "input")} draggable>
            <p>All Handler</p>
            <img src="src/assets/four_node.png" width="250" />
          </div>
        </List>
      </Drawer>
    </Box>
  );
}
