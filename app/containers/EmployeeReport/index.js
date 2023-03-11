import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Tab, Tabs } from '@material-ui/core';
import AddReportEmployee from '../AddReportEmployee';
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
function EmployeeReport(props) {
  const { dataRole } = props;
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState();

  const handleClose = () => {
    setOpen(false);
  };
  const handleChangeTab = value => {
    setTab(value);
  };
  const handleOpen = index => {
    setOpen(true);
    setTab(index);
  };
  const customLable = name => {
    switch (name) {
      case 'reportsFinishLevel':
        return 'Báo cáo mức độ hoàn thành mục tiêu';
      case 'reportsEmployeeKpiSales':
        return 'Báo cáo doanh số theo nhân viên';
      case 'reportStatsHrm':
        return 'Báo cáo thống kê nhân sự';
      case 'Báo cáo mức độ hoàn thành mục tiêu':
        return 'Báo cáo mức độ hoàn thành mục tiêu';
      case 'Báo cáo doanh số theo nhân viên':
        return 'Báo cáo doanh số theo nhân viên';
      case 'Báo cáo thống kê nhân sự':
        return 'Báo cáo thống kê nhân sự';
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
              onClick={() => handleOpen(index, i)}
            />
          ))}
        <VerticalTab
          style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
          label={'Báo cáo tổng đài'}
          onClick={() => handleOpen(3, 'ccall_report')}
        />
      </VerticalTabs>

      <SwipeableDrawer anchor="right" onClose={() => handleClose()} open={open} width={window.innerWidth - 260}>
        <AddReportEmployee tab={tab} onChangeTab={handleChangeTab} />
      </SwipeableDrawer>
    </div>
  );
}

export default EmployeeReport;
