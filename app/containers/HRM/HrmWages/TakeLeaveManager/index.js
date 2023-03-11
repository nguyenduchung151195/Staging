import React, { memo, useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import ListPage from 'components/List';
import { API_TAKE_LEAVE } from 'config/urlConfig';
import { Add } from '@material-ui/icons';
import { SwipeableDrawer } from 'components/LifetekUi';
import AddTakeLeaveManager from './AddTakeLeaveManager/Loadable';
import { viewConfigName2Title } from 'utils/common';
import reducer from './reducer';
import saga from './saga';
import makeSelectTakeLeaveManagement from './selectors';
import { addTakeLeaveManager, deleteTakeLeaveManager, mergeData, updateTakeLeaveManager, getAllVacationMode } from './actions';
import { Paper, Tooltip } from '@material-ui/core';
import { makeSelectProfile } from '../../../Dashboard/selectors';
import { changeSnackbar } from '../../../Dashboard/actions';

function TakeLeaveManager(props) {
  const { takeLeaveManager, addTakeLeaveManager, updateTakeLeaveManager, deleteTakeLeaveManager, getAllVacationMode, onChangeSnackbar } = props;
  const { reload, addUpdateTakeleaveManagerSuccess, vacationMode } = takeLeaveManager;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTakeLeavemanager, setSelectedTakeLeaveManager] = useState({});
  const [name2Title, setName2Title] = useState({});
  const [code] = useState('TakeLeave');

  useEffect(() => {
    getAllVacationMode();
    const name2Title = viewConfigName2Title(code);
    setName2Title(name2Title);
  }, []);

  useEffect(
    () => {
      if (addUpdateTakeleaveManagerSuccess) {
        handleCloseDialog();
      }
    },
    [addUpdateTakeleaveManagerSuccess],
  );

  const handleDelete = ids => {
    deleteTakeLeaveManager(ids);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedTakeLeaveManager({});
    setOpenDialog(false);
  };
  const addItem = () => (
    <Tooltip title="Thêm mới">
      <Add onClick={handleOpenDialog}>Open Menu</Add>
    </Tooltip>
  );

  const handleSave = data => {
   
    if (data && data._id) {
      updateTakeLeaveManager(data);
    } else {
      addTakeLeaveManager(data);
    }
  };

  const mapFunction = item => (
   {
    ...item,
    createdBy: item['createdBy.name'],
    date: item && item.originItem && item.originItem.date || '',
  });

  return (
    <Paper style={{ paddingTop: '15px' }}>
      <ListPage
        height="635px"
        code={code}
        parentCode="hrm"
        onEdit={row => {
          setSelectedTakeLeaveManager(row);
          setOpenDialog(true);
        }}
        // disableSearch
        exportExcel
        importExport
        employeeFilterKey="hrmEmployeeId"
        showDepartmentAndEmployeeFilter
        isHrm
        onDelete={handleDelete}
        reload={reload}
        apiUrl={API_TAKE_LEAVE}
        settingBar={[addItem()]}
        mapFunction={mapFunction}
        disableAdd
        profile={props.profile}
        filterEdit={true}
      />

      {openDialog && (
        <AddTakeLeaveManager
          data={selectedTakeLeavemanager}
          onChangeSnackbar={onChangeSnackbar}
          onSave={handleSave}
          reload={reload}
          onClose={handleCloseDialog}
          code={code}
          name2Title={name2Title}
          vacationMode={vacationMode}
          open={openDialog}
          profile={props.profile}
        />
      )}
    </Paper>
  );
}

TakeLeaveManager.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  takeLeaveManager: makeSelectTakeLeaveManagement(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),

    addTakeLeaveManager: data => dispatch(addTakeLeaveManager(data)),
    updateTakeLeaveManager: data => dispatch(updateTakeLeaveManager(data)),
    deleteTakeLeaveManager: ids => dispatch(deleteTakeLeaveManager(ids)),
    getAllVacationMode: () => dispatch(getAllVacationMode()),
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'takeLeaveManager', reducer });
const withSaga = injectSaga({ key: 'takeLeaveManager', saga });

export default compose(
  memo,
  withReducer,
  withSaga,
  withConnect,
)(TakeLeaveManager);
