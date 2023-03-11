/**
 *
 * ReceivableManager
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Tab, Tabs } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import AddReceivableManager from 'containers/AddReceivableManager';
import LiabilitiesReport from 'containers/LiabilitiesReport';
import makeSelectReceivableManager from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData } from './actions';
import { SwipeableDrawer } from '../../components/LifetekUi';
import { mergeData as mergeDataReceivable } from '../AddReceivableManager/actions';

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
export class ReceivableManager extends React.Component {
  mergeData = data => {
    this.props.mergeData(data);
  };

  // onArea = openDrawer => {
  //   this.props.mergeData({ openDrawer, tab: 0 });
  //   this.props.mergeDataReceivable({
  //     tab: 0,
  //   });
  // };

  // handleLiabiliti = () => {
  //   this.props.mergeData({ openLiabiliti: true });
  // };

  // onCity = openCity => {
  //   this.props.mergeData({ openCity, tab: 1 });
  //   this.props.mergeDataReceivable({
  //     tab: 1,
  //   });
  // };

  // onTime = openTime => {
  //   this.props.mergeData({ openTime, tab: 2 });
  //   this.props.mergeDataReceivable({
  //     tab: 2,
  //   });
  // };

  handleOpen = index => {
    this.props.mergeData({ open: true, tab: index });
  };

  render() {
    const { receivableManager, dataRole = [] } = this.props;
    const { id, open, tab } = receivableManager;
    receivableManager.tab = {};
    const customLable = name => {
      switch (name) {
        case 'Báo cáo tổng hợp công nợ theo nhân viên kinh doanh':
          return 'Báo cáo tổng hợp công nợ theo nhân viên kinh doanh';
        case 'Báo cáo số dư công nợ phải trả theo thời gian':
          return 'Báo cáo số dư công nợ phải trả theo thời gian';
        case 'Báo cáo số dư công nợ phải thu theo thời gian':
          return 'Báo cáo số dư công nợ phải thu theo thời gian';
        case 'reportDebtEmployees':
          return 'Báo cáo tổng hợp công nợ theo nhân viên kinh doanh';
        case 'reportDebtToPay':
          return 'Báo cáo số dư công nợ phải trả theo thời gian';
        case 'reportDebtReceivables':
          return 'Báo cáo số dư công nợ phải thu theo thời gian';
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
                onClick={() => this.handleOpen(index)}
              />
            ))}
          {/* <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Tổng hợp công nợ theo khu vực" onClick={this.onArea} />
          <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Tổng hợp công nợ theo tỉnh thành" onClick={this.onCity} />
          <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Số dư công nợ phải thu theo thời gian" onClick={this.onTime} />
          <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Báo cáo tổng hợp công nợ" onClick={this.handleLiabiliti} /> */}
        </VerticalTabs>
        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ open: false })} open={open} width={window.innerWidth - 260}>
          <AddReceivableManager id={id} tab={tab} />
        </SwipeableDrawer>
        {/* <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openCity: false })} open={openCity} width={window.innerWidth - 260}>
          <AddReceivableManager id={id} tab={tab} />
        </SwipeableDrawer>

        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openTime: false })} open={openTime} width={window.innerWidth - 260}>
          <AddReceivableManager id={id} tab={tab} />
        </SwipeableDrawer>
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.props.mergeData({ openLiabiliti: false })}
          open={openLiabiliti}
          width={window.innerWidth - 260}
        >
          <LiabilitiesReport />
        </SwipeableDrawer> */}
      </div>
    );
  }
}

ReceivableManager.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  receivableManager: makeSelectReceivableManager(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    mergeDataReceivable: data => dispatch(mergeDataReceivable(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'receivableManager', reducer });
const withSaga = injectSaga({ key: 'receivableManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ReceivableManager);
