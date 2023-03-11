/**
 *
 * DismissedPage
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
import makeSelectDismissedPage from './selectors';
import { API_HRM_DISMISSED } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddDismissed from './components/AddDismissed';
import { createDismissed, updateDismissed, deleteDismissed } from './actions';
import { Grid } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';
import { makeSelectProfile, makeSelectMiniActive } from '../../../../../Dashboard/selectors';
import moment from 'moment';
/* eslint-disable react/prefer-stateless-function */
function DismissedPage(props) {
  const { dismissedPage, onCreateDismissed, onUpdateDismissed, onDeleteDismissed, id: hrmEmployeeId, fileName, miniActive, profile } = props;
  const { createDismissedSuccess, updateDismissedSuccess, reload } = dismissedPage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDismissed, setSelectedDismissed] = useState(null);
  const filter = {
    hrmEmployeeId: hrmEmployeeId,
  };
  useEffect(
    () => {
      if (createDismissedSuccess === true) {
        handleCloseDismissedDialog();
      }
      if (!createDismissedSuccess) {
      }
    },
    [createDismissedSuccess],
  );

  useEffect(
    () => {
      if (updateDismissedSuccess === true) {
        handleCloseDismissedDialog();
      }
      if (!updateDismissedSuccess) {
      }
    },
    [updateDismissedSuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: dismissedId } = data;
    if (!dismissedId) {
      onCreateDismissed(data);
    } else {
      onUpdateDismissed(dismissedId, data);
    }
  }, []);

  const handleOpenDismissedDialog = () => {
    setSelectedDismissed(null);
    setOpenDialog(true);
  };

  const handleCloseDismissedDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => <Add onClick={handleOpenDismissedDialog}>Open Menu</Add>;

  const handleDelete = ids => onDeleteDismissed(hrmEmployeeId, ids);
  const mapFunction = item => {
    return {
      ...item,
      hrmEmployeeId: item.name,
      endDate: item.endDate ? moment(item.endDate).format('DD/MM/YYYY') : '',
      organizationUnit: item['organizationUnit.name'],
    };
  };
  return (
    <Grid style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)' }}>
      <CustomAppBar
        title="Kiêm nhiệm"
        onGoBack={() => props.onClose && props.onClose()}
        disableAdd
      // onSubmit={this.onSubmit}
      />
      <Grid style={{ marginTop: 60 }}>
        <Paper>
          <ListPage
            code="Concurrently"
            parentCode="hrm"
            onEdit={row => {
              setSelectedDismissed(row);
              setOpenDialog(true);
            }}
            onDelete={handleDelete}
            reload={reload}
            apiUrl={API_HRM_DISMISSED}
            settingBar={[addItem()]}
            filter={filter}
            exportExcel
            importExport="Concurrently"
            disableAdd
            mapFunction={mapFunction}
          />
        </Paper>
        <SwipeableDrawer anchor="right" onClose={handleCloseDismissedDialog} open={openDialog} width={window.innerWidth - 260}>
          <div
          // style={{ width: window.innerWidth - 260 }}
          >
            <AddDismissed
              profile={profile}
              hrmEmployeeId={hrmEmployeeId}
              code="Concurrently"
              dismissed={selectedDismissed}
              onSave={handleSave}
              onClose={handleCloseDismissedDialog}
              fileName={fileName}
            />
          </div>
        </SwipeableDrawer>
      </Grid>
    </Grid>
  );
}

DismissedPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  dismissedPage: makeSelectDismissedPage(),
  miniActive: makeSelectMiniActive(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateDismissed: data => dispatch(createDismissed(data)),
    onUpdateDismissed: (hrmEmployeeId, data) => dispatch(updateDismissed(hrmEmployeeId, data)),
    onDeleteDismissed: (hrmEmployeeId, ids) => dispatch(deleteDismissed(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'dismissedPage', reducer });
const withSaga = injectSaga({ key: 'dismissedPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DismissedPage);
