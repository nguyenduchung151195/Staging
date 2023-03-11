/**
 *
 * ExpenseManager
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
import AddExpenseManage from 'containers/AddExpenseManage';
import makeSelectExpenseManager from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData } from './actions';
import { SwipeableDrawer } from '../../components/LifetekUi';
import { mergeData as mergeDataExpense } from '../AddExpenseManage/actions';

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
export class ExpenseManager extends React.Component {
  mergeData = data => {
    this.props.mergeData(data);
  };

  handleOpen = index => {
    this.props.mergeData({ open: true, expense: index });
  };
  render() {
    const { expenseManager, dataRole = [] } = this.props;
    const { open, id, expense } = expenseManager;
    expenseManager.expense = {};
    const customLable = name => {
      switch (name) {
        case 'reportCostRatio':
          return 'Báo cáo tỉ trọng chi phí';
        case 'reportCostRatioItem':
          return 'Báo cáo tỷ trọng chi phí theo khoản mục';
        case 'Báo cáo tỷ trọng chi phí':
          return 'Báo cáo tỉ trọng chi phí';
        case 'Báo cáo tỷ trọng chi phí theo khoản mục':
          return 'Báo cáo tỷ trọng chi phí theo khoản mục';
      }
    };
    return (
      <div>
        <VerticalTabs value={expense} wrapped={true}>
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
          <AddExpenseManage id={id} expense={expense} />
        </SwipeableDrawer>
      </div>
    );
  }
}

ExpenseManager.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  expenseManager: makeSelectExpenseManager(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    mergeDataExpense: data => dispatch(mergeDataExpense(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'expenseManager', reducer });
const withSaga = injectSaga({ key: 'expenseManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ExpenseManager);
