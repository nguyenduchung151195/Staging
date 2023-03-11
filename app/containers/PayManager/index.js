/**
 *
 * PayManager
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
import AddPayManager from 'containers/AddPayManager';
import makeSelectPayManager from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData } from './actions';
import { SwipeableDrawer } from '../../components/LifetekUi';
import { mergeData as mergeDataPayManager } from '../AddPayManager/actions';

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
export class PayManager extends React.Component {
  mergeData = data => {
    this.props.mergeData(data);
  };

  onArea = openDrawer => {
    this.props.mergeData({ openDrawer });
    this.props.mergeDataPayManager({
      tab: 0,
    });
  };

  onEmployees = openEmployees => {
    this.props.mergeData({ openEmployees });
    this.props.mergeDataPayManager({
      tab: 1,
    });
  };

  onTime = openTime => {
    this.props.mergeData({ openTime });
    this.props.mergeDataPayManager({
      tab: 2,
    });
  };

  onLiabiliti = openLiabiliti => {
    this.props.mergeData({ openLiabiliti });
    this.props.mergeDataPayManager({
      tab: 3,
    });
  };

  render() {
    const { payManager } = this.props;
    const { openDrawer, id, openEmployees, openTime, openLiabiliti } = payManager;
    return (
      <div>
        <VerticalTabs>
          <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Tổng hợp công nợ phải trả" onClick={this.onLiabiliti} />
          <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Tổng hợp công nợ theo khu vực" onClick={this.onArea} />
          <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Tổng hợp công nợ theo nhân viên kd" onClick={this.onEmployees} />
          <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Số dư công nợ phải thu theo thời gian" onClick={this.onTime} />
        </VerticalTabs>
        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openDrawer: false })} open={openDrawer} width={window.innerWidth - 260}>
          <AddPayManager id={id} />
        </SwipeableDrawer>

        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openEmployees: false })} open={openEmployees} width={window.innerWidth - 260}>
          <AddPayManager id={id} />
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openTime: false })} open={openTime} width={window.innerWidth - 260}>
          <AddPayManager id={id} />
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openLiabiliti: false })} open={openLiabiliti} width={window.innerWidth - 260}>
          <AddPayManager id={id} />
        </SwipeableDrawer>
      </div>
    );
  }
}

PayManager.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  payManager: makeSelectPayManager(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    mergeDataPayManager: data => dispatch(mergeDataPayManager(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'payManager', reducer });
const withSaga = injectSaga({ key: 'payManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(PayManager);
