/**
 *
 * DeliveryPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, Paper, Typography, TextField, Button, Tabs, Tab, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import Progressbar from 'react-progressbar';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import AsyncSelect from 'react-select/async';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { components } from 'react-select';
import CustomButton from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import dot from 'dot-object';
import makeSelectDeliveryPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { API_TASK_PROJECT, GET_CONTRACT, API_DELIVERY } from '../../config/urlConfig';
import { getTaskAct, getContractAct, changeTabAct, getItemDeliveryAct, updateItemDeliveryAct, reset } from './actions';
import HOCTable from '../HocTable';
import Kanban from '../KanbanPlugin';
import CalendarContainer from '../CalendarContainer';
import { serialize, getLabelName } from '../../utils/common';
import { changeSnackbar } from '../Dashboard/actions';
import makeSelectEditProfilePage from '../EditProfilePage/selectors';
import BODialog from '../../components/LifetekUi/Planner/BODialog';
import ListPage from '../../components/List';
import { Dialog } from '../../components/LifetekUi';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import TodayIcon from '@material-ui/icons/Today';
// import messages from './messages';

const date = moment().format('YYYY-MM-DD');
// const datePrev = moment(date)
//   .subtract(1, 'months')
//   .format('YYYY-MM-DD');

const CustomKanbanStatus = props => {
  const propsFromTable = props.kanbanProps.slice();
  const laneStart = [];
  const laneAdd = [];
  const laneSucces = [];
  const laneFail = [];

  propsFromTable.forEach(item => {
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
  const itemFromTable = Object.assign({}, props.item);
  const kanbanStatusNumber = sortedKanbanStatus.findIndex(n => String(n._id) === String(itemFromTable.kanbanStatus));
  const kanbanValue = ((kanbanStatusNumber + 1) / propsFromTable.length) * 100;
  return (
    <div>
      {sortedKanbanStatus[kanbanStatusNumber] !== undefined ? (
        <Progressbar color={sortedKanbanStatus[kanbanStatusNumber].color} completed={kanbanValue} />
      ) : (
        <span>Không xác định</span>
      )}
    </div>
  );
};

const CustomRefObject = props => {
  // console.log(props.item);
  let refLink = '';
  switch (Number(props.item.type)) {
    case 3:
      refLink = <Link to={`/StockExport/edit/${props.item['ref.objectId']}`}> {props.item['ref.code']}</Link>;
      break;
    case 4:
      refLink = <Link to={`/StockImport/edit/${props.item['ref.objectId']}`}> {props.item['ref.code']}</Link>;
      break;
    case 1:
      refLink = <Link to={`/RevenueExpenditure/edit/${props.item['ref.objectId']}`}> {props.item['ref.code']}</Link>;
      break;
    case 2:
      refLink = <Link to={`/RevenueExpenditure/edit/${props.item['ref.objectId']}`}> {props.item['ref.code']}</Link>;
      break;

    default:
      break;
  }
  return refLink;
};

/* eslint-disable react/prefer-stateless-function */
export class DeliveryPage extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
    this.state = {
      crmStatusSteps: [],
      task: null,
      taskList: [],
      contract: null,
      dayStart: null,
      dayEnd: null,
      listItems: [],
      listType: 0,
      valueOfTab: 0,
      pageDetail: {
        currentPage: 0,
        pageSize: 10,
        totalCount: 0,
      },
      params: '',
      open: false,
      currentItem: null,
      kanbanFilter: {},
      kanbanData: {},
      openKanbanDialog: false,
      filterList: {},
      listCrmStatus: []
    };
  }

  componentDidMount() {
    // this.props.onChangeTab(0);
    this.props.onGetTask();
    const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    const currentCrmStatus = listCrmStatus[listCrmStatus.findIndex(d => d.code === 'ST13')];
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    currentCrmStatus &&
      currentCrmStatus.data != 'undefined' &&
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
    this.setState({ crmStatusSteps: sortedKanbanStatus, listCrmStatus: listCrmStatus });
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { deliveryPage } = props;
      const taskList = deliveryPage.taskList || [];
      const taskListNew = taskList.map(item => ({ ...item, value: item._id }));
      this.setState({ taskList: taskListNew });
      const listItems = deliveryPage.deliveryItems || [];
      this.state.pageDetail.totalCount = deliveryPage.count || 0;
      this.state.pageDetail.currentPage = Number(deliveryPage.skip || 0) || 0;
      this.state.pageDetail.pageSize = deliveryPage.limit || 0;
      this.setState({ listItems });
    }
  }

  componentDidUpdate(props) {
    if (props !== this.props) {
      if (props.deliveryPage.successUpdate) {
        this.state.open = false;
        this.onGetAllItemsCustom();
        this.props.onReset();
      }
    }
  }

  componentWillUnmount() {
    this.props.onChangeTab(0);
  }
  handleEditClick = item => {
    this.props.history.value = this.state.tab;
    const { history } = this.props;
    history.push({
      pathname: `/Delivery/${item._id}`,
      state: { typeOfRecord: this.state.tab, add: false },
    });
    // console.log('11111', item);
  };

  mapFunction = item => {
    const { listCrmStatus } = this.state
    console.log(listCrmStatus, "listCrmStatus")
    let crmStatus = item.crmStatus
    const currentCrmStatus = listCrmStatus && Array.isArray(listCrmStatus) && listCrmStatus.find(it => it.code === crmStatus)
    currentCrmStatus ? crmStatus = currentCrmStatus.title : crmStatus = crmStatus
    console.log(currentCrmStatus, 'currentCrmStatus')
    return {
      ...item,
      // receivingUnit: item.receivingUnit ? item.receivingUnitName : '',
      crmStatus: crmStatus,
      type: item.type === 0 ? 'Loại khác' :
        item.type === 1 ? 'Kế hoạch chi' :
          item.type === 2 ? 'Kế hoạch thu' :
            item.type === 3 ? 'Kế hoạch xuất' :
              item.type === 4 ? 'Kế hoạch nhập' : '',
    };
  };

  render() {
    const { profile } = this.props;
    const { valueOfTab, listItems } = this.state;
    const { tab, reload } = this.props.deliveryPage;
    const Bt = props => (
      <CustomButton onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </CustomButton>
    );
    const newItemsList = listItems.map(item => dot.dot(Object.assign({}, item)));
    return (
      <div>
        <Helmet>
          <title>Giao nhận</title>
          <meta name="description" content="Description of DeliveryPage" />
        </Helmet>
        <Grid>
          <Paper style={{ width: '100%', padding: '20px' }}>
            <Grid item container md={11}>
              <Grid md={2} item style={{ zIndex: 999 }}>
                <Typography>Dự án</Typography>
                <AsyncSelect
                  // className={this.props.classes.select}
                  placeholder="Tìm kiếm dự án ..."
                  loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, API_TASK_PROJECT)}
                  loadingMessage={() => 'Đang tải ...'}
                  components={{ Option, SingleValue }}
                  // onBlur={() => field.onBlur({ value: field.value })}
                  isClearable
                  onChange={this.handleTask}
                  defaultOptions={this.state.taskList}
                  value={this.state.task}
                  theme={theme => (
                    {
                      ...theme,
                      spacing: {
                        ...theme.spacing,
                        controlHeight: '55px',
                      },
                    }
                  )}
                />
              </Grid>
              &nbsp;
              <Grid md={2} item style={{ zIndex: 999 }}>
                <Typography>Hợp đồng</Typography>
                <AsyncSelect
                  // className={this.props.classes.select}
                  placeholder="Tìm kiếm hợp đồng ..."
                  loadOptions={(newValue, callback) => this.loadOptionsContract(newValue, callback, GET_CONTRACT)}
                  loadingMessage={() => 'Đang tải ...'}
                  components={{ Option, SingleValue }}
                  // onBlur={() => field.onBlur({ value: field.value })}
                  isClearable
                  onChange={this.handleContract}
                  // defaultOptions={this.state.taskList}
                  value={this.state.contract}
                  theme={theme => ({
                    ...theme,
                    spacing: {
                      ...theme.spacing,
                      controlHeight: '55px',
                    },
                  })}
                />
              </Grid>
              &nbsp;
              {Number(this.props.deliveryPage.tab) === 0 ? (
                <Grid item md={6} style={{ marginTop: '5px' }}>
                  {/* <TextField
                    label="Ngày bắt đầu"
                    name="dayStart"
                    type="date"
                    value={this.state.dayStart}
                    onChange={this.handleChangeDate}
                    InputProps={{ inputProps: { max: date } }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    style={{ width: '34%', marginTop: '15px' }}
                    color="primary"
                  // margin="normal"
                  /> */}
                  <DatePicker
                    invalidLabel="DD/MM/YYYY"
                    format="DD/MM/YYYY"
                    label="Ngày bắt đầu"
                    name="dayStart"
                    variant="outlined"
                    style={{ width: '34%', marginTop: '22px' }}
                    value={this.state.dayStart || moment()}
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => {
                      this.setState({ dayStart: e })
                    }}
                    keyboard
                    fullWidth
                    // disableOpenOnEnter
                    keyboardIcon={<TodayIcon style={{ width: '100%' }} />}
                  />
                  &nbsp;
                  {/* <TextField
                    label="Ngày kết thúc"
                    name="dayEnd"
                    type="date"
                    value={this.state.dayEnd}
                    onChange={this.handleChangeDate}
                    // InputProps={{ inputProps: { max: date } }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    style={{ width: '34%', marginTop: '15px' }}
                    color="primary"
                  // margin="normal"
                  /> */}
                  <DatePicker
                    invalidLabel="DD/MM/YYYY"
                    format="DD/MM/YYYY"
                    label="Ngày kết thúc"
                    name="dayEnd"
                    variant="outlined"
                    style={{ width: '34%', marginTop: '22px' }}
                    value={this.state.dayEnd || moment()}
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => {
                      this.setState({ dayEnd: e })
                    }}
                    keyboard
                    fullWidth
                    // disableOpenOnEnter
                    keyboardIcon={<TodayIcon style={{ width: '100%' }} />}
                  />
                  &nbsp;&nbsp;
                  <Button
                    color="primary"
                    variant="outlined"
                    style={{ width: '20%', marginTop: '17px', height: '55px' }}
                    onClick={this.handleSearchByDay}
                  >
                    Thực hiện
                  </Button>
                </Grid>
              ) : null}
            </Grid>
            <Grid item md={12} container style={{ marginTop: '10px' }}>
              <Button
                onClick={() => {
                  this.changeListType(0);
                }}
                // className="mx-2"
                variant={this.state.listType === 0 ? 'outlined' : 'outlined'}
                color="primary"
              >
                Tổng hợp
              </Button>
              <Button
                onClick={() => {
                  this.changeListType(1);
                }}
                className="mx-2"
                variant={this.state.listType === 1 ? 'outlined' : 'outlined'}
                color="primary"
              >
                Kế hoạch giao nhận
              </Button>
            </Grid>
            <Grid item md={12} container>
              <Grid item md={6} container style={{ marginTop: '10px' }}>
                <Tabs value={valueOfTab} onChange={this.handleChangeTab} indicatorColor="primary" variant="fullWidth">
                  <Tab label="Tất cả" />
                  <Tab label="Giao hàng" />
                  <Tab label="Nhận hàng" />
                </Tabs>
              </Grid>
              <Grid item md={6} container style={{ marginTop: '10px' }} justify="flex-end">
                <Bt tab={0}>Danh sách</Bt>
                <Bt tab={1}>Kanban</Bt>
                <Bt tab={2}>Lịch</Bt>
              </Grid>
            </Grid>
            <Grid item md={12} container style={{ width: '100%' }}>
              <TabContainer>
                {Number(tab) === 0 ? (
                  // <HOCTable
                  //   disableImport
                  //   // onRef={ref => (this.HOCTable = ref)}
                  //   handleEditClick={this.handleEdiClick}
                  //   // handleAddClick={this.handleAddClick}
                  //   // handleDeleteClick={this.handleDeleteClick}
                  //   customColumns={[
                  //     {
                  //       columnName: 'kanbanStatus',
                  //       CustomComponent: CustomKanbanStatus,
                  //     },
                  //     {
                  //       columnName: 'ref.code',
                  //       CustomComponent: CustomRefObject,
                  //     },
                  //   ]}
                  //   path="/crm/Delivery"
                  //   collectionCode="Delivery"
                  //   data={newItemsList}
                  //   enableDelete={false}
                  //   kanbanStatuses={this.state.crmStatusSteps}
                  //   pageDetail={this.state.pageDetail} // phân trang
                  //   onGetAPI={this.onGetAllItemsCustom}
                  //   enableServerPaging
                  //   disableAdd
                  //   enableEdit
                  //   enableExportForm={false}
                  //   enableAddFieldTable={false}
                  // />
                  <ListPage
                    // style={{ position: "unset", zIndex: 1001 }}
                    disableImport
                    disableAdd
                    kanban="ST13"
                    kanbanKey="_id"
                    withPagination
                    mapFunction={this.mapFunction}
                    // enableEdit
                    apiUrl={API_DELIVERY}
                    code="Delivery"
                    filter={this.state.filterList}
                    onEdit={(item) => {
                      this.handleEditClick(item);
                    }}
                  />
                ) : null}
                {Number(tab) === 1 ? (
                  <Kanban
                    titleField="name"
                    enableAdd
                    callBack={this.callBack}
                    path={`${API_DELIVERY}?${this.state.params}`}
                    code="ST13"
                    reload={reload}
                    mapFunction={this.mapFunction}
                    filter={this.state.kanbanFilter}
                    customContent={customContent}
                    customActions={[
                      {
                        action: 'comment',
                        // params: 'typeLine=4',
                      },
                    ]}
                    successUpdate={this.props.deliveryPage.successUpdate}
                    history={this.props.history}
                    isOpenSinglePage
                  // params="bills/edit"
                  />
                ) : null}
                <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
                  <BODialog
                    setCoverTask={() => { }}
                    profile={profile}
                    taskId={this.state.kanbanData._id}
                    // filterItem={innerFilterItem}
                    data={this.state.kanbanData}
                    API={API_DELIVERY}
                    customContent={customContent}
                  />
                </Dialog>
                {Number(tab) === 2 ? (
                  <CalendarContainer
                    column={{
                      Id: '_id',
                      Subject: 'code',
                      Location: '',
                      StartTime: 'implementationDate',
                      EndTime: 'implementationDate',
                      CategoryColor: '#357cd2',
                    }}
                    // isCloneModule
                    url={`${API_DELIVERY}`}
                    mapFunction={this.mapFunction}
                    code="ST13"
                    querySort={this.state.params}
                    handleAdd={this.handleAddClickCalendar}
                    handleEdit={this.handleClickEditCalendar}
                  />
                ) : null}
              </TabContainer>
            </Grid>
          </Paper>
        </Grid>
        {/* <FormattedMessage {...messages.header} /> */}
        <Dialog fullWidth="md" open={this.state.open} onClose={this.handleClose} aria-labelledby="responsive-dialog-title" noClose>
          <DialogTitle id="responsive-dialog-title">{`${getLabelName('note', 'Delivery')}`}</DialogTitle>
          <DialogContent>
            <ValidatorForm style={{ width: '100%', zIndex: 0, display: 'inline' }} onSubmit={this.handleSubmitForm}>
              <TextValidator
                onChange={this.handleChangeNote}
                style={{ width: '100%' }}
                value={this.state.currentItem !== null ? this.state.currentItem.note : ''}
                variant="outlined"
                multiline
                rows={4}
                validators={['required', 'trim']}
                errorMessages={['Không được để trống!', 'Không được để trống!']}
              />
              {/* <div style={{ display: 'none' }}>
                <button ref={this.submitBtn} type="submit" />
              </div> */}
            </ValidatorForm>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.submitBtn.current.click();
              }}
              color="primary"
              autoFocus
              variant="outlined"
            >
              Lưu
            </Button>
            <Button onClick={this.handleClose} variant="outlined" color="secondary">
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleAddClickCalendar = () => { };

  handleClickEditCalendar = data => {
    this.setState({ open: true, currentItem: data });
  };

  handleChangeNote = event => {
    const { currentItem } = this.state;
    currentItem.note = event.target.value;
    this.setState({ currentItem });
  };

  handleSubmitForm = () => {
    this.props.onUpdateItems(this.state.currentItem);
  };

  handleClose = () => {
    this.setState({ open: false, currentItem: null });
  };

  handleEdiClick = data => {
    this.setState({ open: true, currentItem: data });
  };

  callBack = (cmd, data) => {
    switch (cmd) {
      case 'kanban-dragndrop': {
        this.props.onUpdateItems(data);
        break;
      }
      case 'openDialog': {
        this.setState({ open: true, currentItem: data });
        break;
      }
      case 'CommentDialog': {
        this.setState({ openKanbanDialog: true, kanbanData: data });
        break;
      }
      default:
        break;
    }
  };

  onGetAllItemsCustom = params1 => {
    console.log('params1', params1);
    let type = [];
    let body = '';
    if (Number(this.state.valueOfTab === 0)) {
      if (Number(this.state.listType === 0)) {
        type = [1, 2, 3, 4];
      } else {
        type = [3, 4];
      }
    } else if (Number(this.state.valueOfTab === 1)) {
      type = [3];
    } else {
      type = [4];
    }
    const filter = {
      filter: {
        type: {
          $in: type,
        },
      },
    };
    this.setState({
      filterList: {
        type: {
          $in: type,
        },
      },
    });
    // if (this.state.task) {
    //   filter.filter['task.taskId'] = this.state.task._id;
    // }
    // if (this.state.contract) {
    //   filter.filter['contract.contractId'] = this.state.contract._id;
    // }
    // if (this.state.dayStart && this.state.dayEnd && Number(this.props.deliveryPage.tab) === 0) {
    //   const startDay = moment(this.state.dayStart)
    //     .startOf('day')
    //     .format();
    //   const endDay = moment(this.state.dayEnd)
    //     .endOf('day')
    //     .format();
    //   const createdAt = {
    //     $gte: `${startDay}`,
    //     $lte: `${endDay}`,
    //   };
    //   filter.filter.createdAt = createdAt;
    // }
    // this.setState({ params: serialize(filter) });
    // if (params1) {
    //   body = `${serialize(params1)}&${serialize(filter)}`;
    // } else {
    //   const params2 = {
    //     skip: 0,
    //     limit: 10,
    //   };
    //   body = `${serialize(params2)}&${serialize(filter)}`;
    //   const pageDetail = {
    //     currentPage: 0,
    //     pageSize: 10,
    //     totalCount: 0,
    //   };
    //   this.setState({ pageDetail });
    // }

    // this.props.onGetAllItems(body);
  };

  handleSearchByDay = () => {
    const { dayStart, dayEnd } = this.state;
    if (dayStart === null) {
      this.props.onChangeSnackbar({ status: true, message: 'Bạn thiếu ngày bắt đầu!', variant: 'error' });
      return;
    }
    if (dayEnd === null) {
      this.props.onChangeSnackbar({ status: true, message: 'Bạn thiếu ngày kết thúc!', variant: 'error' });
      return;
    }
    if (new Date(dayStart) > new Date(dayEnd)) {
      this.props.onChangeSnackbar({ status: true, message: 'Ngày bắt đầu lớn hơn ngày kết thúc!', variant: 'error' });
      return;
    }
    this.onGetAllItemsCustom();
  };

  handleTab(tab) {
    this.props.onChangeTab(tab);
  }

  handleChangeTab = (e, value) => {
    this.setState({ valueOfTab: value });
    this.state.valueOfTab = value;
    this.onGetAllItemsCustom();
  };

  changeListType = val => {
    this.setState({ listType: val });
    this.state.listType = val;
    this.onGetAllItemsCustom();
  };

  handleChangeDate = e => {
    console.log(66666, e);
    this.setState({ [e.target.name]: e.target.value });
  };

  handleContract = selected => {
    this.setState({ contract: selected });
    this.state.contract = selected;
    this.onGetAllItemsCustom();
  };

  loadOptionsContract = (newValue, callback, api) => {
    const token = localStorage.getItem('token');
    const url = `${api}?filter%5Bname%5D%5B%24regex%5D=${newValue}&filter%5Bname%5D%5B%24options%5D=gi${this.state.task ? `&filter%5Btask.taskId%5D=${this.state.task._id}` : ''
      }`;
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(myJson => {
        const { data } = myJson;
        callback(
          data.map(item => ({
            ...item,
            value: item._id,
          })),
        );
      });
  };

  handleTask = selected => {
    this.setState({ task: selected });
    this.state.task = selected;
    this.onGetAllItemsCustom();
  };

  loadOptions = (newValue, callback, api) => {
    const token = localStorage.getItem('token');
    const url = `${api}?filter%5Bname%5D%5B%24regex%5D=${newValue}&filter%5Bname%5D%5B%24options%5D=gi${api === API_TASK_PROJECT ? '&filter%5BisProject%5D=true' : ''
      }`;
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(myJson => {
        const { data } = myJson;
        callback(
          data.map(item => ({
            ...item,
            value: item._id,
          })),
        );
      });
  };
}

function TabContainer(props) {
  return (
    <Typography component="div" style={{ width: '100%' }}>
      {props.children}
    </Typography>
  );
}

const Option = props => (
  <components.Option {...props}>
    <div style={{ display: 'flex', justifyContent: 'flex-start', zIndex: 100 }}>
      <div style={{ marginTop: 10 }}>{props.data.name}</div>
    </div>
  </components.Option>
);

const SingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{ marginTop: 5 }}>{props.data.name}</div>
    </div>
  </components.SingleValue>
);

DeliveryPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  deliveryPage: makeSelectDeliveryPage(),
  profile: makeSelectEditProfilePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetTask: () => {
      dispatch(getTaskAct());
    },
    onGetContract: body => {
      dispatch(getContractAct(body));
    },
    onChangeTab: val => {
      dispatch(changeTabAct(val));
    },
    onGetAllItems: params => {
      dispatch(getItemDeliveryAct(params));
    },
    onUpdateItems: params => {
      dispatch(updateItemDeliveryAct(params));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    onReset: () => {
      dispatch(reset());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'deliveryPage', reducer });
const withSaga = injectSaga({ key: 'deliveryPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DeliveryPage);
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
