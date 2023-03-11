/**
 *
 * WageSalarySalary
 *
 */

import { Grid, Tooltip } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import Buttons from 'components/CustomButtons/Button';
import ListPage from 'components/List';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { Dialog, Paper, SwipeableDrawer } from '../../../../components/LifetekUi';
import { API_HRM_WAGES } from '../../../../config/urlConfig';
import { changeSnackbar } from '../../../Dashboard/actions';
import makeSelectDashboardPage, { makeSelectProfile } from '../../../Dashboard/selectors';
import WagesSalaryDetail from '../WagesSalaryDetail';
import { createWageSalary, deleteWageSalary, getAllSalaryFormula, getSalaryFormulaAttributes, mergeData, updateWageSalary } from './actions';
import AddWageSalary from './components/AddWageSalary';
import reducer from './reducer';
import saga from './saga';
import makeSelectWageSalary from './selectors';
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

function WageSalarySalary(props) {
  const {
    mergeData,
    wageSalary,
    onCreateWageSalary,
    onUpdateWageSalary,
    onDeleteWageSalary,
    id: hrmEmployeeId,
    dashboardPage,
    getAllSalaryFormula,
    onGetSalaryFormulaAttributes,
    onChangeSnackbar,
  } = props;
  const { createWageSalarySuccess, updateWageSalarySuccess, deleteWageSalarySuccess, tab, reload, salaryFormula, formulaAttributes } = wageSalary;
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedWageSalary, setSelectedWageSalary] = useState(null);
  const [dataDetail, setDataDetail] = useState(null);
  const [kanbanFilter, setKanbanFilter] = useState({});
  const [filter] = useState({});
  const [openKanbanDialog, setOpenKanbanDialog] = useState(false);
  const [kanbanData] = useState({});

  // const [reload, setReload] = useState(false);

  useEffect(() => {
    getAllSalaryFormula();
  }, []);

  useEffect(
    () => {
      if (createWageSalarySuccess === true) {
        // setReload(true);
        handleCloseWageSalaryDialog();
      }
      if (!createWageSalarySuccess) {
        // setReload(false);
      }
    },
    [createWageSalarySuccess],
  );

  useEffect(
    () => {
      if (updateWageSalarySuccess === true) {
        // setReload(true);
        handleCloseWageSalaryDialog();
      }
      if (!updateWageSalarySuccess) {
        // setReload(false);
      }
    },
    [updateWageSalarySuccess],
  );

  useEffect(
    () => {
      if (deleteWageSalarySuccess === true) {
        // setReload(true);
      }
      if (!deleteWageSalarySuccess) {
        // setReload(false);
      }
    },
    [deleteWageSalarySuccess],
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
    const { _id: WageSalaryId } = data;
    if (!WageSalaryId) {
      onCreateWageSalary(data);
    } else {
      onUpdateWageSalary(WageSalaryId, data);
    }
  }, []);

  const handleOpenWageSalaryDialog = () => {
    setSelectedWageSalary(null);
    setOpenDialog(true);
  };

  const handleCloseWageSalaryDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleCloseDetailWageSalaryDialog = useCallback(() => {
    setOpenDetail(false);
  }, []);

  const addItem = () => (
    <Tooltip title="Thêm mới">
      <Add onClick={handleOpenWageSalaryDialog}>Open Menu</Add>
    </Tooltip>
  );

  //  const callBack = () => {
  //    setOpenDialog(true);

  //  }
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

  const callbackDetail = () => {
    setOpenDialog(false);
  };

  const handleCloseKanbanDialog = () => {
    setOpenKanbanDialog(false);
  };

  const editItem = value => {
    const { originItem } = value;
    setDataDetail(originItem);
    onGetSalaryFormulaAttributes(value['formula._id']);
    setSelectedWageSalary(originItem);
    setOpenDetail(true);
  };

  const handleDelete = data => onDeleteWageSalary(hrmEmployeeId, data);

  const mapFunction = item => {
    return {
      ...item,
      inChargedEmployeeId: item['inChargedEmployeeId.name'],
      organizationUnitId: item['organizationUnitId.name'],
      fomula: item['formula.name'],
    };
  };

  return (
    <div>
      <Paper>
        {/* <Grid container>
          <Grid item md={12}>
            <Bt onClick={() => mergeData({ tab: 1 })} color={tab === 1 ? 'gradient' : 'simple'}>
              Kanban
            </Bt>
            <Bt onClick={() => mergeData({ tab: 0 })} color={tab === 0 ? 'gradient' : 'simple'}>
              Danh sách
            </Bt>
          </Grid>
        </Grid> */}
        {tab === 0 && (
          <ListPage
            height="635px"
            code="HrmTimekeepingTable"
            status="hrmStatus"
            parentCode="hrm"
            onEdit={row => {
              editItem(row);
            }}
            // disableSearch
            // exportExcel
            // importExport
            employeeFilterKey="inChargedEmployeeId"
            showDepartmentAndEmployeeFilter
            onDelete={handleDelete}
            reload={reload}
            apiUrl={API_HRM_WAGES}
            settingBar={[addItem()]}
            mapFunction={mapFunction}
            disableAdd
            disableImport
            disableExport
            profile={props.profile}
            kanban="ST06"
            filter={filter}
            filterEdit={true}
          />
        )}
        {/* {tab === 1 ? (
          <Kanban
            isOpenSinglePage
            statusType="hrmStatus"
            enableAdd
            titleField="name" // tên trường sẽ lấy làm title trong kanban
            callBack={callBack} // sự kiện trả về kanban
            // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
            // data={bos} // list dữ liệu
            // reload={reload}
            path={API_HRM_WAGES}
            reload={reload}
            filter={kanbanFilter}
            code="ST06" // code của danh sách trạng thái kanban
            customContent={customContent}
            history={props.history}
          />
        ) : null} */}
      </Paper>

      {/* <SwipeableDrawer anchor="right" onClose={handleCloseWageSalaryDialog} open={openDialog}>
         <div style={{ width: window.innerWidth - 260 }}>
           <AddWageSalary
             hrmEmployeeId={hrmEmployeeId}
             code="Recruitment"
             wageSalary={selectedWageSalary}
             onSave={handleSave}
             onClose={handleCloseWageSalaryDialog}
           />
         </div>
       </SwipeableDrawer> */}
      <AddWageSalary
        open={openDialog}
        hrmEmployeeId={hrmEmployeeId}
        code="HrmTimekeepingTable"
        wageSalary={selectedWageSalary}
        onSave={handleSave}
        onClose={handleCloseWageSalaryDialog}
        salaryFormula={salaryFormula}
        onChangeSnackbar={onChangeSnackbar}
        profile={props.profile}
      />
      <Dialog dialogAction={false} onClose={handleCloseKanbanDialog} open={openKanbanDialog}>
        <BODialog
          setCoverTask={() => {}}
          profile={props.profile}
          taskId={kanbanData._id}
          // filterItem={innerFilterItem}
          data={kanbanData}
          API={API_HRM_WAGES}
          customContent={customContent}
        />
      </Dialog>
      <SwipeableDrawer anchor="right" onClose={handleCloseDetailWageSalaryDialog} open={openDetail} width={window.innerWidth - 260}>
        <WagesSalaryDetail
          dashboardPage={props.dashboardPage}
          onClose={handleCloseDetailWageSalaryDialog}
          formulaAttributes={formulaAttributes}
          selectedWageSalary={dataDetail}
          callback={callbackDetail}
        />
      </SwipeableDrawer>
    </div>
  );
}

WageSalarySalary.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  wageSalary: makeSelectWageSalary(),
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),
    onCreateWageSalary: data => dispatch(createWageSalary(data)),
    onUpdateWageSalary: (hrmEmployeeId, data) => dispatch(updateWageSalary(hrmEmployeeId, data)),
    onDeleteWageSalary: (hrmEmployeeId, ids) => dispatch(deleteWageSalary(hrmEmployeeId, ids)),
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
    getAllSalaryFormula: () => dispatch(getAllSalaryFormula()),
    onGetSalaryFormulaAttributes: formulaId => dispatch(getSalaryFormulaAttributes(formulaId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'wageSalary', reducer });
const withSaga = injectSaga({ key: 'wageSalary', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(WageSalarySalary);
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
