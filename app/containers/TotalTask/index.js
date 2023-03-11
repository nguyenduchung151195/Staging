import React from 'react';
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Paper,
  Avatar,
  MenuItem,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Menu,
  InputAdornment,
  Typography,
  DialogContent,
  Fab,
} from '@material-ui/core';
import dot from 'dot-object';
import { Grid as GridLife, SwipeableDrawer, TextField, Dialog } from 'components/LifetekUi';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import { Assignment, Work, FilterList, Archive } from '@material-ui/icons';
import AddProjects from 'containers/AddProjects';
import { injectIntl } from 'react-intl';
import CustomButton from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { taskStatusArr, taskStageArr } from 'variable';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Planner from '../../components/LifetekUi/Planner/TaskKanban';
import makeSelectTotalTask from './selectors';
import makeSelectDashboardPage, { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData, deleteTasks, getTasks, addBoAction, getTasksForTimeManagement } from './actions';
import { API_TASK_PROJECT, API_USERS } from '../../config/urlConfig';
import Gantt from '../Gantt';
import TaskTimes from '../../components/TaskTimes';
import List from '../../components/List/ListTask';
import messages from './messages';
import BoDialog from '../BoDialog';
import Automation from '../PluginAutomation';
import { changeSnackbar } from '../Dashboard/actions';
import ExportTable from './exportTable';
import { getCurrentUrl } from '../../utils/common';
import { tableToExcel, tableToPDF } from '../../helper';
import DepartmentAndEmployee from '../../components/Filter/DepartmentAndEmployee';
import ViewContent from '../../components/ViewContent/Loadable';
// import { makeSelectMiniActive } from '../Dashboard/selectors';
import GridItem from 'components/Grid/ItemGrid';
import { useEffect } from 'react';

const Process = props => (
  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'no-wrap', height: 22, width: '100%', position: 'relative' }}>
    <div
      style={{
        width: `${props.value}%`,
        background: `${props.color2}`,
        height: '100%',
        animation: '2s alternate slidein',
      }}
    />
    <div
      style={{
        width: `${100 - props.value}%`,
        background: `${props.color}`,
        height: '100%',
        animation: '2s alternate slidein',
      }}
    />
    <span style={{ fontSize: 13, marginLeft: 3, color: '#e0e0e0', position: 'absolute' }}>
      {props.progress}
      %- {props.time}
      {/* ngày */}
    </span>
  </div>
);

//

