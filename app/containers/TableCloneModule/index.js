/**
 *
 * TableCloneModule
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectTableCloneModule from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
export class TableCloneModule extends React.Component {
  render() {
    return <div>{/* <FormattedMessage {...messages.header} /> */}</div>;
  }
}

TableCloneModule.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  tableCloneModule: makeSelectTableCloneModule(),
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

const withReducer = injectReducer({ key: 'tableCloneModule', reducer });
const withSaga = injectSaga({ key: 'tableCloneModule', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TableCloneModule);
