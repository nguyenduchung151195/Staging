/**
 *
 * AddDispatchManagerPage
 *
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
// import { withStyles } from '@material-ui/core/styles';
import Tree from 'react-d3-tree';
import {
  // Slide,
  Tabs,
  Tab,
  Grid,
  MenuItem,
  AppBar,
  Toolbar,
  Paper,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
} from '@material-ui/core';

// import { moment } from 'moment';
import { Add, Assignment, Work, Close } from '@material-ui/icons';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
// import { withStyles } from '@material-ui/core/styles';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
// import swal from 'sweetalert';
// import axios from 'axios';
import moment from 'moment';
import messages from './messages';
import ListPage from '../../components/List';
import AddProjects from 'containers/AddProjects/Loadable';
import AddMeetingSchedule from '../AddMeetingSchedule/Loadable';
import { Typography, TextField, AsyncAutocomplete, KanbanStep, FileUpload, SwipeableDrawer, Comment } from '../../components/LifetekUi';
// import MeetingDialogContent from '../../components/MeetingDialogContent';
import { API_TASK_PROJECT, API_USERS, API_ROLE_GROUP, API_DISPATCH, API_MEETING, API_LOG, API_CUSTOMERS } from '../../config/urlConfig';
import TextFieldCode from '../../components/TextFieldCode';
// import DialogFile from '../../components/DialogFile';
// import DialogSend from '../../components/DialogSend';
import CustomAppBar from 'components/CustomAppBar';

import { injectIntl } from 'react-intl';
import HistoryLog from '../HistoryLog';
import Editor from '../../components/Editor';
import makeSelectAddDispatchManagerPage, { makeSelectDashboardPage } from './selectors';
import { createDocumentAction, updateDocumentAct, mergeData, getCurrent, getDefault, getLogAct } from './actions';
import { addMeetingAction } from '../MeetingPage/actions';
import { changeSnackbar } from '../Dashboard/actions';
import reducer from './reducer';
import saga from './saga';
import { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import { taskStatusArr, logNames, clientId } from '../../variable';
import meetingPageSaga from '../MeetingPage/saga';
import 'moment/locale/vi';
import './style.scss';
import { viewConfigCheckRequired, viewConfigCheckForm } from 'utils/common';
import CustomInputBase from '../../components/Input/CustomInputBase';
import DepartmentAndEmployee from 'components/Filter/DepartmentAndEmployee';
import dot from 'dot-object';
import { Paper as PaperUI } from 'components/LifetekUi';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import { withStyles } from '@material-ui/core/styles';
import { isThisSecond } from 'date-fns';

moment.locale('vi');

/* eslint-disable react/prefer-stateless-function */
const GridList = React.memo(({ reload, openTask, filter, settingBar, onEdit, documentaryId }) => {
  const columnExtensions = React.useState([
    { columnName: 'name', width: 300 },
    { columnName: 'edit', width: 150 },
    { columnName: 'progress', width: 180 },
  ])[0];

  const mapTask = item => (

    {
      ...item,
      // parentId: item['parentId.name'],
      name: (
        <button onClick={() => openTask(item)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
          {item.name}
        </button>
      ),
      customer: item['customer.name'],
      createdBy: item['createdBy.name'],
      taskStatus: taskStatusArr[item.taskStatus - 1],
      type: item.type === 1 ? 'Nhóm bảo mật' : item.type === 4 ? 'Nhóm công khai' : item.type === 2 ? 'Nhóm ẩn' : 'Nhóm mở rộng',
      priority:
        item.priority === 1 ? 'Rất cao' : item.priority === 2 ? 'Cao' : item.priority === 3 ? 'Trung bình' : item.priority === 4 ? 'Thấp' : 'Rất thấp',
      template: item.templateName,
    });

  return (
    <Grid style={{ paddingTop: 10 }} item md={12}>
      <ListPage
        columnExtensions={columnExtensions}
        tree
        reload={reload}
        apiUrl={`${API_TASK_PROJECT}/projects`}
        code="Task"
        kanban="KANBAN"
        status="taskStatus"
        mapFunction={mapTask}
        addChildTask
        filter={filter}
        perPage={5}
        documentaryId={documentaryId}
        // disableEdit
        disableAdd
        onEdit={onEdit}
        settingBar={settingBar}
      />
    </Grid>
  );
});

const styles = {
  root: {
    height: 'calc(100vh - 64px)',
  },
  kanban: {
    marginTop: '60px',
  },
  addCV: {
    marginTop: '0px',
  },
};

export class AddDispatchManagerPage extends React.Component {
  constructor(props) {
    super(props);
    const moduleCode = this.props.match && this.props.match.url.includes('inComingDocument') ? 'inDocumentary' : 'outDocumentary';
    // const moduleCode = "Documentary"
    const crmSource = JSON.parse(localStorage.getItem('crmSource'));
    const dispatchColumns = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === moduleCode).listDisplay.type.fields.type
      .columns;
    const names = {};
    dispatchColumns.forEach(item => {
      names[item.name] = item.title;
    });
    const checkRequired = viewConfigCheckRequired(moduleCode, 'required');
    const checkShowForm = viewConfigCheckRequired(moduleCode, 'showForm');
    this.state = {
      crmSource,
      names,
      checkRequired,
      checkShowForm,
      moduleCode,
      localMessages: {},
      height: '',
      openDrawerMeeting: false,
      openDrawerTask: false,
      documentId: null,
      taskId: null,
      errorMeterNumber: 'Không được để trống PHÒNG BAN',
      check: false,
      disableAdd: false,
    };

    this.inputFile = React.createRef();
  }

  componentWillMount() {
    this.setState({ height: window.innerHeight + 'px' });
  }
  componentWillUnmount() {
    this.props.mergeData({ openDrawerTask: false })
    this.props.mergeData({ tab: 0 });
    this.props.mergeData({ anchorEl: null })
  }
  componentDidMount() {
    // this.props.history.push('/Documentary')
    const { dashboardPage, addDispatchManagerPage } = this.props;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    // console.log('check', this.state.check);
    // console.log(5555555, addDispatchManagerPage);
    if (dashboardPage && dashboardPage.profile && addDispatchManagerPage && addDispatchManagerPage.viewer) {
      addDispatchManagerPage.viewer.map((item) => {
        if (item._id === dashboardPage.profile._id) {
          this.setState({ check: true })
        }
      })
    }
    // console.log(this.props, 'ssss')
    if (id === 'add') this.props.getDefault();
    else {
      this.props.getCurrent(id);
      // this.props.getLogAct(id);
    }
    // this.setState({ errorMeterNumber: '' })
    // if (data.department === 0) {
    //   this.setState({ errorMeterNumber: 'Không được để trống PHÒNG BAN' })
    // }
    if (!this.props.addDispatchManagerPage && !this.props.addDispatchManagerPage.receivingUnit) {
      this.setState({ errorMeterNumber: 'Không được để trống PHÒNG BAN' })
    } else {
      this.setState({ errorMeterNumber: '' })
    }

  }

  componentWillReceiveProps(props) {
    if (this.props.addDispatchManagerPage !== props.addDispatchManagerPage) {
      const { moduleCode } = this.state;
      const data = dot.dot(props.addDispatchManagerPage);
      console.log(data, 'datadata', moduleCode);
      const messages = viewConfigCheckForm(moduleCode, data);
      this.setState({
        localMessages: messages,
      });
    }
  }
  // componentDidUpdate(prevProps) {
  //   if (prevProps.addDispatchManagerPage && this.props.addDispatchManagerPage && prevProps.addDispatchManagerPage.receivingUnit !== this.props.addDispatchManagerPage.receivingUnit) {
  //     console.log("prevProps", this.props.addDispatchManagerPage.receivingUnit)
  //   }
  // }
  handleChangeSelect = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeInput = event => {
    this.props.mergeData({ code: event.target.value });
  };

  handleChangeTab = (e, value) => {
    this.props.mergeData({ tab: value });
  };

  mapFunctionCalendar = item => (
    // console.log(item, 'qlcongvan');
    {
      ...item,
      typeCalendar: item.typeCalendar === '1' ? 'Lịch họp' : 'Lịch công tác',
      organizer: item['organizer.name'],
      task: item['task.name'],
      roomMetting: item['roomMetting.name'],
    });

  // eslint-disable-next-line consistent-return

  handleChangeKanban = item => {
    this.props.mergeData({ kanbanStatus: item.type });
  };

  handleClickTree = item => {
    if ('parent' in item === true) {
      if (item.parent.name === 'Công việc') {
        this.props.mergeData({ openDrawerTask: true, taskId: item._id });
        this.setState({ openDrawerTask: true, taskId: item._id });
      }
      if (item.parent.name === 'Lịch họp') {
        this.setState({ openDrawerMeeting: true, documentId: item._id });
      }
    }
    else {
      console.log(item);
    }
    // console.log(item);
    // console.log('parent' in item);
  };

  handleDepartmentAndEmployeeChange = data => {
    let { department, employee } = data;
    if (department === 0) department = ""
    this.props.mergeData({
      receivingUnit: department,
    });
    this.setState({ errorMeterNumber: '' })
    if (data.department === 0 || department === "") {
      this.setState({ errorMeterNumber: 'Không được để trống PHÒNG BAN' })
    }
  };

  // if (item.source === 'Task') {
  //   this.setState({ openDrawerTask: true, taskId: item._id });
  // } else {
  //   this.setState({ openDrawerMeeting: true, documentId: item._id });
  // }

  // if (item.parent.name === 'Công việc') {
  //   this.setState({ openDrawerTask: true, taskId: item._id });
  // }
  // if (item.parent.name === 'Lịch họp') {
  //   this.setState({ openDrawerMeeting: true, documentId: item._id });
  // }

  callbackTask = task => {
    const { addDispatchManagerPage, profile } = this.props;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const employee = {
      employeeId: profile._id,
      name: profile.name,
    };

    const newLog = {
      content: `Công việc ${task ? task.data.name : null} đã được tạo!`,
      employee,
      model: 'Documentary',
      type: logNames.TASK,
      objectId: id,
    };
    fetch(API_LOG, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(newLog),
    }).then(() => { });

    this.props.mergeData({ openDrawerTask: false, reloadTask: addDispatchManagerPage.reloadTask + 1 });
  };

  callbackMeeting = metting => {
    const { addDispatchManagerPage, profile } = this.props;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const employee = {
      employeeId: profile._id,
      name: profile.name,
    };

    const newLog = {
      content: `Lịch họp ${metting && metting.name} đã được tạo!`,
      employee,
      model: 'Documentary',
      type: logNames.MEETING,
      objectId: id,
    };
    fetch(API_LOG, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(newLog),
    }).then(() => { });

    if (metting) {
      this.props.mergeData({ openDrawerMeeting: false, reload: addDispatchManagerPage.reload + 1 });
      this.setState({ openDrawerMeeting: false });
    } else {
      this.props.mergeData({ openDrawerMeeting: true, reload: false });
    }
  };

  addItemCalendar = () => (
    <Add onClick={() => this.setState({ openDrawerMeeting: true, documentId: 'add' })}>
      Open Menu
    </Add>
  );
  handleCloseAddItemCalendar = () => {
    this.setState({ openDrawerMeeting: false, id: 'add' })
  }
  openTask = item => this.props.mergeData({ openDrawerTask: true, idCalendar: item._id });

  addItemTask = () => (
    <Add onClick={e => {
      // console.log(77777, e.currentTarget);
      this.props.mergeData({ anchorEl: e.currentTarget, idCalendar: 'add' })
    }}>
      Open Menu
    </Add>
  );

  changeFile = e => {
    this.file = e.target.files[0];
    const name = this.file.name;
    const lastDot = name.lastIndexOf('.');
    const fileName = name.substring(0, lastDot);
    // const ext = name.substring(lastDot + 1);
    const arrfiles = [];
    arrfiles.push({
      name: fileName,
      fileType: e.target.files[0].type,
      // path: `${UPLOAD_APP_URL}/file-system/projects${res.data.url}`,
    });
    this.props.mergeData({ files: arrfiles });
  };

  onSaveDucument = () => {
    this.setState({ disableAdd: true });
    setTimeout(() => {
      this.setState({ disableAdd: false });
    }, 3000);
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { addDispatchManagerPage } = this.props;

    // if (
    //   addDispatchManagerPage.name === '' ||
    //   addDispatchManagerPage.receivingUnit === '' ||
    //   addDispatchManagerPage.addressUnit === '' ||
    //   addDispatchManagerPage.errorUser ||
    //   addDispatchManagerPage.receiverSign === null
    // ) {
    //   this.props.onChangeSnackbar({ status: true, message: 'Trường màu đỏ không được để trống', variant: 'warning' });
    //   return;
    // }

    const type = this.props.match && this.props.match.url.includes('outGoingDocument') ? '1' : '2';

    if (this.props.match && this.props.match.url.includes('inComingDocument')) {
      if (new Date(addDispatchManagerPage.receiveTime) >= new Date(addDispatchManagerPage.replyDeadline)) {
        this.props.onChangeSnackbar({ status: true, message: 'Hạn trả lời công văn lớn hơn thời điểm tiếp nhận', variant: 'warning' });
        return;
      }
      null;

      if (
        new Date(addDispatchManagerPage.toDate) > new Date(addDispatchManagerPage.replyDeadline) ||
        new Date(addDispatchManagerPage.toDate) > new Date(addDispatchManagerPage.receiveTime)
      ) {
        this.props.onChangeSnackbar({
          status: true,
          message: 'Ngày ký công văn không được lớn hơn thời điểm tiếp nhận và Hạn trả lời công văn',
          variant: 'warning',
        });
        return;
      }
    }

    // if (addDispatchManagerPage.kanbanStatus === 0) {
    //   this.props.onChangeSnackbar({ status: true, message: 'Bạn cần chọn trạng thái kanban', variant: 'warning' });
    //   return;
    // }
    const newRecieverPosition = {
      name: addDispatchManagerPage.recieverPosition ? addDispatchManagerPage.recieverPosition.name : null,
      id: addDispatchManagerPage.recieverPosition ? addDispatchManagerPage.recieverPosition._id : null,
    };

    const data = {
      type: id === 'add' ? type : addDispatchManagerPage.type,
      name: addDispatchManagerPage.name,
      code: addDispatchManagerPage.code,
      typeDocument: addDispatchManagerPage.typeDocument,
      task: addDispatchManagerPage.task,
      abstract: addDispatchManagerPage.abstract,
      replyDispatch: addDispatchManagerPage.replyDispatch,
      officialDispatch: addDispatchManagerPage.officialDispatch,
      where: addDispatchManagerPage.where,
      toDate: addDispatchManagerPage.toDate,
      signer: addDispatchManagerPage.signer,
      signerPosition: addDispatchManagerPage.signerPosition,
      receivingUnit: addDispatchManagerPage.receivingUnit,
      nameUnit: addDispatchManagerPage.nameUnit,
      addressUnit: addDispatchManagerPage.addressUnit,
      additionalPlaces: addDispatchManagerPage.additionalPlaces,
      toUsers: addDispatchManagerPage.toUsers,
      fromUsers: addDispatchManagerPage.fromUsers,
      recieverPosition: newRecieverPosition,
      receiveTime: addDispatchManagerPage.receiveTime,
      replyDeadline: addDispatchManagerPage.replyDeadline,
      statusDocumentary: addDispatchManagerPage.statusDocumentary,
      storage: addDispatchManagerPage.storage,
      urgency: addDispatchManagerPage.urgency,
      density: addDispatchManagerPage.density,
      receiverSign: addDispatchManagerPage.receiverSign,
      viewer: addDispatchManagerPage.viewer,
      content: addDispatchManagerPage.content,
      others: addDispatchManagerPage.others,
      handlingComments: addDispatchManagerPage.handlingComments,
      files: addDispatchManagerPage.files,
      kanbanStatus: addDispatchManagerPage.kanbanStatus,
      callback:
        (localStorage.getItem('mettingScheduleId') && localStorage.getItem('mettingScheduleId') !== 'add') ||
          (localStorage.getItem('workingScheduleId') && localStorage.getItem('workingScheduleId') !== 'add')
          ? () => {
            if (this.props.history) {
              this.props.history.goBack();
            }
          }
          : this.props.callback,
      customers: Array.isArray(addDispatchManagerPage.customers)
        ? addDispatchManagerPage.customers.map(i => ({ customerId: i._id, name: i.name }))
        : [],
      mettingSchedule:
        localStorage.getItem('mettingScheduleId') && localStorage.getItem('mettingScheduleId') !== 'add'
          ? localStorage.getItem('mettingScheduleId')
          : null,
      workingSchedule:
        localStorage.getItem('workingScheduleId') && localStorage.getItem('workingScheduleId') !== 'add'
          ? localStorage.getItem('workingScheduleId')
          : null,
    };

    const { localMessages } = this.state;
    if (Object.keys(localMessages).length === 0) {
      if (id === 'add') this.props.onAddDocument(data);
      else this.props.onUpdateDocument(id, data);
    } else if (Object.keys(localMessages).find(element => element === 'receivingUnit')) {

      this.props.onChangeSnackbar({ status: true, message: 'Cần chọn PHÒNG BAN', variant: 'warning' });
    } else {
      this.props.onChangeSnackbar({ status: true, message: 'Trường màu đỏ không được để trống', variant: 'warning' });
    }
  };

  handleGoBack = () => {
    if (this.props.history && !this.props.close) {
      // console.log(111111, this.props.history);
      this.props.history.goBack();
      // this.props.callback();
    }
    else if (this.props.callback) {
      this.props.callback();
    }
    // this.props.callback();
  };
  genMessageForRelationiField = type => {
    if (type) {
      const arr = type.split('/');
      return arr[2];
    }
    return '';
  };

  render() {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { addDispatchManagerPage, dashboardPage, intl, miniActive } = this.props;
    const { tab } = addDispatchManagerPage;
    const { names, checkRequired, checkShowForm, localMessages, height, check } = this.state;
    // const type = this.props.documentType || this.genMessageForRelationiField(this.props.location.pathname);
    // console.log(55555, this.props);
    // console.log('check1', this.state.check);
    const roleCodeCalendar = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === 'Calendar');
    const roleModuleCalendar = roleCodeCalendar && roleCodeCalendar.methods ? roleCodeCalendar.methods : [];
    const roleCodeTask = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === 'Task');
    const roleModuleTask = roleCodeTask && roleCodeTask.methods ? roleCodeTask.methods : [];
    const type = this.props.documentType || this.props.location ? this.genMessageForRelationiField(this.props.location.pathname) : null;
    return (
      <>
        <CustomAppBar
          title={
            type !== 'outGoingDocument'
              ? id === 'add'
                ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới công văn đến' })}`
                : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật công văn đến' })}`
              : id === 'add'
                ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới công văn đi' })}`
                : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật công văn đi' })}`
          }
          onGoBack={this.handleGoBack}
          onSubmit={this.onSaveDucument}
          disableAdd={this.state.disableAdd}
        />
        <div>
          <div style={this.props.id === undefined ? styles.addCV : styles.kanban}>
            <KanbanStep
              handleStepper={this.handleChangeKanban}
              kanbanStatus={addDispatchManagerPage.kanbanStatus}
              code={this.props.match && this.props.match.url.includes('outGoingDocument') ? 'ST17' : 'ST14'}
            />
          </div>
          <div>
            <Grid container>
              <Tabs
                value={tab}
                onChange={(e, value) => this.handleChangeTab(e, value)}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab value={0} label="Thông tin chung" />
                {clientId === 'MIPEC' ? null : (roleModuleCalendar.find(elm => elm.name === 'GET') || { allow: false }).allow === true ? (
                  <Tab disabled={id === 'add'} value={1} label="Lịch họp" />
                ) : null}
                {clientId === 'MIPEC' ? null : (roleModuleTask.find(elm => elm.name === 'GET') || { allow: false }).allow === true ? (
                  <Tab disabled={id === 'add'} value={2} label="Công việc" />
                ) : null}
                <Tab disabled={id === 'add'} value={5} label="Thảo luận" />
                {clientId === 'MIPEC' ? null : <Tab disabled={id === 'add'} value={3} label="Nguồn gốc" />}
                {clientId === 'MIPEC' ? null : <Tab disabled={id === 'add'} value={4} label="Lịch sử" />}
              </Tabs>
            </Grid>
            {tab === 0 ? (
              <PaperUI style={{ zIndex: '0 !important' }}>
                <Grid container spacing={8}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" gutterBottom>
                      Thông tin cơ bản
                    </Typography>
                    <TextFieldCode
                      code={14}
                      value={addDispatchManagerPage.code}
                      onChange={this.handleChangeInput}
                      disabled
                      label={names.code}
                      error={localMessages && localMessages.code}
                      helperText={localMessages && localMessages.code}
                      required={checkRequired.code}
                      checkedShowForm={checkShowForm.code}
                    />
                    <CustomInputBase
                      value={addDispatchManagerPage.name}
                      onChange={e => this.props.mergeData({ name: e.target.value })}
                      label={names.name}
                      error={localMessages && localMessages.name}
                      helperText={localMessages && localMessages.name}
                      required={checkRequired.name}
                      checkedShowForm={checkShowForm.name}
                    />
                    <CustomInputBase
                      value={addDispatchManagerPage.typeDocument}
                      onChange={e => this.props.mergeData({ typeDocument: e.target.value })}
                      select
                      label={names.typeDocument}
                      error={localMessages && localMessages.typeDocument}
                      helperText={localMessages && localMessages.typeDocument}
                      required={checkRequired.typeDocument}
                      checkedShowForm={checkShowForm.typeDocument}
                    >
                      {this.state.crmSource.find(elm => elm.code === 'S19').data.map(item => (
                        <MenuItem value={item.value}>{item.title}</MenuItem>
                      ))}
                    </CustomInputBase>

                    <div>
                      <AsyncAutocomplete
                        name="Chọn dự án"
                        label={names.task || 'Chọn dự án'}
                        onChange={value => {
                          const newData = { task: value };
                          if (value && value.customer && value.customer._id) {
                            newData.customers = [value.customer];
                          }
                          this.props.mergeData(newData);
                        }}
                        value={addDispatchManagerPage.task}
                        url={API_TASK_PROJECT}
                        ref={ref => (this.projectRef = ref)}
                        error={localMessages && localMessages.task}
                        helperText={localMessages && localMessages.task}
                        required={checkRequired.task}
                        checkedShowForm={checkShowForm.task}
                      />
                    </div>
                    <div>
                      <AsyncAutocomplete
                        label={names.customers}
                        isMulti
                        onChange={value => this.props.mergeData({ customers: value })}
                        url={`${API_CUSTOMERS}`}
                        value={addDispatchManagerPage.customers}
                        error={localMessages && localMessages.customers}
                        helperText={localMessages && localMessages.customers}
                        required={checkRequired.customers}
                        checkedShowForm={checkShowForm.customers}
                      />
                    </div>
                    <TextField
                      id="outlined-basic"
                      label={names.abstract}
                      multiline
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      rows={4}
                      onChange={e => this.props.mergeData({ abstract: e.target.value })}
                      value={addDispatchManagerPage.abstract}
                      error={localMessages && localMessages.abstract}
                      helperText={localMessages && localMessages.abstract}
                      required={checkRequired.abstract}
                      checkedShowForm={checkShowForm.abstract}
                    />
                    {this.props.match && this.props.match.url.includes('outGoingDocument') ? (
                      <div>
                        <AsyncAutocomplete
                          label={names.replyDispatch}
                          onChange={value => this.props.mergeData({ replyDispatch: value })}
                          value={addDispatchManagerPage.replyDispatch}
                          url={`${API_DISPATCH}`}
                          ref={ref => (this.projectRef = ref)}
                          filter={{ type: '2' }}
                          error={localMessages && localMessages.replyDispatch}
                          helperText={localMessages && localMessages.replyDispatch}
                          required={checkRequired.replyDispatch}
                          checkedShowForm={checkShowForm.replyDispatch}
                          name="cv den"
                        />

                        <AsyncAutocomplete
                          label={names.officialDispatch || 'CÔNG VĂN CHÍNH THỨC'}
                          onChange={value => this.props.mergeData({ officialDispatch: value })}
                          value={addDispatchManagerPage.officialDispatch}
                          url={API_DISPATCH}
                          ref={ref => (this.projectRef = ref)}
                          filter={{ type: '2' }}
                          name="cv den"
                          error={localMessages && localMessages.officialDispatch}
                          helperText={localMessages && localMessages.officialDispatch}
                          required={checkRequired.officialDispatch}
                          checkedShowForm={checkShowForm.officialDispatch}
                        />
                      </div>
                    ) : (
                      <div>
                        <AsyncAutocomplete
                          label={names.replyDispatch}
                          onChange={value => this.props.mergeData({ replyDispatch: value })}
                          value={addDispatchManagerPage.replyDispatch}
                          url={`${API_DISPATCH}`}
                          ref={ref => (this.projectRef = ref)}
                          filter={{ type: '1' }}
                          error={localMessages && localMessages.replyDispatch}
                          helperText={localMessages && localMessages.replyDispatch}
                          required={checkRequired.replyDispatch}
                          checkedShowForm={checkShowForm.replyDispatch}
                        />

                        <AsyncAutocomplete
                          label={names.officialDispatch || 'CÔNG VĂN CHÍNH THỨC'}
                          onChange={value => this.props.mergeData({ officialDispatch: value })}
                          value={addDispatchManagerPage.officialDispatch}
                          url={API_DISPATCH}
                          ref={ref => (this.projectRef = ref)}
                          filter={{ type: '1' }}
                          error={localMessages && localMessages.officialDispatch}
                          helperText={localMessages && localMessages.officialDispatch}
                          required={checkRequired.officialDispatch}
                          checkedShowForm={checkShowForm.officialDispatch}
                        />
                      </div>
                    )}

                    <CustomInputBase
                      select
                      value={addDispatchManagerPage.where}
                      onChange={e => this.props.mergeData({ where: e.target.value })}
                      label={names.where}
                      name="Cau hinh CRM"
                      error={localMessages && localMessages.where}
                      helperText={localMessages && localMessages.where}
                      required={checkRequired.where}
                      checkedShowForm={checkShowForm.where}
                    >
                      {this.state.crmSource.find(elm => elm.code === 'S23').data.map(item => (
                        <MenuItem value={item.value}>{item.title}</MenuItem>
                      ))}
                    </CustomInputBase>

                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DateTimePicker
                        inputVariant="outlined"
                        format="DD/MM/YYYY HH:mm"
                        label={names.toDate}
                        value={addDispatchManagerPage.toDate}
                        name="toDate"
                        margin="dense"
                        variant="outlined"
                        onChange={value => this.props.mergeData({ toDate: value })}
                        fullWidth
                      />
                    </MuiPickersUtilsProvider>

                    <CustomInputBase
                      value={addDispatchManagerPage.signer}
                      onChange={e => this.props.mergeData({ signer: e.target.value })}
                      label={names.signer}
                      error={localMessages && localMessages.signer}
                      helperText={localMessages && localMessages.signer}
                      required={checkRequired.signer}
                      checkedShowForm={checkShowForm.signer}
                    />
                    <CustomInputBase
                      value={addDispatchManagerPage.signerPosition}
                      onChange={e => this.props.mergeData({ signerPosition: e.target.value })}
                      label={names.signerPosition}
                      error={localMessages && localMessages.signerPosition}
                      helperText={localMessages && localMessages.signerPosition}
                      required={checkRequired.signerPosition}
                      checkedShowForm={checkShowForm.signerPosition}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" gutterBottom>
                      {this.props.match && this.props.match.url.includes('outGoingDocument') ? 'Đơn vị tiếp nhận' : 'Đơn vị gửi'}
                    </Typography>
                    <DepartmentAndEmployee
                      error={this.state.errorMeterNumber}
                      helperText={this.state.errorMeterNumber}
                      onChange={this.handleDepartmentAndEmployeeChange}
                      labelDepartment={names.receivingUnit}
                      disableEmployee
                      department={addDispatchManagerPage.receivingUnit}
                      moduleCode="Documentary"
                      profile={this.props.profile}
                    />
                    <CustomInputBase
                      id="outlined-basic"
                      label={names.nameUnit}
                      onChange={e => this.props.mergeData({ nameUnit: e.target.value })}
                      value={addDispatchManagerPage.nameUnit}
                      error={localMessages && localMessages.nameUnit}
                      helperText={localMessages && localMessages.nameUnit}
                      required={checkRequired.nameUnit}
                      checkedShowForm={checkShowForm.nameUnit}
                    />
                    <CustomInputBase
                      id="outlined-basic"
                      label={names.addressUnit}
                      onChange={e => this.props.mergeData({ addressUnit: e.target.value })}
                      value={addDispatchManagerPage.addressUnit}
                      error={localMessages && localMessages.addressUnit}
                      helperText={localMessages && localMessages.addressUnit}
                      required={checkRequired.addressUnit}
                      checkedShowForm={checkShowForm.addressUnit}
                    />
                    <TextField
                      id="outlined-basic"
                      label={names.additionalPlaces}
                      onChange={e => this.props.mergeData({ additionalPlaces: e.target.value })}
                      value={addDispatchManagerPage.additionalPlaces}
                      multiline
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      rows={4}
                      error={localMessages && localMessages.additionalPlaces}
                      helperText={localMessages && localMessages.additionalPlaces}
                      required={checkRequired.additionalPlaces}
                      checkedShowForm={checkShowForm.additionalPlaces}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="subtitle2" gutterBottom>
                      {this.props.match && this.props.match.url.includes('outGoingDocument') ? 'Gửi công văn' : ' Tiếp nhận công văn'}
                    </Typography>

                    <div>
                      <AsyncAutocomplete
                        isMulti
                        name="Chọn...."
                        label={this.props.match && this.props.match.url.includes('outGoingDocument') ? names.fromUsers : names.toUsers}
                        onChange={value =>
                          this.props.match && this.props.match.url.includes('outGoingDocument')
                            ? this.props.mergeData({ fromUsers: value, errorUser: false })
                            : this.props.mergeData({ toUsers: value, errorUser: false })
                        }
                        value={
                          this.props.match && this.props.match.url.includes('outGoingDocument')
                            ? addDispatchManagerPage.fromUsers
                            : addDispatchManagerPage.toUsers
                        }
                        url={API_USERS}
                        ref={ref => (this.projectRef = ref)}
                        error={
                          this.props.match && this.props.match.url.includes('outGoingDocument')
                            ? localMessages && localMessages.fromUsers
                            : localMessages && localMessages.toUsers
                        }
                        helperText={
                          this.props.match && this.props.match.url.includes('outGoingDocument')
                            ? localMessages && localMessages.fromUsers
                            : localMessages && localMessages.toUsers
                        }
                        required={
                          this.props.match && this.props.match.url.includes('outGoingDocument') ? checkRequired.fromUsers : checkRequired.toUsers
                        }
                        checkedShowForm={
                          this.props.match && this.props.match.url.includes('outGoingDocument') ? checkShowForm.fromUsers : checkShowForm.toUsers
                        }
                      />
                    </div>
                    <div>
                      <AsyncAutocomplete
                        label={names['recieverPosition.name']}
                        onChange={value => this.props.mergeData({ recieverPosition: value })}
                        value={addDispatchManagerPage.recieverPosition}
                        url={API_ROLE_GROUP}
                        clientId
                        ref={ref => (this.projectRef = ref)}
                        error={localMessages && localMessages.recieverPosition}
                        helperText={localMessages && localMessages.recieverPosition}
                        required={checkRequired.recieverPosition}
                        checkedShowForm={checkShowForm.recieverPosition}
                      />
                    </div>

                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DateTimePicker
                        inputVariant="outlined"
                        format="DD/MM/YYYY HH:mm"
                        label={names.receiveTime}
                        // label={this.props.match && this.props.match.url.includes('outGoingDocument') ? 'Thời điểm gửi' : 'Thời điểm tiếp nhận'}
                        value={addDispatchManagerPage.receiveTime}
                        name="receiveTime"
                        margin="dense"
                        variant="outlined"
                        onChange={value => this.props.mergeData({ receiveTime: value })}
                        fullWidth
                      />
                    </MuiPickersUtilsProvider>
                    {this.props.match && this.props.match.url.includes('outGoingDocument') ? null : (
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DateTimePicker
                          inputVariant="outlined"
                          format="DD/MM/YYYY HH:mm"
                          label={names.replyDeadline}
                          value={addDispatchManagerPage.replyDeadline}
                          name="replyDeadline"
                          margin="dense"
                          variant="outlined"
                          onChange={value => this.props.mergeData({ replyDeadline: value })}
                          fullWidth
                        />
                      </MuiPickersUtilsProvider>
                    )}

                    <CustomInputBase
                      select
                      value={addDispatchManagerPage.storage}
                      onChange={e => this.props.mergeData({ storage: e.target.value })}
                      label={names.storage}
                      name="Cau hinh CRM"
                      error={localMessages && localMessages.storage}
                      helperText={localMessages && localMessages.storage}
                      required={checkRequired.storage}
                      checkedShowForm={checkShowForm.storage}
                    >
                      {this.state.crmSource.find(elm => elm.code === 'S22').data.map(item => (
                        <MenuItem value={item.value}>{item.title}</MenuItem>
                      ))}
                    </CustomInputBase>
                    <CustomInputBase
                      id="outlined-basic"
                      label={names.urgency}
                      onChange={e => this.props.mergeData({ urgency: e.target.value })}
                      value={addDispatchManagerPage.urgency}
                      select
                      error={localMessages && localMessages.urgency}
                      helperText={localMessages && localMessages.urgency}
                      required={checkRequired.urgency}
                      checkedShowForm={checkShowForm.urgency}
                    >
                      {this.state.crmSource.find(elm => elm.code === 'S20').data.map(item => (
                        <MenuItem value={item.value}>{item.title}</MenuItem>
                      ))}
                    </CustomInputBase>
                    <CustomInputBase
                      id="outlined-basic"
                      label={names.density}
                      onChange={e => this.props.mergeData({ density: e.target.value })}
                      value={addDispatchManagerPage.density}
                      select
                      error={localMessages && localMessages.density}
                      helperText={localMessages && localMessages.density}
                      required={checkRequired.density}
                      checkedShowForm={checkShowForm.density}
                    >
                      {this.state.crmSource.find(elm => elm.code === 'S21').data.map(item => (
                        <MenuItem value={item.value}>{item.title}</MenuItem>
                      ))}
                    </CustomInputBase>
                    <div>
                      <AsyncAutocomplete
                        name="Chọn "
                        label={names.receiverSign}
                        onChange={value => this.props.mergeData({ receiverSign: value })}
                        value={addDispatchManagerPage.receiverSign}
                        url={API_USERS}
                        ref={ref => (this.projectRef = ref)}
                        error={localMessages && localMessages.receiverSign}
                        helperText={localMessages && localMessages.receiverSign}
                        required={checkRequired.receiverSign}
                        checkedShowForm={checkShowForm.receiverSign}
                      />
                    </div>
                    <div>
                      <AsyncAutocomplete
                        name="Chọn người được xem"
                        label={names.viewer}
                        onChange={value => this.props.mergeData({ viewer: value })}
                        value={addDispatchManagerPage.viewer}
                        url={API_USERS}
                        ref={ref => (this.projectRef = ref)}
                        isMulti
                        error={localMessages && localMessages.viewer}
                        helperText={localMessages && localMessages.viewer}
                        required={checkRequired.viewer}
                        checkedShowForm={checkShowForm.viewer}
                      />
                    </div>
                    <div>
                      <CustomGroupInputField
                        code="Documentary"
                        columnPerRow={1}
                        value={addDispatchManagerPage.others}
                        onChange={value => this.props.mergeData({ others: value })}
                      />
                    </div>
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      id="outlined-basic"
                      label={names.content}
                      onChange={e => this.props.mergeData({ content: e.target.value })}
                      value={addDispatchManagerPage.content}
                      multiline
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      rows={4}
                      error={localMessages && localMessages.content}
                      helperText={localMessages && localMessages.content}
                      required={checkRequired.content}
                      checkedShowForm={checkShowForm.content}
                    />
                    <div style={{ width: '100%', marginTop: '20px' }}>
                      <span> {names.handlingComments}</span>
                      <Editor
                        value={addDispatchManagerPage.handlingComments}
                        onChange={value => {
                          addDispatchManagerPage.handlingComments = value;
                          this.props.mergeData({ handlingComments: value });
                        }}
                      />
                    </div>
                    {this.props.match && this.props.match.url.includes('outGoingDocument') ? (
                      <FileUpload name={this.props.addDispatchManagerPage.name} id={id} code="outGoingDocument" profile={this.props.profile} />
                    ) : (
                      <FileUpload name={this.props.addDispatchManagerPage.name} id={id} code="inComingDocument" profile={this.props.profile} />
                    )}
                  </Grid>
                </Grid>
              </PaperUI>
            ) : null}
            {tab === 1 ? (
              <PaperUI>
                <ListPage
                  reload={addDispatchManagerPage.reload} // load render lai khi them moi
                  kanban="ST15"
                  filter={{
                    $and: [{ typeCalendar: '1' }, { documentary: id }],
                  }}
                  code="Calendar"
                  apiUrl={API_MEETING}
                  mapFunction={this.mapFunctionCalendar}
                  // disableEdit
                  disableAdd
                  documentaryId={id}
                  onEdit={row => this.setState({ openDrawerMeeting: true, documentId: row._id })}
                  settingBar={[this.addItemCalendar()]}
                />
              </PaperUI>
            ) : null}
            {tab === 2 ? (
              <PaperUI>
                {/* <div style={{ marginLeft: '15.2rem' }}> */}
                <GridList
                  filter={{
                    $and: [{ documentary: id }],
                  }}
                  openTask={this.openTask}
                  reload={addDispatchManagerPage.reloadTask} // load render lai khi them moi
                  // disableEdit
                  onEdit={row => this.props.mergeData({ openDrawerTask: true, taskId: row._id })}
                  settingBar={[this.addItemTask()]}
                  documentaryId={id}
                />
                {/* </div> */}
              </PaperUI>
            ) : null}
            {tab === 3 ? (
              <PaperUI style={{ height: height }}>
                <Tree
                  data={addDispatchManagerPage.ducumentData}
                  translate={{ x: 60, y: 260 }}
                  scaleExtent={{ min: 0.5, max: 2 }}
                  circleRadius={12}
                  depthFactor={300}
                  onClick={this.handleClickTree}
                />
              </PaperUI>
            ) : null}
            {tab === 4 ? (
              <PaperUI>
                <HistoryLog generalData={addDispatchManagerPage.ducumentData} collectionCode="Documentary" />
              </PaperUI>
            ) : null}
            {tab === 5 ? (
              <PaperUI>
                <Comment code="Calendar" id={this.props.id ? this.props.id : this.props.match.params.id} />
              </PaperUI>
            ) : null}
            {/* <div style={{ marginTop: 25, float: 'right' }}>
          {' '}
          <Button variant="contained" color="primary" style={{ marginRight: 20 }} onClick={this.onSaveDucument}>
            Lưu
          </Button>
          <Button variant="contained" color="secondary" style={{ marginRight: 20 }} onClick={this.handleGoBack}>
            Đóng
          </Button>
        </div> */}
          </div>
          <Menu
            id="simple-menu"
            anchorEl={addDispatchManagerPage.anchorEl}
            keepMounted
            open={Boolean(addDispatchManagerPage.anchorEl)}
            onClose={() => this.props.mergeData({ anchorEl: null })}
          >
            <MenuItem onClick={() => {
              this.props.mergeData({ openDrawerTask: true, taskId: 'add', taskData: { isProject: false } });
              this.props.mergeData({ anchorEl: null });
            }}>
              <ListItemIcon>
                <Assignment color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Công việc" />
            </MenuItem>
            <MenuItem onClick={() => {
              this.props.mergeData({ openDrawerTask: true, taskId: 'add', taskData: { isProject: true } })
              this.props.mergeData({ anchorEl: null });
            }}>
              <ListItemIcon>
                <Work color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Dự án" />
            </MenuItem>
          </Menu>
          <SwipeableDrawer
            width={window.innerWidth - 260}
            anchor="right"
            onClose={() => this.setState({ openDrawerMeeting: false, id: 'add' })}
            open={this.state.openDrawerMeeting}
          >
            <div style={{ width: window.innerWidth - 260 }}>
              <AddMeetingSchedule id={this.state.documentId} callback={this.callbackMeeting} documentary={id} handleCloseAddItemCalendar={() => this.handleCloseAddItemCalendar()} />
            </div>
          </SwipeableDrawer>
          <SwipeableDrawer
            anchor="right"
            onClose={() => this.props.mergeData({ openDrawerTask: false, taskId: 'add' })}
            open={addDispatchManagerPage.openDrawerTask}
            width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
          >
            <div>
              <AddProjects data={addDispatchManagerPage.taskData} id={addDispatchManagerPage.taskId} callback={this.callbackTask} documentary={id} />
            </div>
          </SwipeableDrawer>
        </div>
      </>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  addDispatchManagerPage: makeSelectAddDispatchManagerPage(),
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onAddDocument: document => {
      dispatch(createDocumentAction(document));
    },
    onUpdateDocument: (id, document) => {
      dispatch(updateDocumentAct(id, document));
    },
    onCreateMeeting: (meeting, reminderBefore) => {
      dispatch(addMeetingAction(meeting, reminderBefore));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    mergeData: data => dispatch(mergeData(data)),
    getCurrent: id => dispatch(getCurrent(id)),
    getDefault: () => dispatch(getDefault()),
    getLogAct: data => {
      dispatch(getLogAct(data));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addDispatchManagerPage', reducer });
const withSaga = injectSaga({ key: 'addDispatchManagerPage', saga });
const withMeetingPageSaga = injectSaga({ key: 'meetingPage', saga: meetingPageSaga });
export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withMeetingPageSaga,
  withConnect,
  withRouter,
)(AddDispatchManagerPage);
