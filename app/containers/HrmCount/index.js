/**
 *
 * FavoritePage
 *
 */

import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Tab, Tabs } from '@material-ui/core';
import { SwipeableDrawer } from '../../components/LifetekUi';
import AddHrmCountReport from 'containers/AddHrmCountReport/Loadable';

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
  const [name, setName] = useState('');


  const handleOpen = (index, i) => {
    setOpen(true);
    setName(i.codeModleFunction)
    setTab(index);
  };
  const handleCLose = () => {
    setOpen(false);
  };
  const customLable = name => {
    switch (name) {
      case 'Báo cáo thống kê nhân sự theo phòng ban':
        return 'Báo cáo thống kê nhân sự theo phòng ban';
      case 'Báo cáo thống kê nhân sự theo loại hợp đồng':
        return 'Báo cáo thống kê nhân sự theo loại hợp đồng';
      case 'Báo cáo thống kê nhân sự sắp hết hạn hợp đồng':
        return 'Báo cáo thống kê nhân sự sắp hết hạn hợp đồng';
      case 'Báo cáo thống kê nhân sự theo thâm niên':
        return 'Báo cáo thống kê nhân sự theo thâm niên';
      case 'reportHrmCountByOrg':
        return 'Báo cáo thống kê nhân sự theo phòng ban';
      case 'reportHrmCountByContract':
        return 'Báo cáo thống kê nhân sự theo loại hợp đồng';
      case 'reportHrmCountBySignedContractDate':
        return 'Báo cáo thống kê nhân sự theo thâm niên';
      case 'reportHrmCountByAboutExpiredContract':
        return 'Báo cáo thống kê nhân sự sắp hết hạn hợp đồng';
      case 'reportHrmCountByLevel':
        return 'Báo cáo thống kê lương theo phòng ban';
      case 'Báo cáo thống kê nhân sự theo trình độ':
        return 'Báo cáo thống kê nhân sự theo trình độ';
      case 'Báo cáo thống kê lương theo phòng ban':
        return 'Báo cáo thống kê lương theo phòng ban';
      case 'Báo cáo tổng hợp hồ sơ tuyển dụng':
        return 'Báo cáo tổng hợp hồ sơ tuyển dụng';
      case 'Báo cáo tổng hợp số lượng hồ sơ tuyển dụng theo nguồn':
        return 'Báo cáo tổng hợp số lượng hồ sơ tuyển dụng theo nguồn';
      case 'Báo cáo chi phí tuyển dụng':
        return 'Báo cáo chi phí tuyển dụng';
      case 'Báo cáo phân tích chi phí tuyển dụng':
        return 'Báo cáo phân tích chi phí tuyển dụng';
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
        {/* <VerticalTab
          style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
          label={'Báo cáo tổng hợp hồ sơ tuyển dụng'}
          onClick={() => handleOpen(5)}
        />
        <VerticalTab
          style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
          label={'Báo cáo tổng hợp số lượng hồ sơ tuyển dụng theo nguồn'}
          onClick={() => handleOpen(6)}
        />
      
        <VerticalTab
          style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
          label={'Báo cáo chi phí tuyển dụng'}
          onClick={() => handleOpen(7)}
        />
        <VerticalTab
          style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
          label={'Báo cáo phân tích chi phí tuyển dụng'}
          onClick={() => handleOpen(8)}
        /> */}
      </VerticalTabs>
      <SwipeableDrawer anchor="right" onClose={() => handleCLose()} open={open} width={window.innerWidth - 260}>
        <AddHrmCountReport tab={tab} name={name}/>
      </SwipeableDrawer>
    </div>
  );
}

GeneralReportPage.propTypes = {};
export default GeneralReportPage;
