import React, { useState } from 'react';
import { Tab, Tabs, withStyles } from '@material-ui/core';
import { SwipeableDrawer } from '../../components/LifetekUi';
import AddTaskReport from '../AddTaskReport';
import ReportTimeForJob from '../ReportReportCustomer/components/ReportTimeForJob';
import ReportTaskStatus from '../ReportReportCustomer/components/ReportTaskStatus';
import AskTaskReportWeek from '../ReportReportCustomer/components/AddTaskReportWeek';
import AddTaskReportDebt from '../ReportReportCustomer/components/AddTaskReportDebt';
import AddTaskReportSummary from '../ReportReportCustomer/components/AddTaskReportSummary';
import ReportContractValueAndPaid from 'containers/AddExpandReportManager/ReportContractValueAndPaid';
import { MODULE_CODE } from 'utils/constants';

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

function TaskManager(props) {
  const [tab, setTab] = useState();
  const [selected, setSelected] = useState();
  const [open, setOpen] = useState(false);
  const [openTimeFoeJob, setOpenTimeFoeJob] = useState(false);
  const [openTaskStatus, setOpenTaskStatus] = useState(false);
  const [openTaskWeek, setOpenTaskWeek] = useState(false);
  const [openTaskDebt, setOpenTaskDebt] = useState(false);
  const [openTaskSummary, setOpenTaskSummary] = useState(false);
  const [openContractValue, setOpenContractValue] = useState(false);

  const handleOpen = (index, item) => {
    const { codeModleFunction } = item;
    if (codeModleFunction === MODULE_CODE.reportWeekTask) {
      setOpenTaskWeek(true);
    } else if (codeModleFunction === MODULE_CODE.reportTaskDebt) {
      setOpenTaskDebt(true);
    } else if (codeModleFunction === MODULE_CODE.reportTaskSummary) {
      setOpenTaskSummary(true);
    } else if (index === 2) {
      setOpen(true);
    } else if (index === 1) {
      setOpenTimeFoeJob(true);
    } else if (index === 0) {
      setOpenTaskStatus(true);
    }
    setTab(index);
    setSelected(item);
  };
  const handleChangeTab = tab => {
    setTab(tab);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseTimeForJob = () => {
    setOpenTimeFoeJob(false);
  };
  const handleCloseTaskStatus = () => {
    setOpenTaskStatus(false);
  };
  const handleCloseContractValue = () => {
    setOpenContractValue(false);
  };
  const { dataRole = [] } = props;
  const customLable = name => {
    switch (name) {
      case 'reportsTaskStatus':
        return 'Báo cáo trạng thái công việc';
      case 'reportDoingTask':
        return 'Báo cáo thời gian thực hiện công việc';
      case 'reportProgressTask':
        return 'Báo cáo tiến độ công việc';
      case 'reportWeekTask':
        return 'Báo cáo công tác tuần';
      case 'reportTaskDebt':
        return 'Báo cáo công nợ dự án';
      case 'reportTaskSummary':
        return 'Báo cáo tổng hợp công việc';
      case 'Báo cáo trạng thái công việc':
        return 'Báo cáo trạng thái công việc';
      case 'Báo cáo thời gian thực hiện công việc':
        return 'Báo cáo thời gian thực hiện công việc';
      case 'Báo cáo tiến độ công việc':
        return 'Báo cáo tiến độ công việc';
      case 'Báo cáo công tác tuần':
        return 'Báo cáo công tác tuần';
      case 'Báo cáo công nợ dự án':
        return 'Báo cáo công nợ dự án';
      case 'Báo cáo tổng hợp công việc':
        return 'Báo cáo tổng hợp công việc';
    }
  };
  return (
    <>
      <VerticalTabs value={tab} wrapped={true} variant="fullWidth">
        {dataRole &&
          dataRole.map((i, index) => (
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label={i.titleFunction}
              onClick={() => handleOpen(index, i)}
            />
          ))}
      </VerticalTabs>

      <SwipeableDrawer anchor="right" onClose={() => setOpenTaskWeek(false)} open={openTaskWeek} width={window.innerWidth - 260}>
        <AskTaskReportWeek item={selected} />
      </SwipeableDrawer>

      <SwipeableDrawer anchor="right" onClose={() => setOpenTaskDebt(false)} open={openTaskDebt} width={window.innerWidth - 260}>
        <AddTaskReportDebt item={selected} />
      </SwipeableDrawer>

      <SwipeableDrawer anchor="right" onClose={() => setOpenTaskSummary(false)} open={openTaskSummary} width={window.innerWidth - 260}>
        <AddTaskReportSummary item={selected} />
      </SwipeableDrawer>

      <SwipeableDrawer anchor="right" onClose={() => handleClose()} open={open} width={window.innerWidth - 260}>
        <AddTaskReport tab={tab} />
      </SwipeableDrawer>

      <SwipeableDrawer anchor="right" onClose={() => handleCloseTimeForJob()} open={openTimeFoeJob} width={window.innerWidth - 260}>
        <ReportTimeForJob tab={tab} profile={props.profile} />
      </SwipeableDrawer>

      <SwipeableDrawer anchor="right" onClose={() => handleCloseTaskStatus()} open={openTaskStatus} width={window.innerWidth - 260}>
        <ReportTaskStatus tab={tab} profile={props.profile} />
      </SwipeableDrawer>

      <SwipeableDrawer anchor="right" onClose={() => handleCloseContractValue()} open={openContractValue} width={window.innerWidth - 260}>
        <ReportContractValueAndPaid tab={tab} profile={props.profile} />
      </SwipeableDrawer>
    </>
  );
}

export default TaskManager;
