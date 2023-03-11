/**
 *
 * GeneralManager
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
import AddGeneralManager from 'containers/AddGeneralManager';
import { mergeData } from './actions';
import makeSelectGeneralManager from './selectors';
import reducer from './reducer';
import saga from './saga';
import { SwipeableDrawer } from '../../components/LifetekUi';
import { mergeData as mergeDataGenerel } from '../AddGeneralManager/actions';
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
export class GeneralManager extends React.Component {
  mergeData = data => {
    this.props.mergeData(data);
  };

  handleOpen = index => {
    this.props.mergeData({ open: true, tab: index });
  };

  render() {
    const { generalManager, dataRole = [] } = this.props;
    const { id, open, tab } = generalManager;
    generalManager.tab = {};
    const customLable = name => {
      switch (name) {
        case 'reportCostRevenue':
          return 'Báo cáo tổng hợp doanh thu, nhóm chi phí trong năm';
        case 'reportCostPrice':
          return 'Báo cáo tổng hợp doanh thu, giá vốn trong năm';
        case 'reportRevenueInventory':
          return 'Báo cáo tổng hợp doanh thu, tồn kho trong năm';
        case 'Báo cáo tổng hợp doanh thu, tồn kho trong năm':
          return 'Báo cáo tổng hợp doanh thu, tồn kho trong năm';
        case 'Báo cáo tổng hợp doanh thu, nhóm chi phí trong năm':
          return 'Báo cáo tổng hợp doanh thu, nhóm chi phí trong năm';
        case 'Báo cáo tổng hợp doanh thu, giá vốn trong năm':
          return 'Báo cáo tổng hợp doanh thu, giá vốn trong năm';
        case 'Báo cáo tổng hợp doang thu, tồn kho trong năm':
          return 'Báo cáo tổng hợp doang thu, tồn kho trong năm';
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
        </VerticalTabs>

        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ open: false })} open={open} width={window.innerWidth - 260}>
          <AddGeneralManager id={id} tab={tab} />
        </SwipeableDrawer>
      </div>
    );
  }
}

GeneralManager.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  generalManager: makeSelectGeneralManager(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    mergeDataGenerel: data => dispatch(mergeDataGenerel(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'generalManager', reducer });
const withSaga = injectSaga({ key: 'generalManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(GeneralManager);
