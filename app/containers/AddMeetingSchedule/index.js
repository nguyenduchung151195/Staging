/* eslint-disable react/button-has-type */
/**
 *
 * AddMeetingSchedule
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Button, Tab, Tabs, Avatar, MenuItem, AppBar, Toolbar, IconButton, Menu, ListItemText, InputAdornment, Tooltip, FormControlLabel, FormGroup } from '@material-ui/core';
import { Add, TrendingFlat, Close, FileCopy } from '@material-ui/icons';
import AddProjects from 'containers/AddProjects';
import { injectIntl } from 'react-intl';
import { taskStatusArr } from 'variable';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import ListPage from '../../components/List/ListTask';
import messages from './messages';
import makeSelectAddMeetingSchedule from './selectors';
import { Link } from 'react-router-dom';
import makeSelectDashboardPage, { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import { API_USERS, API_MEETING, API_TASK_PROJECT, API_CUSTOMERS, API_DISPATCH, URL_MEETTING } from '../../config/urlConfig';
import { Typography, Paper, TextField, Grid, AsyncAutocomplete, KanbanStep, SwipeableDrawer, FileUpload } from '../../components/LifetekUi';
import { Grid as GridUI } from '@material-ui/core';
import reducer from './reducer';
import { changeSnackbar } from '../Dashboard/actions';
import { mergeData, postData, getCurrent, putData, getDefault, getData } from './actions';
import saga from './saga';
import { viewConfigCheckRequired, viewConfigCheckForm, getHost } from 'utils/common';
import CustomInputBase from '../../components/Input/CustomInputBase';
import './style.scss';
import dot from 'dot-object';
import CustomAppBar from 'components/CustomAppBar';
import { Checkbox } from 'semantic-ui-react';
import moment from 'moment';

// import messages from './messages';
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
    </span>
  </div>
);
/* eslint-disable react/prefer-stateless-function */
export class AddMeetingSchedule extends React.Component {
  constructor(props) {
    super(props);
    const moduleCode = 'Calendar';
    const dispatchColumns = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === moduleCode).listDisplay.type.fields.type
      .columns;
    const names = {};
    dispatchColumns.forEach(item => {
      names[item.name] = item.title;
    });
    const checkRequired = viewConfigCheckRequired(moduleCode, 'required');
    const checkShowForm = viewConfigCheckRequired(moduleCode, 'showForm');
    const crmSource = JSON.parse(localStorage.getItem('crmSource'));
    this.state = {
      names,
      moduleCode,
      checkRequired,
      checkShowForm,
      localMessages: {},
      crmSource,
      openSelectDocumentType: null,
      reload: null,
      checkCopy: false,
      disableAdd: false,
    };
  }

  componentDidMount() {
    this.props.getData();
    const id = this.props.id ? this.props.id : this.props.match.params.id;

    this.props.mergeData({ tab: 0 });
    if (id === 'add') {
      this.props.getDefault();
      this.props.mergeData({ people: [this.props.profile] });
    } else {
      this.props.getCurrent(id);
      this.props.mergeData({
        employee: null,
        department: '',
        timeStart: new Date(),
        timeEnd: new Date(),
        filter: {
          isProject: "false",

          // mettingSchedule: id,
        },
      });
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.addMeetingSchedule !== props.addMeetingSchedule) {
      const { moduleCode } = this.state;
      const data = dot.dot(props.addMeetingSchedule);
      localStorage.setItem('mettingScheduleId', data._id);
      localStorage.removeItem('workingScheduleId');
      const messages = viewConfigCheckForm(moduleCode, data);
      this.setState({
        localMessages: messages,
      });
    }
  }

  handleChangeKanban = item => {
    this.props.mergeData({ kanbanStatus: item.type });
  };

  addItemPersonal = () => (
    <Add style={{ color: 'none' }} onClick={() => this.props.mergeData({ openDrawer: true })}>
      Open Menu
    </Add>
  );

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
    this.props.mergeData({
      department: e.target.value,
      filter: {
        organizationUnit: e.target.value,
      },
    });
  };

  handleChangeDate = value => {
    if (new Date(this.props.addMeetingSchedule.startDate1) > new Date(value)) {
      this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu', variant: 'warning' });
      return;
    }
    this.props.mergeData({
      startDate2: value,
      filter: {
        startDate: { $gte: new Date(this.props.addMeetingSchedule.startDate1).toISOString(), $lte: new Date(value).toISOString() },
      },
    });
  };

  handleEmployees = value => {
    this.props.mergeData({
      employee: value,
      filter: {
        $or: [
          { createdBy: value._id ? value._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: value._id ? value._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: value._id ? value._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: value._id ? value._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: value._id ? value._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
    });
  };

  handleChangeInputFile = e => {
    this.props.mergeData({ file: e.target.files[0] });
  };

  callbackTask = () => {
    const { addMeetingSchedule } = this.props;
    this.props.mergeData({ openDrawer: false, reload: addMeetingSchedule.reload + 1 });
  };

  onGoBack = () => {
    if (this.props.handleCloseAddItemCalendar) {
      return this.props.handleCloseAddItemCalendar()
    }
    if (this.props.history) {
      this.props.history.goBack();
    } else if (this.props.callback) this.props.callback();
  };

  onSaveData = () => {
    this.setState({ disableAdd: true });
    setTimeout(() => {
      this.setState({ disableAdd: false });
    }, 3000);
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { addMeetingSchedule } = this.props;

    // if (addMeetingSchedule.approved === null || addMeetingSchedule.people === null || addMeetingSchedule.organizer === null) return;
    const createdBy = {
      name: this.props.profile.name,
      employeeId: this.props.profile._id,
    };

    const organizer = {
      name: addMeetingSchedule && addMeetingSchedule.organizer && addMeetingSchedule.organizer.name,
      employeeId: addMeetingSchedule && addMeetingSchedule.organizer && addMeetingSchedule.organizer._id,
    };

    if (new Date(addMeetingSchedule.timeStart) >= new Date(addMeetingSchedule.timeEnd)) {
      this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu', variant: 'warning' });
      return;
    }
    const data = {
      typeCalendar: addMeetingSchedule.typeCalendar,
      name: addMeetingSchedule.name,
      code: addMeetingSchedule.code,
      date: addMeetingSchedule.date,
      timeStart: addMeetingSchedule.timeStart,
      timeEnd: addMeetingSchedule.timeEnd,
      address:
        addMeetingSchedule.roomMetting !== null && addMeetingSchedule.roomMetting.address
          ? addMeetingSchedule.roomMetting.address
          : addMeetingSchedule.address,
      prepareMeeting: addMeetingSchedule.prepareMeeting,
      organizer,
      customers: Array.isArray(addMeetingSchedule.customers) ? addMeetingSchedule.customers.map(i => ({ customerId: i._id, name: i.name })) : [],
      people: Array.isArray(addMeetingSchedule.people) ? addMeetingSchedule.people.map(i => ({ name: i.name, employeeId: i._id })) : [],
      prepare: addMeetingSchedule.prepare,
      file: addMeetingSchedule.file,
      content: addMeetingSchedule.content,
      createdBy,
      from: addMeetingSchedule.from === null ? '5e0464fd09ea5f2a2c249306' : addMeetingSchedule.from,
      link: addMeetingSchedule.link,
      linkMeeting: addMeetingSchedule.linkMeeting,
      isOnlineMeeting: addMeetingSchedule.isOnlineMeeting,
      task: addMeetingSchedule.task,
      roomMetting: addMeetingSchedule.roomMetting,
      kanbanStatus: this.props.kanbanStatus ? this.props.kanbanStatus : addMeetingSchedule.kanbanStatus,
      documentary: this.props.documentary ? this.props.documentary : null,
      callback: this.props.callback,
    };

    const { moduleCode } = this.state;
    const messages = viewConfigCheckForm(moduleCode, dot.dot(data));
    if (Object.keys(messages).length === 0) {
      if (id === 'add') this.props.postData(data, this.handleGetErr);
      else this.props.putData(data, id, this.handleGetErr);
    } else {
      this.props.onChangeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' });
    }
  };
  handleGetErr = (err) => {
    if (err && Array.isArray(err) && err.length === 2) {
      const key = err[1]
      this.setState({ localMessages: { ...this.state.localMessages, [key]: err[0] } })
    }
  }
  mapFunctionTaskRevenue = (item, index) => {
    const roleCode = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === 'Task');
    const roleModule = roleCode ? roleCode.methods : [];
    console.log(item, 'item');
    return {
      ...item,
      name:
        (roleModule.find(elm => elm.name === 'PUT') || { allow: false }).allow === true ? (
          <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.props.mergeData({ openDrawer: true, idTask: item._id })}>
            {item.name}
          </button>
        ) : (
          // eslint-disable-next-line no-alert
          <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => alert('Bạn không có quyền cho chức năng này')}>
            {item.name}
          </button>
        ),
      index: index + 1,
      taskStatus: taskStatusArr[item.taskStatus - 1],
      customer: item['customer.name'],
      createdBy: item['createdBy.name'],
      startDate: item.startDate ? moment(item.startDate).format("DD/MM/YYYY") : "",
      endDate: item.endDate ? moment(item.endDate).format("DD/MM/YYYY") : "",
      createdAt: item.createdAt ? moment(item.createdAt).format("DD/MM/YYYY") : "",
      progress: (
        <Process
          value={item.progress}
          progress={item.progress}
          color={this.colorProgress(item)}
          time={this.ProcessTask(item)}
          color2={this.color2Progress(item)}
        />
      ),
      avatar: <Avatar src={`${this.props && this.props.data && this.props.data.avatar}?allowDefault=true`} />,
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
      type: item.type === 1 ? 'Nhóm bảo mật' : item.type === 4 ? 'Nhóm công khai' : item.type === 2 ? 'Nhóm ẩn' : 'Nhóm mở rộng',
      taskType: item.taskType === 1 ? 'Công việc' : item.taskType === 2 ? 'Công việc không doanh thu' : 'Công việc cá nhân',
      template: item.templateName,
    };
  };

  ProcessTask(item) {
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
      // eslint-disable-next-line no-lonely-if
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

  colorProgress(item) {
    let color;
    if (item.finishDate) {
      color = new Date(item.finishDate) > new Date(item.endDate) ? '#fa0522' : '#009900';
    } else {
      color = new Date(item.endDate) >= new Date() ? '#056ffa' : '#f00707';
    }

    return color;
  }

  color2Progress(item) {
    let color2;
    if (item.finishDate) {
      color2 = new Date(item.finishDate) > new Date(item.endDate) ? '#f28100' : '#009900';
    } else {
      color2 = new Date(item.endDate) >= new Date() ? '#05c9fa' : '#6e1305';
    }

    return color2;
  }

  onAddFunctionClick = e => {
    this.setState({ openSelectDocumentType: e.target });
  };

  mapFunction = item => {
    const { crmSource } = this.state;
    const typeDocumentArr = crmSource.find(elm => elm.code === 'S19').data;
    const urgencyArr = crmSource.find(elm => elm.code === 'S20').data;
    const whereArr = crmSource.find(elm => elm.code === 'S23').data;
    const storageArr = crmSource.find(elm => elm.code === 'S22').data;
    const densityArr = crmSource.find(elm => elm.code === 'S21').data;

    return {
      ...item,
      task: item['task.name'],
      receiverSign: item['receiverSign.name'],
      viewer: item['viewerName'],
      replyDispatch: item['replyDispatch.name'],
      type: item.type === '2' ? 'Công văn đến' : 'Công văn đi',
      typeDocument: typeDocumentArr.find(elm => elm.value === item.typeDocument)
        ? typeDocumentArr.find(elm => elm.value === item.typeDocument).title
        : item.typeDocument,
      urgency: urgencyArr.find(elm => elm.value === item.urgency) ? urgencyArr.find(elm => elm.value === item.urgency).title : item.urgency,
      where: whereArr.find(elm => elm.value === item.where) ? whereArr.find(elm => elm.value === item.where).title : item.where,
      storage: storageArr.find(elm => elm.value === item.storage) ? storageArr.find(elm => elm.value === item.storage).title : item.storage,
      density: densityArr.find(elm => elm.value === item.density) ? densityArr.find(elm => elm.value === item.density).title : item.density,
    };
  };

  render() {
    const { addMeetingSchedule, intl, miniActive } = this.props;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { names, checkRequired, checkShowForm, localMessages } = this.state;
    return (
      <div>
        <CustomAppBar
          title={
            id === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới lịch họp' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật lịch họp' })}`
          }
          onGoBack={this.onGoBack}
          onSubmit={this.onSaveData}
          disableAdd={this.state.disableAdd}
        />
        <Paper>
          {id === 'add' ? null : (
            <div>
              <Tabs value={addMeetingSchedule.tab} onChange={(e, tab) => this.props.mergeData({ tab })}>
                <Tab value={0} label="Chi tiết" />
                <Tab value={1} label="Công việc" />
                <Tab value={2} label="Công văn" />
              </Tabs>
            </div>
          )}
          {addMeetingSchedule.tab === 0 ? (
            <div>
              <div style={{ marginTop: '64px' }}>
                <KanbanStep
                  handleStepper={this.handleChangeKanban}
                  kanbanStatus={addMeetingSchedule.kanbanStatus}
                  code="ST15"
                  apiUrl={API_MEETING}
                  Id={id}
                />
              </div>
              {/* <Typography variant="h6" align="center">
                {id === 'add' ? ' Thêm mới lịch họp' : 'Họp giao ban đầu tuần'}
              </Typography> */}
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <GridUI container spacing={16}>
                  {/* <DateTimePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY HH:mm"
                    error={!addMeetingSchedule.date}
                    helperText={addMeetingSchedule.date ? null : 'Không được bỏ trống'}
                    label={names.date}
                    value={addMeetingSchedule.date}
                    name="date"
                    margin="dense"
                    variant="outlined"
                    onChange={value => this.props.mergeData({ date: value })}
                    fullWidth
                    keyboard
                    style={{ padding: 15 }}
                  /> */}
                  <GridUI item xs={6}>
                    <DateTimePicker
                      fullWidth
                      format="DD/MM/YYYY HH:mm"
                      variant="outlined"
                      keyboard
                      className="picker"
                      label={names.timeStart}
                      value={addMeetingSchedule.timeStart}
                      onChange={value => this.props.mergeData({ timeStart: value })}
                      error={localMessages && localMessages.timeStart}
                      helperText={localMessages && localMessages.timeStart}
                      required={checkRequired.timeStart}
                      // checkedShowForm={checkShowForm.timeStart}
                      keyboardIcon={<i className="far fa-clock fa-xs" />}
                      // style={{ padding: 15 }}
                      margin="dense"
                    />
                  </GridUI>
                  <GridUI item xs={6}>
                    <DateTimePicker
                      fullWidth
                      format="DD/MM/YYYY HH:mm"
                      variant="outlined"
                      keyboard
                      className="picker "
                      label={names.timeEnd}
                      value={addMeetingSchedule.timeEnd}
                      onChange={value => this.props.mergeData({ timeEnd: value })}
                      error={localMessages && localMessages.timeEnd}
                      helperText={localMessages && localMessages.timeEnd}
                      required={checkRequired.timeEnd}
                      // checkedShowForm={checkShowForm.timeEnd}
                      keyboardIcon={<i className="far fa-clock fa-xs" />}
                      margin="dense"
                    />
                  </GridUI>
                </GridUI>
              </MuiPickersUtilsProvider>
              <GridUI container spacing={16}>
                <GridUI item md={6}>

                  <CustomInputBase
                    label={names.name}
                    value={addMeetingSchedule.name}
                    name="name"
                    onChange={e => this.props.mergeData({ name: e.target.value })}
                    error={localMessages && localMessages.name}
                    helperText={localMessages && localMessages.name}
                    required={checkRequired.name}
                    checkedShowForm={checkShowForm.name}
                  />
                  <AsyncAutocomplete
                    name="Chọn..."
                    label={names.roomMetting}
                    onChange={value => this.props.mergeData({ roomMetting: value })}
                    url={`${API_MEETING}/room`}
                    value={addMeetingSchedule.roomMetting}
                    error={localMessages && localMessages.roomMetting}
                    helperText={localMessages && localMessages.roomMetting}
                    required={checkRequired.roomMetting}
                    checkedShowForm={checkShowForm.roomMetting}
                  />
                  <CustomInputBase
                    label={names.address}
                    value={
                      id === 'add' && addMeetingSchedule.roomMetting !== null ? addMeetingSchedule && addMeetingSchedule.roomMetting && addMeetingSchedule.roomMetting.address : addMeetingSchedule.address
                    }
                    name="address"
                    onChange={e => this.props.mergeData({ address: e.target.value })}
                    disabled={addMeetingSchedule.roomMetting !== null}
                  // error={localMessages && localMessages.address}
                  // helperText={localMessages && localMessages.address}
                  // required={checkRequired.address}
                  // checkedShowForm={checkShowForm.address}
                  />
                  <AsyncAutocomplete
                    name="Chọn..."
                    label={names.prepare}
                    onChange={value => this.props.mergeData({ prepare: value })}
                    url={`${API_USERS}`}
                    value={addMeetingSchedule.prepare}
                    isMulti
                    error={localMessages && localMessages.prepare}
                    helperText={localMessages && localMessages.prepare}
                    required={checkRequired.prepare}
                    checkedShowForm={checkShowForm.prepare}
                  />
                  <CustomInputBase
                    label={names.prepareMeeting}
                    value={addMeetingSchedule.prepareMeeting}
                    name="prepareMeeting"
                    onChange={e => this.props.mergeData({ prepareMeeting: e.target.value })}
                    error={localMessages && localMessages.prepareMeeting}
                    helperText={localMessages && localMessages.prepareMeeting}
                    required={checkRequired.prepareMeeting}
                    checkedShowForm={checkShowForm.prepareMeeting}
                  />
                </GridUI>
                <GridUI item md={6}>
                  <AsyncAutocomplete
                    name="Chọn..."
                    label={names.task}
                    onChange={value => {
                      const newData = { task: value };
                      if (value && value.customer && value.customer._id) {
                        newData.customers = [value.customer];
                      }
                      this.props.mergeData(newData);
                    }}
                    url={`${API_TASK_PROJECT}`}
                    value={addMeetingSchedule.task}
                    filter={{ isProject: true }}
                    error={localMessages && localMessages.task}
                    helperText={localMessages && localMessages.task}
                    required={checkRequired.task}
                    checkedShowForm={checkShowForm.task}
                  />
                  <AsyncAutocomplete
                    label={names.customers}
                    isMulti
                    onChange={value => this.props.mergeData({ customers: value })}
                    url={`${API_CUSTOMERS}`}
                    value={addMeetingSchedule.customers}
                    error={localMessages && localMessages.customers}
                    helperText={localMessages && localMessages.customers}
                    required={checkRequired.customers}
                    checkedShowForm={checkShowForm.customers}
                  />
                  <CustomInputBase
                    label="Mã cuộc họp"
                    value={addMeetingSchedule.code}
                    name="code"
                    onChange={e => this.props.mergeData({ code: e.target.value, linkMeeting: `${URL_MEETTING}/${e.target.value}` })}
                    error={localMessages && localMessages.code}
                    helperText={localMessages && localMessages.code}
                    required={checkRequired.code}
                    checkedShowForm={checkShowForm.code}
                  />
                  <AsyncAutocomplete
                    name="Chọn..."
                    label={names.people}
                    onChange={value => this.props.mergeData({ people: value })}
                    url={`${API_USERS}`}
                    value={addMeetingSchedule.people}
                    isMulti
                    error={localMessages && localMessages.people}
                    helperText={localMessages && localMessages.people}
                    required={checkRequired.people}
                    checkedShowForm={checkShowForm.people}
                  />
                  <AsyncAutocomplete
                    name="Chọn..."
                    label={names['organizer.name'] ? names['organizer.name'] : 'Người tổ chức'}
                    onChange={value => this.props.mergeData({ organizer: value })}
                    url={`${API_USERS}`}
                    value={addMeetingSchedule.organizer}
                    error={localMessages && localMessages['organizer.name']}
                    helperText={localMessages && localMessages['organizer.name']}
                    required={checkRequired['organizer.name']}
                    checkedShowForm={checkShowForm['organizer.name']}
                  />
                </GridUI>
              </GridUI>
              <Grid container>
                <Grid item xs={2}>
                  <FormGroup style={{ marginTop: 15, justifyContent: "center" }} row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          style={{ marginRight: 2 }}
                          onChange={(e) => this.props.mergeData({ isOnlineMeeting: e.target.checked })}
                          checked={addMeetingSchedule.isOnlineMeeting}
                          color="primary"
                        />
                      }
                      label="Họp trực tuyến"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={10}>
                  <CustomInputBase
                    label="Đường dẫn phòng họp online"
                    value={(addMeetingSchedule && addMeetingSchedule.isOnlineMeeting) ? addMeetingSchedule.linkMeeting : ' '}
                    name="linkMeeting"
                    disabled
                    // onChange={e => this.props.mergeData({ linkMeeting: e.target.value })}
                    error={localMessages && localMessages.linkMeeting}
                    helperText={localMessages && localMessages.linkMeeting}
                    required={checkRequired.linkMeeting}
                    checkedShowForm={checkShowForm.linkMeeting}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => {
                            if (addMeetingSchedule && addMeetingSchedule.isOnlineMeeting) {
                              navigator.clipboard.writeText(addMeetingSchedule.linkMeeting);
                              this.setState({ checkCopy: true })
                            }
                          }
                          } >
                            <Tooltip title={!this.state.checkCopy ? "Sao chép" : "Đã sao chép"} >
                              <FileCopy />
                            </Tooltip>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item sm={12}>
                <FileUpload name={addMeetingSchedule.name} id={id} code="Calendar" reload={this.state.reload} profile={this.props.profile} />
                <TextField
                  multiline
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  name={addMeetingSchedule.name}
                  id={id}
                  code="Calendar"
                  rows={4}
                  showRecorder
                  setReload={() => {
                    this.setState({ reload: (this.state.reload || 0) + 1 });
                  }}
                  label={names.content}
                  value={addMeetingSchedule.content}
                  onChange={e => this.props.mergeData({ content: e.target.value })}
                  error={localMessages && localMessages.content}
                  helperText={localMessages && localMessages.content}
                  required={checkRequired.content}
                  checkedShowForm={checkShowForm.content}
                />
              </Grid>{' '}
            </div>
          ) : null}
          {addMeetingSchedule.tab === 1 ? (
            <div>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <CustomInputBase
                    value={addMeetingSchedule.department}
                    onChange={this.handleDepartment}
                    label="Phòng ban"
                    select
                    error={localMessages && localMessages.department}
                    helperText={localMessages && localMessages.department}
                    required={checkRequired.department}
                    checkedShowForm={checkShowForm.department}
                  >
                    {this.mapItem(this.findChildren(addMeetingSchedule.departments))}
                  </CustomInputBase>
                  <div style={{ width: '20%' }}>
                    <AsyncAutocomplete
                      label="Nhân viên"
                      onChange={value => this.handleEmployees(value)}
                      url={API_USERS}
                      value={addMeetingSchedule.employee}
                      error={localMessages && localMessages.employee}
                      helperText={localMessages && localMessages.employee}
                      required={checkRequired.employee}
                      checkedShowForm={checkShowForm.employee}
                    />
                  </div>

                  <DateTimePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY HH:mm"
                    label="Từ Ngày"
                    value={addMeetingSchedule.startDate1}
                    name="startDate1"
                    variant="outlined"
                    margin="dense"
                    onChange={value => this.props.mergeData({ startDate1: value })}
                    error={localMessages && localMessages.startDate1}
                    helperText={localMessages && localMessages.startDate1}
                    required={checkRequired.startDate1}
                    checkedShowForm={checkShowForm.startDate1}
                  />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingFlat color="primary" />
                  </div>

                  <DateTimePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY HH:mm"
                    label="Đến"
                    value={addMeetingSchedule.startDate2}
                    name="startDate2"
                    onChange={value => this.handleChangeDate(value)}
                    error={localMessages && localMessages.startDate2}
                    helperText={localMessages && localMessages.startDate2}
                    required={checkRequired.startDate2}
                  // checkedShowForm={checkShowForm.startDate1}
                  />
                </div>
              </MuiPickersUtilsProvider>
              {console.log(addMeetingSchedule.filter, 'abc')}
              <ListPage
                kanban="ST11"
                reload={addMeetingSchedule.reload}
                disableEdit
                disableAdd
                settingBar={[this.addItemPersonal()]}
                columnExtensions={[{ columnName: 'progress', width: 180 }, { columnName: 'name', width: 200 }]}
                disableConfig
                code="Task"
                tree
                addChildTask
                apiUrl={`${API_TASK_PROJECT}/projects`}
                mapFunction={this.mapFunctionTaskRevenue}
                filter={{
                  // ...addMeetingSchedule.filter,
                  // isProject: "false",
                  mettingSchedule: id,
                  // _id : addMeetingSchedule.task && addMeetingSchedule.task._id
                }}
                mettingScheduleId={id}
              />
            </div>
          ) : null}
          {addMeetingSchedule.tab === 2 ? (
            <div>
              <ListPage
                addFunction={this.onAddFunctionClick}
                mapFunction={this.mapFunction}
                code="Documentary"
                apiUrl={API_DISPATCH}
                kanban="ST14"
                customUrl={item => (item.type === '2' ? `${getHost()}/Documentary/inComingDocument` : `${getHost()}/Documentary/outGoingDocument`)}
                filter={{
                  mettingSchedule: id,
                }}
                mettingScheduleId={id}
              />
            </div>
          ) : null}
          {/* <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 15 }}>
            <Button variant="contained" color="primary" style={{ width: 100, marginRight: 20 }} onClick={this.onSaveData}>
              Lưu
            </Button>
            <Button variant="contained" color="secondary" style={{ width: 100 }} onClick={this.onGoBack}>
              Hủy
            </Button>
          </div> */}
        </Paper>
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.props.mergeData({ openDrawer: false, idTask: 'add' })}
          open={addMeetingSchedule.openDrawer}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <div>
            <AddProjects mettingSchedule={id} data={{ isProject: false }} id={addMeetingSchedule.idTask} callback={this.callbackTask} />
          </div>
        </SwipeableDrawer>
        <Menu
          id="simple-menu"
          anchorEl={this.state.openSelectDocumentType}
          keepMounted
          open={Boolean(this.state.openSelectDocumentType)}
          onClose={() => this.setState({ openSelectDocumentType: null })}
        >
          <MenuItem>
            <Link style={{ display: 'flex' }} to={`${getHost()}/Documentary/inComingDocument/add`}>
              <ListItemText primary="Công văn đến" />
            </Link>
          </MenuItem>
          <MenuItem>
            <Link style={{ display: 'flex' }} to={`${getHost()}/Documentary/outGoingDocument/add`}>
              <ListItemText primary="Công văn đi" />
            </Link>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

AddMeetingSchedule.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addMeetingSchedule: makeSelectAddMeetingSchedule(),
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    postData: (data, getErr) => dispatch(postData(data, getErr)),
    getCurrent: id => dispatch(getCurrent(id)),
    putData: (data, id, getErr) => dispatch(putData(data, id, getErr)),
    getDefault: () => dispatch(getDefault()),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    getData: () => dispatch(getData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addMeetingSchedule', reducer });
const withSaga = injectSaga({ key: 'addMeetingSchedule', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(AddMeetingSchedule);
