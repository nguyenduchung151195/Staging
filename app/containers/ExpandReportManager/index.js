/**
 *
 * ExpandReportManager
 *
 */

import React, { useState } from 'react';

import { Tab, Tabs, withStyles } from '@material-ui/core';

import AddExpandReportManager from 'containers/AddExpandReportManager/Loadable';
import ReportContractValueAndPaid from 'containers/AddExpandReportManager/ReportContractValueAndPaid';
import { SwipeableDrawer } from '../../components/LifetekUi';
import { MODULE_CODE } from 'utils/constants';
//Báo cáo tổng hợp giá trị hợp đồng và thanh toán

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
function ExpandReportManager(props) {
  const { dataRole = [] } = props;
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState();
  const [selected, setSelected] = useState({});
  const [openReportContractValueAndPaid, setOpenReportContractValueAndPaid] = useState(false); // báo cáo đã xuất bản tuần
  const handleClose = index => {
    setOpen(false);
  };

  const handleOpen = (index, item) => {
    //setSelected(item);
    // switch (item.codeModleFunction) {
    //   case MODULE_CODE.reportContractValueAndPaid:
    //     setOpenReportContractValueAndPaid(true);
    //     break;
    //   default:
    //     setOpen(true);
    //     break;
    // }
    setOpen(true);
    setTab(index);
  };
  function handleChangeTab(tab) {
    setTab(tab);
  }
  const customLable = name => {
    switch (name) {
      case 'reportCustomerNumberSell':
        return 'Báo cáo khách hàng theo số lượng mua hàng';
      case 'reportCustomerFrequencySell':
        return 'Báo cáo tần suất khách hàng mua hàng';
      case 'ReportFavoriteCostRatioYear':
        return 'Báo cáo tổng hợp chi phí trong năm ';
      case 'reportIventoryByYear':
        return 'Báo cáo tồn kho trong năm';
      case 'reportAggregateRevenue':
        return 'Báo cáo tổng hợp doanh thu';
      case 'reportContractValueAndPaid':
        return 'Báo cáo tổng hợp giá trị hợp đồng và thanh toán';
      case 'reportContractReported':
        return 'Báo cáo đã xuất bản trong tuần';
      case 'reportHrmAboutExpiredContract':
        return 'Báo cáo hợp đồng sắp hết hạn';
      case 'Báo cáo khách hàng theo số lượng mua hàng':
        return 'Báo cáo khách hàng theo số lượng mua hàng';
      case 'Báo cáo tần suất khách hàng mua hàng':
        return 'Báo cáo tần suất khách hàng mua hàng';
      case 'Báo cáo tổng hợp chi phí trong năm':
        return 'Báo cáo tổng hợp chi phí trong năm ';
      case 'Báo cáo tồn kho trong năm':
        return 'Báo cáo tồn kho trong năm';
      case 'Báo cáo tổng hợp doanh thu':
        return 'Báo cáo tổng hợp doanh thu';
      case 'Báo cáo tổng hợp giá trị hợp đồng và thanh toán':
        return 'Báo cáo tổng hợp giá trị hợp đồng và thanh toán';
      case 'Báo cáo đã xuất bản trong tuần':
        return 'Báo cáo đã xuất bản trong tuần';
      case 'Báo cáo hợp đồng sắp hết hạn':
        return 'Báo cáo hợp đồng sắp hết hạn';
      default: return name || "Báo cáo mở rộng"
    }
  };
  return (
    <div>
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
      <SwipeableDrawer anchor="right" onClose={handleClose} open={open} width={window.innerWidth - 260}>
        <AddExpandReportManager tab={tab} miniActive={props.miniActive} onChangeTab={handleChangeTab} />
      </SwipeableDrawer>

      {/* <SwipeableDrawer
        anchor="right"
        onClose={() => setOpenReportContractValueAndPaid(false)}
        open={openReportContractValueAndPaid}
        width={window.innerWidth - 260}
      >
        <ReportContractValueAndPaid item={selected} />
      </SwipeableDrawer> */}
    </div>
  );
}

export default ExpandReportManager;
