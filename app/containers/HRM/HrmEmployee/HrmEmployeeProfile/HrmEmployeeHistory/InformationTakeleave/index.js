/**
 *
 * SalaryPage
 *
 */

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Edit, Add } from '@material-ui/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Paper, Typography, SwipeableDrawer } from '../../../../../../components/LifetekUi';
import makeSelectSalaryPage from './selectors';
import { API_HRM_SALARY } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddSalary from './components/AddSalary';
import { createSalary, updateSalary, deleteSalary } from './actions';
import { makeSelectProfile } from '../../../../../Dashboard/selectors';

/* eslint-disable react/prefer-stateless-function */
function SalaryPage(props) {
  const { salaryPage, onCreateSalary, onUpdateSalary } = props;
  const { hrmEmployeeId, createSalarySuccess, updateSalarySuccess, deleteSalarySuccess, profile } = salaryPage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(
    () => {
      if (createSalarySuccess === true) {
        setReload(true);
        handleCloseSalaryDialog();
      }
      if (createSalarySuccess === false) {
      }
    },
    [createSalarySuccess],
  );

  const handleSave = useCallback(data => {
    const { hrmEmployeeId, ...restData } = data;
    if (!hrmEmployeeId) {
      onCreateSalary(data);
    } else {
      onUpdateSalary(hrmEmployeeId, restData);
    }
  }, []);

  const handleOpenSalaryDialog = () => {
    setOpenDialog(true);
    setReload(false);
  };

  const handleCloseSalaryDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenSalaryDialog}>
      Open Menu
    </Add>
  );

  return (
    <div>
      <Typography
        component="p"
        style={{
          fontWeight: 550,
          fontSize: '18px',
          marginLeft: 40,
          marginTop: 40,
        }}
      >
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Quá trình diễn biến lương
        <span
          style={{
            color: '#A4A4A4',
            fontStyle: 'italic',
            fontWeight: 500,
          }}
        />
      </Typography>
      <Paper>
        <ListPage code="SalesPolicy" reload={reload} apiUrl={API_HRM_SALARY} settingBar={[addItem()]} disableAdd />
      </Paper>
      <SwipeableDrawer anchor="right" onClose={handleCloseSalaryDialog} open={openDialog} width={window.innerWidth - 260}>
        <div
        // style={{ width: window.innerWidth - 260 }}
        >
          <AddSalary profile={profile} id={hrmEmployeeId} salary={selectedSalary} onSave={handleSave} onClose={handleCloseSalaryDialog} />
        </div>
      </SwipeableDrawer>
    </div>
  );
}

SalaryPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  salaryPage: makeSelectSalaryPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateSalary: data => dispatch(createSalary(data)),
    onUpdateSalary: (hrmEmployeeId, data) => dispatch(updateSalary(hrmEmployeeId, data)),
    onDeleteSalary: hrmEmployeeId => dispatch(deleteSalary(hrmEmployeeId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'salaryPage', reducer });
const withSaga = injectSaga({ key: 'salaryPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SalaryPage);
