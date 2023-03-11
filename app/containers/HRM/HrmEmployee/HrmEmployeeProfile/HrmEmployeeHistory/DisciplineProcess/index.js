/**
 *
 * DisciplinePage
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
import makeSelectDisciplinePage from './selectors';
import { API_HRM_DISCIPLINE } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddDiscipline from './components/AddDiscipline';
import { createDiscipline, updateDiscipline, deleteDiscipline } from './actions';
import { Grid } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';
import { makeSelectProfile, makeSelectMiniActive } from '../../../../../Dashboard/selectors';

/* eslint-disable react/prefer-stateless-function */
function DisciplinePage(props) {
  const { disciplinePage, onCreateDiscipline, onUpdateDiscipline, onDeleteDiscipline, id: hrmEmployeeId, miniActive } = props;
  const { createDisciplineSuccess, updateDisciplineSuccess, deleteDisciplineSuccess, reload } = disciplinePage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const filter = {
    hrmEmployeeId: hrmEmployeeId,
  };
  useEffect(
    () => {
      if (createDisciplineSuccess === true) {
        handleCloseDisciplineDialog();
      }
      if (!createDisciplineSuccess) {
      }
    },
    [createDisciplineSuccess],
  );
  useEffect(
    () => {
      if (updateDisciplineSuccess === true) {
        handleCloseDisciplineDialog();
      }
      if (!updateDisciplineSuccess) {
      }
    },
    [updateDisciplineSuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: disciplineId } = data;
    if (!disciplineId) {
      onCreateDiscipline(data);
    } else {
      onUpdateDiscipline(disciplineId, data);
    }
  }, []);

  const handleOpenDisciplineDialog = () => {
    setSelectedDiscipline(null);
    setOpenDialog(true);
  };

  const handleCloseDisciplineDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => <Add onClick={handleOpenDisciplineDialog}>Open Menu</Add>;

  const handleDelete = ids => onDeleteDiscipline(hrmEmployeeId, ids);

  const mapFunction = item => ({
    ...item,
    hrmEmployeeId: item['name'],
  });

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
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Quá trình kỷ luật
        <span
          style={{
            color: '#A4A4A4',
            fontStyle: 'italic',
            fontWeight: 500,
          }}
        />
      </Typography> */}
      <CustomAppBar
        title="Quá trình kỷ luật"
        onGoBack={() => props.onClose && props.onClose()}
        disableAdd
        // onSubmit={this.onSubmit}
      />
      <Grid style={{ marginTop: 60 }}>
        <Paper>
          <ListPage
            code="DisciplineProcess"
            parentCode="hrm"
            onEdit={row => {
              setSelectedDiscipline(row);
              setOpenDialog(true);
            }}
            onDelete={handleDelete}
            reload={reload}
            apiUrl={API_HRM_DISCIPLINE}
            settingBar={[addItem()]}
            filter={filter}
            mapFunction={mapFunction}
            disableAdd
            exportExcel
            importExport="DisciplineProcess"
            // client
          />
        </Paper>
        <SwipeableDrawer anchor="right" onClose={handleCloseDisciplineDialog} open={openDialog} width={window.innerWidth - 260}>
          <div
          // style={{ width: window.innerWidth - 260 }}
          >
            <AddDiscipline
              hrmEmployeeId={hrmEmployeeId}
              code="DisciplineProcess"
              discipline={selectedDiscipline}
              onSave={handleSave}
              onClose={handleCloseDisciplineDialog}
            />
          </div>
        </SwipeableDrawer>
      </Grid>
    </Grid>
  );
}

DisciplinePage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  disciplinePage: makeSelectDisciplinePage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateDiscipline: data => dispatch(createDiscipline(data)),
    onUpdateDiscipline: (hrmEmployeeId, data) => dispatch(updateDiscipline(hrmEmployeeId, data)),
    onDeleteDiscipline: (hrmEmployeeId, ids) => dispatch(deleteDiscipline(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'disciplinePage', reducer });
const withSaga = injectSaga({ key: 'disciplinePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DisciplinePage);
