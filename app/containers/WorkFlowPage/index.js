/**
 *
 * WorkFlowPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import ListPage from 'components/List/ListPage';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectWorkFlowPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const rows = [
  {
    title: 'Quy trình sản xuất đường trắng',
    id: '21',
    start_date: '09-03-2019',
    created_by: 'Ngô Thị Thu',
  },
  {
    title: 'Quy trình sản suất sữa ông thọ',
    id: '11',
    start_date: '04-08-2018',
    created_by: 'Nguyễn Văn Minh',
  },
];

const columns = [
  { name: 'id', title: 'ID', visibility: true },
  { name: 'title', title: 'Tên', visibility: true },
  { name: 'start_date', title: 'Ngày tạo', visibility: true },
  { name: 'created_by', title: 'Người tạo', visibility: true },
];

const WorkFlowPage = props => (
  <div>
    <ListPage path={props.match.path} columns={columns} rows={rows} />
  </div>
);

// WorkFlowPage.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  workFlowPage: makeSelectWorkFlowPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'workFlowPage', reducer });
const withSaga = injectSaga({ key: 'workFlowPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(WorkFlowPage);
