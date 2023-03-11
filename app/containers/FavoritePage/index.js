/**
 *
 * FavoritePage
 *
 */

import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Tab, Tabs } from '@material-ui/core';

import AddFavoritePage from '../AddFavoritePage/Loadable';
import { SwipeableDrawer } from '../../components/LifetekUi';
import './../AddCashManager/style.css';
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
function FavoritePage(props) {
  const { dataRole } = props;
  const [menu, setMenu] = useState();
  const [open, setOpen] = useState(false);

  function handleClose() {
    setOpen(false);
  }
  function handleChangeTab(menu) {
    setMenu(menu);
  }

  function handleOpen(index) {
    setMenu(index);
    setOpen(true);
  }
  const customLable = name => {
    switch (name) {
      case 'reportbankBalance':
        return 'Báo cáo tổng hợp chi phí năm';
      case 'ReportSalesEmployees':
        return 'Báo cáo chi tiết bán hàng theo nhân viên';
      case 'Báo cáo chi tiết bán hàng theo nhân viên':
        return 'Báo cáo tổng hợp chi phí năm';
      case 'Báo cáo số dư quỹ và các ngân hàng':
        return 'Báo cáo chi tiết bán hàng theo nhân viên';
    }
  };
  return (
    <div style={{ width: '360px' }}>
      <VerticalTabs value={menu} wrapped={true}>
        {dataRole &&
          dataRole.map((i, index) => (
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label={customLable(i.titleFunction)}
              onClick={() => handleOpen(index)}
            />
          ))}
      </VerticalTabs>

      <SwipeableDrawer
        anchor="right"
        onClose={() => handleClose()}
        open={open}
        width={!props.miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
      >
        <AddFavoritePage miniActive={props.miniActive} menu={menu} onChangeTab={handleChangeTab} />
      </SwipeableDrawer>
    </div>
  );
}

export default FavoritePage;
