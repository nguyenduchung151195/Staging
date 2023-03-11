/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
/**
 *
 * TimelineEvent
 *
 */

import React from 'react';
import { Divider, TextField, Tab, Tabs, Typography, Chip, Grid, Button, Paper, Dialog, DialogTitle, DialogActions, DialogContent, } from '@material-ui/core';
import { Add, Phone, CommentOutlined, MeetingRoom, CalendarToday, AirportShuttle, Close } from '@material-ui/icons';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import { Timeline, TimelineEvent } from 'react-event-timeline';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import AddTask from 'containers/AddProjects';
import axios from 'axios';
import moment from 'moment';
import { DatePicker, TimePicker } from 'material-ui-pickers';
import AsyncSelect from 'react-select/async';
// import { Loading } from '../../components/LoadingIndicator/Circle';
// import { Loading } from '../components/loadingonents/loading';
import { API_NOTIFY, API_MEETING, API_VISIT } from '../../config/urlConfig';
import { SwipeableDrawer, FileUpload } from '../LifetekUi';
import CallPage from '../../containers/CallPage';
import Email from '../Email';
import { convertDatetimeToDate, convertDatetimeToFullDate } from '../../utils/common';
import { logNames } from '../../variable';
import Meeting from './components/meeting';
import Visit from './components/visit';
/* eslint-disable react/prefer-stateless-function */
import { connect } from 'react-redux';
import { compose } from 'redux';
import { changeSnackbar } from '../../containers/Dashboard/actions';
function TabContainer({ children }) {
  return <Typography style={{ padding: 8 * 3, overflow: 'auto' }}>{children}</Typography>;
}
TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  chip: {
    margin: theme.spacing.unit,
  },
  customTab: {
    minWidth: 0,
    '& span': {
      padding: 2.5,
    },
  },
  titleTimeline: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

class TimelineEventComponent extends React.Component {
  state = {
    value: 0,
    content: '',
    openDrawer: false,
    reminder: {
      date: new Date(),
      content: '',
      title: '',
    },
    meetingDetail: {
      date: new Date(),
      timeStart: new Date(),
      timeEnd: new Date(),
      name: '',
      code: '',
      createdBy: null,
      people: [],
      organizer: null,
      file: undefined,
      content: '',
      result: '',
      address: '',
      from: '',
    },
    visitDetail: undefined,
    loading: false,
    peopleName: '',
    organizer: '',
  };

  componentWillMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const typeLine = urlParams.get('typeLine');
    if (typeLine) {
      this.setState({ value: Number(typeLine) });
    }
  }

  componentDidMount() {
    const timelineData = JSON.parse(localStorage.getItem('timeLineData'));
    if (timelineData) {
      if (timelineData.value === 1) {
        this.handleClickDetailReminder(timelineData.id);
      }
      localStorage.removeItem('timeLineData');
    }
  }

  componentDidUpdate() {
    this.swipeableActions.updateHeight();
  }

  handleChangeInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleCreateLog = () => {
    const { editData, dashboardPage } = this.props;
    const { content } = this.state;
    const objectId = editData._id;
    const employee = {
      employeeId: dashboardPage.profile._id,
      name: dashboardPage.profile.name,
    };
    this.state.content = '';

    this.props.onPostLog({ content, objectId, type: 'message', employee });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  handleChangeSwitch = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleDrawer = () => {
    this.setState({ openDrawer: false });
  };

  handleClickDetailReminder = (reminderId, logId) => {
    const token = localStorage.getItem('token');
    this.setState({ loading: true });
    axios
      .get(`${API_NOTIFY}/${reminderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        this.setState({
          reminder: {
            logId,
            id: response.data._id,
            date: response.data.date,
            content: response.data.content,
            title: response.data.title,
          },
          value: 1,
          loading: false,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleClickDetailMeeting = (meetingId, logId) => {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_MEETING}/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        let valueData = [];
        let data = '';
        let organizer = '';
        response.data.people.map((i) => {
            valueData.push(i.name)
        });
        data=valueData.join(', ');
        organizer=response.data.organizer.name;
        this.setState({
          loading: true,
          meetingDetail: { code: "", ...response.data, logId },
          value: 6,
          peopleName: data,
          organizer: organizer
          // loading: false,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleClickDetailVisit = visitId => {
    const token = localStorage.getItem('token');

    axios
      .get(`${API_VISIT}/${visitId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        this.setState({
          visitDetail: response.data,
          value: 7,
          loading: false,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  backTask = data => {
    this.setState({ openDrawer: false, content: data && data.data && data.data.name });
    const { editData, dashboardPage } = this.props;
    const objectId = editData._id;
    const employee = {
      employeeId: dashboardPage.profile._id,
      name: dashboardPage.profile.name,
    };

    this.props.onPostLog({ content: this.state.content, objectId, type: 'task', employee });
  };

  handleDescription = () => {
    const data = this.props.viewConfig
      .filter(item => item.name.slice(0, 6) === 'others')
      .map(item => ({
        name: item.title,
        value: this.props.data[item.name],
      }))
      .filter(item => item.value !== null && item.value !== undefined);
    return data;
  };
  render() {
    const { classes, boDialog } = this.props;
    const { openDrawer, loading, meetingDetail, visitDetail, value, peopleName, organizer } = this.state;
    const { id } = boDialog;
    const description = this.handleDescription();
    let logs = [];
    if (this.props.isEditting) {
      logs = boDialog.logs || [];
    }

    const renderTimeLine = (item, logName) => {
      if (logName !== undefined && logName.includes(item.type)) {
        switch (item.type) {
          case logNames.MESSAGE:
            return (
              <TimelineEvent
                iconColor="white"
                icon={<CommentOutlined fontSize="small" />}
                bubbleStyle={{ backgroundColor: '#7bc043', borderColor: '#7bc043' }}
                contentStyle={{ borderLeft: '2px solid #63ace5' }}
              >
                <div className={classes.titleTimeline}>
                  <b>Bình luận</b>
                  <b>{item.employee ? item.employee.name : ''}</b>
                </div>
                <div className={classes.titleTimeline}>
                  <span> {item.content}</span>
                  <span>{convertDatetimeToFullDate(item.createdAt)}</span>
                </div>
              </TimelineEvent>
            );
          case logNames.REMINDER: {
            const objectContent = JSON.parse(item.content);
            return (
              <TimelineEvent
                iconColor="white"
                icon={<CalendarToday fontSize="small" />}
                bubbleStyle={{ backgroundColor: '#7bc043', borderColor: '#7bc043' }}
                contentStyle={{ borderLeft: '2px solid #63ace5' }}
              >
                <div className={classes.titleTimeline}>
                  <b>Nhắc lịch</b>
                  <b>{item.employee ? item.employee.name : ''}</b>
                </div>
                <div className={classes.titleTimeline}>
                  <span> {objectContent.content}</span>
                  <span>{convertDatetimeToFullDate(item.createdAt)}</span>
                </div>
                <div>
                  <span
                    style={{ cursor: 'pointer' }}
                    className="text-primary"
                    onClick={() => {
                      this.handleClickDetailReminder(objectContent.reminderId, item._id);
                    }}
                  >
                    <b>Chi tiết</b>
                  </span>
                </div>
              </TimelineEvent>
            );
          }
          case logNames.MEETING: {
            const objectContent = JSON.parse(item.content);
            return (
              <TimelineEvent
                iconColor="white"
                icon={<MeetingRoom fontSize="small" />}
                bubbleStyle={{ backgroundColor: '#7bc043', borderColor: '#7bc043' }}
                contentStyle={{ borderLeft: '2px solid #63ace5' }}
              >
                <div className={classes.titleTimeline}>
                  <b>Lịch họp</b>
                  <b>{item.employee ? item.employee.name : ''}</b>
                </div>
                <div className={classes.titleTimeline}>
                  <span> {objectContent.content}</span>
                  <span>{convertDatetimeToDate(item.createdAt)}</span>
                </div>
                <div>
                  <span
                    style={{ cursor: 'pointer' }}
                    className="text-primary"
                    onClick={() => {
                      // this.setState({ loading: true });
                      this.handleClickDetailMeeting(item.meetingId, item._id);
                    }}
                  >
                    <b>Chi tiết</b>
                  </span>
                </div>
              </TimelineEvent>
            );
          }
          case logNames.VISIT: {
            const objectContent = JSON.parse(item.content);
            return (
              <TimelineEvent
                iconColor="white"
                icon={<AirportShuttle fontSize="small" />}
                bubbleStyle={{ backgroundColor: '#7bc043', borderColor: '#7bc043' }}
                contentStyle={{ borderLeft: '2px solid #63ace5' }}
              >
                <div className={classes.titleTimeline}>
                  <b>Thăm doanh nghiệp</b>
                  <b>{item.employee ? item.employee.name : ''}</b>
                </div>
                <div className={classes.titleTimeline}>
                  <span> {objectContent.content}</span>
                  <span>{convertDatetimeToDate(item.createdAt)}</span>
                </div>
                <div>
                  <span
                    style={{ cursor: 'pointer' }}
                    className="text-primary"
                    onClick={() => {
                      this.setState({ loading: true });
                      this.handleClickDetailVisit(objectContent.visitId);
                    }}
                  >
                    <b>Chi tiết</b>
                  </span>
                </div>
              </TimelineEvent>
            );
          }
          case logNames.CALL:
            return (
              <TimelineEvent
                iconColor="white"
                icon={<Phone fontSize="small" />}
                bubbleStyle={{ backgroundColor: '#7bc043', borderColor: '#7bc043', borderLeft: '4px solid blue' }}
                contentStyle={{ borderLeft: '2px solid #63ace5' }}
              >
                <div className={classes.titleTimeline}>
                  <b>Gọi điện</b>
                  <b>{item.employee ? item.employee.name : ''}</b>
                </div>
                <div className={classes.titleTimeline}>
                  <span> {item.content}</span>
                  <span>{convertDatetimeToFullDate(item.createdAt)}</span>
                </div>
              </TimelineEvent>
            );
          case logNames.TASK:
            return (
              <TimelineEvent
                iconColor="white"
                icon={<Phone fontSize="small" />}
                bubbleStyle={{ backgroundColor: '#7bc043', borderColor: '#7bc043', borderLeft: '4px solid blue' }}
                contentStyle={{ borderLeft: '2px solid #63ace5' }}
              >
                <div className={classes.titleTimeline}>
                  <b>Công việc</b>
                  <b>{item.employee ? item.employee.name : ''}</b>
                </div>
                <div className={classes.titleTimeline}>
                  <span>Đã thêm công việc : {item.content}</span>
                  <span>{convertDatetimeToFullDate(item.createdAt)}</span>
                </div>
              </TimelineEvent>
            );

          default:
            return <div />;
        }
      } else {
        return <div />;
      }
    };
    return (
      <div>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Timeline style={{ paddingTop: 0 }}>
            <TimelineEvent
              iconColor="white"
              icon={value === 0 ? <i className="fas fa-comment-alt fa-lg" /> : <i className="fas fa-handshake fa-lg" />}
              bubbleStyle={{ backgroundColor: '#1E90FF', borderColor: '#1E90FF' }}
              contentStyle={{ boxShadow: 'none', backgroundColor: '#F4F6F8' }}
            >
              <Paper style={!this.props.businessOpportunities1 ? { backgroundColor: '#F4F6F8' } : {}}>
                <Tabs
                  variant="scrollable"
                  scrollButtons="auto"
                  value={value}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab className={classes.customTab} label="Bình luận" disabled={!this.props.businessOpportunities1} />
                  <Tab className={classes.customTab} label="Nhắc lịch" disabled={!this.props.businessOpportunities1} />
                  <Tab className={classes.customTab} label="Gọi điện" disabled={!this.props.businessOpportunities1} />
                  <Tab className={classes.customTab} label="SMS" disabled={!this.props.businessOpportunities1} />
                  <Tab className={classes.customTab} label="Email" disabled={!this.props.businessOpportunities1} />
                  <Tab className={classes.customTab} label="Tạo công việc/dự án" disabled={!this.props.businessOpportunities1} />
                  <Tab className={classes.customTab} label="Lịch họp" disabled={!this.props.businessOpportunities1} />
                  <Tab className={classes.customTab} label="Thăm doanh nghiệp" disabled={!this.props.businessOpportunities1} />
                </Tabs>

                <SwipeableViews
                  index={value}
                  onChangeIndex={this.handleChangeIndex}
                  action={actions => {
                    this.swipeableActions = actions;
                  }}
                  width={window.innerWidth - 260}
                >
                  <TabContainer>
                    <TextField
                      label="Bình luận"
                      multiline
                      rows={4}
                      onChange={this.handleChangeInput}
                      value={this.state.content}
                      name="content"
                      variant="outlined"
                      style={{ width: '100%' }}
                      margin="normal"
                    />
                    <Button variant="outlined" color="primary" onClick={this.handleCreateLog}>
                      Gửi
                    </Button>
                  </TabContainer>
                  {value === 1 && (
                    <TabContainer>
                      <Grid container justify="center" alignItems="center">
                        <Grid item sm={6}>
                          <TextField
                            fullWidth
                            id="outlined-name"
                            label="Tiêu đề"
                            required
                            className=""
                            value={this.state.reminder && this.state.reminder.title}
                            onChange={event => {
                              const { reminder } = this.state;
                              reminder.title = event.target.value;
                              this.setState({ reminder });
                            }}
                            margin="normal"
                            variant="outlined"
                            error={!(this.state.reminder && this.state.reminder.title)}
                            helperText={(this.state.reminder && this.state.reminder.title) ? false : "Tiêu đề không được để trống"}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item sm={2} />
                        <Grid item sm={4}>
                          <DateTimePicker
                            disablePast
                            keyboard
                            variant="outlined"
                            disableOpenOnEnter
                            keyboardIcon={<i className="far fa-clock fa-xs" />}
                            label="Thời gian"
                            value={this.state.reminder.date}
                            onChange={event => {
                              const { reminder } = this.state;
                              reminder.date = event;
                              this.setState({ reminder });
                            }}
                            format="MM/DD/YYYY HH:mm"
                          />
                        </Grid>
                        <Grid item sm={12}>
                          <TextField
                            fullWidth
                            id="outlined-name"
                            label="Nội dung"
                            className=""
                            value={this.state.reminder.content}
                            onChange={event => {
                              const { reminder } = this.state;
                              reminder.content = event.target.value;
                              this.setState({ reminder });
                            }}
                            margin="normal"
                            variant="outlined"
                            multiline
                            rows={4}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item sm={12} justify="flex-end">
                          <Button
                            color="primary"
                            variant="outlined"
                            onClick={() => {
                              const body = {
                                ...this.state.reminder,
                                ...{
                                  link: `${this.props.path}/${this.props.generalData._id}`,
                                  to: this.props.dashboardPage.profile._id,
                                  type: 'system',
                                  isRead: false,
                                },
                              };
                              if (!body.title) {
                                return this.props.onChangeSnackbar && this.props.onChangeSnackbar({ status: true, message: 'Vui lòng nhập tiêu đề!', variant: 'error' });
                              }
                              this.props.onCreateReminder(body, this.props.generalData._id);
                              this.setState({
                                reminder: {
                                  date: new Date(),
                                  content: '',
                                  title: '',
                                },
                              });
                            }}
                          >
                            Tạo nhắc lịch
                          </Button>
                        </Grid>
                      </Grid>
                    </TabContainer>
                  )}
                  {value === 2 && (
                    <TabContainer>
                      <CallPage title="Gọi cho khách hàng" {...this.props} customerId={this.props.data['customer.customerId']} />
                    </TabContainer>
                  )}
                  <TabContainer>Bạn chưa thiết lập cấu hình</TabContainer>
                  {value === 4 && (
                    <TabContainer>
                      <Email moduleCode={this.props.moduleCode} />
                    </TabContainer>
                  )}
                  {value === 5 && (
                    <TabContainer>
                      <Button variant="outlined" color="primary" onClick={() => this.setState({ openDrawer: true })}>
                        <Add />
                        {this.props.isTrading === true ? 'Thêm dự án' : 'Thêm công việc'}
                      </Button>
                      <SwipeableDrawer anchor="right" onClose={this.handleDrawer} open={openDrawer} width={window.innerWidth - 260}>
                        <div style={{ width: window.innerWidth - 260 }}>
                          <AddTask
                            data={this.props.isTrading === false ? { isProject: false } : { isProject: true }}
                            id={id}
                            businessOpportunities={this.props.businessOpportunities}
                            exchangingAgreement={this.props.exchangingAgreement}
                            callback={this.backTask}
                            customerBos={this.props.generalData.customer}
                            description={description}
                          />
                        </div>
                      </SwipeableDrawer>
                    </TabContainer>
                  )}
                  {value === 6 && (
                    <TabContainer>
                      <Meeting
                        onChangeSnackbar={this.props.onChangeSnackbar}
                        isEdittingMeeting={this.state.isEdittingMeeting}
                        // meetingDetail={meetingDetail}
                        profile={this.props.profile}
                        handleClear={() => this.handleClear()}
                        {...this.props}
                      />
                    </TabContainer>
                  )}
                  {value === 7 && (
                    <TabContainer>
                      <Visit handleClear={() => this.handleClear()} {...this.props} visitDetail={visitDetail} />
                    </TabContainer>
                  )}
                </SwipeableViews>
              </Paper>
            </TimelineEvent>
          </Timeline>

          {value === 6 && (
            <>
              <div className="dividerContainer ">
                <div className="timelineTitle ">
                  <Chip style={{ background: '#7bc043', color: 'white' }} label="Kế hoạch dự kiến" className={classes.chip} />
                </div>
                <Divider />
              </div>
              <Timeline style={{ paddingTop: 20, paddingBottom: 40 }}>
                {logs.map(item => renderTimeLine(item, [logNames.MEETING, logNames.VISIT]))}
              </Timeline>
            </>
          )}
          {/* <div className="dividerContainer ">
            <div className="timelineTitle ">
              <Chip style={{ background: '#7bc043', color: 'white' }} label="Kế hoạch dự kiến" className={classes.chip} />
            </div>
            <Divider />
          </div>
          <Timeline style={{ paddingTop: 20, paddingBottom: 40 }}>
            {logs.map(item => renderTimeLine(item, [logNames.MEETING, logNames.VISIT]))}
          </Timeline> */}
          <div className="dividerContainer ">
            <div className="timelineTitle ">
              <Chip style={{ background: '#7bc043', color: 'white' }} label="Dòng thời gian" className={classes.chip} />
            </div>
            <Divider />
          </div>
          <Timeline style={{ paddingTop: 20 }}>
            {logs.map(item => renderTimeLine(item, [logNames.VISIT, logNames.CALL, logNames.MESSAGE, logNames.UPDATE, logNames.REMINDER, logNames.TASK]))}
          </Timeline>
        </MuiPickersUtilsProvider>

        <Dialog open={this.state.loading} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
          <DialogTitle id="form-dialog-title">Chi tiết <Close style={{ float: 'right' }} onClick={() => { this.setState({ loading: false }) }} /></DialogTitle>

          <DialogContent>
            <Grid container>
              {/* <Grid item sm={12} className="my-1">
                <TextField
                  fullWidth
                  id="outlined-full-width"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Mã buổi họp"
                  className=""
                  value={meetingDetail.code || ''}
                  // onChange={this.handleChangeInput('code')}
                  disabled
                  margin="normal"
                  variant="outlined"
                />
              </Grid> */}
              <Grid item sm={12} className="my-1">
                <TextField
                  fullWidth
                  id="outlined-full-width"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Tiêu đề buổi họp"
                  className=""
                  value={meetingDetail.name || ''}
                  // onChange={this.handleChangeInput('name')}
                  disabled
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
               <Grid item sm={12} xl={4} className="my-1">
            <DatePicker
              fullWidth
              variant="outlined"
              keyboard
              className="mr-xl-2  my-0"
              margin="normal"
              label="Ngày họp"
              value={meetingDetail.date || ''}
              // onChange={event => {
              //   const { meetingData } = this.state;
              //   meetingData.date = event;
              //   this.setState(meetingData);
              // }}
              disabled
              disablePast
            />
          </Grid>
          <Grid item sm={6} xl={4} className="my-1">
            <TimePicker
              variant="outlined"
              keyboard
              keyboardIcon={<i className="far fa-clock fa-xs" />}
              className="picker mx-xl-2"
              label="Thời gian bắt đầu"
              value={meetingDetail.timeStart}
              // onChange={event => {
              //   const { meetingData } = this.state;
              //   if (meetingData._id) {
              //     meetingData.timeStart = event;
              //     this.setState(meetingData);
              //   } else if ((moment().isBefore(event) && moment().isSame(this.state.meetingData.date, 'day')) || (!moment().isSame(this.state.meetingData.date, 'day'))) {
              //     meetingData.timeStart = event;
              //     this.setState(meetingData);
              //   } else {
              //     this.props.onChangeSnackbar({ status: true, message: 'Thời gian bắt đầu không được nhỏ hơn hiện tại!', variant: 'error' });
              //   }
              // }}
              disabled
              disableOpenOnEnter
              // disablePast
            />
          </Grid>
          <Grid sm={6} xl={4} className="my-1">
            <TimePicker
              variant="outlined"
              keyboard
              className="picker ml-xl-2"
              label="Thời gian kết thúc"
              value={meetingDetail.timeEnd}
              // onChange={event => {
              //   const { meetingData } = this.state;
              //   if (event <= meetingData.timeStart) {
              //     meetingData.timeEnd = meetingData.timeStart;
              //     this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc không được nhỏ hơn bắt đầu!', variant: 'error' });
              //   } else {
              //     meetingData.timeEnd = event;
              //   }
              //   this.setState(meetingData);
              // }}
              disabled
              disableOpenOnEnter
              // disablePast
              keyboardIcon={<i className="far fa-clock fa-xs" />}
            />
          </Grid>
              <Grid item sm={12} className="my-1 ">
                <TextField
                  fullWidth
                  id="outlined-full-width"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Địa điểm"
                  className=""
                  value={meetingDetail.address || ''}
                  // onChange={this.handleChangeInput('address')}
                  disabled
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
                  {/* <Grid sm="12" className="my-2">
                <AsyncSelect
                  onChange={selectedOption => {
                    this.handleChangeSelect(selectedOption, 'createdBy');
                  }}
                  placeholder="Người tạo"
                  styles={customStyles}
                  defaultOptions
                  value={meetingData.createdBy}
                  loadOptions={(inputValue, callback) => {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                      promiseOptions(inputValue, callback);
                    }, 1000);
                  }}
                  theme={theme => ({
                    ...theme,
                    spacing: {
                      ...theme.spacing,
                      controlHeight: '55px',
                    },
                  })}
                />
              </Grid> */}
              <Grid sm="12" className="my-2">
              <TextField
                  fullWidth
                  id="outlined-full-width"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Người tổ chức"
                  className=""
                  value={organizer || ''}
                  // onChange={this.handleChangeInput('name')}
                  disabled
                  margin="normal"
                  variant="outlined"
                />
                {/* <AsyncSelect
                  className="my-react-select"
                  // styles={customStyles}
                  // onChange={selectedOption => {
                  //   this.handleChangeSelect(selectedOption, 'organizer');
                  // }}
                  placeholder="Người tổ chức"
                  defaultOptions
                  disabled
                  value={meetingDetail.organizer}
                  // loadOptions={(inputValue, callback) => {
                  //   clearTimeout(this.organizer);
                  //   this.organizer = setTimeout(() => {
                  //     promiseOptions(inputValue, callback);
                  //   }, 1000);
                  // }}
                  theme={theme => ({
                    ...theme,
                    spacing: {
                      ...theme.spacing,
                      controlHeight: '55px',
                    },
                  })}
                /> */}
              </Grid>
              <Grid sm="12" className="my-2">
              <TextField
                  fullWidth
                  id="outlined-full-width"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Người tham gia"
                  className=""
                  value={peopleName || ''}
                  // onChange={this.handleChangeInput('name')}
                  disabled
                  margin="normal"
                  variant="outlined"
                />
                {/* <AsyncSelect
                  // onChange={selectedOption => {
                  //   this.handleChangeSelect(selectedOption, 'people');
                  // }}
                  placeholder="Người tham gia"
                  // styles={customStyles}
                  defaultOptions
                  value={meetingDetail.people}
                  isMulti
                  disabled
                  loadOptions={(inputValue, callback) => {
                    clearTimeout(this.people);
                    this.people = setTimeout(() => {
                      promiseOptions(inputValue, callback);
                    }, 1000);
                  }}
                  theme={theme => ({
                    ...theme,
                    spacing: {
                      ...theme.spacing,
                      controlHeight: '55px',
                    },
                  })}
                /> */}
              </Grid>

              <Grid item sm={12} className="my-1 ">
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  id="outlined-full-width"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Nội dung"
                  className=""
                  value={meetingDetail.content || ''}
                  // onChange={this.handleChangeInput('content')}
                  disabled
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item sm={12} className="my-1 ">
                <TextField
                  fullWidth
                  multiline
                  id="outlined-full-width"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Kết quả"
                  className=""
                  value={meetingDetail.result || ''}
                  // onChange={this.handleChangeInput('result')}
                  disabled
                  margin="normal"
                  variant="outlined"
                  rows={4}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {/* <Button
              variant="outlined"
              color="primary"
              className="border-primary text-primary"
              onClick={() => {
                this.submitBtn.current.click();
              }}
            >
              LƯU
            </Button>
            <Button onClick={this.handleCancelAddNewField} color="secondary" variant="outlined" className="border-danger text-danger">
              Hủy
            </Button> */}
          </DialogActions>
        </Dialog>

      </div>
    );
  }

  handleClear = () => {
    this.setState({
      meetingDetail: {
        date: new Date(),
        timeStart: new Date(),
        timeEnd: new Date(),
        name: '',
        code: '',
        createdBy: null,
        people: [],
        organizer: null,
        file: undefined,
        content: '',
        result: '',
        address: '',
        from: '',
      }, visitDetail: undefined
    });
  };
}

TimelineEvent.propTypes = {
  //   classes: PropTypes.object.isRequired,
};

// export default withStyles(styles, { withTheme: true })(TimelineEventComponent);


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);


export default compose(
  withConnect,
  withStyles(styles, { withTheme: true }),
)(TimelineEventComponent);
