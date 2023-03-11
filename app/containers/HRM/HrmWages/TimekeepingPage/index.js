/**
 *
 * WagesPage
 *
 */

import { Grid, AppBar, IconButton, Toolbar, Button, TextField, Tooltip } from '@material-ui/core';
import { Add, ImportExport, Close } from '@material-ui/icons';
import Buttons from 'components/CustomButtons/Button';
import ListPage from 'components/List';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { Dialog, Paper, SwipeableDrawer, Typography } from '../../../../components/LifetekUi';
import { API_TIMEKEEPING_TABLE } from '../../../../config/urlConfig';
import { changeSnackbar } from '../../../Dashboard/actions';
import makeSelectDashboardPage from '../../../Dashboard/selectors';
import Timekeeping from '../Timekeeping/Loadable';
import AddWages from './components/AddWages';
import ImportHrmTimeKeeping from './components/ImportHrmTimeKeeping';
import CustomInputBase from 'components/Input/CustomInputBase';

import {
  addTakeLeaveManager,
  createWages,
  deleteTakeLeaveManager,
  deleteWages,
  getAllTimekeepingEquipment,
  getTimekeepingToEquipment,
  importTimeKeeping,
  mergeData,
  updateTakeLeaveManager,
  updateWages,
} from './actions';
import { mergeData as MergeData } from '../../../Dashboard/actions';
import FaceRecognition from '../../../FaceRecognition/Loadable';
import { makeSelectProfile } from '../../../Dashboard/selectors';
import './style.css';
import reducer from './reducer';
import saga from './saga';
import makeSelectTimekeepingPage from './selectors';
import CustomAppBar from 'components/CustomAppBar';
import Kanban from '../../../KanbanPlugin';
import BODialog from '../../../../components/LifetekUi/Planner/BODialog';
/* eslint-disable react/prefer-stateless-function */
function Bt(props) {
  return (
    <Buttons
      // color={props.tab === tab ? 'gradient' : 'simple'}
      color={props.color}
      right
      round
      size="sm"
      onClick={props.onClick}
    >
      {props.children}
    </Buttons>
  );
}

