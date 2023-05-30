import React, { useState, useRef, useEffect } from 'react';
import './FlowEditor.scss';
import Button from '@mui/material/Button';
import './ToolBar.scss';
import {
  BsDot,
  BsBookmarkHeart,
  BsNodePlus,
  BsShare,
  BsPalette,
} from 'react-icons/bs';
import { BiFirstPage, BiCross } from 'react-icons/bi';
import { AiOutlineBorderlessTable, AiOutlineEdit } from 'react-icons/ai';
import { Menu, MenuItem } from '@mui/material';
import { usePageTab } from '../../hooks/usePageTab';
import Colabs from './Colabs';
import { useTranslation } from 'react-i18next';

export default function ToolBar({
  addNode,
  backToHome,
  changeBackground,
  flowId,
  subRef,
  isEdit,
  isNodeSelected,
  handleNodeBarOpen,
  openNodeContextMenu,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const { flowWebSocket, renewFlowWebSocket } = usePageTab();
  const handleShow = () => setShow(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const changeBG = (bg) => {
    changeBackground(bg);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="navbar">
      <div className="left">
        <Button
          variant="dark"
          onClick={() => {
            backToHome();
            renewFlowWebSocket(null);
          }}
          className="toolBarButton lastPageButton"
        >
          <BiFirstPage size={18} />
        </Button>
      </div>
      <div className="mid">
        <Button
          variant="dark"
          onClick={() => addNode()}
          className="toolBarButton addNodeButton"
        >
          <BsNodePlus size={18} />
        </Button>
        {/* 調色盤，需要 handleClick */}
        <Button variant="dark" onClick={handleClick} className="toolBarButton">
          <BsPalette size={18} />
        </Button>
        <Menu
          // id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem key="lines" onClick={() => changeBG('lines')}>
            <AiOutlineBorderlessTable /> {t('Lines')}
          </MenuItem>
          <MenuItem key="dots" onClick={() => changeBG('dots')}>
            <BsDot /> {t('Dots')}
          </MenuItem>
          <MenuItem key="cross" onClick={() => changeBG('cross')}>
            <BiCross /> {t('Cross')}
          </MenuItem>
        </Menu>
        <Button
          variant="dark"
          className="toolBarButton"
          onClick={handleNodeBarOpen}
        >
          <BsBookmarkHeart size={18} />
        </Button>
        <Button
          variant="dark"
          className="toolBarButton"
          onClick={openNodeContextMenu}
          disabled={isNodeSelected == null ? true : false}
        >
          <AiOutlineEdit size={18} />
        </Button>
      </div>
      <div className="right">
        <div
          ref={subRef}
          style={{ display: isEdit ? 'none' : 'flex' }}
          className="mouse-dot-subscribe"
        ></div>
        <Button
          variant="dark"
          onClick={handleShow}
          className="toolBarButton shareButton"
        >
          <BsShare size={18} />
        </Button>
      </div>
      <Colabs // modal
        show={show}
        setShow={setShow}
        flowId={flowId}
        handleClose={handleClose}
      />
    </nav>
  );
}
