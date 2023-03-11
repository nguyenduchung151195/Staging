/**
 *
 * SalesPolicyPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
// import { sampleProcesskColumns } from 'variable';
import makeSelectSalesPolicyPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { API_SALE_POLICY } from '../../config/urlConfig';
import moment from 'moment';
/* eslint-disable react/prefer-stateless-function */
const ruleArr = [
  'Giảm giá đơn hàng',
  'Giảm giá cao cấp',
  'Mua X nhận Y miễn phí (BOGO)',
  'Mua X nhận giảm giá',
  'Chi tiêu X nhận giảm',
  'Hoa hồng cho khách hàng',
];
export class SalesPolicyPage extends React.Component {
  mapFunction = item => {
    console.log(item, 'item');
    return {
      ...item,
      startDate: moment(item.startDate).format('YYYY-MM-DD'),
      endDate: moment(item.endDate).format('YYYY-MM-DD'),
      rule: ruleArr[item.rule - 1],
      active: item.active === true ? 'true' : 'false',
      discount: item.discount === true ? 'true' : 'false',
    };
  };

  render() {
    return (
      <div>
        <ListPage height="660px" exportExcel withPagination code="SalesPolicy" apiUrl={API_SALE_POLICY} mapFunction={this.mapFunction} />
      </div>
    );
  }
}

// SalesPolicyPage.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  salesPolicyPage: makeSelectSalesPolicyPage(),
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

const withReducer = injectReducer({ key: 'salesPolicyPage', reducer });
const withSaga = injectSaga({ key: 'salesPolicyPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SalesPolicyPage);
