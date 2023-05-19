import React, { useEffect, useState, useRef } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import instance from '../../API/api';
import { useApp } from '../../hooks/useApp';
import { useTranslation } from 'react-i18next';
import { usePageTab } from '../../hooks/usePageTab';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import BackToTopButton from '../BackToTopButton/BackToTopButton';
import './FlowGrid.scss';

export default function FlowGrid({ containerRef }) {
  const { t, i18n } = useTranslation();
  const { isMobile, user } = useApp();
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const navigateTo = useNavigate();
  const { tabList, addTab } = usePageTab();
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
            setFlows([...flows, ...res.data]);
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
    if (!tabList.find((f) => f.objectId == flow.id)) {
      addTab({
        type: 'flow',
        objectId: flow.id,
        name: flow.name ? flow.name : 'UnTitled',
      }); // name 應該在 flows/create 拿
    }
    console.log(flow);
    navigateTo(`/flow?id=${flow.id}`);
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      <div
        className={`${isMobile ? 'flow-container-mobile' : 'flow-container'}`}
      >
        {flows.map((flow, key) => (
          <div className="grid-item" key={key}>
            <FlowButton onClick={() => toFlow(flow)}>
              {flow.thumbnail !== '' ? (
                <img style={{ objectFit: 'cover' }} loading="lazy">
                  flow.thumbnail
                </img>
              ) : (
                `${t('Last Edit Time')}: ${flow.updateAt} ${t('hours')}`
              )}
            </FlowButton>
            <Typography>{flow.name}</Typography>
          </div>
        ))}

        {containerRef?.current && (
          <BackToTopButton containerRef={containerRef} />
        )}

        <div
          className="loading-checkpoint"
          ref={loadingCheckPointRef}
          style={{ visibility: 'hidden' }}
        >
          CHECKPOINT
        </div>
      </div>
    </>
  );
}
