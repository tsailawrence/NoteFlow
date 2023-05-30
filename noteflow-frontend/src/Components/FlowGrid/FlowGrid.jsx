import React, { useEffect, useState, useRef } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Menu from '@mui/material/Menu';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useNavigate } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import instance from '../../API/api';
import { useApp } from '../../hooks/useApp';
import { useTranslation } from 'react-i18next';
import { usePageTab } from '../../hooks/usePageTab';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import BackToTopButton from '../BackToTopButton/BackToTopButton';
import './FlowGrid.scss';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FlowGrid({ containerRef }) {
  const { t, i18n } = useTranslation();
  const { isMobile, user } = useApp();
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  // 按右鍵的時候會出現的 menu
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 刪除 flow 會出現的警告
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  // 更改 flow 名稱時的警告
  const [isChangeTitleOpen, setIsChangeTitleOpen] = useState(false);

  const [focus, setFocus] = useState(null);

  const [target, setTarget] = useState(null);

  const navigateTo = useNavigate();
  const { tabList, addTab, deleteTab, renameTab } = usePageTab();
  const loadingCheckPointRef = useRef(null);
  const FlowButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[100]),
    backgroundColor: 'white',
    border: '1px black solid',
    '&:hover': {
      backgroundColor: grey[100],
      border: '1px grey solid',
    },
    width: '100%',
    aspectRatio: '3/2',
  }));
  const options = {
    root: null,
    threshold: 0,
  };
  const fetchFlows = async () => {
    const nextPage = page + 1;
    await instance
      .get('/flows', { params: { page } })
      .then((res) => {
        if (res.status === 200) {
          if (res.data.length == 0) {
            observeforFetching.unobserve(loadingCheckPointRef.current);
          } else {
            setFlows([
              ...flows,
              ...res.data.sort((a, b) =>
                a.updateAt < b.updateAt ? 1 : a.updateAt > b.updateAt ? -1 : 0,
              ),
            ]);
            setPage(nextPage);
          }
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const observeforFetching = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          await fetchFlows();
        }
      });
    }, options);
    let loadingCheckPointEle = loadingCheckPointRef.current;
    if (loadingCheckPointEle) observeforFetching.observe(loadingCheckPointEle);

    return () => {
      let loadingCheckPointEle = loadingCheckPointRef.current;
      if (loadingCheckPointEle)
        observeforFetching.unobserve(loadingCheckPointEle);
    };
  }, [page, loading]);

  useEffect(() => {
    if (!user) return;
    fetchFlows();
  }, [user]);

  const toFlow = (flow) => {
    addTab({
      type: 'flow',
      objectId: flow.id,
      name: flow.name ? flow.name : 'UnTitled',
    }); // name 應該在 flows/create 拿
    navigateTo(`/flow?id=${flow.id}`);
  };
  const handleCloseContextMenu = (event) => {
    console.log('click away');
    setTarget(null);
    setFocus(null);
    // setIsMenuOpen(false);
  };

  const deleteFlow = (id) => {
    instance
      .post('/flows/delete-flow', { id })
      .then((res) => {
        setFlows(flows.filter((flow) => flow.id !== id));
      })
      .catch((e) => {
        console.log(e);
      });

    if (tabList.find((f) => f.objectId == id)) {
      deleteTab(id);
    }
  };

  const changeTitle = (id, title) => {
    instance
      .post('flows/set-title', { id, title })
      .then((res) => {
        setFlows((fs) =>
          fs.map((flow) => {
            if (flow.id == id) {
              flow.name = title;
            }
            return flow;
          }),
        );
        renameTab(id, title);
      })
      .catch((e) => {
        console.log(e);
      });
    //change Title API
  };

  // 長按功能
  const pressTimer = useRef(null);

  const startPress = (event, flow) => {
    pressTimer.current = setTimeout(() => {
      setTarget(event.currentTarget);
      // setIsMenuOpen(flow.id);
      event.preventDefault();
      event.stopPropagation();
    }, 1000);
  };

  const cancelPress = () => {
    clearTimeout(pressTimer.current);
    pressTimer.current = null;
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="flow-grid">
      {isAlertOpen || isChangeTitleOpen ? (
        isAlertOpen ? (
          <Dialog
            open={isAlertOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setIsAlertOpen(false)}
          >
            <DialogTitle>
              {t('Do you want to delete the follow ') + focus.title + '?'}
            </DialogTitle>
            <DialogActions>
              <Button
                onClick={() => {
                  deleteFlow(focus.id);
                  setIsAlertOpen(false);
                }}
              >
                {t('Yes')}
              </Button>
              <Button onClick={() => setIsAlertOpen(false)}>
                {t('Cancel')}
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          <Dialog
            open={isChangeTitleOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setIsChangeTitleOpen(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>{t('Change Name')}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                fullWidth
                variant="standard"
                label={t('Flow Name')}
                multiline
                value={focus.value}
                onChange={(event) => {
                  setFocus((state) => {
                    state.title = event.target.value;
                    return state;
                  });
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  changeTitle(focus.id, focus.title);
                  setIsChangeTitleOpen(false);
                }}
              >
                {t('Confirm')}
              </Button>
              <Button onClick={() => setIsChangeTitleOpen(false)}>
                {t('Cancel')}
              </Button>
            </DialogActions>
          </Dialog>
        )
      ) : (
        <div
          className={`${isMobile ? 'flow-container-mobile' : 'flow-container'}`}
        >
          {flows.map((flow, key) => {
            console.log('flow', flow);
            const date = new Date();
            date.setTime(flow.updateAt);
            const formattedDate = date.toLocaleString();
            return (
              <div
                className="grid-item"
                onContextMenu={(event) => {
                  setTarget(event.currentTarget);
                  // setIsMenuOpen((prev) => !prev);
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onTouchStart={(event) => {
                  startPress(event, flow);
                }}
                onTouchEnd={cancelPress}
                key={key}
              >
                <FlowButton
                  onClick={() => toFlow(flow)}
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                >
                  {flow.thumbnail !== '' ? (
                    <img
                      style={{ objectFit: 'cover' }}
                      loading="lazy"
                      alt="flow.thumbnail"
                    />
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Typography>{t('Last Edit Time:')}</Typography>
                      <Typography>{formattedDate}</Typography>
                    </div>
                  )}
                </FlowButton>
                <Typography>{flow.name}</Typography>
                <ClickAwayListener
                  onClickAway={handleCloseContextMenu}
                  key={key}
                >
                  <Menu
                    // autoFocusItem={open}
                    open={!!target}
                    anchorEl={target}
                    anchorOrigin={{
                      vertical: 'center',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    style={{
                      border: '1px solid red',
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setFocus({
                          id: flow.id,
                          title: flow.name,
                        });
                        setIsChangeTitleOpen(true);
                      }}
                    >
                      {t('Rename')}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setFocus({
                          id: flow.id,
                          title: flow.name,
                        });
                        setIsAlertOpen(true);
                      }}
                    >
                      {t('Delete')}
                    </MenuItem>
                  </Menu>
                </ClickAwayListener>
              </div>
            );
          })}

          {containerRef?.current && (
            <BackToTopButton containerRef={containerRef} />
          )}
        </div>
      )}
      <div className="loading-checkpoint" ref={loadingCheckPointRef}>
        CHECKPOINT
      </div>
    </div>
  );
}
