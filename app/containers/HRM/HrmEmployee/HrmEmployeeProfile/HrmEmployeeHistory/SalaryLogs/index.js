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
import { changeSnackbar } from '../../../../../Dashboard/actions';
import makeSelectEditProfilePage from '../../../../../EditProfilePage/selectors';
import { makeSelectProfile, makeSelectMiniActive } from '../../../../../Dashboard/selectors';
import { Grid } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';

/* eslint-disable react/prefer-stateless-function */
function SalaryPage(props) {
  const { salaryPage, onCreateSalary, onUpdateSalary, onDeleteSalary, id: hrmEmployeeId, miniActive } = props;
  const { createSalarySuccess, updateSalarySuccess, deleteSalarySuccess, reload } = salaryPage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  // const [reload, setReload] = useState(false);
  const filter = {
    hrmEmployeeId: hrmEmployeeId,
  };
  useEffect(
    () => {
      if (createSalarySuccess === true) {
        // setReload(true);
        handleCloseSalaryDialog();
      }
      if (!createSalarySuccess) {
        // setReload(false);
      }
    },
    [createSalarySuccess],
  );

  useEffect(
    () => {
      if (updateSalarySuccess === true) {
        // setReload(true);
        handleCloseSalaryDialog();
      }
      if (!updateSalarySuccess) {
        // setReload(false);
      }
    },
    [updateSalarySuccess],
  );
  const mapFunction = item => {
    return {
      ...item,
      hrmEmployeeId: item.name,
      organizationUnit: item['organizationUnit.name'],
    };
  };
  const handleSave = useCallback(data => {
    const { _id: salaryId } = data;
    if (!salaryId) {
      onCreateSalary(data);
    } else {
      onUpdateSalary(salaryId, data);
    }
  }, []);

  const handleOpenSalaryDialog = () => {
    setSelectedSalary(null);
    setOpenDialog(true);
  };

  const handleCloseSalaryDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => <Add onClick={handleOpenSalaryDialog}>Open Menu</Add>;

  const handleDelete = data => onDeleteSalary(hrmEmployeeId, data);

  return (
    <Grid style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)' }}>
      {/* <Typography
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
      </Typography> */}
      <CustomAppBar
        title="Quá trình diễn biến lương"
        onGoBack={() => props.onClose && props.onClose()}
        disableAdd
        // onSubmit={this.onSubmit}
      />
      <Grid style={{ marginTop: 80 }}>
        <Paper>
          <ListPage
            code="SalaryDevelopment"
            parentCode="hrm"
            onEdit={row => {
              setSelectedSalary(row);
              setOpenDialog(true);
            }}
            onDelete={handleDelete}
            reload={reload}
            apiUrl={API_HRM_SALARY}
            settingBar={[addItem()]}
            filter={filter}
            disableAdd
            profile={props.profile}
            exportExcel
            importExport="SalaryDevelopment"
            mapFunction={mapFunction}
            // client
          />
        </Paper>
        <SwipeableDrawer anchor="right" onClose={handleCloseSalaryDialog} open={openDialog} width={window.innerWidth - 260}>
          <div
          // style={{ width: window.innerWidth - 260 }}
          >
            <AddSalary
              hrmEmployeeId={hrmEmployeeId}
              profile={props.profile}
              miniActive={miniActive}
              code="SalaryDevelopment"
              salary={selectedSalary}
              onSave={handleSave}
              onClose={handleCloseSalaryDialog}
              onChangeSnackbar={props.onChangeSnackbar}
            />
          </div>
        </SwipeableDrawer>
      </Grid>
    </Grid>
  );
}

SalaryPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  salaryPage: makeSelectSalaryPage(),
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateSalary: data => dispatch(createSalary(data)),
    onUpdateSalary: (hrmEmployeeId, data) => dispatch(updateSalary(hrmEmployeeId, data)),
    onDeleteSalary: (hrmEmployeeId, ids) => dispatch(deleteSalary(hrmEmployeeId, ids)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
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
