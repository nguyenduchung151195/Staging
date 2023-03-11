/**
 *
 * FavoritePage
 *
 */

import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Tab, Tabs } from '@material-ui/core';
import { SwipeableDrawer } from '../../components/LifetekUi';
import AddGeneralReport from 'containers/AddGeneralReport/Loadable';

const VerticalTabs = withStyles(() => ({
  flexContainer: {
    flexDirection: 'column',
  },
  indicator: {
    display: 'none',
  },
}))(Tabs);

const VerticalTab = withStyles(() => ({
  selected: {
    color: 'white',
    backgroundColor: `#2196F3`,
    borderRadius: '5px',
    boxShadow: '3px 5.5px 7px rgba(0, 0, 0, 0.15)',
  },
  root: {},
}))(Tab);
/* eslint-disable react/prefer-stateless-function */
function GeneralReportPage(props) {
  const { dataRole = [] } = props;
  const [tab, setTab] = useState();
  const [open, setOpen] = useState(false);

  const handleOpen = index => {
    setOpen(true);
    setTab(index);
  };
  const handleCLose = () => {
    setOpen(false);
  };
  const customLable = (name) => {
    switch (name) {
      case 'reportsBusinessOpportunities':
        return 'Báo cáo trạng thái CHKD';
      case 'reportBusinessSituation':
        return 'Báo cáo tổng hợp tình hình kinh doanh';
      case 'Báo cáo trạng thái CHKD':
        return 'Báo cáo trạng thái CHKD';
      case 'Báo cáo tổng hợp tình hình kinh doanh':
        return 'Báo cáo tổng hợp tình hình kinh doanh';
    }
  };
  return (
    <div style={{ width: '360px' }}>
      <VerticalTabs value={tab} wrapped={true}>
        {dataRole &&
          dataRole.map((i, index) => (
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label={customLable(i.titleFunction)}
              onClick={() => handleOpen(index)}
            />
          ))}
        <VerticalTab
          style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
          label={'Báo cáo tổng hợp doanh thu'}
          onClick={() => handleOpen(2)}
        />
      </VerticalTabs>
      <SwipeableDrawer anchor="right" onClose={() => handleCLose()} open={open} width={window.innerWidth - 260}>
        <AddGeneralReport tab={tab} />
      </SwipeableDrawer>
    </div>
  );
}

GeneralReportPage.propTypes = {};
export default GeneralReportPage;
