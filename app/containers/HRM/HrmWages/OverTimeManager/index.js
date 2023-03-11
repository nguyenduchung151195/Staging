import React, { memo, useEffect, useState } from 'react';
import { compose } from 'redux';
import ListPage from 'components/List';
import { API_OVER_TIME, API_PLAN_OT } from 'config/urlConfig';
import { Add, ImportExport, Close } from '@material-ui/icons';
import ImportHrmTimeKeeping from '../TimekeepingPage/components/ImportHrmTimeKeeping';
import { addOverTimeManager, updateOverTimeManager, deleteOverTimeManager, addPlanOverTime, updatePlanOverTime, deletePlanOverTime } from './actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { SwipeableDrawer, Paper } from 'components/LifetekUi';
import { viewConfigName2Title } from 'utils/common';
import CustomInputBase from 'components/Input/CustomInputBase';
import { Grid, Menu, MenuItem, withStyles, Tooltip } from '@material-ui/core';
import styles from './styles';
import AddOverTimeManager from './components/AddEditOverTime';
import AddPlanOverTime from './components/AddPlanOverTime/Loadable';
import makeSelectOverTimeManager from './selectors';
import { createStructuredSelector } from 'reselect';
import saga from './saga';
import reducer from './reducer';
import Button from 'components/CustomButtons/Button';
import moment from 'moment';
import { makeSelectProfile } from '../../../Dashboard/selectors';
import { changeSnackbar } from '../../../Dashboard/actions';

const MenuAction = memo(props => {
  const { handleOpenOT, handleOpenPlanOT, handleClose, anchorEl } = props;
  return (
    <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose} keepMounted>
      <MenuItem
        onClick={() => {
          handleOpenOT();
          handleClose();
        }}
      >
        Thêm OT
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleOpenPlanOT();
          handleClose();
        }}
      >
        Thêm kế hoạch OT
      </MenuItem>
    </Menu>
  );
});
const Bt = props => {
  const { setTabIndex, tab, tabIndex } = props;
  return (
    <Button
      onClick={e => {
        setTabIndex(props.tab);
      }}
      {...props}
      color={props.tab === props.tabIndex ? 'gradient' : 'simple'}
      right
      round
      size="sm"
    >
      {props.children}
    </Button>
  );
};

