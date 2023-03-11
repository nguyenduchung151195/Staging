import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Tab, Tabs } from '@material-ui/core';

import { SwipeableDrawer } from '../../components/LifetekUi';
import AddCustomerReport from '../AddCustomerReport';

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

function CustomerReportPage(props) {
  const { dataRole = [] } = props;
  const [tab, setTab] = useState();
  const [open, setOpen] = useState(false);
  const [listDataRole, setListDataRole] = useState(props.dataRole || []);

  function handleChangeTab(value) {
    setTab(value);
  }
  function handleOpen(index) {
    setTab(index);
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  };
  const customLable = (name) => {
    switch (name) {
      case 'reportMeetingCustomer':
        return 'Báo cáo tiếp xúc khách hàng';
      case 'Báo cáo tiếp xúc khác hàng':
        return 'Báo cáo khách hàng theo số lượng mua hàng';
      default:
        return name;
    }
  };
  useEffect(() => {
    console.log(listDataRole, 'listDataRole')
    const fakeRole = [
      // { titleFunction: "Báo cáo khách hàng" },
      { titleFunction: "Báo cáo tiếp xúc khách hàng" }
    ]
    setListDataRole([...listDataRole, ...fakeRole])
  }, [])
  return (
    <div style={{ width: '360px' }}>
      <VerticalTabs value={tab} wrapped={true}>
        {listDataRole &&
          listDataRole.map((i, index) => (
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label={customLable(i.titleFunction)}
              onClick={() => handleOpen(index)}
            />
          ))}
      </VerticalTabs>

      <SwipeableDrawer anchor="right" onClose={handleClose} open={open} width={window.innerWidth - 260}>
        <AddCustomerReport tab={tab} onChangeTab={handleChangeTab} {...props} />
      </SwipeableDrawer>
    </div>
  );
}

export default CustomerReportPage;
