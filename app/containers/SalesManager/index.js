/**
 *
 * SalesManager
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { Tab, Tabs } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import AddSalesManager from 'containers/AddSalesManager/Loadable';
import ReportSource from 'containers/ReportSource/Loadable';
import ReportTypeCustomer from 'containers/ReportTypeCustomer/Loadable';
import makeSelectSalesManager from './selectors';
import { mergeData } from './actions';
import reducer from './reducer';
import saga from './saga';
import { SwipeableDrawer } from '../../components/LifetekUi';
import { mergeData as mergeDataSales } from '../AddSalesManager/actions';

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
export class SalesManager extends React.Component {
  mergeData = data => {
    this.props.mergeData(data);
  };

  handleOpen = index => {
    this.props.mergeData({ open: true, sale: index });
  };

  render() {
    const { salesManager, dataRole = [], miniActive } = this.props;
    const { id, open, sale } = salesManager;
    salesManager.sale = {};

    const customLable = name => {
      switch (name) {
        case 'Báo cáo tỷ lệ hoàn thành chỉ tiêu doanh số tháng':
          return 'Báo cáo tỷ lệ hoàn thành chỉ tiêu doanh số tháng';
        case 'Báo cáo Thực hiện chỉ tiêu doanh số':
          return 'Báo cáo thực hiện chỉ tiêu doanh số';
        case 'Báo cáo tốp doanh số theo sản phẩm':
          return 'Báo cáo top doanh số theo sản phẩm';
        case 'Báo cáo tốp doanh số theo khách hàng':
          return 'Báo cáo top doanh số theo khách hàng';
        case 'reportMonthlySalesTarget':
          return 'Báo cáo tỷ lệ hoàn thành chỉ tiêu doanh số tháng';
        case 'reportkpiSales':
          return 'Báo cáo thực hiện chỉ tiêu doanh số';
        case 'reportTopSalesProduct':
          return 'Báo cáo top doanh số theo sản phẩm';
        case 'reportTopSalesCustomer':
          return 'Báo cáo top doanh số theo khách hàng';
        case 'Báo cáo top doanh số theo sản phẩm':
          return 'Báo cáo top doanh số theo sản phẩm';
        case 'Báo cáo top doanh số theo khách hàng':
          return 'Báo cáo top doanh số theo khách hàng';
      }
    };
    return (
      <div>
        <VerticalTabs value={sale} wrapped={true}>
          {dataRole &&
            dataRole.map((i, index) => (
              <VerticalTab
                style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
                label={customLable(i.titleFunction)}
                onClick={() => this.handleOpen(index)}
              />
            ))}
        </VerticalTabs>
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.props.mergeData({ open: false })}
          open={open}
          width={!miniActive ? window.innerWidth - 250 : window.innerWidth - 65}
        >
          <AddSalesManager miniActive={miniActive} id={id} sale={sale} />
        </SwipeableDrawer>
      </div>
    );
  }
}

SalesManager.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  salesManager: makeSelectSalesManager(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    mergeDataSales: data => dispatch(mergeDataSales(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'salesManager', reducer });
const withSaga = injectSaga({ key: 'salesManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SalesManager);
