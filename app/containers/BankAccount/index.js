// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Paper } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectLtAccount from './selectors';
import reducer from './reducer';
import { API_BANK_ACCOUNT } from '../../config/urlConfig';
import saga from './saga';
import { getAccountRequested } from './actions';
import List from '../../components/List';
import { Button, Tooltip } from '@material-ui/core';
import { Add } from '@material-ui/icons';

function BankAccount(props) {
  const handleAddClick = () => {
    props.history.valueTab = 'add';
    props.history.push('/RevenueExpenditure/Account/add');
  };
  const handleEditClick = item => {
    const { history } = props;
    props.history.valueTab = item._id;
    history.push(`/RevenueExpenditure/Account/edit/${item._id}`);
  };
  const mapFunction = item => {
    return {
      ...item,
      // accountStatus: item.accountStatus === "1" ? "Hoạt động" : item.accountStatus === "2" ? "Khóa hoạt đông " : null
    };
  };

  return (
    <div>
      <Paper elevation={3} style={{ padding: 10 }}>
        <List
          height="695px"
          apiUrl={API_BANK_ACCOUNT}
          code="BankAccount"
          disableAdd
          mapFunction={mapFunction}
          settingBar={[<Add onClick={handleAddClick}>Thêm mới</Add>]}
          onEdit={handleEditClick}
          exportExcel
          importExport="BankAccount"
        />
      </Paper>
    </div>
  );
}

// LtAccount.propTypes = {
//   dispatch: PropTypes.func.isRequired,
//   ltAccount: PropTypes.object,
// };

const mapStateToProps = createStructuredSelector({
  BankAccount: makeSelectLtAccount(),
});

// function mapDispatchToProps(dispatch) {
//   return {
//     dispatch,
//   };
// }

const withConnect = connect(
  mapStateToProps,
  // mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'BankAccount', reducer });
const withSaga = injectSaga({ key: 'BankAccount', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(BankAccount);
