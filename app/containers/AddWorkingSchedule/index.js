/**
 *
 * AddWorkingSchedule
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Input, IconButton, InputAdornment, Button, Tabs, Tab, MenuItem, AppBar, Toolbar, Menu, ListItemText, Avatar} from '@material-ui/core';
import { GpsFixed, TrendingFlat, Add, Close } from '@material-ui/icons';
import ReactGoogleMap from 'react-google-map';
import ReactGoogleMapLoader from 'react-google-maps-loader';
import ReactGooglePlacesSuggest from 'react-google-places-suggest';
import ListPage from 'components/List/ListTask';
import axios from 'axios';
import AddProjects from 'containers/AddProjects';
import { injectIntl } from 'react-intl';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import injectSaga from 'utils/injectSaga';
import { Link } from 'react-router-dom';
import injectReducer from 'utils/injectReducer';
import makeSelectDashboardPage, { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import locationIcon from '../../images/location.png';
import { getHost } from 'utils/common';
import { API_KEY, API_USERS, API_CUSTOMERS, API_TASK_PROJECT, API_DISPATCH } from '../../config/urlConfig';
import makeSelectAddWorkingSchedule from './selectors';
import { Typography, Paper, TextField, Grid, AsyncAutocomplete, KanbanStep, SwipeableDrawer, FileUpload } from '../../components/LifetekUi';
import { mergeData, postData, getCurrent, getDefault, putData, getData } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import './style.css';
import CustomAppBar from 'components/CustomAppBar';
import { taskStatusArr } from 'variable';
import moment from 'moment';

/* eslint-disable react/prefer-stateless-function */
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
export class AddWorkingSchedule extends React.Component {
  constructor(props) {
    super(props);
    const dispatchColumns = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'Calendar').listDisplay.type.fields.type
      .columns;
    const names = {};
    dispatchColumns.forEach(item => {
      names[item.name] = item.title;
    });
    const crmSource = JSON.parse(localStorage.getItem('crmSource'));
    this.state = {
      names,
      crmSource,
      openSelectDocumentType: null,
      disableAdd: false,
    };
  }

  componentDidMount() {
    this.props.getData();
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    if (id === 'add') {
      this.props.getDefault();
      this.props.mergeData({
        code: `LCT-${new Date() * 1}`,
      });
    } else {
      this.props.getCurrent(id);
      this.props.mergeData({
        employee: null,
        department: '',
        timeStart: new Date(),
        timeEnd: new Date(),
        filter: {
          isProject: false,
          mettingSchedule: id,
        },
      });
    }
  }

  handleChangeKanban = item => {
    this.props.mergeData({ kanbanStatus: item.type });
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
    this.props.mergeData({
      department: e.target.value,
      filter: {
        organizationUnit: e.target.value,
      },
    });
  };

  mapFunctionTaskRevenue = (item, index) => {
    const roleCode = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === 'Task');
    const roleModule = roleCode ? roleCode.methods : [];
    console.log(item, 'item');
    return {
      ...item,
      name:
        (roleModule.find(elm => elm.name === 'PUT') || { allow: false }).allow === true ? (
          // eslint-disable-next-line react/button-has-type
          <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.props.mergeData({ openDrawer: true, idTask: item._id })}>
            {item.name}
          </button>
        ) : (
          // eslint-disable-next-line react/button-has-type
          <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => alert('Bạn không có quyền cho chức năng này')}>
            {item.name}
          </button>
        ),
      index: index + 1,
      taskStatus: taskStatusArr[item.taskStatus - 1],
      customer: item['customer.name'],
      createdBy: item['createdBy.name'],
      startDate: item.startDate ? moment(item.startDate).format('DD/MM/YYYY') : '',
      endDate: item.endDate ? moment(item.endDate).format('DD/MM/YYYY') : '',
      createdAt: item.createdAt ? moment(item.createdAt).format('DD/MM/YYYY') : '',
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
  handleEditClick = item => {
    const { history } = this.props;
    if (item.type === '2') {
      history.push(`${getHost()}/Documentary/inComingDocument/${item._id}`);
    } else {
      history.push(`${getHost()}/Documentary/outGoingDocument/${item._id}`);
    }
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

  handleClose = () => {
    if (this.props.history) {
      this.props.history.goBack();
    } else if (this.props.callback) {
      this.props.callback();
    }
  };

  render() {
    const { addWorkingSchedule, intl, miniActive } = this.props;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    localStorage.setItem('workingScheduleId', id);
    localStorage.removeItem('mettingScheduleId');
    const { names } = this.state;
    return (
      <div>
        {id === 'add' ? null : (
          <div>
            <Tabs value={addWorkingSchedule.tab} onChange={(e, tab) => this.props.mergeData({ tab })}>
              <Tab value={0} label="Chi tiết" />
              <Tab value={1} label="Công việc" />
              <Tab value={2} label="Công văn" />
            </Tabs>
          </div>
        )}

        <Paper className="Paperdetail">
          <CustomAppBar
            title={
              id === 'add'
                ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'THÊM MỚI lịch công tác' })}`
                : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật lịch công tác' })}`
            }
            onGoBack={this.handleClose}
            onSubmit={this.onSaveData}
            disableAdd={this.state.disableAdd}
          />
          <div>
            <KanbanStep handleStepper={this.handleChangeKanban} kanbanStatus={addWorkingSchedule.kanbanStatus} code="ST16" />
          </div>
          <Typography variant="h6" align="center">
            {id === 'add' ? ' Thêm mới lịch công tác' : 'Lịch công tác'}
          </Typography>
          {addWorkingSchedule.tab === 0 ? (
            <Grid container md={12}>
              <Grid item md={6} style={{ display: 'grid', padding: 15 }}>
                <TextField
                  label={names.name}
                  validators={['required']}
                  errorMessages={['Không được bỏ trống']}
                  required
                  InputLabelProps={{ shrink: true }}
                  value={addWorkingSchedule.name}
                  name="name"
                  onChange={e => this.props.mergeData({ name: e.target.value })}
                  error={!addWorkingSchedule.name}
                  helperText={addWorkingSchedule.name ? null : 'Không được bỏ trống'}
                  fullWidth
                />
                <TextField
                  label={names.code}
                  validators={['required']}
                  required
                  InputLabelProps={{ shrink: true }}
                  value={addWorkingSchedule.code}
                  name="code"
                  fullWidth
                  disabled
                />
                <AsyncAutocomplete
                  name="Chọn..."
                  label={names.customers}
                  onChange={value => this.props.mergeData({ customers: value })}
                  url={`${API_CUSTOMERS}`}
                  value={addWorkingSchedule.customers}
                  isMulti
                  // error={!addWorkingSchedule.people}
                  // helperText={addWorkingSchedule.people ? null : 'Không được bỏ trống'}
                />

                {/* <AsyncAutocomplete
                  name="Chọn..."
                  label={names.customers}
                  onChange={value => this.props.mergeData({ customers: value })}
                  url={`${API_CUSTOMERS}`}
                  value={addWorkingSchedule.customers}
                  isMulti
                // error={!addWorkingSchedule.people}
                // helperText={addWorkingSchedule.people ? null : 'Không được bỏ trống'}
                /> */}
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <div style={{ display: 'flex', marginTop: 20 }}>
                    <DateTimePicker
                      inputVariant="outlined"
                      format="DD/MM/YYYY HH:mm"
                      // error={!addWorkingSchedule.date}
                      // helperText={addWorkingSchedule.date ? null : 'Không được bỏ trống'}
                      label={names.timeStart}
                      value={addWorkingSchedule.timeStart}
                      name="timeStart"
                      margin="dense"
                      variant="outlined"
                      onChange={value => this.props.mergeData({ timeStart: value })}
                      fullWidth
                      // keyboard
                      style={{ paddingRight: 10 }}
                    />
                    <DateTimePicker
                      inputVariant="outlined"
                      format="DD/MM/YYYY HH:mm"
                      // error={!addWorkingSchedule.timeEnd}
                      // helperText={addWorkingSchedule.timeEnd ? null : 'Không được bỏ trống'}
                      label={names.timeEnd}
                      value={addWorkingSchedule.timeEnd}
                      name="timeEnd"
                      margin="dense"
                      variant="outlined"
                      onChange={value => this.props.mergeData({ timeEnd: value })}
                      fullWidth
                      // keyboard
                      style={{ paddingLeft: 10 }}
                    />
                  </div>
                </MuiPickersUtilsProvider>
                {/* <ReactGoogleMapLoader
                  params={{
                    key: API_KEY,
                    libraries: 'places,geocode',
                  }}
                  render={googleMaps =>
                    googleMaps && (
                      <div>
                        <ReactGooglePlacesSuggest
                          autocompletionRequest={{ input: addWorkingSchedule.search }}
                          googleMaps={googleMaps}
                          onSelectSuggest={this.handleSelectSuggest}
                        >
                          <Input
                            placeholder={names.address}
                            type="text"
                            ref={ref => {
                              this.desc = ref;
                            }}
                            style={{ marginTop: 20, marginBottom: 20 }}
                            value={addWorkingSchedule.address}
                            // floatingLabelStyle={styles.label}
                            // floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            onChange={this.handleInputChange}
                            fullWidth
                            endAdornment={
                              <InputAdornment position="end" onClick={this.handleClickCurrentLocation}>
                                <IconButton aria-label="Tìm địa điểm">{addWorkingSchedule.address ? <GpsFixed /> : ''}</IconButton>
                              </InputAdornment>
                            }
                          />
                        </ReactGooglePlacesSuggest>

                        <div style={{ height: '300px' }}>
                          <ReactGoogleMap
                            googleMaps={googleMaps}
                            center={addWorkingSchedule.location}
                            zoom={addWorkingSchedule.zoom}
                            coordinates={[
                              {
                                title: 'Vị trí của bạn',
                                icon: locationIcon,
                                draggable: true,
                                position: addWorkingSchedule.location,
                                // eslint-disable-next-line no-shadow
                                onLoaded: (googleMaps, map, marker) => {
                                  // vòng vị trí
                                  if (Object.entries(addWorkingSchedule.cityCircle).length === 0) {
                                    addWorkingSchedule.cityCircle = new googleMaps.Circle({
                                      strokeColor: '#57aad7',
                                      strokeOpacity: 0.8,
                                      strokeWeight: 1,
                                      fillColor: '#69c0ef',
                                      fillOpacity: 0.35,
                                      map,
                                      center: addWorkingSchedule.location,
                                      radius: 50,
                                    });
                                  } else {
                                    addWorkingSchedule.cityCircle.setMap(map);
                                    addWorkingSchedule.cityCircle.setCenter(addWorkingSchedule.location);
                                  }

                                  // hiển thị market ra giữa map
                                  map.panTo(addWorkingSchedule.location);

                                  // Set Marker animation
                                  // marker.setAnimation(googleMaps.Animation.BOUNCE)

                                  // Define Marker InfoWindow
                                  const infoWindow = new googleMaps.InfoWindow({
                                    content: `
                                  <div>
                                    <h5>${addWorkingSchedule.address}<h5>
                                  </div>
                                `,
                                  });

                                  //  OpenInfoWindow when Marker will be clicked
                                  googleMaps.event.addListener(marker, 'click', () => {
                                    infoWindow.open(map, marker);
                                  });

                                  // Change icon when Marker will be hovered
                                  googleMaps.event.addListener(marker, 'mouseover', () => {
                                    marker.setIcon(locationIcon);
                                  });

                                  googleMaps.event.addListener(marker, 'mouseout', () => {
                                    marker.setIcon(locationIcon);
                                  });

                                  googleMaps.event.addListener(marker, 'dragend', event => {
                                    this.onMarkerDragEnd(event);
                                    if (Object.entries(addWorkingSchedule.cityCircle).length !== 0) {
                                      addWorkingSchedule.cityCircle.setMap(null);
                                    }
                                  });
                                  // Open InfoWindow directly
                                  infoWindow.open(map, marker);
                                },
                              },
                            ]}
                          />
                        </div>
                      </div>
                    )
                  }
                /> */}
              </Grid>
              <Grid item md={6} style={{ padding: 15 }}>
                <AsyncAutocomplete
                  name="Chọn..."
                  label={names.people}
                  onChange={value => this.props.mergeData({ people: value })}
                  url={`${API_USERS}`}
                  value={addWorkingSchedule.people}
                  isMulti
                  error={!addWorkingSchedule.people}
                  helperText={addWorkingSchedule.people ? null : 'Không được bỏ trống'}
                />
                <AsyncAutocomplete
                  name="Chọn..."
                  label={names['organizer.name'] ? names['organizer.name'] : 'Người tổ chức'}
                  onChange={value => this.props.mergeData({ organizer: value })}
                  url={`${API_USERS}`}
                  value={addWorkingSchedule.organizer}
                  // error={!addWorkingSchedule.organizer}
                  // helperText={addWorkingSchedule.organizer ? null : 'Không được bỏ trống'}
                />
                <AsyncAutocomplete
                  name="Chọn..."
                  label={names.approved}
                  onChange={value => this.props.mergeData({ approved: value })}
                  url={`${API_USERS}`}
                  value={addWorkingSchedule.approved}
                  error={!addWorkingSchedule.approved}
                  helperText={addWorkingSchedule.approved ? null : 'Không được bỏ trống'}
                />
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label={names.content}
                  className=""
                  value={addWorkingSchedule.content}
                  onChange={e => this.props.mergeData({ content: e.target.value })}
                  variant="outlined"
                />
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label={names.result}
                  className=""
                  value={addWorkingSchedule.result}
                  onChange={e => this.props.mergeData({ result: e.target.value })}
                  variant="outlined"
                />
              </Grid>

              <FileUpload name={addWorkingSchedule.name} id={id} code="Calendar" />
            </Grid>
          ) : null}
          {addWorkingSchedule.tab === 1 ? (
            <div>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <TextField
                    value={addWorkingSchedule.department}
                    onChange={this.handleDepartment}
                    label="Phòng ban"
                    select
                    style={{ width: '20%', padding: 10 }}
                    InputLabelProps={{ shrink: true }}
                  >
                    {this.mapItem(this.findChildren(addWorkingSchedule.departments))}
                  </TextField>
                  <div style={{ width: '20%', padding: 10 }}>
                    <AsyncAutocomplete
                      value={addWorkingSchedule.employee}
                      label="Nhân viên"
                      onChange={value => this.handleEmployees(value)}
                      url={API_USERS}
                    />
                  </div>

                  <DateTimePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY HH:mm"
                    label="Từ Ngày"
                    value={addWorkingSchedule.startDate1}
                    name="startDate1"
                    error={false}
                    helperText={null}
                    variant="outlined"
                    margin="dense"
                    onChange={value => this.props.mergeData({ startDate1: value })}
                    style={{ padding: 10 }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingFlat color="primary" />
                  </div>

                  <DateTimePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY HH:mm"
                    label="Đến"
                    error={false}
                    helperText={null}
                    value={addWorkingSchedule.startDate2}
                    name="startDate2"
                    margin="dense"
                    variant="outlined"
                    onChange={value => this.handleChangeDate(value)}
                    style={{ padding: 10 }}
                  />
                </div>
              </MuiPickersUtilsProvider>
              <ListPage
                kanban="ST11"
                reload={addWorkingSchedule.reload}
                disableEdit
                disableAdd
                settingBar={[this.addItemPersonal()]}
                columnExtensions={[{ columnName: 'progress', width: 180 }, { columnName: 'name', width: 200 }]}
                disableConfig
                code="Task"
                tree
                addChildTask
                apiUrl={`${API_TASK_PROJECT}/projects`}
                // apiUrl={API_TASK_PROJECT}
                mapFunction={this.mapFunctionTaskRevenue}
                filter={{
                  ...addWorkingSchedule.filter,
                  isProject: 'false',
                  mettingSchedule: id,
                }}
                workingScheduleId={id}
              />
            </div>
          ) : null}
          {addWorkingSchedule.tab === 2 ? (
            <div>
              <ListPage
                addFunction={this.onAddFunctionClick}
                mapFunction={this.mapFunction}
                code="Documentary"
                apiUrl={API_DISPATCH}
                kanban="ST14"
                customUrl={item => (item.type === '2' ? `${getHost()}/Documentary/inComingDocument` : `${getHost()}/Documentary/outGoingDocument`)}
                filter={{
                  workingSchedule: id,
                }}
                onEdit={this.handleEditClick}
                workingScheduleId={id}
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
          open={addWorkingSchedule.openDrawer}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <div>
            <AddProjects mettingSchedule={id} data={{ isProject: false }} id={addWorkingSchedule.idTask} callback={this.callbackTask} />
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

  handleChangeDate = value => {
    if (new Date(this.props.addWorkingSchedule.startDate1) > new Date(value)) {
      this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu', variant: 'warning' });
      return;
    }
    this.props.mergeData({
      startDate2: value,
      filter: {
        startDate: { $gte: new Date(this.props.addWorkingSchedule.startDate1).toISOString(), $lte: new Date(value).toISOString() },
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

  addItemPersonal = () => <Add onClick={() => this.props.mergeData({ openDrawer: true })}>Open Menu</Add>;

  callbackTask = () => {
    const { addWorkingSchedule } = this.props;
    this.props.mergeData({ openDrawer: false, reload: new Date() * 1 });
  };

  handleChangeInputFile = e => {
    this.props.mergeData({ file: e.target.files[0] });
  };

  onGoBack = () => {
    if (this.props.history) {
      this.props.history.goBack();
    } else if (this.props.callback) this.props.callback();
  };

  handleSelectSuggest = suggest => {
    const lat = suggest.geometry.location.lat();
    const lng = suggest.geometry.location.lng();
    this.props.mergeData({ search: '', address: suggest.formatted_address, location: { lat, lng } });
  };

  handleInputChange = e => {
    this.props.mergeData({ search: e.target.value, address: e.target.value });
  };

  handleClickCurrentLocation = () => {
    const { lat, lng } = this.state.location;
    this.getLocationByLatLng(lat, lng, 'default');
  };

  getLocationByLatLng(latitude, longitude, df = false) {
    const self = this;
    let location = null;
    if (window.navigator && window.navigator.geolocation) {
      location = window.navigator.geolocation;
    }
    if (location) {
      location.getCurrentPosition(position => {
        let lat = latitude;
        let lng = longitude;
        if (df === 'default') {
          lat = position.coords.latitude;
          lng = position.coords.longitude;
        }

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAXhItM5DtDeNF7uesxuyhEGd3Wb_5skTg`;
        axios.get(url).then(data => {
          const { results } = data.data;
          if (!!results && !!results.length) {
            /* eslint camelcase: ["error", {ignoreDestructuring: true}] */
            /* eslint-disable */
            const { formatted_address } = results[0];
            self.props.mergeData({
              address: formatted_address,
              location: { lat, lng },
            });
          }
        });
      });
    }
  }

  onMarkerDragEnd = evt => {
    if (window.google) {
      const cityCircle = new google.maps.Circle({
        strokeColor: '#57aad7',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#69c0ef',
        fillOpacity: 0.35,
        // map,
        // center: this.state.location,
        radius: 50,
      });
      this.state.cityCircle = cityCircle;
    }
    this.getLocationByLatLng(evt.latLng.lat(), evt.latLng.lng());
  };

  onSaveData = () => {
    this.setState({ disableAdd: true });
    setTimeout(() => {
      this.setState({ disableAdd: false });
    }, 3000);
    const { addWorkingSchedule } = this.props;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    if (addWorkingSchedule.approved === null || addWorkingSchedule.people === null) return;

    if (new Date(addWorkingSchedule.timeStart) >= new Date(addWorkingSchedule.timeEnd)) {
      this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu', variant: 'warning' });
      return;
    }

    const createdBy = {
      name: this.props.profile.name,
      employeeId: this.props.profile._id,
    };

    const data = {
      typeCalendar: addWorkingSchedule.typeCalendar,
      kanbanStatus: this.props.kanbanStatus ? this.props.kanbanStatus : addWorkingSchedule.kanbanStatus,
      name: addWorkingSchedule.name,
      address: addWorkingSchedule.address,
      timeStart: addWorkingSchedule.timeStart,
      timeEnd: addWorkingSchedule.timeEnd,
      approved: addWorkingSchedule.approved,
      customers: Array.isArray(addWorkingSchedule.customers) ? addWorkingSchedule.customers.map(i => ({ customerId: i._id, name: i.name })) : [],
      people: addWorkingSchedule.people,
      organizer: addWorkingSchedule.organizer,
      content: addWorkingSchedule.content,
      result: addWorkingSchedule.result,
      file: addWorkingSchedule.file,
      from: addWorkingSchedule.from === null ? '5e0464fd09ea5f2a2c249306' : addWorkingSchedule.from,
      link: addWorkingSchedule.link,
      createdBy,
      code: addWorkingSchedule.code || '',
      date: new Date(),
      callback: this.props.callback,
      // task: addWorkingSchedule.task,
    };
    if (Object.keys(messages).length === 0) {
      if (id === 'add') this.props.postData(data);
      else this.props.putData(data, id);
    } else {
      this.props.onChangeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' });
    }
    
  };
}

// AddWorkingSchedule.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  addWorkingSchedule: makeSelectAddWorkingSchedule(),
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    postData: data => dispatch(postData(data)),
    getCurrent: id => dispatch(getCurrent(id)),
    getDefault: () => dispatch(getDefault()),
    putData: (data, id) => dispatch(putData(data, id)),
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

const withReducer = injectReducer({ key: 'addWorkingSchedule', reducer });
const withSaga = injectSaga({ key: 'addWorkingSchedule', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(AddWorkingSchedule);
