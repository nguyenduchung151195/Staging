/**
 *
 * TradingPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { withSnackbar } from 'notistack';
import { Grid, Tooltip } from '@material-ui/core';
import Progressbar from 'react-progressbar';
import Button from 'components/CustomButtons/Button';
import dot from 'dot-object';
import lodash from 'lodash';
import moment from 'moment';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { convertDot } from '../../helper';
import {
  fetchAllTradingsAction,
  resetNotis,
  addTradingAction,
  updateTradingAction,
  editViewConfigAction,
  deleteTradingsAction,
  changeTabTradingAction,
} from './actions';
import makeSelectTradingPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import HOCTable from '../HocTable';
// import Calendar from '../../components/Calendar';
import Kanban from '../KanbanPlugin';
import BoDialog from '../BoDialog';
import { API_TRADINGS, API_TRADINGS_CALENDAR } from '../../config/urlConfig';
import CalendarContainer from '../CalendarContainer';
import Automation from '../PluginAutomation/Loadable';
import TradingReport from '../TradingReport';
import { Dialog } from '../../components/LifetekUi';
import BODialog from '../../components/LifetekUi/Planner/BODialog';
import { makeSelectProfile } from '../Dashboard/selectors';
import ListPage from '../../components/List';
import { Add } from '@material-ui/icons';
/* eslint-disable react/prefer-stateless-function */

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
      {/* {sortedKanbanStatus[kanbanStatusNumber] !== undefined ? (
        <Tooltip title={sortedKanbanStatus[kanbanStatusNumber].name}>
          <Progressbar color={sortedKanbanStatus[kanbanStatusNumber].color} completed={kanbanValue} />
        </Tooltip>
      ) : (
        <span>Không xác định</span>
      )} */}
    </div>
  );
};
const CustomResponsibilityPerson = props => {
  const item = dot.object(props.item);
  if (typeof item.responsibilityPerson === 'object') {
    const arr = [];
    item.responsibilityPerson.forEach(element => {
      arr.push(element.name);
    });
    const str = arr.join(', ');
    return <div>{str}</div>;
  }
  return '';
};

