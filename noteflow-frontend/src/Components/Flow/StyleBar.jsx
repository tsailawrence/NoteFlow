import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import './FlowEditor.scss';
import { useTranslation } from 'react-i18next';

export default function StyleBar({
  nodeId,
  nodes,
  nodeChangeStyle,
  handleStyleBarClose,
}) {
  const { t } = useTranslation();
  const [border, setBorder] = useState(2);
  const [style, setStyle] = useState(
    nodes.filter((nd) => nd.id == nodeId)[0].style,
  );

  return (
    <Box className="bar">
      <Drawer
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
          },
        }}
        variant="persistent"
        anchor="right"
        open={true}
      >
        <List>
          <ListItem sx={{ fontSize: '20px', marginBottom: '10px' }}>
            <IconButton onClick={handleStyleBarClose}>
              <ChevronLeftIcon />
            </IconButton>
            {/* {nodeId} */}
          </ListItem>
          <ListItem sx={{ fontSize: '20px', marginBottom: '10px' }}>
            {t('Border Style')}
          </ListItem>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {t('Color')}
            </Grid>
            <Grid item xs={6}>
              <input
                type="color"
                value={style.borderColor}
                onChange={(event) => {
                  setStyle({ ...style, borderColor: event.target.value });
                  nodeChangeStyle(nodeId, event, 'color');
                }}
              />
            </Grid>
          </Grid>
          <Grid
            sx={{ marginTop: '10px', marginBottom: '20px' }}
            container
            spacing={2}
          >
            <Grid item xs={6}>
              {t('Width')}
            </Grid>
            <Grid item xs={6}>
              <Select
                onChange={(event) => {
                  setStyle({ ...style, borderWidth: event.target.value });
                  nodeChangeStyle(nodeId, event, 'stroke');
                }}
                value={style.borderWidth}
                sx={{ margin: '10x', height: '25px', width: '60px' }}
              >
                <MenuItem value="1px">1</MenuItem>
                <MenuItem value="2px">2</MenuItem>
                <MenuItem value="3px">3</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Divider variant="middle" />
          <ListItem
            sx={{ fontSize: '20px', marginTop: '20px', marginBottom: '10px' }}
          >
            {t('Node Color')}
          </ListItem>
          <Grid container spacing={2}>
            <Grid sx={{ justifyContent: 'flex-start' }} item xs={6}>
              {t('Color')}
            </Grid>
            <Grid item xs={6}>
              <input
                type="color"
                value={style.background}
                onChange={(event) => {
                  setStyle({ ...style, background: event.target.value });
                  nodeChangeStyle(nodeId, event, 'background');
                }}
                // onChange={data.onChange}
                // defaultValue={data.color}
              />
            </Grid>
          </Grid>
        </List>
      </Drawer>
    </Box>
  );
}
