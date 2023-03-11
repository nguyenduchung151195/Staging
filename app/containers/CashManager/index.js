/**
 *
 * CashManager
 *
 */

import React, { useState } from 'react';

import { Tab, Tabs, withStyles } from '@material-ui/core';
import AddCashManager from 'containers/AddCashManager';
import { SwipeableDrawer } from '../../components/LifetekUi';
import AddTopCustomerCollect from '../AddTopCustomerCollect/index';
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
function CashManager(props) {
  const { dataRole = [] } = props;
  const [tab, setTab] = useState();
  const [open,setOpen] = useState(false)
  const [openCashManager, setOpenCashManager] = useState(false);
  const handleOpen = (index, item) => {
     setOpen(true);
    setTab(index);
  
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChangeTab = value => {
    setTab(value);
  };
  const customLable = name => {
    switch (name) {
      case 'reportStatisticalReceipt':
        return 'Báo cáo tổng tiền thu trong năm';
      case 'reportTopCustomerReceiptsMonth':
        return 'Báo cáo top khách hàng thu tiền nhiều nhất trong tháng';
      case 'Báo cáo tổng tiền thu trong năm':
        return 'Báo cáo tổng tiền thu trong năm';
      case 'Báo cáo top khách hàng thu tiền nhiều nhất trong tháng':
        return 'Báo cáo top khách hàng thu tiền nhiều nhất trong tháng';
    }
  };

  return (
    <div>
      <div style={{ width: '360px' }}>
        <VerticalTabs value={tab} wrapped={true}>
          {dataRole &&
            dataRole.map((i, index) => (
              <VerticalTab
                style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
                label={customLable(i.titleFunction)}
                onClick={() => handleOpen(index, i)}
              />
            ))}
        </VerticalTabs>

        <SwipeableDrawer
          anchor="right"
          onClose={() => handleClose()}
          open={open}
          width={!props.miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
        >
          <AddCashManager miniActive={props.miniActive} tab={tab} onChangeTab={handleChangeTab} />
        </SwipeableDrawer>
      </div>
    </div>
  );
}

export default CashManager;
