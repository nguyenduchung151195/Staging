/**
 *
 * MaternityPage
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
import makeSelectMaternityPage from './selectors';
import { API_HRM_MATERNITY } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddMaternity from './components/AddMaternity';
import { createMaternity, updateMaternity, deleteMaternity } from './actions';
import { Grid } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';
import { makeSelectProfile, makeSelectMiniActive } from '../../../../../Dashboard/selectors';
import moment from 'moment';

/* eslint-disable react/prefer-stateless-function */
function MaternityPage(props) {
  const { maternityPage, onCreateMaternity, onUpdateMaternity, onDeleteMaternity, id: hrmEmployeeId, miniActive } = props;
  const { createMaternitySuccess, updateMaternitySuccess, deleteMaternitySuccess, reload } = maternityPage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMaternity, setSelectedMaternity] = useState(null);
  const filter = {
    hrmEmployeeId: hrmEmployeeId,
  };
  useEffect(
    () => {
      if (createMaternitySuccess === true) {
        handleCloseMaternityDialog();
      }
      if (!createMaternitySuccess) {
      }
    },
    [createMaternitySuccess],
  );

  useEffect(
    () => {
      if (updateMaternitySuccess === true) {
        handleCloseMaternityDialog();
      }
      if (!updateMaternitySuccess) {
      }
    },
    [updateMaternitySuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: maternityId } = data;
    if (!maternityId) {
      onCreateMaternity(data);
    } else {
      onUpdateMaternity(maternityId, data);
    }
  }, []);

  const handleOpenMaternityDialog = () => {
    setSelectedMaternity(null);
    setOpenDialog(true);
  };

  const handleCloseMaternityDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => <Add onClick={handleOpenMaternityDialog}>Open Menu</Add>;

  const handleDelete = ids => onDeleteMaternity(hrmEmployeeId, ids);

  const mapFunction = item => {
    return {
      ...item,
      atHome: item.atHome ? moment(item.atHome).format('DD/MM/YYYY') : '',
      backDate: item.backDate ? moment(item.backDate).format('DD/MM/YYYY') : '',
      createdAt: item.createdAt ? moment(item.createdAt).format('DD/MM/YYYY') : '',
      dateFounded: item.dateFounded ? moment(item.dateFounded).format('DD/MM/YYYY') : '',
      dateOfBirth: item.dateOfBirth ? moment(item.dateOfBirth).format('DD/MM/YYYY') : '',
      decisionDate: item.decisionDate ? moment(item.decisionDate).format('DD/MM/YYYY') : '',
      dateOfBirthChild: item.dateOfBirthChild ? moment(item.dateOfBirthChild).format('DD/MM/YYYY') : '',
      duedate: item.duedate ? moment(item.duedate).format('DD/MM/YYYY') : '',
      fromMonth: item.fromMonth ? moment(item.fromMonth).format('DD/MM/YYYY') : '',
      toMonth: item.toMonth ? moment(item.toMonth).format('DD/MM/YYYY') : '',
      updatedAt: item.updatedAt ? moment(item.updatedAt).format('DD/MM/YYYY') : '',
      hrmEmployeeId: item['name'],
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
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Quá trình thai sản
        <span
          style={{
            color: '#A4A4A4',
            fontStyle: 'italic',
            fontWeight: 500,
          }}
        />
      </Typography> */}
      <CustomAppBar
        title="Quá trình thai sản"
        onGoBack={() => props.onClose && props.onClose()}
        disableAdd
        // onSubmit={this.onSubmit}
      />
      <Grid style={{ marginTop: 60 }}>
        <Paper>
          <ListPage
            code="MaternityProcess"
            parentCode="hrm"
            onEdit={row => {
              setSelectedMaternity(row);
              setOpenDialog(true);
            }}
            onDelete={handleDelete}
            reload={reload}
            apiUrl={API_HRM_MATERNITY}
            settingBar={[addItem()]}
            filter={filter}
            mapFunction={mapFunction}
            disableAdd
            exportExcel
            importExport="MaternityProcess"
            // client
          />
        </Paper>
        <SwipeableDrawer
          anchor="right"
          onClose={handleCloseMaternityDialog}
          open={openDialog}
          width={!miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)'}
        >
          <div
          // style={{ width: window.innerWidth - 260 }}
          >
            <AddMaternity
              hrmEmployeeId={hrmEmployeeId}
              miniActive={miniActive}
              code="MaternityProcess"
              maternity={selectedMaternity}
              onSave={handleSave}
              onClose={handleCloseMaternityDialog}
            />
          </div>
        </SwipeableDrawer>
      </Grid>
    </Grid>
  );
}

MaternityPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  maternityPage: makeSelectMaternityPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateMaternity: data => dispatch(createMaternity(data)),
    onUpdateMaternity: (hrmEmployeeId, data) => dispatch(updateMaternity(hrmEmployeeId, data)),
    onDeleteMaternity: (hrmEmployeeId, ids) => dispatch(deleteMaternity(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'maternityPage', reducer });
const withSaga = injectSaga({ key: 'maternityPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(MaternityPage);
