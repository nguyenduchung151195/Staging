/**
 *
 * CollaboratePage
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
import makeSelectCollaboratePage from './selectors';
import { API_HRM_BUSINESS_TRIP } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddCollaborate from './components/AddCollaborate';
import { createCollaborate, updateCollaborate, deleteCollaborate } from './actions';
import CustomAppBar from 'components/CustomAppBar';
import { Grid } from '@material-ui/core';
import { makeSelectProfile, makeSelectMiniActive } from '../../../../../Dashboard/selectors';

/* eslint-disable react/prefer-stateless-function */
function CollaboratePage(props) {
  const { collaboratePage, onCreateCollaborate, onUpdateCollaborate, onDeleteCollaborate, id: hrmEmployeeId, miniActive } = props;
  const { createCollaborateSuccess, updateCollaborateSuccess, deleteCollaborateSuccess, reload } = collaboratePage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCollaborate, setSelectedCollaborate] = useState(null);
  const filter = {
    hrmEmployeeId: hrmEmployeeId,
  };
  useEffect(
    () => {
      if (createCollaborateSuccess === true) {
        handleCloseCollaborateDialog();
      }
      if (!createCollaborateSuccess) {
      }
    },
    [createCollaborateSuccess],
  );

  useEffect(
    () => {
      if (updateCollaborateSuccess === true) {
        handleCloseCollaborateDialog();
      }
      if (!updateCollaborateSuccess) {
      }
    },
    [updateCollaborateSuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: collaborateId } = data;
    if (!collaborateId) {
      onCreateCollaborate(data);
    } else {
      onUpdateCollaborate(collaborateId, data);
    }
  }, []);

  const handleOpenCollaborateDialog = () => {
    setSelectedCollaborate(null);
    setOpenDialog(true);
  };

  const handleCloseCollaborateDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => <Add onClick={handleOpenCollaborateDialog}>Open Menu</Add>;

  const handleDelete = ids => onDeleteCollaborate(hrmEmployeeId, ids);
  const mapFunction = item => {
    return {
      ...item,
      hrmEmployeeId: item.name,
    };
  };
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
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Công tác
        <span
          style={{
            color: '#A4A4A4',
            fontStyle: 'italic',
            fontWeight: 500,
          }}
        />
      </Typography> */}
      <CustomAppBar
        title="Công tác"
        onGoBack={() => props.onClose && props.onClose()}
        disableAdd
      // onSubmit={this.onSubmit}
      />
      <Grid style={{ marginTop: 60 }}>
        <Paper>
          <ListPage
            code="BusinessTrip"
            parentCode="hrm"
            onEdit={row => {
              setSelectedCollaborate(row);
              setOpenDialog(true);
            }}
            onDelete={handleDelete}
            reload={reload}
            apiUrl={API_HRM_BUSINESS_TRIP}
            settingBar={[addItem()]}
            filter={filter}
            mapFunction={mapFunction}
            exportExcel
            importExport="BusinessTrip"
            disableAdd
          />
        </Paper>
        <SwipeableDrawer anchor="right" onClose={handleCloseCollaborateDialog} open={openDialog} width={window.innerWidth - 260}>
          <div
          // style={{ width: window.innerWidth - 260 }}
          >
            <AddCollaborate
              hrmEmployeeId={hrmEmployeeId}
              code="BusinessTrip"
              collaborate={selectedCollaborate}
              onSave={handleSave}
              onClose={handleCloseCollaborateDialog}
            />
          </div>
        </SwipeableDrawer>
      </Grid>
    </Grid>
  );
}

CollaboratePage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  collaboratePage: makeSelectCollaboratePage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateCollaborate: data => dispatch(createCollaborate(data)),
    onUpdateCollaborate: (hrmEmployeeId, data) => dispatch(updateCollaborate(hrmEmployeeId, data)),
    onDeleteCollaborate: (hrmEmployeeId, ids) => dispatch(deleteCollaborate(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'collaboratePage', reducer });
const withSaga = injectSaga({ key: 'collaboratePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CollaboratePage);
