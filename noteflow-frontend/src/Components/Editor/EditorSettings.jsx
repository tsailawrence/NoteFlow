import React, { useEffect, useState } from 'react';
import { Modal, Backdrop, Box, Fade, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import './EditorSettings.scss';
import instance from '../../API/api';

const Settings = ({ editorId }) => {
  const [allColabs, setAllColabs] = useState(null);
  const [rerender, setRerender] = useState(false);
  const [colabInput, setColabInput] = useState('');
  const [alarms, setAlarms] = useState('');

  useEffect(() => {
    instance
      .get(`/nodes/get-colab-list?id=${editorId}`)
      .then((res) => {
        const new_array = new Array(res.data.length);
        for (let i = 0; i < res.data.length; i++) {
          new_array[i] = {
            email: res.data[i],
            type: 'original',
            status: 200,
          };
        }
        setAllColabs(new_array);
      })
      .catch((e) => {
        console.log('wrong:', e);
      });
    setColabInput('');
  }, []);

  const handleSubmit = async () => {
    instance
      .post('/nodes/revise-colab-list', { colabs: allColabs, id: editorId })
      .then((res) => {
        if (res.status === 200) {
          let canClose = true;
          console.log(res.data);
          res.data.map((data, index) => {
            if (data.status !== 200) {
              canClose = false;
              if (data.type === 'remove') {
                res.data[index].type = 'original';
              }
            }
          });
          setAllColabs(res.data);
        }
      })
      .catch((e) => {
        switch (e.response.status) {
          case 401: // 沒有登入
            return setAlarms('You have not logged in yet.');
          case 402: // 提供不充分的資料
            return setAlarms('Error. Reopen the window and try again.');
          case 403: // 沒有權限使用
            return setAlarms('You are not authorized to edit this.');
          default:
            return setAlarms('Internal server error.');
        }
      });
  };

  useEffect(() => {
    if (allColabs) {
      allColabs.forEach((data, index) => {
        const each = document.querySelector(`#colab-node-${index}`);
        if (data.status === 200) {
          each.style.border = undefined;
        } else {
          each.style.border = '1px solid red';
        }
      });
    }
  }, [allColabs]);

  return (
    <div className="editor-input" id="editor-settings">
      {allColabs === null ? <h2>載入中⋯</h2> : <h2>使用者清單</h2>}
      <TextField
        margin="normal"
        // required
        fullWidth
        multiline
        name="colabs"
        label=""
        type="text"
        id="colabs"
        size="small"
        value={colabInput}
        onChange={(e) => {
          setColabInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            setAllColabs((state) => [
              ...state,
              { email: colabInput, type: 'new', status: 200 },
            ]);
            setColabInput('');
          }
        }}
        InputProps={{
          style: {
            display: 'flex',
            flexWrap: 'wrap',
          },
          startAdornment:
            allColabs === null
              ? undefined
              : allColabs.map((data, index) => {
                  return data.type === 'remove' ? (
                    <></>
                  ) : (
                    <div
                      id={`colab-node-${index}`}
                      key={`colab-node-${index}`}
                      className="colab-tags"
                    >
                      {data.email}
                      <div
                        onClick={() => {
                          setAllColabs((state) => {
                            // 如果是 new，可以直接 filter 掉，
                            if (state[index].type === 'new') {
                              return state.filter((d, i) => i !== index);
                            }
                            state[index].type = 'remove';
                            return state;
                          });
                          setRerender((state) => !state);
                        }}
                      >
                        <CloseIcon />
                      </div>
                    </div>
                  );
                }),
        }}
      />
      <div
        style={{
          color: 'red',
          height: '18px',
          // border: '1px solid black',
          textAlign: 'left',
          padding: '0 5px 0 5px',
        }}
      >
        {alarms}
      </div>
      <Button
        onClick={handleSubmit}
        variant="contained"
        sx={{ mt: 2, mb: 2 }}
        style={{
          backgroundColor: '#0e1111',
          color: 'white',
          paddingTop: '2%',
          textTransform: 'none',
        }}
      >
        更新清單
      </Button>
    </div>
  );
};

export default Settings;