function OverTimeManager(props) {
  const {
    overTimeManager,
    addOverTimeManager,
    updateOverTimeManager,
    deleteOverTimeManager,
    classes,
    addPlanOverTime,
    updatePlanOverTime,
    deletePlanOverTime,
    onChangeSnackbar,
    miniActive,
  } = props;
  const { reload, addUpdateOverTimeManagerSuccess, addUpdatePlantOverTimeSuccess } = overTimeManager;
  const [anchorEl, setAnchorEl] = useState(null);
  const [openImport, setOpenImport] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogPlanOT, setOpenDialogPlanOT] = useState(false);

  const [selectedOverTimeManager, setSelectedOverTimeManager] = useState({});
  const [selectedPlanOT, setSelectedPlanOT] = useState(null);
  const [name2Title, setName2Title] = useState({});
  const [code] = useState('HrmOverTime');
  const [filter, setFilter] = useState({});
  const [localState, setLocalState] = useState({
    month: moment().month() + 1,
    year: moment().year(),
  });
  const [tabIndex, setTabIndex] = useState(0);
  const [yearArr, setYearArr] = useState([moment().year() - 1, moment().year()]);

  useEffect(() => {
    const name2Title = viewConfigName2Title(code);
    setName2Title(name2Title);
    setFilter(localState);
  }, []);

  useEffect(
    () => {
      if (addUpdateOverTimeManagerSuccess) {
        handleCloseDialog();
      }
    },
    [addUpdateOverTimeManagerSuccess],
  );
  useEffect(
    () => {
      if (addUpdatePlantOverTimeSuccess) {
        handleClosePlanOT();
      }
    },
    [addUpdatePlantOverTimeSuccess],
  );

  const handleDelete = ids => {
    deleteOverTimeManager(ids);
  };

  const handleDeleteOT = ids => {
    deletePlanOverTime(ids);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedOverTimeManager({});
    setOpenDialog(false);
  };

  const handleOpenPlanOT = () => {
    setOpenDialogPlanOT(true);
  };
  const handleClosePlanOT = () => {
    setSelectedPlanOT(null);
    setOpenDialogPlanOT(false);
  };

  const addItem = () => (
    <Tooltip title="Thêm mới">
      <Add onClick={e => setAnchorEl(e.currentTarget)}>Open Menu</Add>
    </Tooltip>
  );
  const addItemPlanOT = () => (
    <Tooltip title="Thêm mới">
      <Add onClick={e => setOpenDialogPlanOT(true)} />
    </Tooltip>
  );

  const handleSave = data => {
    if (data && data._id) {
      updateOverTimeManager(data);
    } else {
      addOverTimeManager(data);
    }
  };

  const handleSavePlanOT = data => {
    if (data && data._id) {
      updatePlanOverTime(data);
    } else {
      addPlanOverTime(data);
    }
  };

  const mapFunction = item => ({
    ...item,
    hrmEmployeeId: item['hrmEmployeeId.name'],
    organizationUnit: item['organizationUnit.name'],
    join: Array.isArray(item.originItem.join)
      ? item.originItem.join
          .map(j => (j.hrmEmployeeId ? j.hrmEmployeeId.name : ''))
          .filter(j => j)
          .join(', ')
      : '',
    taskId: item['taskId.name'],
    month: Number.isInteger(item.month) + 1,
  });

  const mapOverTimeFunction = item =>
    console.log('item', item) || {
      ...item,
      hrmEmployeeId: item['hrmEmployeeId.name'],
      organizationUnit: item['organizationUnit.name'],
      position: item['hrmEmployeeId.position.title'],
    };

  const handleFilter = e => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
    if (e.target.value === '') {
      delete filter[e.target.name];
    } else {
      setFilter({ ...filter, [e.target.name]: e.target.value });
    }
  };
  const importExport = () => <ImportExport style={{ color: 'white' }} onClick={() => setOpenImport(true)} />;
  return (
    <Paper>
      <Grid container>
        <Grid item xs={12}>
          <Bt tab={1} setTabIndex={setTabIndex} tabIndex={tabIndex}>
            Danh sách kế hoạch
          </Bt>
          <Bt tab={0} setTabIndex={setTabIndex} tabIndex={tabIndex}>
            Danh sách OT
          </Bt>
        </Grid>
      </Grid>
      {tabIndex === 0 ? (
        <React.Fragment>
          {/* <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            spacing={8}
            className={classes.searchField}
            style={{ height: '16px', marginLeft: '430px' }}
          >
            <Grid item xs={2}>
              <CustomInputBase type="number" label={'Tháng'} select value={localState.month} name="month" onChange={handleFilter}>
                <MenuItem value={1}>Tháng 1</MenuItem>
                <MenuItem value={2}>Tháng 2</MenuItem>
                <MenuItem value={3}>Tháng 3</MenuItem>
                <MenuItem value={4}>Tháng 4</MenuItem>
                <MenuItem value={5}>Tháng 5</MenuItem>
                <MenuItem value={6}>Tháng 6</MenuItem>
                <MenuItem value={7}>Tháng 7</MenuItem>
                <MenuItem value={8}>Tháng 8</MenuItem>
                <MenuItem value={9}>Tháng 9</MenuItem>
                <MenuItem value={10}>Tháng 10</MenuItem>
                <MenuItem value={11}>Tháng 11</MenuItem>
                <MenuItem value={12}>Tháng 12</MenuItem>
              </CustomInputBase>
            </Grid>
            <Grid item xs={2}>
              <CustomInputBase type="number" label={'Năm'} value={localState.year} name="year" onChange={handleFilter} select>
                {yearArr.map(y => (
                  <MenuItem value={y}>{`Năm ${y}`}</MenuItem>
                ))}
              </CustomInputBase>
            </Grid>
          </Grid> */}
          <ListPage
            height="600px"
            code={code}
            parentCode="hrm"
            onEdit={row => {
              setSelectedOverTimeManager(row);
              setOpenDialog(true);
            }}
            onDelete={handleDelete}
            // disableSearch
            exportExcel
            importExport
            employeeFilterKey="hrmEmployeeId"
            isHrm
            // showDepartmentAndEmployeeFilter
            reload={reload}
            apiUrl={API_OVER_TIME}
            settingBar={[addItem()]}
            filter={filter}
            mapFunction={mapOverTimeFunction}
            disableAdd
            onChangeSnackbar={onChangeSnackbar}
          />
        </React.Fragment>
      ) : null}
      {tabIndex === 1 && (
        <ListPage
          code="HrmOverTimePlan"
          parentCode="hrm"
          onEdit={row => {
            setSelectedPlanOT(row);
            setOpenDialogPlanOT(true);
          }}
          disableSearch
          exportExcel
          importExport
          employeeFilterKey="inChargedEmployeeId"
          showDepartmentAndEmployeeFilter
          onDelete={handleDeleteOT}
          reload={reload}
          apiUrl={API_PLAN_OT}
          settingBar={[addItemPlanOT()]}
          // filter={filter}
          mapFunction={mapFunction}
          disableAdd
          profile={props.profile}
          filterEdit={true}
        />
      )}
      <MenuAction anchorEl={anchorEl} handleClose={() => setAnchorEl(null)} handleOpenOT={handleOpenDialog} handleOpenPlanOT={handleOpenPlanOT} />
      {/* <SwipeableDrawer anchor="right" onClose={() => setOpenImport(false)} open={openImport} width={window.innerWidth - 260}>
        <ImportHrmTimeKeeping
          timekeepingEquipment={timekeepingEquipment}
          onChangeSnackbar={onChangeSnackbar}
          hrm2equipment={hrm2equipment}
          getTimekeepingToEquipment={getTimekeepingToEquipment}
          importTimeKeeping={importTimeKeeping}
          onClose={() => setOpenImport(false)}
        />
      </SwipeableDrawer> */}
      {openDialog && (
        <AddOverTimeManager
          data={selectedOverTimeManager}
          onSave={handleSave}
          reload={reload}
          onClose={handleCloseDialog}
          code={code}
          // name2Title={name2Title}
          // vacationMode={vacationMode}
          open={openDialog}
          profile={props.profile}
          onChangeSnackbar={onChangeSnackbar}
        />
      )}
      {openDialogPlanOT && (
        <AddPlanOverTime
          miniActive={miniActive}
          onSave={handleSavePlanOT}
          reload={reload}
          onClose={handleClosePlanOT}
          code={code}
          planOT={selectedPlanOT}
          open={openDialogPlanOT}
          profile={props.profile}
          onChangeSnackbar={onChangeSnackbar}
        />
      )}
    </Paper>
  );
}

OverTimeManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  overTimeManager: makeSelectOverTimeManager(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),

    addOverTimeManager: data => dispatch(addOverTimeManager(data)),
    updateOverTimeManager: data => dispatch(updateOverTimeManager(data)),
    deleteOverTimeManager: ids => dispatch(deleteOverTimeManager(ids)),

    // ke hoach ot
    addPlanOverTime: data => {
      dispatch(addPlanOverTime(data));
    },
    updatePlanOverTime: data => dispatch(updatePlanOverTime(data)),
    deletePlanOverTime: ids => dispatch(deletePlanOverTime(ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'overTimeManager', reducer });
const withSaga = injectSaga({ key: 'overTimeManager', saga });

export default compose(
  memo,
  withStyles(styles),
  withConnect,
  withReducer,
  withSaga,
)(OverTimeManager);
