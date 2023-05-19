import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';

import sharedb from 'sharedb/lib/client';
import richText from 'rich-text';
import { useApp } from '../hooks/useApp';
import { BASE_URL } from './api';
import quillEvent from './QuillEvent';

sharedb.types.register(richText.type);

const QuillContext = createContext({
  OpenEditor: () => {},
  setOnline: () => {},
  setTitle: () => {},
  setNewTitle: () => {},
  sendNewTitle: () => {},
  QuillRef: {},
  title: '',
  newTitle: '',
});

const collection = 'editor';

const colors = {};

const QuillProvider = (props) => {
  const [websocket, setWebsocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const [editor, setEditor] = useState(null);
  const [title, setTitle] = useState('');
  const [newTitle, setNewTitle] = useState(title);
  const [online, setOnline] = useState([]);

  const QuillRef = useRef();

  const { user } = useApp();

  const OpenEditor = async (editorId) => {
    const socket = new WebSocket(`wss://${BASE_URL}/ws/node?id=${editorId}`);
    const connection = new sharedb.Connection(socket);
    setWebsocket({ socket: socket, sharedb: connection, editorId: editorId });
    QuillRef.current !== null
      ? setQuill(QuillRef.current.getEditor())
      : console.error('NULL QUILL REFERENCE');
  };

  useEffect(() => {
    // 檢查 ws 連線，自動刪除無效連線的 cursor
    if (quill && editor) {
      const cursors = quill.getModule('cursors');
      const killed = Object.keys(colors).filter(
        (email) => !online.includes(email),
      );
      killed.forEach((email) => {
        delete colors[email];
        cursors.removeCursor(email);
      });
    }
  }, [online]);

  const sendNewTitle = (newTitle) => {
    if (quillEvent.localPresence) {
      const range = {
        type: 'change-title',
        title: newTitle,
        name: user.email,
      };
      quillEvent.localPresence.submit(range, (error) => {
        if (error) throw error;
      });
    }
  };

  useEffect(() => {
    if (!quill || !websocket) return;
    const editor = websocket.sharedb.get(collection, websocket.editorId);

    editor.subscribe((error) => {
      if (error) throw error;

      setEditor(editor);
      quill.setContents(editor.data);
      const presence = editor.connection.getDocPresence(
        collection,
        websocket.editorId,
      );

      presence.subscribe((error) => {
        if (error) throw error;
        quillEvent.offon(quill, editor, presence, user, {
          setTitle,
          setNewTitle,
        });
      });
    });
  }, [quill, websocket]);

  return (
    <QuillContext.Provider
      value={{
        OpenEditor,
        QuillRef,
        newTitle,
        setNewTitle,
        setOnline,
        title,
        setTitle,
        sendNewTitle,
      }}
      {...props}
    />
  );
};

const useQuill = () => useContext(QuillContext);

export { QuillProvider, useQuill };