const GridList = React.memo(({ reload, openTask, filter, openBusiness, addFunction, modalRequiredFilter, modalFilter }) => {
  const { isProject, ...rest } = filter;

  const mapTask = item => {
    try {
      return {
        ...item,
        parentId: item.parentId && item['parentId.name'] || item.parentId || null,
        name: (
          <button onClick={() => openTask(item._id)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
            {item.name}
          </button>
        ),
        avatar: <Avatar src={`${item.avatar}?allowDefault=true`} />,
        progress: (
          <Process value={item.progress} progress={item.progress} color={colorProgress(item)} time={ProcessTask(item)} color2={color2Progress(item)} />
        ),
        note: (
          <Tooltip title={item.note || null}>
            <p>{item.note || null}</p>
          </Tooltip>
        ),
        startDate: moment(item.startDate),
        createdAt: moment(item.createdAt),
        endDate: moment(item.endDate),
        finishDate: moment(item.finishDate),
        // level:(
        //   <p style={{textAlign: center, paddingLeft: '5px'}}>{item.level}</p>
        // ),
        planApproval:
          item.planApproval === 1 ? (
            <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã phê duyệt kế hoạch</p>
          ) : item.planApproval === 2 ? (
            <p style={{ color: '#ed0000', fontWeight: 'bold' }}>Không phê duyệt kế hoạch</p>
          ) : item.planApproval === 3 ? (
            <p style={{ color: 'rgb(214, 129, 11)', fontWeight: 'bold' }}>Chờ phê duyệt kế hoạch</p>
          ) : (
            <p style={{ color: 'rgb(52, 11, 214)', fontWeight: 'bold' }}>Chưa phê duyệt kế hoạch</p>
          ),
        template: item.templateName,
        acceptApproval:
          item.acceptApproval === 1 ? (
            <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã phê duyệt nghiệm thu </p>
          ) : item.acceptApproval === 2 ? (
            <p style={{ color: '#ed0000', fontWeight: 'bold' }}>Không phê duyệt nghiệm thu</p>
          ) : item.acceptApproval === 3 ? (
            <p style={{ color: 'rgb(214, 129, 11)', fontWeight: 'bold' }}>Chờ phê duyệt nghiệm thu</p>
          ) : (
            <p style={{ color: 'rgb(52, 11, 214)', fontWeight: 'bold' }}>Chưa phê duyệt nghiệm thu</p>
          ),
        approvedProgress: item['approvedProgress.name'],
        support: item.supportStr,
        taskStage: taskStageArr[item.taskStage - 1],
        customer: item['customer.name'] || item.customer || "",
        createdBy: item['createdBy.name'] || item.createdBy || "",
        businessOpportunities: item['businessOpportunities.name'],
        exchangingAgreement: item['exchangingAgreement.name'],
        taskStatus: taskStatusArr[item.taskStatus - 1],
        type: item.type === 1 ? 'Nhóm bảo mật' : item.type === 4 ? 'Nhóm công khai' : item.type === 2 ? 'Nhóm ẩn' : 'Nhóm mở rộng',
        priority:
          item.priority === 1
            ? 'Rất cao'
            : item.priority === 2
              ? 'Cao'
              : item.priority === 3
                ? 'Trung bình'
                : item.priority === 4
                  ? 'Thấp'
                  : 'Rất thấp',
        organizationUnit: item.organizationUnitName || item.organizationUnit,
        taskType: item.taskType === 1 ? 'Công việc' : item.taskType === 2 ? 'Công việc không doanh thu' : 'Công việc cá nhân',
        category:
          item.category === 1
            ? 'Bán hàng (Mở rộng thị trường)'
            : item.category === 2
              ? 'Công việc hành chính'
              : item.category === 3
                ? 'Công việc thi công'
                : item.category === 4
                  ? 'Công việc bảo hành'
                  : null,
      };
    } catch (error) {
      console.log(error, 'error')
    }

  };
  // const setPage = (page) => {
  //   // this.page = page
  //   this.setState({page})
  // }
  return (
    <GridLife item md={12}>
      <List
        showDepartmentAndEmployeeFilter
        columnExtensions={[{ columnName: 'name', width: 300 }, { columnName: 'edit', width: 150 }, { columnName: 'progress', width: 180 }]}
        tree
        reload={reload}
        addFunction={addFunction}
        apiUrl={`${API_TASK_PROJECT}/projects`}
        code="Task"
        exportExcel
        kanban="KANBAN"
        status="taskStatus"
        mapFunction={mapTask}
        // customExport={customExport}
        modalRequiredFilter={modalRequiredFilter}
        modalFilter={modalFilter}
        addChildTask
        perPage={15}
        filter={rest}
        extraMenu={openBusiness}
        height="610px"
        lengthSplice={15}

      // setPage={setPage}
      />
    </GridLife>
  );
});

function colorProgress(item) {
  let color;
  if (item.finishDate) {
    color = new Date(item.finishDate) > new Date(item.endDate) ? '#fa0522' : '#009900';
  } else {
    color = new Date(item.endDate) >= new Date() ? '#056ffa' : '#f00707';
  }

  return color;
}

function color2Progress(item) {
  let color2;
  if (item.finishDate) {
    color2 = new Date(item.finishDate) > new Date(item.endDate) ? '#f28100' : '#009900';
  } else {
    color2 = new Date(item.endDate) >= new Date() ? '#05c9fa' : '#6e1305';
  }

  return color2;
}

function ProcessTask(item) {
  let date;
  let total;
  if (item.finishDate) {
    if (new Date(item.finishDate) > new Date(item.endDate)) {
      date = ((new Date(item.finishDate) - new Date(item.endDate)) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Trễ ${date3} ngày ${date4} giờ`;
    } else {
      date = ((new Date(item.endDate) - new Date(item.finishDate)) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Sớm ${date3} ngày ${date4} giờ`;
    }
  } else {
    if (new Date(item.endDate) > new Date()) {
      date = ((new Date(item.endDate) - new Date()) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Còn ${date3} ngày ${date4} giờ`;
    } else {
      date = ((new Date() - new Date(item.endDate)) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Quá ${date3} ngày ${date4} giờ`;
    }
  }

  return total;
}

class TotalTask extends React.Component {
  state = {
    open: false,
    data: {},
    reload: 0,
    crmStatusSteps: [],
    editDialog: false,
    hasPermissionViewConfig: false,
    addTaskAnchorEl: null,
    openDialogFilter: false,
    categoryTaskArr: [],
    exportAnchor: null,
    openExport: null,
    html: [],
    htmlTotal: 0,
    queryFilter: null,
    dialogAllFilter: false,
    windowHeight: null,
    windowWidth: null,
    agreeFilter: false,
    timeFilter: 0,
  };
  handleResize = () => {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    });
  };
  componentDidMount() {
    try {
      const { dashboardPage } = this.props;
      let currentRole;
      if (dashboardPage.role.roles) {
        currentRole = dashboardPage.role.roles.find(item => item.codeModleFunction === this.props.collectionCode);
      }
      let functionAllow = [];
      if (currentRole) {
        functionAllow = currentRole.methods.filter(item => item.allow).map(item => item.name);
      }
      if (functionAllow.includes('VIEWCONFIG')) {
        this.state.hasPermissionViewConfig = true;
      } else {
        this.state.hasPermissionViewConfig = false;
      }
    } catch (error) {
      // ignore error
    }
    this.props.getTasks();

    const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    const currentCrmStatus = listCrmStatus && listCrmStatus[listCrmStatus.findIndex(d => d.code === 'ST01')];
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    currentCrmStatus &&
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
    const categoryTaskArrLocal = JSON.parse(localStorage.getItem('taskStatus'));
    const categoryTaskArr = categoryTaskArrLocal ? categoryTaskArrLocal.find(item => item.code === 'TASKTYPE').data : null;
    this.setState({ crmStatusSteps: sortedKanbanStatus, categoryTaskArr });
    window.addEventListener('resize', this.handleResize);
  }

  mergeData = data => {
    this.props.mergeData(data);
  };

  addItem = (type, code) => {
    this.setState({ data: { planerStatus: type, taskStatus: code, isProject: false, kanbanStatus: code }, open: true, id: 'add' });
  };

  onAddFunctionClick = e => {
    this.setState({ addTaskAnchorEl: e.target, id: "add" });
  };

  openCreateTask = () => {
    this.setState({ open: true, addTaskAnchorEl: null, data: { taskType: 1, isProject: false } });
  };

  callbackTask = () => {
    const { reload } = this.state;
    this.setState({ reload: reload + 1, open: false });
  };

  openTask = id => {
    this.setState({ id, editDialog: true });
  };

  closeDrawer = () => {
    this.setState({ open: false });
  };

  handleEmployees = value => {
    this.props.mergeData({
      employee: value,
      filter: {
        $or: [
          { createdBy: value._id ? value._id : '' },
          { inCharge: { $in: value._id ? value._id : '' } },
          { viewable: { $in: value._id ? value._id : '' } },
          { support: { $in: value._id ? value._id : '' } },
          { join: { $in: value._id ? value._id : '' } },
        ],
      },
    });
  };

  handleChange = (name, value) => {
    this.props.mergeData({ [name]: value });
  };

  findChildren(data) {
    const newData = data.filter(item => item.parent === null);
    this.getLevel(newData, 0);
    return newData;
  }

  getLevel(arr, lvl) {
    arr.forEach(item => {
      item.level = lvl;
      if (item.child) {
        this.getLevel(item.child, lvl + 1);
      }
    });
  }

  mapItem(array, result = []) {
    array.forEach(item => {
      result.push(
        <MenuItem value={item._id} style={{ paddingLeft: 20 * item.level }}>
          {item.name}
        </MenuItem>,
      );
      if (item.child) this.mapItem(item.child, result);
    });
    return result;
  }

  handleDepartment = e => {
    if (e.target.value === 0) {
      this.props.mergeData({
        department: e.target.value,
        filter: {
          isProject: false,
        },
      });
    } else if (e.target.value === 'gantt') {
      this.props.mergeData({
        department: e.target.value,
        filter: {
          organizationUnit: e.target.value,
        },
      });
    } else {
      this.props.mergeData({
        department: e.target.value,
        filter: {
          organizationUnit: e.target.value,
        },
      });
    }
  };

  handleDepartmentAndEmployeeChange = data => {
    const { department, employee } = data;
    this.props.mergeData({
      department,
      employee,
    });
  };

  openBusiness = () => <MenuItem onClick={this.handleDialogBusiness}>Thêm cơ hội kinh doanh</MenuItem>;

  handleDialogBusiness = () => {
    this.props.mergeData({ openDialog: true });
  };

  handleCloseDialog = () => {
    this.props.mergeData({ openDialog: false });
  };

  callBackBos = (cmd, data) => {
    this.props.onAddBo(dot.object(data));
    this.props.mergeData({ openDialog: false });
  };

  checkItem(ft) {
    if (!ft.taskManager) delete ft.taskManager;
    if (!ft.inCharge) delete ft.inCharge;
    if (!ft.join) delete ft.join;
    if (!ft.support) delete ft.support;
    if (!ft.viewable) delete ft.viewable;
    if (!ft.approved) delete ft.approved;
    if (!ft.type) delete ft.type;

    return ft;
  }

  checkDate(ft) {
    if (!ft.startDate) delete ft.startDate;
    if (!ft.endDate) delete ft.endDate;
    if (!ft.category) delete ft.category;
    return ft;
  }

  changeSearch = e => {
    const filter = { ...this.props.totalTask.filter };
    const searchClient = e.target.value;
    if (searchClient) {
      filter.name = { $regex: searchClient, $options: 'gi' };
    } else delete filter.name;
    this.props.mergeData({ filter });
  };
  exportTable = queryFilter => {
    this.setState({ queryFilter: queryFilter });
    return (
      <Tooltip title="Xuất dữ liệu">
        <Archive onClick={e => this.setState({ exportAnchor: e.currentTarget })} />
      </Tooltip>
    );
  };

  filterAdvanced = () => {
    const { search, categoryCurrent, startDate1, startDate2, endDate2, endDate1 } = this.props.totalTask;
    const { profile } = this.props.dashboardPage;
    let ft;
    switch (search) {
      case 0:
        ft = this.checkDate({
          isProject: false,
          category: categoryCurrent !== 0 ? categoryCurrent : '',
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });

        this.props.mergeData({ filter: ft });

        break;
      case 1:
        ft = this.checkDate({
          category: categoryCurrent !== 0 ? categoryCurrent : '',
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
          taskStatus: 2,
          isProject: false,
          $or: [
            { createdBy: profile._id ? profile._id : '' },
            { inCharge: { $in: profile._id ? profile._id : '' } },
            { viewable: { $in: profile._id ? profile._id : '' } },
            { join: { $in: profile ? profile._id : '' } },
            { support: { $in: profile._id ? profile._id : '' } },
          ],
        });
        this.props.mergeData({ filter: ft });
        break;
      case 2:
        ft = this.checkDate({
          support: profile._id ? profile._id : '',
          isProject: false,
          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });

        this.props.mergeData({ filter: ft });
        break;
      case 3:
        ft = this.checkDate({
          createdBy: profile._id ? profile._id : '',
          isProject: false,
          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });

        this.props.mergeData({ filter: ft });

        break;
      case 4:
        ft = this.checkDate({
          viewable: profile._id ? profile._id : '',
          isProject: false,
          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });

        this.props.mergeData({ filter: ft });

        break;
      case 5:
        ft = this.checkDate({
          state: '0',
          isProject: false,
          $or: [
            { createdBy: profile ? profile._id : '' },
            { inCharge: { $in: profile ? profile._id : '' } },
            { viewable: { $in: profile ? profile._id : '' } },
            { join: { $in: profile ? profile._id : '' } },
            { support: { $in: profile ? profile._id : '' } },
          ],
          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });

        this.props.mergeData({ filter: ft });

        break;
      case 6:
        ft = this.checkDate({
          isProject: false,
          taskStatus: 3,
          $or: [
            { createdBy: profile ? profile._id : '' },
            { inCharge: { $in: profile ? profile._id : '' } },
            { viewable: { $in: profile ? profile._id : '' } },
            { join: { $in: profile ? profile._id : '' } },
            { support: { $in: profile ? profile._id : '' } },
          ],

          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });

        this.props.mergeData({ filter: ft });

        break;
      case 7:
        ft = this.checkDate({
          taskStatus: { $not: { $eq: 3 } },
          endDate:
            endDate1 !== '' && endDate2 !== ''
              ? { $lt: new Date().toISOString(), $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() }
              : { $lt: new Date().toISOString() },
          isProject: false,
          $or: [
            { createdBy: profile._id ? profile._id : '' },
            { inCharge: { $in: profile._id ? profile._id : '' } },
            { viewable: { $in: profile._id ? profile._id : '' } },
            { join: { $in: profile ? profile._id : '' } },
            { support: { $in: profile._id ? profile._id : '' } },
          ],

          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
        });

        this.props.mergeData({ filter: ft });

        break;
      case 8:
        ft = this.checkDate({
          isProject: false,
          $or: [
            { createdBy: profile._id ? profile._id : '' },
            { inCharge: { $in: profile._id ? profile._id : '' } },
            { viewable: { $in: profile._id ? profile._id : '' } },
            { join: { $in: profile ? profile._id : '' } },
            { support: { $in: profile._id ? profile._id : '' } },
          ],
          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });
        this.props.mergeData({ filter: ft });
        break;
      case 9:
        ft = this.checkDate({
          isProject: false,
          inCharge: { $in: profile._id ? profile._id : '' },
          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });
        this.props.mergeData({ filter: ft });
        break;
      case 10:
        ft = this.checkDate({
          isProject: false,
          join: { $in: profile ? profile._id : '' },
          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });
        this.props.mergeData({ filter: ft });
        break;
      default:
        break;
    }
    this.setState({
      openDialogFilter: false,
    });
  };

  handleCloseEdit = () => {
    this.setState({ editDialog: false });
  };
  componentDidUpdate(preProps, preState) {
    const { html, htmlTotal, openImport, reload, search, filters } = this.state;
    if ((html.length > 0) & (htmlTotal !== 0)) {
      if (html.length === htmlTotal) {
        for (let index = 0; index < htmlTotal; index++) {
          const win = window.open();
          win.document.write(html[index].content);
          win.document.close();
          win.print();
        }
        this.setState({ html: [], htmlTotal: 0 });
      }
    }

    if (preState.openImport && !openImport) {
      this.setState({ reload: reload + 1 });
    }
    if (preProps.miniActive !== this.props.miniActive) {
      console.log('1');
    }
  }

  callbackSaveTask = () => {
    const { reload } = this.state;
    this.setState({ reload: reload + 1, open: false });
  };

  handleChangeTab(tabBt) {
    this.setState({ timeFilter: tabBt });
  }
  modalRequiredFilter = () => {
    const { employee, department, profile } = this.props;
    return (
      <div style={{ width: '30em' }}>
        <DepartmentAndEmployee
          onChange={this.handleDepartmentAndEmployeeChange}
          employee={employee}
          department={department}
          moduleCode="Task"
          profile={profile}
          fullWidth
        />
      </div>
    );
  };
  onSaveDialog = () => {
    this.handleChange('searchTime', this.state.timeFilter);
    const { roleTask, profile } = this.props.dashboardPage;
    const bussines = roleTask.roles ? roleTask.roles.find(elm => elm.code === 'BUSSINES').data : [];
    const extra = roleTask.roles ? roleTask.roles.find(elm => elm.code === 'EXTRA').data : [];
    const hideTask = roleTask.roles ? extra.find(elm => elm.name === 'hide').data : false;
    const protectedTask = roleTask.roles ? extra.find(elm => elm.name === 'protected').data : false;
    const publicTask = roleTask.roles ? extra.find(elm => elm.name === 'public').data : false;
    const openTask = roleTask.roles ? extra.find(elm => elm.name === 'open').data : false;

    const taskManager = roleTask.roles ? bussines.find(elm => elm.name === 'taskManager').data : false;
    const taskInCharge = roleTask.roles ? bussines.find(elm => elm.name === 'inCharge').data : false;
    const taskSupport = roleTask.roles ? bussines.find(elm => elm.name === 'support').data : false;
    const taskViewable = roleTask.roles ? bussines.find(elm => elm.name === 'viewable').data : false;
    const taskJoin = roleTask.roles ? bussines.find(elm => elm.name === 'join').data : false;
    let time;
    const today = new Date();
    // Get tuần
    const first = today.getDate() - today.getDay() + 1; // First day is the day of the month - the day of the week
    const last = first + 6; // last day is the first day + 6
    const firstday = new Date(new Date().setDate(first)).toISOString();
    const lastday = new Date(new Date().setDate(last)).toISOString();
    // GET tháng
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString();

    // GET Quý

    const quarter = Math.floor(today.getMonth() / 3);
    const startFullQuarter = new Date(today.getFullYear(), quarter * 3, 1);
    const endFullQuarter = new Date(startFullQuarter.getFullYear(), startFullQuarter.getMonth() + 3, 1);
    this.setState({ agreeFilter: true, dialogAllFilter: false, timeFilter: 0 });
    switch (this.state.timeFilter) {
      case 0:
        time = this.props.mergeData({
          filter: {
            isProject: false,
          },
        });
        break;
      case 1:
        time = this.props.mergeData({
          filter: {
            isProject: false,
            endDate: { $lte: lastday, $gte: firstday },
          },
        });
        break;
      case 2:
        time = this.props.mergeData({
          filter: {
            isProject: false,
            endDate: { $lte: lastDay, $gte: firstDay },
          },
        });
        break;
      case 3:
        time = this.props.mergeData({
          filter: {
            isProject: false,
            endDate: { $lte: endFullQuarter.toISOString(), $gte: startFullQuarter.toISOString() },
          },
        });
        break;
      case 4:
        time = this.props.mergeData({
          filter: {
            isProject: true,
          },
        });
        break;
      default:
        break;
    }
    return time;
  };
  modalFilter = (intl, totalTask, tab) => (
    <React.Fragment>
      <Fab
        onClick={() => this.setState({ dialogAllFilter: true, timeFilter: null })}
        color="primary"
        style={{ marginLeft: 14, width: 40, height: 40, minWidth: 40 }}
      >
        <Tooltip title="Xem thêm filter">
          <FilterList />
        </Tooltip>
      </Fab>
      <Dialog
        onClose={() => this.setState({ dialogAllFilter: false })}
        onSave={this.onSaveDialog}
        saveText="ĐỒNG Ý"
        open={this.state.dialogAllFilter}
      >
        {document.documentElement.clientWidth <= 1285 ? (
          <GridItem>
            <p style={{ marginBottom: 0 }}>LỌC THEO PHÒNG BAN NHÂN VIÊN</p>
            {this.modalRequiredFilter()}
          </GridItem>
        ) : null}
        <GridItem>
          <p style={{ marginBottom: 0 }}>LỌC THEO TÊN DỰ ÁN</p>
          {this.modalProjectName(intl)}
        </GridItem>
        <GridItem>
          <p style={{ marginBottom: 0 }}>LỌC THEO THỜI GIAN TẠO</p>
          {this.modalSelectField(intl, totalTask)}
        </GridItem>
      </Dialog>
    </React.Fragment>
  );
  modalProjectName = intl => (
    <div style={{ display: 'flex' }}>
      <TextField
        label={intl.formatMessage(messages.projectname || { id: 'projectname' })}
        // style={{ marginLeft: 14 }}
        placeholder={intl.formatMessage(messages.seaching || { id: 'searching' })}
        onChange={this.changeSearch}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment style={{ cursor: 'pointer' }} position="end">
              <FilterList color="primary" onClick={() => this.setState({ openDialogFilter: true })} />{' '}
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
  modalSelectField = (intl, totalTask) => (
    <TextField
      value={this.state.timeFilter || totalTask.searchTime}
      fullWidth
      // style={{ marginLeft: 15 }}
      select
      onChange={val => {
        this.handleChangeTab(val.target.value);
      }}
    >
      <MenuItem value={0}>{intl.formatMessage(messages.selected || { id: 'selected' })}</MenuItem>
      <MenuItem value={1}>{intl.formatMessage(messages.week || { id: 'week' })}</MenuItem>
      <MenuItem value={2}>{intl.formatMessage(messages.month || { id: 'month' })}</MenuItem>
      <MenuItem value={3}>{intl.formatMessage(messages.quarter || { id: 'quarter' })}</MenuItem>
      <MenuItem value={4}>Dự án</MenuItem>
    </TextField>
  );

  render() {
    const { totalTask, profile, miniActive, dashboardPage } = this.props;
    const { tab, tasks, employee, filter, department, openDialog, isEditting, editData, approvedGroups, taskType } = totalTask;
    const { open, data, id, reload, editDialog, exportAnchor } = this.state;

    const extra = this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'EXTRA').data;
    const hideTask = extra.find(elm => elm.name === 'hide').data;
    const protectedTask = extra.find(elm => elm.name === 'protected').data;
    const publicTask = extra.find(elm => elm.name === 'public').data;
    const openTask = extra.find(elm => elm.name === 'open').data;
    const employeeId = employee ? employee._id : '';

    const addProject = this.props.dashboardPage.roleTask.roles.find(item => item.code === 'SPECIALL');
    const roleModuleAddProject = addProject && addProject.data ? addProject.data : [];
    const roleModuleAddProjectData = roleModuleAddProject.find(elm => elm.name === 'add').data;




    const { department: departmentId, organizationUnit, ...rest } = filter;
    let or = [
      this.checkItem({ type: hideTask.view === true ? 2 : '' }),
      this.checkItem({ type: protectedTask.view === true ? 1 : '' }),
      this.checkItem({ type: publicTask.view === true ? 4 : '' }),
      this.checkItem({ type: openTask.view === true ? 3 : '' }),
    ];
    if (employeeId) {
      or = [{ createdBy: employeeId }, { taskManager: employeeId }, { inCharge: employeeId }, { join: employeeId }, { support: employeeId }];
    }

    const newFilter = {
      ...rest,
      $or: or,
    };
    if (department) {
      newFilter.organizationUnit = department;
    }

    const { intl } = this.props;
    const Bt = props => (
      <CustomButton
        onClick={() => {
          this.props.mergeData({ tab: props.tab });
          if (props.tab === 3) {
            this.props.onGetTasksForTimeManagement();
          }
        }}
        {...props}
        color={props.tab === tab ? 'gradient' : 'simple'}
        right
        round
        size="sm"
      >
        {props.children}
      </CustomButton>
    );
    const roles = dashboardPage.role.roles;

    // const roleTaskProject = roles && roles.find(item => item.codeModleFunction === 'Task');
    // const roleModuleTaskProject = roleTaskProject && roleTaskProject.methods ? roleTaskProject.methods : [];
    const roleTaskProject = roles && roles.find(item => item.codeModleFunction === 'taskProject');
    const roleModuleTaskProject = roleTaskProject && roleTaskProject.methods ? roleTaskProject.methods : [];
    
    return (
      <Paper>
        <GridLife container style={{ justifyContent: 'flex-end' }}>
          <GridLife item md={12}>
            <Bt tab={3}>{intl.formatMessage(messages.timemanagement || { id: 'timemanagement' })}</Bt>
            <Bt tab={2}> {intl.formatMessage(messages.grattchar || { id: 'grattchar' })}</Bt>
            <Bt tab={1}> {intl.formatMessage(messages.plan || { id: 'plan' })}</Bt>
            <Bt tab={0}> {intl.formatMessage(messages.list || { id: 'list' })}</Bt>
            <Bt tab={4}> Automations</Bt>
          </GridLife>
          {tab === 4 ? (
            <GridLife item md={12}>
              <Automation status="taskStatus" path="/Task" code="KANBAN" codeModule="Task" nameViewConfig={false} />
            </GridLife>
          ) : null}
          {tab === 1 ? (
            <GridLife item md={12}>
              <Planner code="PLANER" filterItem="planerStatus" apiUrl={API_TASK_PROJECT} addItem={this.addItem} />
            </GridLife>
          ) : null}
          {tab === 2 ? (
            <GridLife item md={12} style={{ padding: '0px 10px' }}>
              <Gantt allProject={[{ title: 'PDF', idx: 0 }]} />
            </GridLife>
          ) : null}
          <SwipeableDrawer
            anchor="right"
            onClose={this.closeDrawer}
            open={open}
            width={miniActive === true ? window.innerWidth - 80 : window.innerWidth - 260}
          >
            <div style={{ width: miniActive ? window.innerWidth - 80 : window.innerWidth - 260 }}>
              <AddProjects data={data} id={id || 'add'} callback={this.callbackTask} />
            </div>
          </SwipeableDrawer>
          {tab === 3 ? (
            <GridLife item md={12}>
              <TaskTimes tasks={tasks} />
            </GridLife>
          ) : null}
          {tab === 0 ? (
            <React.Fragment>
              <GridList
                openTask={this.openTask}
                addFunction={this.onAddFunctionClick}
                reload={reload}
                filter={newFilter}
                openBusiness={this.openBusiness}
                modalRequiredFilter={this.modalRequiredFilter()}
                modalFilter={this.modalFilter(intl, totalTask, tab)}
              />
            </React.Fragment>
          ) : null}
        </GridLife>
        {openDialog ? (
          <BoDialog
            {...this.props}
            isTrading={false}
            path="/crm/BusinessOpportunities"
            kanbanSteppers={this.state.crmStatusSteps}
            handleClose={this.handleCloseDialog}
            callBack={this.callBackBos}
            open={openDialog}
            isEditting={isEditting}
            editData={editData}
          />
        ) : null}
        <Dialog title="Xem công việc/dự án" onClose={this.handleCloseEdit} open={editDialog} dialogAction={false}>
          <ViewContent code="Task" dataInfo={this.props.totalTask.rows || null} id={id} />
        </Dialog>

        <Menu
          id="simple-menu"
          anchorEl={this.state.addTaskAnchorEl}
          keepMounted
          open={Boolean(this.state.addTaskAnchorEl)}
          onClose={() => this.setState({ addTaskAnchorEl: null })}
        >
          <MenuItem onClick={this.openCreateTask}>
            {' '}
            <ListItemIcon>
              <Assignment color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={intl.formatMessage({ id: 'task.Task' })} />
          </MenuItem>
          {
            // roleModuleAddProjectData.access === true ? 
            (
              // (roleModuleTaskProject.find(elm => elm.name === 'GET') || { allow: false }).allow === true ? (
              (roleModuleTaskProject.find(elm => elm.name === 'POST') || { allow: false }).allow === true ? (
                <MenuItem>
                  {' '}
                  <Link style={{ display: 'flex' }} to={`${getCurrentUrl()}/add`}>
                    <ListItemIcon>
                      <Work color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={intl.formatMessage({ id: 'task.Project' })} />
                  </Link>
                </MenuItem>
              ) : null
            )
            // : null
          }
        </Menu>

        <Dialog
          title="Tìm kiếm Công việc, Dự án"
          onSave={this.filterAdvanced}
          open={this.state.openDialogFilter}
          onClose={() => this.setState({ openDialogFilter: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent style={{ paddingTop: '10px' }}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Typography className="mt-2">Ngày bắt đầu</Typography>
                <DateTimePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY HH:mm"
                  label="Từ"
                  value={totalTask.startDate1}
                  name="startDate1"
                  error={false}
                  helperText={null}
                  variant="outlined"
                  margin="dense"
                  onChange={value => this.handleChange('startDate1', value)}
                />
                <DateTimePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY HH:mm"
                  label="Đến"
                  error={false}
                  helperText={null}
                  value={totalTask.startDate2}
                  name="startDate2"
                  margin="dense"
                  variant="outlined"
                  onChange={value => this.handleChange('startDate2', value)}
                />
              </div>
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Typography>Ngày kết thúc</Typography>
                <DateTimePicker
                  inputVariant="outlined"
                  error={false}
                  helperText={null}
                  label="Từ"
                  format="DD/MM/YYYY HH:mm"
                  value={totalTask.endDate1}
                  name="endDate1"
                  variant="outlined"
                  margin="dense"
                  onChange={value => this.handleChange('endDate1', value)}
                />
                <DateTimePicker
                  inputVariant="outlined"
                  error={false}
                  helperText={null}
                  label="Đến"
                  format="DD/MM/YYYY HH:mm"
                  value={totalTask.endDate2}
                  name="endDate2"
                  margin="dense"
                  variant="outlined"
                  onChange={value => this.handleChange('endDate2', value)}
                />
              </div>
            </MuiPickersUtilsProvider>
            <TextField
              select
              label="Bộ lọc công việc"
              value={totalTask.search}
              onChange={e => this.handleChange('search', e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              style={{ width: '95%', marginLeft: 10, marginTop: 30 }}
            >
              <MenuItem value={0}>---Chọn---</MenuItem>
              <MenuItem value={7}> Công việc tồn đọng</MenuItem>
              {/* <MenuItem value={8}> Công việc cá nhân</MenuItem> */}
              <MenuItem value={1}>Công việc đang thực hiện</MenuItem>
              <MenuItem value={2}>Công việc hỗ trợ</MenuItem>
              <MenuItem value={3}>Công việc thiết lập bởi tôi</MenuItem>
              <MenuItem value={4}>Công việc đang theo dõi</MenuItem>
              <MenuItem value={5}>Công việc phê duyệt</MenuItem>
              <MenuItem value={6}> Công việc hoàn thành</MenuItem>
              <MenuItem value={9}> Công việc phụ trách</MenuItem>
              <MenuItem value={10}> Công việc tham gia</MenuItem>
            </TextField>
            <TextField
              value={totalTask.categoryCurrent}
              onChange={e => this.handleChange('categoryCurrent', e.target.value)}
              label="Loại công việc"
              select
              style={{ width: '95%', marginLeft: 10 }}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value={0}>Tất cả</MenuItem>
              {this.state.categoryTaskArr.map((item, index) => (
                <MenuItem key={item._id} value={index + 1}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
        </Dialog>
      </Paper>
    );
  }
}
TotalTask.propTypes = {
  dispatch: PropTypes.func.isRequired,
  // component: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  totalTask: makeSelectTotalTask(),
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    deleteTasks: data => dispatch(deleteTasks(data)),
    getTasks: data => dispatch(getTasks(data)),
    onAddBo: bo => {
      dispatch(addBoAction(bo));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    onGetTasksForTimeManagement: () => {
      dispatch(getTasksForTimeManagement());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'totalTask', reducer });
const withSaga = injectSaga({ key: 'totalTask', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(TotalTask);
