/**
 *
 * StockManager
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Tab, Tabs } from '@material-ui/core';
import AddStockManager from 'containers/AddStockManager';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectStockManager from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData } from './actions';
import { SwipeableDrawer } from '../../components/LifetekUi';
import { mergeData as mergeDataStockManager } from '../AddStockManager/actions';

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
export class StockManager extends React.Component {
  mergeData = data => {
    this.props.margeData(data);
  };

  // onType = openType => {
  //   this.props.mergeData({ openType, tab:1 });
  //   this.props.mergeDataStockManager({
  //     tab: 1,
  //   });
  // };

  // onIndustry = openIndustry => {
  //   this.props.mergeData({ openIndustry, tab:2 });
  //   this.props.mergeDataStockManager({
  //     tab: 2,
  //   });
  // };

  // onTime = openTime => {
  //   this.props.mergeData({ openTime, tab:3 });
  //   this.props.mergeDataStockManager({
  //     tab: 3,
  //   });
  // };

  // onDate = openDate => {
  //   this.props.mergeData({ openDate, tab:4 });
  //   this.props.mergeDataStockManager({
  //     tab: 4,
  //   });
  // };

  // onDrawer = openDrawer => {
  //   this.props.mergeData({ openDrawer, tab:5 });
  //   this.props.mergeDataStockManager({
  //     tab: 5,
  //   });
  // };

  // onInvetory = openDrawer => {
  //   this.props.mergeData({ openDrawer, tab:6 });
  //   this.props.mergeDataStockManager({
  //     tab: 6,
  //   });
  // };
  handleOpen = index => {
    this.props.mergeData({ open: true, tab: index });
  };

  render() {
    const { stockManager, dataRole = [] } = this.props;
    const { id, open, tab } = stockManager;
    stockManager.tab = {};
    const customLable = name => {
      switch (name) {
        case 'Báo cáo tổng hợp tồn kho theo nhóm sản phẩm':
          return 'Báo cáo tổng hợp tồn kho theo nhóm sản phẩm 1';
        case 'Báo cáo tồn kho trong năm':
          return 'Báo cáo tồn kho trong năm';
        case 'reportInventoryProduct':
          return 'Báo cáo tổng hợp tồn kho theo sản phẩm';
        case 'Báo cáo tổng hợp tồn kho theo sản phẩm':
          return 'Báo cáo tổng hợp tồn kho theo sản phẩm';
        case 'reportInventoryByYear':
          return 'Báo cáo tồn kho trong năm';
      }
    };
    return (
      <div>
        <VerticalTabs value={tab} wrapped={true}>
          {dataRole &&
            dataRole.map((i, index) => (
              <VerticalTab
                style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
                label={i.titleFunction}
                onClick={() => this.handleOpen(index)}
              />
            ))}
        </VerticalTabs>
        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ open: false })} open={open} width={window.innerWidth - 260}>
          <AddStockManager id={id} tab={tab} />
        </SwipeableDrawer>
        {/* <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openIndustry: false })} open={openIndustry} width={window.innerWidth - 260}>
          <AddStockManager id={id} tab={tab} />
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openTime: false })} open={openTime} width={window.innerWidth - 260}>
          <AddStockManager id={id} tab={tab} />
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openDate: false })} open={openDate} width={window.innerWidth - 260}>
          <AddStockManager id={id}  tab={tab} />
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openDrawer: false })} open={openDrawer} width={window.innerWidth - 260}>
          <AddStockManager id={id}  tab={tab} />
        </SwipeableDrawer> */}
      </div>
    );
  }
}

StockManager.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  stockManager: makeSelectStockManager(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    mergeDataStockManager: data => dispatch(mergeDataStockManager(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'stockManager', reducer });
const withSaga = injectSaga({ key: 'stockManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(),
)(StockManager);
