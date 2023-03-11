/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * TaskTimes
 *
 */

import React from 'react';
import { compose } from 'redux';
import AddProjects from 'containers/AddProjects';
import Tooltip from '@material-ui/core/Tooltip';
import { injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Typography, Paper, SwipeableDrawer } from '../LifetekUi';
import { connect } from 'react-redux';
import { makeSelectMiniActive } from '../../containers/Dashboard/selectors';
import taskTime from '../../assets/img/taskTime.jpg';
/* eslint-disable react/prefer-stateless-function */
import messages from './messages';
import CustomDatePicker from '../CustomDatePicker';
import moment from 'moment';
import { Grid } from '@material-ui/core';

const Process = props => (
  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'no-wrap', height: 22, width: '100%' }}>
    <div style={{ width: `${props.value}%`, background: `${props.color}`, height: '100%', borderRadius: 5 }}>
      <b style={{ fontSize: 13, marginLeft: '30%' }}>Tiến độ: {props.progress}%</b>
    </div>
    <div style={{ width: `${100 - props.value}%`, height: '100%' }} />
  </div>
);
class TaskTimes extends React.Component {
  state = {
    id: 'add',
    openDrawer: false,
    projectId: null,
    open: false,
    filter: {
      // startDate: new Date(moment().subtract(1, 'months')),
      // endDate: new Date(),
      endDate: moment().format('YYYY-MM-DD'),
      startDate: moment()
        .clone()
        .startOf('month')
        .format('YYYY-MM-DD'),
      key: 'selection',
    },
    errorStartDateEndDate: false,
    errorTextStartDate: '',
    errorTextEndDate: '',
  };

  handleTooltipClose = () => {
    this.setState({ open: false });
  };

  handleTooltipOpen = () => {
    this.setState({ open: true });
  };

  // handleChangeInput = (e, isDate) => {
  //   const name = isDate ? 'startDate' : 'endDate';
  //   const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
  //   this.setState({ [name]: value });
  // };

  handleChangeFilter = (e, isDate) => {
    const name = isDate ? 'startDate' : 'endDate';
    const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    const { filter } = this.state;
    console.log('filter', filter);
    const newFilter = { ...filter, [name]: value };
    // TT
    if (!newFilter.startDate && newFilter.endDate) {
      this.setState(state => ({ ...state, errorStartDateEndDate: true, errorTextStartDate: 'nhập thiếu: "Từ ngày"', errorTextEndDate: '' }));
    } else if (newFilter.startDate && !newFilter.endDate) {
      this.setState(state => ({ ...state, errorStartDateEndDate: true, errorTextStartDate: '', errorTextEndDate: 'nhập thiếu: "Đến ngày"' }));
    } else if (newFilter.startDate && newFilter.endDate && new Date(newFilter.endDate) < new Date(newFilter.startDate)) {
      this.setState(state => ({
        ...state,
        errorStartDateEndDate: true,
        errorTextStartDate: '"Từ ngày" phải nhỏ hơn "Đến ngày"',
        errorTextEndDate: '"Đến ngày" phải lớn hơn "Từ ngày"',
      }));
    } else {
      this.setState(state => ({ ...state, errorStartDateEndDate: false, errorTextStartDate: '', errorTextEndDate: '' }));
    }
    this.setState(state => ({ ...state, filter: { ...newFilter } }));
  };

