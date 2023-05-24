import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { useTranslation } from 'react-i18next';
import { Editor } from '../../Components/Editor/Editor';
import { useQuill } from '../../API/useQuill';
import { useApp } from '../../hooks/useApp';
import { Colab } from '../../API/Colab';
import { useState, useEffect } from 'react';
import instance from '../../API/api';

const Library = () => {
  const { t } = useTranslation();
  const { user, isMobile } = useApp();
  const [nodes, setNodes] = useState([]);
  const { OpenEditor, QuillRef } = useQuill();
  const [editorId, setEditorId] = useState(null);

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
  }));
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: '0',
    '&:hover': {
      backgroundColor: grey[100],
    },
    width: '90%',
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
  }));
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));
  const toNode = (id) => {
    setEditorId(id);
  };
  const [colab, setColab] = useState([]);
  useEffect(() => {
    instance
      .get('/library')
      .then((res) => {
        setNodes([...nodes, ...res.data]);
        setEditorId([...nodes, ...res.data][0].id);
        console.log(res.data);
        console.log('ok!');
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  useEffect(() => {
    if (!editorId) return;
    OpenEditor(editorId);
    const connection = new Colab(editorId, user.email, (members) => {
      console.log(members);
      setColab(members);
    });
    return () => {
      console.log('CLOSING colab connection');
      connection.close();
    };
  }, [editorId]);
  return (
    <Grid container columns={12} sx={{ height: '100%' }}>
      <Grid
        item
        md={2}
        xs={12}
        sx={{
          // borderRight: "1px solid lightgrey",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'top',
          display: mobileEditorDisplay ? 'none' : 'flex',
          alignItems: 'center',
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'scroll',
        }}
      >
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
        {nodes.map((node) => (
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
            {node.name} {t('Last Edit Time:')} {node.time} {t('hours')}
          </NodeButton>
        ))}
      </Grid>{' '}
      <Grid
        item
        md={10}
        style={{
          height: '100%',
          display:
            !isMobile || (isMobile && mobileEditorDisplay) ? 'flex' : 'none',
        }}
      >
        <Editor
          editorId={editorId}
          handleDrawerClose={() => {
            setMobileEditorDisplay(false);
          }}
          QuillRef={QuillRef}
          colab={colab}
        />
      </Grid>
    </Grid>
  );
};
export default Library;
