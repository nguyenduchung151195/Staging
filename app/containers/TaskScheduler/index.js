/**
 *
 * TaskScheduler
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Scheduler from 'components/Calendar';
import makeSelectTaskScheduler from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getTasks } from './actions';

function TaskScheduler(props) {
  useEffect(() => {
    props.getTasks();
  }, []);

  return <Scheduler data={props.taskScheduler.data} />;
}

TaskScheduler.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  taskScheduler: makeSelectTaskScheduler(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getTasks: () => dispatch(getTasks()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'taskScheduler', reducer });
const withSaga = injectSaga({ key: 'taskScheduler', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TaskScheduler);
