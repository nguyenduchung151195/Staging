/* eslint-disable func-names */

/**
 *
 * Gantt
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
// import { gantt } from 'dhtmlx-gantt';
// import AddTask from 'containers/AddTask';
import AddProjects from 'containers/AddProjects';
import { SwipeableDrawer, TextField, Loading, AsyncAutocomplete } from 'components/LifetekUi';
// import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
// import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_material.css';
// import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_terrace.css';
// import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_skyblue.css';
// import 'dhtmlx-gantt'
// import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_tooltip';
import { MenuItem, TablePagination, Menu, Tooltip, Fab } from '@material-ui/core';
import { Archive, ImportExport } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Snackbar from 'components/Snackbar';
import makeSelectGantt from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData, getGantt, postProgress, getData } from './actions';
import makeSelectDashboardPage, { makeSelectMiniActive } from '../Dashboard/selectors';
import { serialize, tableToExcel } from '../../helper';
import './Gantt.css';
import { API_TASK_PROJECT, API_USERS } from '../../config/urlConfig';
import DepartmentAndEmployee from '../../components/Filter/DepartmentAndEmployee';
import { canUpdateTaskPlan } from '../../utils/common';

const gantt = window.gantt;
const allEvent = {
  onAfterTaskUpdate: null,
  onTaskClick: null,
  onTaskCreated: null,
};

function converDateGantt(date) {
  // const d = new Date(date);

  // let month = `${d.getMonth() + 1}`;

  // let day = `${d.getDate()}`;

  // const year = d.getFullYear();

  // if (month.length < 2) month = `0${month}`;
  // if (day.length < 2) day = `0${day}`;

  // return [year, month, day].join('-');
  return new Date(date);
}

function hasPriority(parent, category) {
  if (!category) return true;
  if (gantt.getTask(parent).category === category) return true;

  const child = gantt.getChildren(parent);
  for (let i = 0; i < child.length; i++) {
    if (hasPriority(child[i], category)) return true;
  }
  return false;
}

function caculateProgress(task, tasks, listUpdate) {
  if (!task.parentId) return;
  let total = 0;
  const list = tasks.filter(i => i.parentId === task.parentId);
  list.forEach(i => {
    total = (i.ratio * 1 * i.progress) / 100 + total;
  });
  listUpdate.push({ id: task.parentId, progress: total.toFixed(2) });
  const parent = tasks.find(i => i.id === task.parentId);
  parent.progress = total.toFixed(2);
  caculateProgress(parent, tasks, listUpdate);
}

class Gantt extends React.Component {
  constructor(props) {
    super(props);
    const categoryTaskArrLocal = JSON.parse(localStorage.getItem('taskStatus'));
    const categoryTaskArr = categoryTaskArrLocal ? categoryTaskArrLocal.find(item => item.code === 'TASKTYPE').data : [];

    this.state = {
      categoryTaskArr,
      loading: true,
      zoom: 'Ngày',
      open: false,
      id: null,
      variant: 'success',
      message: '',
      openSnack: false,
      type: 'task',
      category: 0,
      rowsPerPage: 10,
      activePage: 0,
      rowsData: {},
      // print: 0,
      employee: '',
      loadTask: {},
    };
  }

  timeout = 0;

  mode = null;

  mergeData = data => {
    this.props.mergeData(data);
  };

  setZoom(value) {
    switch (value) {
      case 'Giờ':
        gantt.config.scale_unit = 'day';
        gantt.config.date_scale = 'Ngày %d';

        gantt.config.scale_height = 60;
        gantt.config.min_column_width = 30;
        gantt.config.subscales = [{ unit: 'hour', step: 1, date: '%H' }];
        break;
      case 'Ngày':
        gantt.config.min_column_width = 70;
        gantt.config.scale_unit = 'month';
        gantt.config.date_scale = 'Tháng %m';
        gantt.config.subscales = [{ unit: 'day', step: 1, date: '%d/%m' }];
        gantt.config.scale_height = 60;
        break;
      case 'Tháng':
        gantt.config.min_column_width = 70;
        gantt.config.scale_unit = 'month';
        gantt.config.date_scale = 'Tháng %m';
        gantt.config.scale_height = 60;
        gantt.config.subscales = [{ unit: 'week', step: 1, date: 'Tuần %W' }];
        break;
      case 'Năm':
        gantt.config.min_column_width = 70;
        gantt.config.scale_unit = 'year';
        gantt.config.date_scale = '%Y';
        gantt.config.scale_height = 60;
        gantt.config.subscales = [{ unit: 'month', step: 1, date: 'Tháng %m' }];
        break;
      default:
        break;
    }
  }

  handleZoomChange = zoom => {
    this.setState({
      zoom,
    });
  };

  handleEmployees = value => {
    this.setState({
      employee: value,
      loadTask: {
        isProject: false,
        $or: [
          { createdBy: value._id ? value._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: value._id ? value._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: value._id ? value._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: value._id ? value._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
    });

    this.loadData();
  };

  handleCategoryChange = e => {
    this.setState({ category: e.target.value }, () => gantt.refreshData());
  };

  handleDepartmentAndEmployeeChange = data => {
    const { employee, department } = data;

    const newState = {
      employee,
      department,
      loadTask: {},
    };
    if (department) {
      newState.loadTask.organizationUnit = department;
    }
    this.mergeData({ department });
    this.setState(newState, () => this.loadData());
  };

  componentDidUpdate() {
    gantt.render();
  }

  componentDidMount() {
    const { dashboardPage } = this.props;
    const { currentUser } = dashboardPage;
    gantt.config.xml_date = '%d/%m/%Y';
    gantt.config.order_branch = true;
    //   gantt.config.task_height = 16;
    //   gantt.config.row_height = 40;
    //   gantt.config.lightbox.sections = [
    //     {name: "description", height: 70, map_to: "text", type: "textarea", focus: true},
    //     {name: "time", height: 72, map_to: "auto", type: "duration"},
    //     {name: "baseline", height: 72, map_to: {
    //         start_date: "planned_start", end_date: "planned_end"}, type: "duration"}
    // ];
    // gantt.locale.labels.section_baseline = "Planned";
    gantt.config.columns = [
      { name: 'text', label: 'Tên công việc', width: '*', tree: true },
      { name: 'start_date', label: 'Bắt đầu', align: 'center' },
      { name: 'duration', label: 'Thời gian', align: 'center' },
      { name: 'add', label: '', width: 44 },
    ];
    gantt.templates.tooltip_text = function(_start, _end, task) {
      return `<b>Công việc:</b> ${task.text}  <br />
          <b>Thời gian:</b>  ${task.duration} </br>
          <b> Người tham gia: ${task.join} </b>`;
    };

    gantt.templates.task_class = function(_start, _end, task) {
      const css = [];
      if (task.type === 'project') {
        css.push('no_drag_progress');
      }
      return css.join(' ');
    };
    gantt.templates.task_text = function(start, end, task) {
      //   function numberWithCommas(x) {
      //     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      // }
      const costEstimate = parseInt(task.costEstimate) || 0;
      const costRealityValue = parseInt(task.costRealityValue) || 0;
      let value = costEstimate === 0 ? `0 VND` : `${costEstimate / 1000000}tr VND`;
      let value1 = costRealityValue === 0 ? `0 VND` : `${costRealityValue / 1000000}tr VND`;
      // let value = numberWithCommas(costEstimate)
      // let value1 = numberWithCommas(costRealityValue)
      // if (costEstimate >= 1000000000){
      //   value = `${costEstimate/1000000000} tỷ`
      // }else if(costEstimate >= 1000000 &&  costEstimate < 1000000000){
      //   value =  `${costEstimate/1000000} triệu`
      // }else if(costEstimate < 1000000 ){
      //   value =  `${costEstimate/1000} nghìn`
      // }
      // if (costRealityValue >= 1000000000){
      //   value1 = `${costRealityValue/1000000000} tỷ`
      // }else if(costRealityValue >= 1000000 &&  costRealityValue < 1000000000){
      //   value1 =  `${costRealityValue/1000000} triệu`
      // }else if(costRealityValue < 1000000 ){
      //   value1 =  `${costRealityValue/1000} nghìn`
      // }
      if (costEstimate === 0 && costRealityValue === 0) {
        return `<span >${task.text} (${(task.progress * 100).toFixed(2)}% ), Chi phí:( 0 VNĐ ) </span>`;
      } else {
        return `<span >${task.text} (${(task.progress * 100).toFixed(2)}% ), Chi phí:(${value1}/ ${value} )</span>`;
      }
    };

    // gantt.templates.progress_text = function(_start, _end, task) {
    //   return `<span>${(task.progress * 100).toFixed(2)}% </span>`;
    // };
    gantt.init(this.ganttContainer);

    this.loadData();
    allEvent.onBeforeTaskDisplay = gantt.attachEvent('onBeforeTaskDisplay', (id, _task) => {
      if (hasPriority(id, this.state.category)) return true;
      return false;
    });

    allEvent.onAfterTaskDrag = gantt.attachEvent('onAfterTaskDrag', (id, mode) => {
      if (mode === 'progress') {
        this.updateData(id);
      } else {
        const task = gantt.getTask(id);
        this.updateTask(id, task);
      }
    });
    allEvent.onBeforeTaskDrag = gantt.attachEvent('onBeforeTaskDrag', (id, mode) => {
      // console.log(task);
      const task = gantt.getTask(id);
      if (!canUpdateTaskPlan(task, currentUser)) {
        this.setState({ openSnack: true, variant: 'error', message: 'Bạn chỉ có thể cập nhật kế hoạch chưa được phê duyệt' });
        return false;
      }
      if (mode === 'progress' && task.taskStatus > 2) {
        this.setState({ openSnack: true, variant: 'error', message: 'Bạn chỉ có thể cập nhật công việc chưa thực hiện hoặc đang thực hiện' });
        return false;
      }

      this.mode = mode;
      return true;
    });

    allEvent.onBeforeRowDragEnd = gantt.attachEvent('onBeforeRowDragEnd', (id, target) => {
      const task = gantt.getTask(id);
      if (task.parent !== target) return false;
      return true;
    });

    allEvent.onTaskClick = gantt.attachEvent('onTaskDblClick', id => {
      const task = gantt.getTask(id);
      if (task.isProject) this.setState({ id, open: true, type: 'project' });
      else this.setState({ id, open: true, type: 'task' });
    });
    allEvent.onTaskCreated = gantt.attachEvent('onTaskCreated', task => {
      if (task.parent) this.setState({ open: true, id: 'add', taskData: { parentId: task.parent }, type: 'task' });
      else this.setState({ open: true, id: 'add', taskData: { isProject: true }, type: 'task' });
    });
    allEvent.onRowDragEnd = gantt.attachEvent('onRowDragEnd', (id, target) => {
      this.updateRow(id, target);
    });
    // allEvent.onTaskLoading = gantt.attachEvent("onTaskLoading", function(task){
    //   task.planned_start = gantt.date.parseDate(task.start_date, "xml_date");
    //   task.planned_end = gantt.date.parseDate(task.end_date, "xml_date");
    //   return true;
    // });
    // gantt.addTaskLayer(function draw_planned(task) {
    //   if (task.planned_start && task.planned_end) {
    //       var sizes = gantt.getTaskPosition(task, task.planned_start, task.planned_end);
    //       var el = document.createElement('div');
    //       el.className = 'baseline';
    //       el.style.left = sizes.left + 'px';
    //       el.style.width = sizes.width + 'px';
    //       el.style.top = sizes.top + gantt.config.task_height  + 13 + 'px';
    //       return el;
    //   }
    //   return false;
    // });
    // eslint-disable-next-line no-empty
  }

  // Caapj
  updateTask(id, item) {
    this.setState({ loading: true });
    fetch(`${API_TASK_PROJECT}/date/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startDate: item.start_date, endDate: item.end_date }),
    }).then(() => {
      this.setState({ openSnack: true, message: 'Cập nhật thành công', variant: 'success', loading: false });
    });
  }

  updateRow = (id, target) => {
    const newTarget = target.includes('next') ? target.substring(5, 29) : target;
    this.setState({ loading: true });
    const taskId = gantt.getTask(id);
    const taskTarget = gantt.getTask(newTarget);
    const tg = taskId.order;
    taskId.order = taskTarget.order;
    taskTarget.order = tg;

    const updateId = async () =>
      fetch(`${API_TASK_PROJECT}/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskId),
      });
    const updateTarget = async () =>
      fetch(`${API_TASK_PROJECT}/${newTarget}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskTarget),
      });
    Promise.all([updateId(), updateTarget()])
      .then(() => {
        this.setState({ openSnack: true, message: 'Cập nhật thành công', variant: 'success', loading: false });
      })
      .catch(() => {
        this.setState({ openSnack: true, message: 'Cập nhật không thành công', variant: 'error', loading: false });
      });
  };

  updateData(id) {
    // Cập nhật
    const listUpdate = [];
    const task = gantt.getTask(id);
    const tasks = gantt.getTaskByTime().map(i => ({ id: i.id, parentId: i.parentId, ratio: i.ratio, progress: i.progress }));
    caculateProgress(task, tasks, listUpdate);
    gantt.batchUpdate(() => {
      for (let index = 0; index < listUpdate.length; index++) {
        gantt.getTask(listUpdate[index].id).progress = listUpdate[index].progress;
      }
    });
    this.setState({ loading: true });
    // console.log('TASK', task);
    let idSend = task._id;
    if (task.projectId) idSend = task.projectId;

    fetch(`${API_TASK_PROJECT}/progress/${idSend}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskId: id, progress: task.progress * 100, taskStatus: 2 }),
    }).then(() => {
      this.setState({ openSnack: true, message: 'Cập nhật thành công', variant: 'success', loading: false });
    });
  }

  checkItem(ft) {
    // console.log('a', ft);

    if (!ft.taskManager) delete ft.taskManager;
    if (!ft.inCharge) delete ft.inCharge;
    if (!ft.join) delete ft.join;
    if (!ft.support) delete ft.support;
    if (!ft.viewable) delete ft.viewable;
    if (!ft.approved) delete ft.approved;
    if (!ft.type) delete ft.type;

    return ft;
  }

  loadData = async (search = '') => {
    const bussines = this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data;
    const extra = this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'EXTRA').data;
    const hideTask = extra.find(elm => elm.name === 'hide').data;
    const protectedTask = extra.find(elm => elm.name === 'protected').data;
    const publicTask = extra.find(elm => elm.name === 'public').data;
    const openTask = extra.find(elm => elm.name === 'open').data;

    const taskManager = bussines.find(elm => elm.name === 'taskManager').data;
    const taskInCharge = bussines.find(elm => elm.name === 'inCharge').data;
    const taskSupport = bussines.find(elm => elm.name === 'support').data;
    const taskViewable = bussines.find(elm => elm.name === 'viewable').data;
    const taskJoin = bussines.find(elm => elm.name === 'join').data;

    const profile = this.props.dashboardPage.profile;

    const { rowsPerPage, activePage, employee } = this.state;
    const employeeId = employee ? employee._id : profile._id;
    const filter = {
      status: 1,
      ...this.state.loadTask,
      $or: [
        { createdBy: employeeId },
        this.checkItem({ type: hideTask.view === true ? 2 : '' }),
        this.checkItem({ type: protectedTask.view === true ? 1 : '' }),
        this.checkItem({ type: publicTask.view === true ? 4 : '' }),
        this.checkItem({ type: openTask.view === true ? 3 : '' }),

        this.checkItem({ taskManager: taskManager.view === true ? { $in: [employeeId] } : '' }),
        this.checkItem({ inCharge: taskInCharge.view === true ? { $in: [employeeId] } : '' }),
        this.checkItem({ join: taskJoin.view === true ? { $in: [employeeId] } : '' }),
        this.checkItem({ support: taskSupport.view === true ? { $in: [employeeId] } : '' }),
        this.checkItem({ viewable: taskViewable.view === true ? { $in: [employeeId] } : '' }),
      ],
    };
    const skip = rowsPerPage * activePage;
    const showCostEstimate = true;
    if (search) filter.name = { $regex: search, $options: 'gi' };
    const query = { limit: rowsPerPage, skip, filter, showCostEstimate };
    const queryString = serialize(query);
    const URL = `${API_TASK_PROJECT}/projects?${queryString}`;

    gantt.clearAll();
    const respon = await fetch(URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    this.setState({ loading: true });

    try {
      const relsult = await respon.json();
      const data = {
        data: relsult.data.map(item => {
          if (!item.isSmallest)
            // if (0)
            return {
              ...item,
              parent: item.parentId,
              text: item.name,
              id: item._id,
              progress: item.progress / 100,
              join: item.join.map(i => i.name).join(),
              // color: '#34c461',
              type: 'project',
              duration: undefined,
              // start_date: item.startDate,
            };
          return {
            ...item,
            parent: item.parentId,
            text: item.name,
            id: item._id,
            start_date: converDateGantt(item.startDate),
            progress: item.progress / 100,
            color: '#65c16f',
            duration: ((new Date(item.endDate) - new Date(item.startDate)) / 86400000).toFixed() * 1,
            join: item.join.map(i => i.name).join(),
          };
        }),
        links: [],
      };

      gantt.parse(data);
      gantt.sort('order', false);

      this.setState({ loading: false, rowsData: relsult });
    } catch (e) {
      this.setState({ loading: false });
    }
  };

  // shouldComponentUpdate(_nextProps, nextState) {
  //   return this.state.zoom !== nextState.zoom;
  // }

  exportFile = e => {
    switch (e.target.value) {
      case 0:
        gantt.exportToPDF({
          name: 'my_beautiful_gantt.pdf',
        });
        break;
      case 1:
        gantt.exportToPNG({
          name: 'my_beautiful_gantt.png',
        });
        break;
      case 2:
        gantt.exportToExcel();
        break;
      case 3:
        () => gantt.exportToICal();
        break;
      default:
        break;
    }
  };

  render() {
    const { loading, zoom, open, id, openSnack, variant, message, type, category, taskData } = this.state;
    const { departments, department } = this.props.gantt;
    const { miniActive } = this.props;
    const roleCode = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === 'Task');
    const roleModule = roleCode.methods ? roleCode.methods : [];
    const allowAdd = (roleModule.find(elm => elm.name === 'POST') || { allow: false }).allow;
    if (!allowAdd) {
      gantt.config.columns = [
        { name: 'text', label: 'Tên công việc', width: '*', tree: true },
        { name: 'start_date', label: 'Bắt đầu', align: 'center' },
        { name: 'duration', label: 'Thời gian', align: 'center' },
      ];
    }
    this.setZoom(zoom);
    return (
      <React.Fragment>
        <Toolbar
          allProject={this.props.allProject}
          exportFile={this.exportFile}
          handleCategoryChange={this.handleCategoryChange}
          category={category}
          zoom={zoom}
          onZoomChange={this.handleZoomChange}
          loadData={this.loadData}
          employee={this.state.employee}
          handleDepartmentAndEmployeeChange={this.handleDepartmentAndEmployeeChange}
          categoryTaskArr={this.state.categoryTaskArr}
        />
        <div className="gantt-container">
          <div
            id="gantt_here"
            ref={input => {
              this.ganttContainer = input;
            }}
            style={{ width: '100%', height: '100%', paddingTop: 6 }}
          />
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 50]}
          component="div"
          count={this.state.rowsData.count}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.activePage}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        <SwipeableDrawer
          onClose={() => this.setState({ open: false })}
          open={open}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          {type === 'project' ? (
            <AddProjects data={taskData} id={id} callback={this.callbackSaveTask} />
          ) : (
            <AddProjects data={taskData} id={id} callback={this.callbackSaveTask} />
          )}
        </SwipeableDrawer>
        {loading && <Loading />}
        <Snackbar open={openSnack} variant={variant} onClose={this.closeSnack} message={message} />
      </React.Fragment>
    );
  }

  // Xử lý phân trang
  handleChangePage = (event, activePage) => {
    this.setState({ activePage }, this.loadData);
  };

  handleChangeRowsPerPage = event => {
    this.setState({ activePage: 0, rowsPerPage: event.target.value }, this.loadData);
  };

  closeSnack = (_e, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ openSnack: false });
  };

  callbackSaveTask = () => {
    this.setState({ open: false });
    this.loadData;
  };

  componentWillUnmount() {
    gantt.clearAll();
    Object.keys(allEvent).forEach(item => {
      gantt.detachEvent(allEvent[item]);
    });
  }
}

Gantt.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  gantt: makeSelectGantt(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getGantt: data => dispatch(getGantt(data)),
    postProgress: (data, loadGantt) => dispatch(postProgress(data, loadGantt)),
    miniActive: makeSelectMiniActive(),

    getData: () => dispatch(getData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'gantt', reducer });
const withSaga = injectSaga({ key: 'gantt', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Gantt);

//  FUNCTION

function Toolbar(props) {
  let timeout = 0;
  const [anchorEl, setAnchorEl] = React.useState(null);
  function handleZoomChange(e) {
    if (props.onZoomChange) {
      props.onZoomChange(e.target.value);
    }
  }

  const zoomRadios = ['Giờ', 'Ngày', 'Tháng', 'Năm'].map(value => (
    <MenuItem key={value} value={value}>
      {value}
    </MenuItem>
  ));

  function changeSearch(e) {
    const searchInput = e.target.value;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      props.loadData(searchInput);
    }, 500);
  }

  function handleChangeMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div style={{ width: '17%', marginRight: 10 }}>
        <TextField onChange={changeSearch} placeholder="Tìm kiếm công việc" variant="outlined" fullWidth />
      </div>
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: '17%', marginRight: 10 }}>
          <TextField value={props.category} onChange={props.handleCategoryChange} fullWidth label="Loại công việc" select>
            <MenuItem value={0}>-----Chọn-----</MenuItem>
            {props.categoryTaskArr.map((it, index) => (
              <MenuItem value={index + 1}>{it.name}</MenuItem>
            ))}
          </TextField>
        </div>
        <div>
          <DepartmentAndEmployee
            onChange={props.handleDepartmentAndEmployeeChange}
            employee={props.employee}
            department={props.department}
            profile={props.profile}
            moduleCode=""
          />
        </div>
        <div style={{ width: '17%' }}>
          <TextField onChange={handleZoomChange} fullWidth label="Lựa chọn" select value={props.zoom}>
            {zoomRadios}
          </TextField>
        </div>

        {/* <div style={{ width: '35%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}> */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginLeft: 10, flex: 'auto' }}>
          <button
            onClick={() => {
              tableToExcel('excel-table-instance', 'W3C Example Table');
            }}
          >
            <Tooltip title="Xuất dữ liệu">
              <Fab color="primary" size="small">
                <Archive onClick={handleChangeMenu} />
              </Fab>
            </Tooltip>
          </button>
          <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
            {props.allProject &&
              props.allProject.map(el => {
                return (
                  <MenuItem onClick={props.exportFile} value={el.idx}>
                    {el.title}
                  </MenuItem>
                );
              })}
          </Menu>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
