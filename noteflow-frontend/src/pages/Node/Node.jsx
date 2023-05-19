import PageTab from '../../Components/PageTab/PageTab';
import { Editor } from '../../Components/Editor/Editor';
import { useNavigate } from 'react-router-dom';
import { useQuill } from '../../API/useQuill';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getRandomPicture, useApp } from '../../hooks/useApp';
import { Colab } from '../../API/Colab';
import './Node.scss';
import instance from '../../API/api';

const Node = ({ nodeId, setIsEdit, nodeWidth }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editorId = nodeId ? nodeId : searchParams.get('id');
  const { OpenEditor, QuillRef, newTitle, setNewTitle, setTitle } = useQuill();
  const [colab, setColab] = useState([]);
  const [colabPicture, setColabPicture] = useState({});
  const { user } = useApp();
  const navigateTo = useNavigate();
  const handleDrawerClose = () => {
    if (!nodeId) navigateTo('/home');
    else setIsEdit(false);
  };

  useEffect(() => {
    if (!editorId) return;
    console.log('open editor', editorId);
    OpenEditor(editorId);
    instance.get(`/nodes/get-title?id=${editorId}`).then((res) => {
      setTitle(res.data);
      setNewTitle(res.data);
    });
    const connection = new Colab(editorId, user.email, (members) => {
      setColab(members);
      members.map((email) => {
        if (!(email in colabPicture)) {
          instance.get(`/user/get-photo-url?email=${email}`).then((res) => {
            const url = res.data;
            if (url) {
              setColabPicture((state) => {
                state[email] = `/api/${url}`;
                return state;
              });
            } else {
              setColabPicture((state) => {
                state[email] = getRandomPicture(email);
                return state;
              });
            }
          });
        }
      });
    });
    return () => {
      console.log('CLOSING colab connection');
      connection.close();
    };
  }, [editorId]);

  return (
    <div
      className="Node-container"
      style={nodeId && { width: `${nodeWidth}px` }}
    >
      <div className="editor">
        <Editor
          editorId={editorId}
          handleDrawerClose={handleDrawerClose}
          QuillRef={QuillRef}
          colab={colab}
          colabPicture={colabPicture}
        />
      </div>
    </div>
  );
};
export default Node;