  render() {
    const { id, openDrawer, projectId, open, filter, errorStartDateEndDate, errorTextStartDate, errorTextEndDate } = this.state;
    const { startDate, endDate } = filter;
    const { intl, miniActive } = this.props;
    return (
      <React.Fragment>
        {/* <Paper
          style={{
            // backgroundImage: `url(${taskTime})`,
            minHeight: '100vh',
            width: '100%',
            height: '100%',
            overflow: 'auto',
            justifyContent: 'center',
            marginLeft: '50px',
          }}
        > */}
        <Grid container spacing={24} style={{ padding: '0 10px' }}>
          <Grid md={3} item>
            <CustomDatePicker
              label="Ngày bắt đầu"
              value={startDate}
              variant="outlined"
              name="note"
              margin="normal"
              onChange={e => this.handleChangeFilter(e, true)}
            />
            {errorStartDateEndDate ? <p style={{ color: 'red' }}>{errorTextStartDate}</p> : null}
          </Grid>
          <Grid md={3} item>
            <CustomDatePicker
              label="Ngày kết thúc"
              value={endDate}
              onChange={e => this.handleChangeFilter(e, false)}
              variant="outlined"
              name="note"
              margin="normal"

              //onChange={this.handleChange('implementationDate')}
              // style={{ width: '100%', zIndex: 0 }}
            />
            {errorStartDateEndDate ? <p style={{ color: 'red', margin: '0px' }}>{errorTextEndDate}</p> : null}
          </Grid>
        </Grid>

        <div style={{ width: '90%', margin: '0px 10px 10px 10px' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
            <div
              style={{
                width: '11%',
                background: 'none',
              }}
            />
            <div
              style={{
                width: '44%',
                borderRadius: '10px',
                padding: ' 10px',
                background: 'linear-gradient(to right, rgba(186, 117, 64, 0.43), rgb(216, 199, 182))',
              }}
            >
              <Typography variant="h6" style={{ color: '#a11818', textAlign: 'center' }}>
                {intl.formatMessage(messages.khancap || { id: 'khancap', defaultMessage: 'khancap' })}
              </Typography>
            </div>
            <div
              style={{
                width: '44.2%',
                padding: '10px',
                borderRadius: '10px',
                background: 'linear-gradient(to left, rgba(186, 117, 64, 0.43), rgb(216, 199, 182))',
              }}
            >
              <Typography variant="h6" style={{ color: '#a11818', textAlign: 'center' }}>
                {intl.formatMessage(messages.khongkhancap || { id: 'khongkhancap', defaultMessage: 'khongkhancap' })}
              </Typography>
            </div>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', marginTop: 3 }}>
            <div
              style={{
                width: '11%',
                borderRadius: '10px',
                padding: '150px 10px',
                background: 'linear-gradient(to right, rgba(186, 117, 64, 0.43), rgb(216, 199, 182))',
              }}
            >
              <Typography variant="h6" style={{ color: '#a11818', textAlign: 'center' }}>
                {intl.formatMessage(messages.quantrong || { id: 'quantrong', defaultMessage: 'quantrong' })}
              </Typography>
            </div>
            <div
              style={{
                width: '44%',
                background: 'linear-gradient(to right, rgba(61, 126, 255, 0.47),rgb(129, 199, 193))',
                borderRadius: '10px',
                padding: '70px 10px',
              }}
            >
              <ol
                className="planner-quote-list"
                style={{
                  fontFamily: 'Arial',
                  minHeight: '16px',
                  margin: 0,
                  boxSizing: ' border-box',
                  mozBoxSizing: ' border-box',
                  webkitBoxSizing: ' border-box',
                  overflow: 'scroll',
                  resize: 'none',
                  outline: 'none',
                  width: 'auto',
                  height: '251px',
                  color: '#000003',
                }}
              >
                {this.props.tasks
                  .filter(elm => elm.priority === 1 || elm.priority === 2)
                  .filter(el => el.taskStatus !== 3)
                  .filter(it => new Date(it.endDate) <= new Date())
                  .filter(it => moment(it.startDate).format('YYYY-MM-DD') >= this.state.filter.startDate)
                  .filter(it => moment(it.endDate).format('YYYY-MM-DD') <= this.state.filter.endDate)
                  .map(item => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    <li
                      className="hover-task"
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.handleDrawer(item._id)}
                      onMouseMove={() => this.handleMouseMove(item._id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <b>{item.name}</b>
                        {projectId === item._id ? (
                          <Tooltip
                            onClose={this.handleTooltipClose}
                            onOpen={this.handleTooltipOpen}
                            open={open}
                            title={`Quá ${((new Date() - new Date(item.endDate)) / 86400000).toFixed()} ngày`}
                            placement="left-start"
                          >
                            <div style={{ color: '#ffffff', width: 250 }}>
                              <Process
                                value={60}
                                color={
                                  item.taskStatus === 1
                                    ? '#007bff'
                                    : item.taskStatus === 2
                                      ? '#009900'
                                      : item.taskStatus === 3
                                        ? '#ff5722'
                                        : '#f44336'
                                }
                                progress={item.progress}
                              />
                            </div>
                          </Tooltip>
                        ) : null}
                      </div>

                      <p style={{ color: '#a11818', fontSize: 13 }}>
                        {projectId === item._id ? (
                          <div>
                            <p style={{ fontSize: 16 }}>{item.projectId ? item.projectId.name : null}</p>
                            <p>
                              {intl.formatMessage(messages.ngaybatdau || { id: 'ngaybatdau', defaultMessage: 'ngaybatdau' })}: {moment(item.startDate).format('DD/MM/YYYY')}
                            </p>
                            <p>
                              {intl.formatMessage(messages.ngayketthuc || { id: 'ngayketthuc', defaultMessage: 'ngayketthuc' })} :{moment(item.endDate).format('DD/MM/YYYY')}
                            </p>
                            <p>{item.join ? item.join.map(it => it.name).join() : null}</p>
                          </div>
                        ) : null}
                      </p>
                    </li>
                  ))}
              </ol>
            </div>

            <div
              style={{
                width: '44.2%',
                background: 'linear-gradient(to left, rgba(61, 126, 255, 0.47),rgb(129, 199, 193) )',
                borderRadius: '10px',
                padding: '70px 10px',
              }}
            >
              <ol
                className="planner-quote-list"
                style={{
                  minHeight: '16px',
                  margin: 0,
                  fontFamily: 'Arial',
                  boxSizing: ' border-box',
                  mozBoxSizing: ' border-box',
                  webkitBoxSizing: ' border-box',
                  overflow: 'scroll',
                  resize: 'none',
                  outline: 'none',
                  width: 'auto',
                  height: '251px',
                  color: '#000003',
                }}
              >
                {this.props.tasks
                  .filter(elm => elm.priority === 1 || elm.priority === 2)
                  .filter(el => el.taskStatus !== 3)
                  .filter(it => new Date(it.endDate) > new Date())
                  .filter(it => moment(it.startDate).format('YYYY-MM-DD') >= this.state.filter.startDate)
                  .filter(it => moment(it.endDate).format('YYYY-MM-DD') <= this.state.filter.endDate)
                  .map(item => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    <li
                      className="hover-task"
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.handleDrawer(item._id)}
                      onMouseMove={() => this.handleMouseMove(item._id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <b>{item.name}</b>
                        {projectId === item._id ? (
                          <Tooltip
                            onClose={this.handleTooltipClose}
                            onOpen={this.handleTooltipOpen}
                            open={open}
                            title={`Còn ${((new Date(item.endDate) - new Date()) / 86400000).toFixed()} ngày`}
                            placement="left-start"
                          >
                            <div style={{ color: '#ffffff', width: 250 }}>
                              <Process
                                value={60}
                                color={
                                  item.taskStatus === 1
                                    ? '#0320ff'
                                    : item.taskStatus === 2
                                      ? '#009900'
                                      : item.taskStatus === 3
                                        ? '#ff5722'
                                        : '#f44336'
                                }
                                progress={item.progress}
                              />
                            </div>
                          </Tooltip>
                        ) : null}
                      </div>
                      <p style={{ color: '#a11818', fontSize: 13 }}>
                        {projectId === item._id ? (
                          <div>
                            <p style={{ fontSize: 16 }}>{item.projectId ? item.projectId.name : null}</p>
                            <p>
                              {intl.formatMessage(messages.ngaybatdau || { id: 'ngaybatdau', defaultMessage: 'ngaybatdau' })}: {moment(item.startDate).format('DD/MM/YYYY')}
                            </p>
                            <p>
                              {intl.formatMessage(messages.ngayketthuc || { id: 'ngayketthuc', defaultMessage: 'ngayketthuc' })}: {moment(item.endDate).format('DD/MM/YYYY')}
                            </p>
                            <p>{item.join ? item.join.map(it => it.name).join() : null}</p>
                          </div>
                        ) : null}
                      </p>
                    </li>
                  ))}
              </ol>
            </div>
          </div>{' '}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', marginTop: 3 }}>
            <div
              style={{
                width: '11%',
                borderRadius: '10px',
                padding: '70px 10px',
                background: 'linear-gradient(to right, rgba(186, 117, 64, 0.43), rgb(216, 199, 182))',
              }}
            >
              <Typography variant="h6" style={{ color: '#a11818', textAlign: 'center' }}>
                {intl.formatMessage(messages.khongquantrong || { id: 'khongquantrong', defaultMessage: 'khongquantrong' })}
              </Typography>
            </div>
            <div
              style={{
                width: '44%',
                background: 'linear-gradient(to right, rgba(61, 126, 255, 0.47),rgb(129, 199, 193) )',
                borderRadius: '10px',
                padding: '70px  10px',
              }}
            >
              <ol
                className="planner-quote-list"
                style={{
                  minHeight: '16px',
                  margin: 0,
                  fontFamily: 'Arial',
                  boxSizing: ' border-box',
                  mozBoxSizing: ' border-box',
                  webkitBoxSizing: ' border-box',
                  overflow: 'scroll',
                  resize: 'none',
                  outline: 'none',
                  width: 'auto',
                  height: '250px',
                  color: '#000003',
                }}
              >
                {this.props.tasks
                  .filter(elm => elm.priority === 3 || elm.priority === 4 || elm.priority === 5)
                  .filter(el => el.taskStatus !== 3)
                  .filter(it => new Date(it.endDate) <= new Date())
                  .filter(it => moment(it.startDate).format('YYYY-MM-DD') >= this.state.filter.startDate)
                  .filter(it => moment(it.endDate).format('YYYY-MM-DD') <= this.state.filter.endDate)
                  .map(item => (
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    <li
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.handleDrawer(item._id)}
                      className="hover-task"
                      onMouseMove={() => this.handleMouseMove(item._id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <b>{item.name}</b>
                        {projectId === item._id ? (
                          <Tooltip
                            onClose={this.handleTooltipClose}
                            onOpen={this.handleTooltipOpen}
                            open={open}
                            title={`Quá ${((new Date() - new Date(item.endDate)) / 86400000).toFixed()} ngày`}
                            placement="left-start"
                          >
                            <div style={{ color: '#ffffff', width: 250 }}>
                              <Process
                                value={60}
                                color={
                                  item.taskStatus === 1
                                    ? '#0320ff'
                                    : item.taskStatus === 2
                                      ? '#009900'
                                      : item.taskStatus === 3
                                        ? '#ff5722'
                                        : '#f44336'
                                }
                                progress={item.progress}
                              />
                            </div>
                          </Tooltip>
                        ) : null}
                      </div>
                      <p style={{ color: '#a11818', fontSize: 13 }}>
                        {projectId === item._id ? (
                          <div>
                            <p style={{ fontSize: 16 }}>{item.projectId ? item.projectId.name : null}</p>
                            <p>
                              {intl.formatMessage(messages.ngaybatdau || { id: 'ngaybatdau', defaultMessage: 'ngaybatdau' })}: {moment(item.startDate).format('DD/MM/YYYY')}
                            </p>
                            <p>
                              {intl.formatMessage(messages.ngayketthuc || { id: 'ngayketthuc', defaultMessage: 'ngayketthuc' })}: {moment(item.endDate).format('DD/MM/YYYY')}
                            </p>
                            <p>{item.join ? item.join.map(it => it.name).join() : null}</p>
                          </div>
                        ) : null}
                      </p>
                    </li>
                  ))}
              </ol>
            </div>
            <div
              style={{
                width: '44.2%',
                background: 'linear-gradient(to left, rgba(61, 126, 255, 0.47),rgb(129, 199, 193) )',

                borderRadius: '10px',
                padding: '70px  10px',
              }}
            >
              <ol
                className="planner-quote-list"
                style={{
                  minHeight: '16px',
                  margin: 0,
                  boxSizing: ' border-box',
                  mozBoxSizing: ' border-box',
                  webkitBoxSizing: ' border-box',
                  overflow: 'scroll',
                  resize: 'none',
                  outline: 'none',
                  width: 'auto',
                  height: '250px',
                  color: '#000003',
                }}
              >
                {this.props.tasks
                  .filter(elm => elm.priority === 3 || elm.priority === 4 || elm.priority === 5)
                  .filter(el => el.taskStatus !== 3)
                  .filter(it => new Date(it.endDate) > new Date())
                  .filter(it => moment(it.startDate).format('YYYY-MM-DD') >= this.state.filter.startDate)
                  .filter(it => moment(it.endDate).format('YYYY-MM-DD') <= this.state.filter.endDate)
                  .map(item => (
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    <li
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.handleDrawer(item._id)}
                      className="hover-task"
                      onMouseMove={() => this.handleMouseMove(item._id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <b>{item.name}</b>
                        {projectId === item._id ? (
                          <Tooltip
                            onClose={this.handleTooltipClose}
                            onOpen={this.handleTooltipOpen}
                            open={open}
                            title={`Còn ${((new Date(item.endDate) - new Date()) / 86400000).toFixed()} ngày`}
                            placement="left-start"
                          >
                            <div style={{ color: '#ffffff', width: 250 }}>
                              <Process
                                value={60}
                                color={
                                  item.taskStatus === 1
                                    ? '#0320ff'
                                    : item.taskStatus === 2
                                      ? '#009900'
                                      : item.taskStatus === 3
                                        ? '#ff5722'
                                        : '#f44336'
                                }
                                progress={item.progress}
                              />
                            </div>
                          </Tooltip>
                        ) : null}
                      </div>
                      <p style={{ color: '#a11818', fontSize: 13 }}>
                        {projectId === item._id ? (
                          <div>
                            <p style={{ fontSize: 16 }}>{item.projectId ? item.projectId.name : null}</p>
                            <p>
                              {intl.formatMessage(messages.ngaybatdau || { id: 'ngaybatdau', defaultMessage: 'ngaybatdau' })}: {moment(item.startDate).format('DD/MM/YYYY')}
                            </p>
                            <p>
                              {intl.formatMessage(messages.ngayketthuc || { id: 'ngayketthuc', defaultMessage: 'ngayketthuc' })}: {moment(item.endDate).format('DD/MM/YYYY')}
                            </p>
                            <p>{item.join ? item.join.map(it => it.name).join() : null}</p>
                          </div>
                        ) : null}
                      </p>
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        </div>
        {/* </Paper> */}
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDrawer: false, id: 'add' })}
          open={openDrawer}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <div>
            <AddProjects data={{ isProject: false }} id={id} callback={() => this.setState({ openDrawer: false })} />
          </div>
        </SwipeableDrawer>
        {/* <Menu onClose={this.handleClose} open={Boolean(anchorEl)} anchorEl={anchorEl}>
          <MenuItem>Profile</MenuItem>
          <MenuItem>My account</MenuItem>
          <MenuItem>Logout</MenuItem>
        </Menu> */}
      </React.Fragment>
    );
  }

  handleDrawer = id => {
    this.setState({ openDrawer: true, id });
  };

  handleMouseMove = id => {
    this.setState({ projectId: id });
  };
}

const mapStateToProps = createStructuredSelector({
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

TaskTimes.propTypes = {};

export default compose(
  injectIntl,
  withConnect,
)(TaskTimes);
