import React, { useEffect, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import EditorToolbar, { modules, formats } from './EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import './Editor.scss';
import { IoIosArrowBack } from 'react-icons/io';
import { BsShare } from 'react-icons/bs';
import { useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { getRandomPicture, useApp } from '../../hooks/useApp';
import { Button, IconButton } from '@mui/material';
import instance from '../../API/api';
import EditorSettings from './EditorSettings';
import { useQuill } from '../../API/useQuill';

window.katex = katex;
const Editor = ({ handleDrawerClose, QuillRef, colab, editorId }) => {
  const [state, setState] = useState({
    title: '',
    value: '',
  });
  const [showSettings, setShowSettings] = useState(false);
  const { isMobile } = useApp();

  useEffect(() => {
    setState({
      title: '',
      value: '',
    });
  }, []);

  const { newTitle, sendNewTitle, setNewTitle } = useQuill();

  useEffect(() => {
    // quill-editor, editor-settings
    const toolbar = document.querySelector('#toolbar');
    const editor = document.querySelector('#quill-editor');

    if (showSettings) {
      toolbar.style.pointerEvents = 'none';
      toolbar.style.opacity = '0.5';

      editor.style.display = 'none';
    } else {
      toolbar.style.pointerEvents = 'auto';
      toolbar.style.opacity = '1';

      editor.style.display = '';
    }
  }, [showSettings]);

  return (
    <div className={`${isMobile ? 'editor-mobile' : 'editor'}`}>
      <div className="header">
        <IconButton
          size="large"
          onClick={() => {
            handleDrawerClose();
          }}
        >
          <IoIosArrowBack size={20} />
        </IconButton>
        <input
          className="title-input"
          type="text"
          placeholder="Untitled..."
          value={newTitle}
          onChange={(e) => {
            console.log('e', e.target.value);
            setNewTitle(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendNewTitle(newTitle);
              instance
                .post('/nodes/set-title', {
                  id: editorId,
                  title: newTitle,
                })
                .then((res) => {
                  console.log(res.status);
                });
            }
          }}
        />
        <Button
          variant="dark"
          onClick={() => setShowSettings((state) => !state)}
          className="toolBarButton"
        >
          <BsShare size={18} />
        </Button>
        <span className="focus-border"></span>
        <div className="users">
          {colab.map((element, index) => {
            return (
              <div className="user" key={index}>
                <img src={getRandomPicture(element)} alt="" />
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-editor">
        <EditorToolbar />
        {showSettings ? <EditorSettings editorId={editorId} /> : <></>}
        <ReactQuill
          theme="snow"
          value={state}
          onChange={setState}
          placeholder={'Write something awesome...'}
          modules={modules}
          formats={formats}
          className="editor-input"
          id="quill-editor"
          ref={QuillRef}
        />
      </div>
    </div>
  );
};

export { Editor };
