/**
 *
 * ProcessPage
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
import makeSelectProcessPage from './selectors';
import { API_HRM_PROCESS } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddProcess from './components/AddProcess';
import { createProcess, updateProcess, deleteProcess } from './actions';
import { Grid } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';
import { makeSelectProfile, makeSelectMiniActive } from '../../../../../Dashboard/selectors';

/* eslint-disable react/prefer-stateless-function */
function ProcessPage(props) {
  const { processPage, onCreateProcess, onUpdateProcess, onDeleteProcess, id: hrmEmployeeId, miniActive } = props;
  const { createProcessSuccess, updateProcessSuccess, deleteProcessSuccess, reload } = processPage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const filter = {
    hrmEmployeeId: hrmEmployeeId,
  };
  useEffect(
    () => {
      if (createProcessSuccess === true) {
        handleCloseProcessDialog();
      }
      if (!createProcessSuccess) {
      }
    },
    [createProcessSuccess],
  );

  useEffect(
    () => {
      if (updateProcessSuccess === true) {
        handleCloseProcessDialog();
      }
      if (!updateProcessSuccess) {
      }
    },
    [updateProcessSuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: processId, ...restData } = data;
    if (!processId) {
      onCreateProcess(data);
    } else {
      onUpdateProcess(processId, data);
    }
  }, []);

  const handleOpenProcessDialog = () => {
    setSelectedProcess(null);
    setOpenDialog(true);
  };

  const handleCloseProcessDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => <Add onClick={handleOpenProcessDialog}>Open Menu</Add>;

  const handleDelete = ids => onDeleteProcess(hrmEmployeeId, ids);

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
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Quá trình làm việc
        <span
          style={{
            color: '#A4A4A4',
            fontStyle: 'italic',
            fontWeight: 500,
          }}
        />
      </Typography> */}
      <CustomAppBar
        title="Quá trình làm việc"
        onGoBack={() => props.onClose && props.onClose()}
        disableAdd
      // onSubmit={this.onSubmit}
      />
      <Grid style={{ marginTop: 80 }}>
        <Paper>
          <ListPage
            code="WorkProgress"
            parentCode="hrm"
            onEdit={row => {
              let data = row
              if (row && row.newOrganizationUnitId) {
                data = {
                  ...data,
                  originItem: {
                    ...data.originItem,
                    newOrganizationUnit: {
                      department: row.newOrganizationUnitId,
                      employee: null,
                    }
                  }
                }
              }
              if (row && row.oldOrganizationUnitId) {
                data = {
                  ...data,
                  originItem: {
                    ...data.originItem,
                    oldOrganizationUnit: {
                      department: row.oldOrganizationUnitId,
                      employee: null,
                    }
                  }
                }
              }
              setSelectedProcess(data);
              setOpenDialog(true);
            }}
            onDelete={handleDelete}
            reload={reload}
            apiUrl={API_HRM_PROCESS}
            settingBar={[addItem()]}
            filter={filter}
            mapFunction={mapFunction}
            disableAdd
            exportExcel
            importExport="WorkProgress"
          // client
          />
        </Paper>
        <SwipeableDrawer anchor="right" onClose={handleCloseProcessDialog} open={openDialog} width={window.innerWidth - 260}>
          <div
          // style={{ width: window.innerWidth - 260 }}
          >
            <AddProcess
              hrmEmployeeId={hrmEmployeeId}
              code="WorkProgress"
              process={selectedProcess}
              onSave={handleSave}
              onClose={handleCloseProcessDialog}
            />
          </div>
        </SwipeableDrawer>
      </Grid>
    </Grid>
  );
}

ProcessPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  processPage: makeSelectProcessPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateProcess: data => dispatch(createProcess(data)),
    onUpdateProcess: (hrmEmployeeId, data) => dispatch(updateProcess(hrmEmployeeId, data)),
    onDeleteProcess: (hrmEmployeeId, ids) => dispatch(deleteProcess(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'processPage', reducer });
const withSaga = injectSaga({ key: 'processPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ProcessPage);
