import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { StaticDatePicker, MobileDatePicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './Calendar.scss';
import { useTranslation } from 'react-i18next';
import { Editor } from '../../Components/Editor/Editor';
import { useApp } from '../../hooks/useApp';
import { useState, useEffect } from 'react';
import instance from '../../API/api';

const Calendar = () => {
  const { isMobile } = useApp();
  const { t } = useTranslation();
  const [nodes, setNodes] = useState([]);
  const [editorId, setEditorId] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  //用這個控制 mobile 時候 editor 要不要顯示，顯示的時候隱藏 search 跟 nodes
  const [mobileEditorDisplay, setMobileEditorDisplay] = useState(false);

  const NodeButton = styled(Button)(({ theme, selected }) => ({
    color: theme.palette.getContrastText(grey[100]),
    fontSize: '12px',
    backgroundColor: selected ? '#E0E0E0' : 'white',
    borderRadius: selected ? '5px' : '0',
    '&:hover': {
      backgroundColor: selected ? '#E0E0E0' : grey[100],
    },
    width: '90%',
    height: 70,
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '95%',
      height: '1px',
      backgroundColor: '#E0E0E0',
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }));
  const getDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const dateString = year + '-' + month + '-' + day;
    return dateString;
  };
  const getTime = (time) => {
    const now = new Date();
    const timeDiff = now - time;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor(timeDiff / (1000 * 60));
    if (days >= 1) {
      return { time: days, unit: days === 1 ? 'day' : 'days' };
    } else if (hours >= 1) {
      return { time: hours, unit: hours === 1 ? 'hour' : 'hours' };
    } else {
      return { time: minutes, unit: minutes <= 1 ? 'minute' : 'minutes' };
    }
  };
  const toNode = (id) => {
    setEditorId(id);
  };
  const getNodes = (flag) => {
    instance
      .get('/library')
      .then((res) => {
        console.log('fetch');
        setNodes(res.data);
        if (res.data.length !== 0 && flag === 0) {
          setEditorId(res.data[0].id);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const createInterval = () => {
    const interval = setInterval(() => {
      getNodes(1);
    }, 2000);
    setIntervalId(interval);
  };
  useEffect(() => {
    if (intervalId === null) {
      getNodes(0);
      createInterval();
    } else if (intervalId === '') {
      createInterval();
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);
  const [date, setDate] = useState(dayjs(getDate()));
  const handleChange = (selectedDate) => {
    setDate(selectedDate);
    clearInterval(intervalId);
    setIntervalId('');
  };

  return (
    <Grid container columns={12} sx={{ p: 0, m: 0, height: '100%' }}>
      {/* <Grid item xs={6}> */}
      <Grid item xs={12} md={4}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {isMobile ? (
            <MobileDatePicker
              defaultValue={dayjs(getDate())}
              autoFocus={true}
              format="YYYY-DD-MM"
              sx={{
                width: '100%',
                display: mobileEditorDisplay ? 'none' : 'flex',
              }}
            />
          ) : (
            <StaticDatePicker
              value={date}
              autoFocus={true}
              sx={{ width: '100%' }}
              onChange={handleChange}
            />
          )}
        </LocalizationProvider>
      </Grid>
      <Grid
        item
        xs={12}
        md={3}
        sx={{
          //手機不顯示 border
          borderLeft: isMobile ? 'none' : '1px solid black',
          paddingTop: '1vmin',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'top',
          alignItems: 'center',
          display: mobileEditorDisplay ? 'none' : 'flex',
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'scroll',
        }}
      >
        {nodes
          .filter((node) => {
            if (date === '') {
              return true;
            }
            return (
              dayjs(node.updateAt).format('YYYY-MM-DD') ===
              date.format('YYYY-MM-DD')
            );
          })
          .map((node) => {
            const editTime = getTime(node.updateAt);
            return (
              <NodeButton
                className="node-button"
                onClick={() => {
                  toNode(node.id);
                  if (isMobile === true) {
                    setMobileEditorDisplay(true);
                  }
                }}
                key={node.id}
                selected={node.id === editorId}
              >
                <Typography sx={{ fontSize: '12px' }}>{node.name}</Typography>
                <Typography sx={{ fontSize: '12px' }}>
                  {t('Last Edit Time:')} {editTime.time}
                  {' ' + t(editTime.unit) + t('ago')}
                </Typography>
              </NodeButton>
            );
          })}
      </Grid>
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          //手機不顯示 border
          borderLeft: isMobile ? 'none' : 'none',

          height: `calc(100% - 10px)`,
          display:
            !isMobile || (isMobile && mobileEditorDisplay) ? 'flex' : 'none',
        }}
      >
        <Editor
          editorId={editorId}
          handleDrawerClose={() => {
            setMobileEditorDisplay(false);
          }}
        />
      </Grid>
    </Grid>
  );
};
export default Calendar;
