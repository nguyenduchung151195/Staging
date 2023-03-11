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
import {API_LT_ACCOUNT} from '../../config/urlConfig'
import saga from './saga';
import { getAccountRequested } from './actions';
import List from '../../components/List';
import { Button, Tooltip } from '@material-ui/core';
import { Add } from '@material-ui/icons'

function LtAccount(props) {
  

  const handleAddClick = () => {
    props.history.valueTab = 'add';
    props.history.push('/setting/lt-account/add');
  };
  const handleEditClick = item => {
    const { history } = props;
    props.history.valueTab = item._id;
    history.push(`/setting/lt-account/edit/${item._id}`);
  };
  const mapFunction = item =>{
    return {
      ...item,
      accountStatus: item.accountStatus === "1" ? "Hoạt động" : item.accountStatus === "2" ? "Khóa hoạt đông " : null
    }
  }

  return (
    <div>
      <Paper elevation={3}>
        <List
          height="700px"
          apiUrl={API_LT_ACCOUNT}
          code="LtAccount"
          disableImport
          disableAdd
          mapFunction={mapFunction}
          settingBar={
            [
              <Add onClick={handleAddClick}>
                Thêm mới
              </Add>
          ]
          }
          onEdit={handleEditClick}
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
  ltAccount: makeSelectLtAccount(),
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

const withReducer = injectReducer({ key: 'ltAccount', reducer });
const withSaga = injectSaga({ key: 'ltAccount', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(LtAccount);
