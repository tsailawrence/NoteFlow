import React, { useEffect, useState } from 'react';
import { Modal, Backdrop, Box, Fade, Button } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import './EditorSettings.scss';
import instance from '../../API/api';
import { useApp } from '../../hooks/useApp';
import { useTranslation } from 'react-i18next';

const Settings = ({ editorId, setShowSettings }) => {
  const [allColabs, setAllColabs] = useState(null);
  const [rerender, setRerender] = useState(false);
  const [colabInput, setColabInput] = useState('');
  const [alarms, setAlarms] = useState('');
  const { user } = useApp();
  const { t } = useTranslation();

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
          res.data.map((data, index) => {
            if (data.status !== 200) {
              canClose = false;
              if (data.type === 'remove') {
                res.data[index].type = 'original';
              }
            }
          });
          setAllColabs(res.data);
          if (canClose) {
            // setShow(false);
            setShowSettings(false);
          }
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
    <div className="editor-settings">
      <div className="share-box">
        {/* <div className="title"> */}
        <h2> {t('Share Node')}</h2>
        {/* </div> */}
        <TextField
          margin="normal"
          // required
          fullWidth
          name="colabs"
          label=""
          type="text"
          id="colabs"
          size="small"
          value={colabInput}
          // placeholder="新增使用者"
          onChange={(e) => {
            setColabInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (allColabs)
                setAllColabs((state) => [
                  ...state,
                  { email: colabInput, type: 'new', status: 200 },
                ]);
              else
                setAllColabs([{ email: colabInput, type: 'new', status: 200 }]);
              setColabInput('');
            }
          }}
          InputProps={{
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              // position: 'relative',
              // height: '100%',
            },
            startAdornment:
              allColabs === null
                ? undefined
                : //  (
                  // <div
                  //   className="adorment"
                  //   style={{
                  //     marginRight: '10px',
                  //     display: 'flex',
                  //     flexWrap: 'wrap',
                  //     height: '70%',
                  //     width: 'calc(100% - 5px)',
                  //     overflowY: 'scroll',
                  //   }}
                  // >
                  // {
                  allColabs.map((data, index) => {
                    return data.type === 'remove' ? (
                      // <div
                      //   id={`colab-node-${index}`}
                      //   key={`colab-node-${index}`}
                      //   style={{ display: 'none' }}
                      // ></div>
                      <></>
                    ) : (
                      <div
                        id={`colab-node-${index}`}
                        key={`colab-node-${index}`}
                        className="colab-tags"
                      >
                        {data.email}
                        {data.email !== user.email && (
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
                            // style={{
                            //   cursor: 'pointer',
                            //   display: 'flex',
                            //   alignItems: 'center',
                            //   justifyContent: 'center',
                            // }}
                          >
                            <CloseIcon />
                          </div>
                        )}
                      </div>
                    );
                  }),
            // }
            // </div>
            // ),
          }}
        />
        <div
          style={{
            color: 'red',
            height: '18px',
            textAlign: 'left',
            padding: '0 5px 0 5px',
          }}
        >
          {alarms}
        </div>
        <div className="buttons">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            variant="contained"
            style={{
              borderRadius: '30px',
              border: 'black solid 1px',
              color: 'black',
              textTransform: 'none',
              width: '120px',
              height: '50px',
              display: 'flex',
              gap: '2px',
            }}
          >
            <LinkIcon />
            {t('Copy Link')}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            style={{
              backgroundColor: '#0e1111',
              height: '50px',
              borderRadius: '30px',
              color: 'white',
              paddingTop: '5px',
              width: '80px',
              textTransform: 'none',
            }}
          >
            {t('Done')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