const CustomSupervisor = props => {
  const item = dot.object(props.item);
  if (typeof item.supervisor === 'object') {
    const arr = [];
    item.supervisor.forEach(element => {
      arr.push(element.name);
    });
    const str = arr.join(', ');
    return <div>{str}</div>;
  }
  return '';
};
const CustomForget = props => {
  const duration = moment.duration(moment().diff(moment(props.item.updatedAt)));
  return <div>{Math.floor(duration.as('day'))} ngày</div>;
};
const CustomName = props => <Link to={`/crm/ExchangingAgreement/${props.item._id}`}>{props.item.name}</Link>;
export class TradingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDetail: {
        currentPage: 0,
        pageSize: 10,
        totalCount: 0,
        skip: 0,
        limit: 10,
      },
      finishKbIds: [],
      bos: [],
      // tab: 4,
      openDialog: false,
      isEditting: false,
      crmStatusSteps: [],
      editData: {},
      kanbanFilter: {},
      kanbanData: {},
      openKanbanDialog: false,
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    const currentCrmStatus = listCrmStatus[listCrmStatus.findIndex(d => d.code === 'ST03')];
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    const newFinishKbIds = [];
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
          newFinishKbIds.push(item._id);
          break;

        case 4:
          laneFail.push(item);
          newFinishKbIds.push(item._id);
          break;

        default:
          break;
      }
    });
    const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
    this.setState({ crmStatusSteps: sortedKanbanStatus, finishKbIds: newFinishKbIds });
    // this.props.onGetTradings({
    //   skip: this.state.currentPage,
    //   limit: this.state.pageSize,
    // });
    if (id) {
      axios
        .get(`${API_TRADINGS}/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          this.setState({
            openDialog: true,
            isEditting: true,
            editData: dot.dot(response.data || {}),
          });
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log(err);
          // eslint-disable-next-line no-alert
          alert('Lấy dữ liệu thất bại');
        });
    }
  }

  componentWillUpdate(props) {
    const { trading } = props;

    const newTradings = [];
    if (trading.bos !== undefined) {
      trading.bos.data.forEach(element => {
        newTradings.push(dot.dot(element));
      });
      this.state.bos = newTradings;
    }
  }

  componentWillReceiveProps(props) {
    const { trading } = props;
    const newTradings = [];
    if (trading.bos !== undefined) {
      trading.bos.data.forEach(element => {
        newTradings.push(dot.dot(element));
      });

      this.state.bos = newTradings;
      this.state.pageDetail.totalCount = trading.bos.count;
      this.state.pageDetail.currentPage = Number(trading.bos.skip);
      this.state.pageDetail.pageSize = trading.bos.limit;
    }
    // if (trading.callAPIStatus === 1) {
    //   this.props.enqueueSnackbar(trading.notiMessage, {
    //     persist: false,
    //     anchorOrigin: {
    //       vertical: 'top',
    //       horizontal: 'right',
    //     },
    //     variant: 'success',
    //   });
    // }
    // if (trading.callAPIStatus === 0) {
    //   this.props.enqueueSnackbar(trading.notiMessage, {
    //     persist: false,
    //     anchorOrigin: {
    //       vertical: 'top',
    //       horizontal: 'right',
    //     },
    //     variant: 'error',
    //   });
    // }
    if (Number(trading.callAPIStatus) === 1 && props.history.isEdit === true) {
      // this.state.openDialog = false;
      this.props.onGetTradings(this.state.pageDetail);
      props.history.isEdit = undefined;
      this.setState({
        openDialog: false,
      });
      this.props.history.push('/crm/ExchangingAgreement');
    }
    const edittingTrading = JSON.parse(localStorage.getItem('edittingTrading'));
    if (edittingTrading && edittingTrading.routingBackFromTabDialog) {
      this.state.editData = newTradings[newTradings.findIndex(d => d._id === edittingTrading._id)];
      this.state.openDialog = true;
      this.state.isEditting = true;
      localStorage.removeItem('edittingTrading');
    } else {
      localStorage.removeItem('edittingTrading');
    }
    this.props.onResetNotis();
  }

  handleAddClick = () => {
    this.setState({ openDialog: true, isEditting: false });
  };

  addItem = () => (
    <Tooltip title="Thêm mới" aria-label="add">
      <Add onClick={() => this.setState({ openDialog: true, isEditting: false })} />
    </Tooltip>
  );

  handleEditClick = data => {
    this.setState({ openDialog: true, isEditting: true, editData: data });
    this.props.history.push(`/crm/ExchangingAgreement/${data._id}`);
  };

  handleDeleteClick = data => {
    const { bos } = this.state;
    const deleteIds = [];
    data.forEach(element => {
      deleteIds.push(bos[element]._id);
    });
    this.props.onDeleteTradings(deleteIds);
  };

  handleCloseDialog = () => {
    const { id } = this.props.match.params;
    if (id) {
      this.props.history.goBack();
    } else {
      this.setState({ openDialog: false, isEditting: false });
    }
  };

  handleClickEdit = data => {
    this.props.history.push(`${data.Link}?typeLine=${data.Type}`);
  };

  callBack = (cmd, data) => {
    switch (cmd) {
      case 'create-bo':
        this.props.onAddTrading(dot.object(data));
        // this.props.history.push('crm/ExchangingAgreement');
        // this.setState({ openDialog: false });
        break;
      case 'update-bo':
        this.props.onUpdateTrading(dot.object(data));
        // this.setState({ openDialog: false });
        break;
      case 'kanban-dragndrop-exa': {
        // const { bos } = this.state;
        // const currentCard = bos[bos.findIndex(d => d._id === data.cardId)];

        // currentCard.kanbanStatus = data.newKanbanStatus;
        this.props.onUpdateTrading(data);
        break;
      }

      case 'update-viewconfig': {
        const localStorageViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
        const currentViewConfigIndex = localStorageViewConfig.findIndex(d => d.path === '/crm/ExchangingAgreement');
        const { others } = localStorageViewConfig[currentViewConfigIndex].listDisplay.type.fields.type;
        const newOthers = lodash.differenceBy([...others, ...data.newColumns], data.deletedColumns, 'name');
        localStorageViewConfig[currentViewConfigIndex].listDisplay.type.fields.type.others = newOthers;
        localStorage.setItem('viewConfig', JSON.stringify(localStorageViewConfig));
        this.props.onEditViewConfig(localStorageViewConfig[currentViewConfigIndex]);
        break;
      }
      case 'kanban-click': {
        const { bos } = this.state; // danh sách cơ hội kinh doanh
        const currentCard = bos[bos.findIndex(d => d._id === data.cardId)]; // tìm cơ hội kinh doanh hiện tại
        this.setState({ openDialog: true, isEditting: true, editData: currentCard });
        break;
      }
      case 'quick-add': {
        this.setState({ openDialog: true, isEditting: false });
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

  mapFunction = item => {
    return {
      ...item,
      updatedAt: <p>{Math.floor(moment.duration(moment().diff(moment(item.updatedAt))).as('day'))} Ngày</p>,
      // updatedAt: Math.floor(moment.duration(moment().diff(moment(item.updatedAt))).as('day')),
      'customer.customerId': item.customerCode ? item.customerCode : null,
      createdBy: item.createdByName ? item.createdByName : null,
      'businessOpportunities.objectId': item.code ? item.code : null,
    };
  };

  render() {
    const { bos, openDialog, isEditting, crmStatusSteps, editData, pageDetail } = this.state;
    const { tab, reload, loading, onChangeKanban } = this.props.trading;
    const { profile } = this.props;
    const Bt = props => (
      <Button onClick={() => this.props.onChangeTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </Button>
    );
    const nameCallBack = 'exa';
    return (
      <div>
        <Grid container>
          <Grid item sm="12">
            <Bt tab={1}>Báo cáo</Bt>
            <Bt tab={2}>Lịch</Bt>
            <Bt tab={3}>Kanban</Bt>
            <Bt tab={4}>Danh sách</Bt>
            <Bt tab={5}>Automation rules</Bt>
          </Grid>
        </Grid>
        {!this.props.match.params.id ? (
          <Grid item sm="12">
            {tab === 3 ? (
              <Kanban
                isOpenSinglePage
                enableTotal
                titleField="name"
                callBack={this.callBack}
                code="ST03"
                path={API_TRADINGS}
                reload={loading}
                filter={this.state.kanbanFilter}
                nameCallBack={nameCallBack}
                customContent={customContent}
                customActions={[
                  {
                    action: 'comment',
                    // params: 'typeLine=4',
                  },
                ]}
                history={this.props.history}
                statusChangeKanban={this.props.trading.successExa}
                params="ExchangingAgreement"
                error={onChangeKanban}
              />
            ) : null}
            <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
              <BODialog
                setCoverTask={() => { }}
                profile={profile}
                taskId={this.state.kanbanData._id}
                // filterItem={innerFilterItem}
                data={this.state.kanbanData}
                API={API_TRADINGS}
                customContent={customContent}
              />
            </Dialog>
            {tab === 4 ? (
              <ListPage
                height="610px"
                showDepartmentAndEmployeeFilter
                disableEmployee
                md={2}
                apiUrl={API_TRADINGS}
                exportExcel
                code="ExchangingAgreement"
                kanban="ST03"
                kanbanKey="_id"
                withPagination
                mapFunction={this.mapFunction}
                settingBar={[this.addItem()]}
                disableAdd
                excludeDatetype="updatedAt"
                reload={loading}
              />
            ) : null}
            {tab === 2 ? (
              <CalendarContainer
                column={{
                  Id: 'Id',
                  Subject: 'Subject',
                  Location: 'Location',
                  StartTime: 'StartTime',
                  EndTime: 'EndTime',
                  CategoryColor: 'CategoryColor',
                }}
                code="ST02"
                url={API_TRADINGS_CALENDAR}
                handleAdd={this.handleAddClick}
                handleEdit={this.handleClickEdit}
              />
            ) : null}
            {tab === 1 ? <TradingReport /> : null}
            {tab === 5 ? (
              <Automation
                code="ST01" // code của danh sách trạng thái kanban
                path="/crm/ExchangingAgreement" // path để lấy viewconfig (hiển thị danh sách các trường bắt trigger)
              />
            ) : null}
          </Grid>
        ) : null}
        {openDialog ? (
          <BoDialog
            {...this.props}
            isTrading
            path="/crm/ExchangingAgreement"
            kanbanSteppers={crmStatusSteps}
            handleClose={this.handleCloseDialog}
            callBack={this.callBack}
            open={openDialog}
            isEditting={isEditting}
            editData={editData}
            bos={bos}
            disableSave={editData && `${editData.state}` === '1' && this.state.finishKbIds.includes(editData.kanbanStatus)}
          />
        ) : (
          ''
        )}
      </div>
    );
  }

  // handleTab() {
  //   // this.setState({ tab });
  // }
}

TradingPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  trading: makeSelectTradingPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetTradings: pageDetail => {
      dispatch(fetchAllTradingsAction(pageDetail));
    },
    onAddTrading: bo => {
      dispatch(addTradingAction(bo));
    },
    onUpdateTrading: bo => {
      dispatch(updateTradingAction(bo));
    },
    onDeleteTradings: deleteIds => {
      dispatch(deleteTradingsAction(deleteIds));
    },
    onResetNotis: () => {
      dispatch(resetNotis());
    },
    onEditViewConfig: viewConfig => {
      dispatch(editViewConfigAction(viewConfig));
    },
    onChangeTab: tab => {
      dispatch(changeTabTradingAction(tab));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'trading', reducer });
const withSaga = injectSaga({ key: 'trading', saga });

export default compose(
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
)(TradingPage);
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
