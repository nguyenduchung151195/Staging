/**
 *
 * EducationPage
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
import makeSelectEducationPage from './selectors';
import { API_HRM_EDUCATION, API_EDUCATE_ROUND } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddEducation from './components/AddEducation';
import ViewTraining from './components/ViewTraining';
import { createEducation, updateEducation, deleteEducation } from './actions';
import { Grid } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';
import { makeSelectProfile, makeSelectMiniActive } from '../../../../../Dashboard/selectors';

/* eslint-disable react/prefer-stateless-function */
function EducationPage(props) {
  const { educationPage, onCreateEducation, onUpdateEducation, onDeleteEducation, id: hrmEmployeeId, miniActive } = props;
  const { createEducationSuccess, updateEducationSuccess, deleteEducationSuccess, reload } = educationPage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEducation, setselectedEducation] = useState(null);
  const filter = {
    // hrmEmployeeId: hrmEmployeeId,
    'hrmJoin.hrmEmployeeId': hrmEmployeeId,
  };
  useEffect(
    () => {
      if (createEducationSuccess === true) {
        handleCloseEducationDialog();
      }
      if (!createEducationSuccess) {
      }
    },
    [createEducationSuccess],
  );

  useEffect(
    () => {
      if (updateEducationSuccess === true) {
        handleCloseEducationDialog();
      }
      if (!updateEducationSuccess) {
      }
    },
    [updateEducationSuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: educationId } = data;
    if (!educationId) {
      onCreateEducation(data);
    } else {
      onUpdateEducation(educationId, data);
    }
  }, []);

  const handleOpenEducationDialog = () => {
    setselectedEducation(null);
    setOpenDialog(true);
  };

  const handleCloseEducationDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  // const addItem = () => <Add onClick={handleOpenEducationDialog}>Open Menu</Add>;

  const handleDelete = ids => onDeleteEducation(hrmEmployeeId, ids);

  const mapFunction = item => ({
    ...item,
    hrmEmployeeId: item['name'],
    degree: item['degree.title'],
    educateCenter: item['educateCenter.title'],
    educatePlan: item['educatePlan.name'],
    educateMethod: item['educateMethod.title'],
  });

  return (
    <Grid style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)' }}>
      <CustomAppBar
        title="Quá trình đào tạo"
        onGoBack={() => props.onClose && props.onClose()}
        disableAdd
        // onSubmit={this.onSubmit}
      />
      <Grid style={{ marginTop: 60 }}>
        <Paper>
          <ListPage
            code="EducateRound"
            parentCode="hrm"
            onEdit={row => {
              setselectedEducation(row);
              setOpenDialog(true);
            }}
            onDelete={handleDelete}
            reload={reload}
            apiUrl={API_EDUCATE_ROUND}
            // settingBar={[addItem()]}
            filter={filter}
            mapFunction={mapFunction}
            disableAdd
            // disableEdit
            exportExcel
            importExport="EducateRound"
            advanceFilter
            // onRowClick={row => {
            //   setselectedEducation(row);
            //   setOpenDialog(true);
            // }}
            // client
          />
        </Paper>
        <SwipeableDrawer anchor="right" onClose={handleCloseEducationDialog} open={openDialog} width={window.innerWidth - 260}>
          <div style={{ width: window.innerWidth - 260 }}>
            {/* <AddEducation
              {...props}
              hrmEmployeeId={hrmEmployeeId}
              code="EducateRound"
              education={selectedEducation}
              onSave={handleSave}
              onClose={handleCloseEducationDialog}
            /> */}
            <ViewTraining
              code="EducateRound"
              {...props}
              isDisabled={true}
              hrmEmployeeId={hrmEmployeeId}
              training={selectedEducation}
              educateID={props.educate && props.educate._id}
              onSave={handleSave}
              onClose={handleCloseEducationDialog}
              profile={props.profile}
            />
          </div>
        </SwipeableDrawer>
      </Grid>
    </Grid>
  );
}

EducationPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  educationPage: makeSelectEducationPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateEducation: data => dispatch(createEducation(data)),
    onUpdateEducation: (hrmEmployeeId, data) => dispatch(updateEducation(hrmEmployeeId, data)),
    onDeleteEducation: (hrmEmployeeId, ids) => dispatch(deleteEducation(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'educationPage', reducer });
const withSaga = injectSaga({ key: 'educationPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(EducationPage);
