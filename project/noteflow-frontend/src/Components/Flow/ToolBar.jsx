import React, { useState, useRef, useEffect } from 'react';
import './FlowEditor.scss';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import './ToolBar.scss';
import {
  BsDot,
  BsNodePlus,
  BsArrowCounterclockwise,
  BsShare,
  BsPalette,
} from 'react-icons/bs';
import { BiFirstPage, BiCross } from 'react-icons/bi';
import { AiOutlineBorderlessTable } from 'react-icons/ai';

import Colabs from './Colabs';

export default function ToolBar({
  setTitle,
  addNode,
  title,
  changeBackground,
  onSave,
  flowWebSocket,
  flowId,
  subRef,
  isEdit,
}) {
  const [show, setShow] = useState(false);
  const inputRef = useRef(null);
  const [isFocus, setIsFocus] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    function checkFocus() {
      if (document.activeElement === inputRef.current) {
        setIsFocus(true);
      } else {
        setIsFocus(false);
      }
    }
    document.addEventListener('click', checkFocus);
    return () => {
      document.removeEventListener('click', checkFocus);
    };
  }, []);

  useEffect(() => {
    if (!isFocus && flowWebSocket) {
      flowWebSocket.editFlowTitle(title);
    }
  }, [isFocus]);

  return (
    <nav className="navbar">
      <div className="left">
        <Button
          variant="dark"
          onClick={() => onSave(title)}
          className="toolBarButton lastPageButton"
        >
          <BiFirstPage size={18} />
        </Button>
        <input
          className="flowTitle"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          type="text"
          ref={inputRef}
        />
        <span className="focus-border"></span>
      </div>
      <div className="mid">
        <div>
          <Button
            variant="dark"
            onClick={() => addNode()}
            className="toolBarButton addNodeButton"
          >
            <BsNodePlus size={18} />
          </Button>
        </div>
        <div>
          <Button
            variant="dark"
            onClick={handleShow}
            className="toolBarButton backwardButton"
          >
            <BsArrowCounterclockwise size={18} />
          </Button>
        </div>
        <Dropdown onSelect={(e) => changeBackground(e)}>
          <Dropdown.Toggle
            variant="dark"
            className="toolBarButton paletteButton"
          >
            <BsPalette size={18} />
          </Dropdown.Toggle>
          <Dropdown.Menu className="bgDropDown">
            <Dropdown.Item eventKey="lines">
              <AiOutlineBorderlessTable /> Lines
            </Dropdown.Item>
            <Dropdown.Item eventKey="dots">
              <BsDot /> Dots
            </Dropdown.Item>
            <Dropdown.Item eventKey="cross">
              <BiCross /> Cross
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="right">
        {!isEdit ? (
          <div ref={subRef} className="mouse-dot-subscribe"></div>
        ) : (
          <></>
        )}
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
