import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
import { Handle, Position, NodeToolbar, NodeResizer } from 'reactflow';
import Button from 'react-bootstrap/Button';
import './FlowEditor.scss';
import { MenuList, MenuItem, ListItemText, Input, Paper } from '@mui/material';
// import styled from "styled-components";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useParams } from '../../hooks/useParams';
import { useTranslation } from 'react-i18next';

const defaultTypeStyle = {
  // border: '0px',
  borderColor: 'transparent',
  borderRadius: 40,
  textAlign: 'center',
  // marginLeft: ,
  justifyContent: 'center',
  height: 50,
  width: 150,
  paddingLeft: 2,
  color: 'red',
  '& input.Mui-disabled': {
    WebkitTextFillColor: 'black',
  },
  // "&$focused": {
  //   borderColor: "transparent",
  // },
};

const CustomNode = ({ id, data }) => {
  const { t } = useTranslation();
  // const [isVisible, setVisible] = useState(false);
  const [isInputDisable, setIsInputDisable] = useState(true);
  const [isResizable, setIsResizable] = useState(false);
  const [label, setLabel] = useState(data.label);
  const { nodeMenuOpen, setNodeMenuOpen } = useParams();

  const onContextMenu = (event) => {
    event.preventDefault();
    // setVisible(true);
    setNodeMenuOpen(id);
  };

  const handleStopTyping = (event) => {
    if (event.keyCode == 13) {
      setIsInputDisable(true);
      data.onLabelStopEdit();
    }
  };
  const handleCloseMenu = () => {
    setNodeMenuOpen(null);
  };

  // 長按功能
  const pressTimer = useRef(null);

  const startPress = (event) => {
    event.preventDefault();
    pressTimer.current = setTimeout(() => {
      console.log('hi');
      // setVisible(true);
      setNodeMenuOpen(id);
    }, 1000);
  };

  const cancelPress = () => {
    clearTimeout(pressTimer.current);
    pressTimer.current = null;
  };

  // useEffect(() => {
  //   const element = document.getElementById(`react-node-${id}`);
  //   element.addEventListener('touchstart', () => {
  //     console.log('hi');
  //   });

  //   return () => {
  //     element.removeEventListener('touchstart', () => {
  //       console.log('hi');
  //     });
  //   };
  // }, []);

  return (
    <div
      // id={`react-node-${id}`}
      id={id}
      onContextMenu={onContextMenu}
    >
      {/* <div id={id} onDoubleClick={onContextMenu}> */}
      <NodeResizer
        minHeight={50}
        minWidth={150}
        handleStyle={{ padding: '3px' }}
        lineStyle={{ border: '1px solid', borderColor: '#1e88e5' }}
        isVisible={isResizable}
      />
      <NodeToolbar
        isVisible={nodeMenuOpen == id}
        position={data.toolbarPosition}
      >
        <ClickAwayListener onClickAway={handleCloseMenu}>
          <Paper>
            <MenuList>
              {/* <MenuItem onClick={() => setIsResizable(!isResizable)}>
                <ListItemText>
                  {isResizable ? 'Complete' : 'Resize'}
                </ListItemText>
              </MenuItem> */}
              <MenuItem
                onClick={(event) => {
                  data.onLabelChange(id, event);
                  data.onLabelEdit(id);
                  setIsInputDisable(false);
                  setNodeMenuOpen(null);
                }}
              >
                <ListItemText>{t('Rename')}</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => data.openStyleBar(id)}>
                <ListItemText>{t('Change Style')}</ListItemText>
              </MenuItem>
              {/* <MenuItem onClick={() => setVisible(setNodeMenuOpen(null))}>
                <ListItemText>CloseMenu</ListItemText>
              </MenuItem> */}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </NodeToolbar>
      {/* <ClickAwayListener onClickAway={handleCloseMenu}> */}
      <Input
        sx={defaultTypeStyle}
        value={label}
        onChange={(event) => {
          setLabel(event.target.value);
          data.label = event.target.value;
          data.editLabel(id, event.target.value);
        }}
        disabled={isInputDisable}
        onKeyDown={() => handleStopTyping(event)}
      />
      {/* </ClickAwayListener> */}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(CustomNode);