function WagesPage(props) {
  const {
    onMergeData,
    mergeData,
    timekeepingPage,
    onCreateWages,
    onUpdateWages,
    onDeleteWages,
    id: hrmEmployeeId,
    onChangeSnackbar,
    dashboardPage,
    getAllTimekeepingEquipment,
    getTimekeepingToEquipment,
    importTimeKeeping,
    addTakeLeaveManager,
    updateTakeLeaveManager,
    miniActive,
  } = props;
  const { createWagesSuccess, updateWagesSuccess, deleteWagesSuccess, tab, reload, timekeepingEquipment, hrm2equipment } = timekeepingPage;
  const { allStock } = dashboardPage;
  const [openDialog, setOpenDialog] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [selectedWages, setSelectedWages] = useState(null);
  const [kanbanFilter, setKanbanFilter] = useState({});
  const [filter] = useState({});
  const [openKanbanDialog, setOpenKanbanDialog] = useState(false);
  const [kanbanData] = useState({});
  // const [reload, setReload] = useState(false);
  useEffect(() => {
    getAllTimekeepingEquipment();
  }, []);

  useEffect(
    () => {
      if (createWagesSuccess === true) {
        // setReload(true);
        handleCloseWagesDialog();
      }
      if (!createWagesSuccess) {
        // setReload(false);
      }
    },
    [createWagesSuccess],
  );

  useEffect(
    () => {
      if (updateWagesSuccess === true) {
        // setReload(true);
        handleCloseWagesDialog();
      }
      if (!updateWagesSuccess) {
        // setReload(false);
      }
    },
    [updateWagesSuccess],
  );

  useEffect(
    () => {
      if (deleteWagesSuccess === true) {
        // setReload(true);
      }
      if (!deleteWagesSuccess) {
        // setReload(false);
      }
    },
    [deleteWagesSuccess],
  );
  useEffect(
    () => {
      console.log('1');
    },
    [miniActive],
  );
  useEffect(() => {
    const listCrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
    const currentCrmStatus = listCrmStatus.find(d => d.code === 'ST06') || { data: [] };
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    currentCrmStatus.data.forEach(item => {
      switch (item.code) {
        case 1:
          laneStart.push(item);
          break;
        case 2:
          laneAdd.push(item);
          break;

        case 3:
          laneSucces.push(item);
          break;

        case 4:
          laneFail.push(item);
          break;

        default:
          break;
      }
    });
    const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
    setKanbanFilter({ crmStatusSteps: sortedKanbanStatus });
  }, []);

  const handleSave = useCallback(data => {
    const { _id: WagesId } = data;
    if (!WagesId) {
      onCreateWages(data);
    } else {
      onUpdateWages(WagesId, data);
    }
  }, []);

  const handleOpenWagesDialog = () => {
    setSelectedWages(null);
    setOpenDialog(true);
  };

  const handleCloseWagesDialog = useCallback(() => {
    setTimeout(() => {
      onMergeData({ hiddenHeader: false });
    }, 1);
    setSelectedWages(null);
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Tooltip title="Thêm mới">
      <Add onClick={handleOpenWagesDialog}>Open Menu</Add>
    </Tooltip>
  );
  const callBack = (cmd, data) => {
    if (cmd === 'quick-add') {
      setOpenDialog(true);
      return;
    }
    if (cmd === 'CommentDialog') {
      setOpenKanbanDialog(true);
      kanbanData(data);
      return;
    }
  };

  const callbackTimekeeping = () => {
    setOpenDialog(false);
  };

  const handleCloseKanbanDialog = () => {
    setOpenKanbanDialog(false);
  };

  const importExport = () => <ImportExport style={{ color: 'white' }} onClick={() => setOpenImport(true)} />;

  const handleDelete = data => onDeleteWages(hrmEmployeeId, data);

  const mapFunction = item => ({
    ...item,
    inChargedEmployeeId: item['inChargedEmployeeId.name'],
    organizationUnitId: item['organizationUnitId.name'],
  });

  const [filterName, setFilterName] = useState('');
  return (
    <div>
      <Paper style={{ paddingTop: '15px' }}>
        <Grid container>
          {/* <Grid item md={12}>
            <Bt onClick={() => mergeData({ tab: 2 })} color={tab === 2 ? 'gradient' : 'simple'}>
              Chấm công
            </Bt>
            <Bt onClick={() => mergeData({ tab: 1 })} color={tab === 1 ? 'gradient' : 'simple'}>
              Kanban
            </Bt>
            <Bt onClick={() => mergeData({ tab: 0 })} color={tab === 0 ? 'gradient' : 'simple'}>
              Danh sách
            </Bt>
          </Grid> */}
        </Grid>
        {tab === 0 && (
          <ListPage
            height="650px"
            code="HrmTimekeepingTable"
            status="hrmStatus"
            parentCode="hrm"
            onEdit={row => {
              setSelectedWages(row);
              setOpenDialog(true);
            }}
            // exportExcel
            // importExport
            // disableSearch
            employeeFilterKey="inChargedEmployeeId"
            showDepartmentAndEmployeeFilter
            onDelete={handleDelete}
            reload={reload}
            mapFunction={mapFunction}
            apiUrl={API_TIMEKEEPING_TABLE}
            settingBar={[addItem()]}
            disableAdd
            disableExport
            disableImport
            profile={props.profile}
            kanban="ST06"
            filter={filter}
            filterEdit={true}
          />
        )}
        {/* {tab === 1 ? (
          <Kanban
            dashboardPage={props.dashboardPage}
            isOpenSinglePage
            statusType="hrmStatus"
            enableAdd
            titleField="name" // tên trường sẽ lấy làm title trong kanban
            callBack={callBack} // sự kiện trả về kanban
            // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
            // data={bos} // list dữ liệu
            reload={reload}
            path={API_TIMEKEEPING_TABLE}
            code="ST06" // code của danh sách trạng thái kanban
            filter={kanbanFilter}
            customContent={customContent}
            customActions={[
              {
                action: 'comment',
                // params: 'typeLine=4',
              },
            ]}
            history={props.history}
          />
        ) : null} */}
        {tab === 2 && <FaceRecognition />}

        <Dialog dialogAction={false} onClose={handleCloseKanbanDialog} open={openKanbanDialog}>
          <BODialog
            setCoverTask={() => {}}
            profile={props.profile}
            taskId={kanbanData._id}
            // filterItem={innerFilterItem}
            data={kanbanData}
            API={API_TIMEKEEPING_TABLE}
            customContent={customContent}
          />
        </Dialog>
        <SwipeableDrawer
          anchor="right"
          onClose={() => setOpenImport(false)}
          open={openImport}
          width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
        >
          <ImportHrmTimeKeeping
            timekeepingEquipment={timekeepingEquipment}
            onChangeSnackbar={onChangeSnackbar}
            hrm2equipment={hrm2equipment}
            getTimekeepingToEquipment={getTimekeepingToEquipment}
            importTimeKeeping={importTimeKeeping}
            onClose={() => setOpenImport(false)}
          />
        </SwipeableDrawer>
        {selectedWages ? (
          <SwipeableDrawer
            anchor="right"
            onClose={handleCloseWagesDialog}
            open={openDialog}
            // width={window.innerWidth - 267}
            width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
            // callback={callbackTimekeeping}
          >
            <div style={{ width: !miniActive ? window.innerWidth - 277 : window.innerWidth - 97 }}>
              <CustomAppBar 
              title={'CẬP NHẬT BẢNG CHẤM CÔNG'} 
              onGoBack={handleCloseWagesDialog} 
              onSubmit={handleSave} 
              disableAdd={true} 
              />
              <Grid container direction="row" style={{ padding: '15px', marginTop: '45px' }}>
                <Grid item xs={12}>
                  <Grid container direction="column" justify="center" alignItems="center">
                    <Typography variant="h5">BẢNG CHẤM CÔNG</Typography>
                    <Typography>
                      {selectedWages &&
                        selectedWages.originItem &&
                        `Tháng ${selectedWages.originItem.month || '...'} Năm ${selectedWages.originItem.year || '...'}`}
                    </Typography>
                  </Grid>
                </Grid>

                {/*  */}
                <Grid item className="nameEmployeeTimeKeep" style={{ width: 'calc(100% - 300px)', marginTop: '80px' }}>
                  <TextField
                    label="Tìm kiếm"
                    variant="outlined"
                    placeholder="Nhập tên nhân viên"
                    onChange={e => setFilterName(e.target.value)}
                    inputProps={{
                      style: {
                        padding: '15px 32px 15px 14px',
                        margin: '0 15px',
                      },
                    }}
                    style={{ width: '196px' }}
                  />
                </Grid>
                <Grid item xs={3} style={{ display: 'flex', marginTop: '-15px' }}>
                  <CustomInputBase style={{ marginRight: '10px' }} value={selectedWages['inChargedEmployeeId.name']} label="Nhân viên phụ trách" />
                  <CustomInputBase value={selectedWages['organizationUnitId.name']} label="Phòng ban" />
                </Grid>
                <Grid item xs={12}>
                  <Timekeeping
                    employee={selectedWages['inChargedEmployeeId.name']}
                    department={selectedWages['organizationUnitId.name']}
                    titleExcel="CHI TIẾT BẢNG CHẤM CÔNG"
                    onClose={handleCloseWagesDialog}
                    tableId={selectedWages && selectedWages._id}
                    organizationUnitId={selectedWages['organizationUnitId._id']}
                    hiddenSideBar={true}
                    filter={filterName}
                  />
                </Grid>
              </Grid>
            </div>
          </SwipeableDrawer>
        ) : (
          <AddWages
            profile={props.profile}
            code="HrmTimekeepingTable"
            onChangeSnackbar={onChangeSnackbar}
            wages={selectedWages}
            open={openDialog}
            users={timekeepingPage && timekeepingPage.users}
            onSave={handleSave}
            onClose={handleCloseWagesDialog}
          />
        )}
      </Paper>
    </div>
  );
}

WagesPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  timekeepingPage: makeSelectTimekeepingPage(),
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),
    onMergeData: data => dispatch(MergeData(data)),

    onCreateWages: data => dispatch(createWages(data)),
    onUpdateWages: (hrmEmployeeId, data) => dispatch(updateWages(hrmEmployeeId, data)),
    onDeleteWages: (hrmEmployeeId, ids) => dispatch(deleteWages(hrmEmployeeId, ids)),
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),

    getAllTimekeepingEquipment: () => dispatch(getAllTimekeepingEquipment()),
    getTimekeepingToEquipment: _id => dispatch(getTimekeepingToEquipment(_id)),
    importTimeKeeping: data => dispatch(importTimeKeeping(data)),

    addTakeLeaveManager: data => dispatch(addTakeLeaveManager(data)),
    updateTakeLeaveManager: data => dispatch(updateTakeLeaveManager(data)),
    deleteTakeLeaveManager: ids => dispatch(deleteTakeLeaveManager(ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'timekeepingPage', reducer });
const withSaga = injectSaga({ key: 'timekeepingPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(WagesPage);
const customContent = [
  {
    title: 'Giám sát',
    fieldName: 'supervisor.name',
    type: 'string',
  },
  {
    title: 'Khách hàng',
    fieldName: 'customer.name',
    type: 'string',
  },
  {
    title: 'Giá trị',
    fieldName: 'value.amount',
    type: 'number',
  },
];
