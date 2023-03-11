/* eslint-disable no-alert */
/* eslint-disable no-console */
/**
 *
 * BusinessOpportunities
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import messages from './messages';
import { injectIntl } from 'react-intl';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { withSnackbar } from 'notistack';
import { Grid, IconButton, Tooltip, Paper } from '@material-ui/core';
import { Add, Close } from '@material-ui/icons';
import Progressbar from 'react-progressbar';
import Button from 'components/CustomButtons/Button';
import dot from 'dot-object';
import moment from 'moment';
import lodash from 'lodash';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BOS, API_BUS_CALENDER } from '../../config/urlConfig';
import { fetchAllBosAction, resetNotis, addBoAction, updateBoAction, editViewConfigAction, deleteBosAction, changeTabBusAction } from './actions';
import { addLog } from '../Dashboard/actions';
import makeSelectBusinessOpportunities from './selectors';
import makeSelectDashboardPage, { makeSelectProfile } from '../Dashboard/selectors';
import reducer from './reducer';
import saga from './saga';
import HOCTable from '../HocTable';
import Kanban from '../KanbanPlugin';
import Automation from '../PluginAutomation/Loadable';
import CalendarContainer from '../CalendarContainer';
import BusinessOpportunitiesReport from '../BusinessOpportunitiesReport';
// import Calendar from '../../components/Calendar';

import BoDialog from '../BoDialog';
import { Dialog, SwipeableDrawer } from '../../components/LifetekUi';
import BODialog from '../../components/LifetekUi/Planner/BODialog';

import ListPage from '../../components/List';
import { CUSTOMER_TYPE_CODE } from '../../utils/constants';

/* eslint-disable react/prefer-stateless-function */
import '../../components/List/CustomCSS.css';

const newColumns = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === CUSTOMER_TYPE_CODE)) || {
    data: [],
  }
).data;

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
const CustomForget = props => {
  const duration = moment.duration(moment().diff(moment(props.item.updatedAt)));
  return <div>{Math.floor(duration.as('day'))} ngày</div>;
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
const CustomName = props => <Link to={`/crm/BusinessOpportunities/${props.item._id}`}>{props.item.name}</Link>;
export class BusinessOpportunities extends React.Component {
  state = {
    bos: [],
    openDialog: false,
    isEditting: false,
    crmStatusSteps: [],
    editData: {},
    kanbanFilter: {},
    pageDetail: {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
      skip: 0,
      limit: 10,
    },
    html: [],
    htmlTotal: 0,
    name2Title: {},
    kanbanData: {},
    openKanbanDialog: false,
  };

  componentDidMount() {
    const { id } = this.props.match.params;

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
    this.setState({ crmStatusSteps: sortedKanbanStatus });
    this.props.onGetBos(this.state.pageDetail);
    if (id) {
      axios
        .get(`${API_BOS}/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          // console.log(response);
          this.setState({
            openDialog: true,
            isEditting: true,
            editData: dot.dot(response.data),
          });
        })
        .catch(err => {
          console.log(err);
          alert('Lấy dữ liệu thất bại');
        });
    }
  }

  componentWillReceiveProps(props) {
    const { businessOpportunities } = props;
    const newBos = [];
    if (businessOpportunities.bos !== undefined) {
      businessOpportunities.bos.forEach(element => {
        newBos.push(dot.dot(element));
      });

      this.state.bos = newBos;
      this.state.pageDetail.totalCount = businessOpportunities.pageDetail.count;
      this.state.pageDetail.currentPage = Number(businessOpportunities.pageDetail.skip);
      this.state.pageDetail.pageSize = businessOpportunities.pageDetail.limit;
    }
    if (Number(businessOpportunities.callAPIStatus) === 1 && props.history.isEdit === true) {
      // this.state.openDialog = false;
      this.props.onGetBos(this.state.pageDetail);
      props.history.isEdit = undefined;
      this.setState({
        openDialog: false,
      });
    }

    this.props.onResetNotis();
  }

  addItem = () => (
    <span className="CustomIconListTask">
      <Tooltip title="Thêm mới">
        <Add onClick={() => this.setState({ openDialog: true, isEditting: false })} />
      </Tooltip>
    </span>
  );
  handleAddBo = ()=>{
    this.setState({ openDialog: true, isEditting: false })
  }
  handleAddClick = () => {
    this.setState({ openDialog: true, isEditting: false });
  };

  handleEditClick = data => {
    this.props.onAddLog({ content: 'Xem chi tiết', type: 'view', objectId: data._id, model: 'BusinessOpportunities' });
    // this.setState({ openDialog: true, isEditting: true, editData: data });
    this.props.history.push(`/crm/BusinessOpportunities/${data._id}`);
  };

  handleClickEdit = data => {
    this.props.history.push(`${data.Link}?typeLine=${data.Type}`);
  };

  handleDeleteClick = data => {
    const { bos } = this.state;
    const deleteIds = [];
    data.forEach(element => {
      deleteIds.push(bos[element]._id);
    });
    this.props.onDeleteBos(deleteIds);
  };

  handleCloseDialog = () => {
    const { id } = this.props.match.params;
    if (id) {
      this.props.history.goBack();
    } else {
      this.setState({ openDialog: false, isEditting: false });
    }
  };

  callBack = (cmd, data) => {
    const { id } = this.props.match.params;
    console.log('12321', data);
    switch (cmd) {
      case 'create-bo':
        this.props.onAddBo(dot.object(data));
        if (id) {
          this.props.history.push('/crm/BusinessOpportunities');
        }
        // this.setState({ openDialog: false });
        break;
      case 'update-bo':
        this.props.onUpdateBo(dot.object(data));
        if (id) {
          this.props.history.push('/crm/BusinessOpportunities');
        }
        // this.setState({ openDialog: false });
        break;
      case 'kanban-dragndrop-bo': {
        // const { bos } = this.state; // danh sách cơ hội kinh doanh
        // const currentCard = bos[bos.findIndex(d => d._id === data.cardId)]; // tìm cơ hội kinh doanh hiện tại
        // currentCard.kanbanStatus = data.newKanbanStatus;
        this.props.onUpdateBo(data); // Cập nhật lại object cơ hội kinh doanh
        break;
      }
      case 'kanban-click': {
        const { bos } = this.state; // danh sách cơ hội kinh doanh
        const currentCard = bos[bos.findIndex(d => d._id === data.cardId)]; // tìm cơ hội kinh doanh hiện tại
        this.setState({ openDialog: true, isEditting: true, editData: currentCard });
        break;
      }

      case 'update-viewconfig': {
        const localStorageViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
        const currentViewConfigIndex = localStorageViewConfig.findIndex(d => d.path === '/crm/BusinessOpportunities');
        const { others } = localStorageViewConfig[currentViewConfigIndex].listDisplay.type.fields.type;
        const newOthers = lodash.differenceBy([...others, ...data.newColumns], data.deletedColumns, 'name');
        localStorageViewConfig[currentViewConfigIndex].listDisplay.type.fields.type.others = newOthers;
        localStorage.setItem('viewConfig', JSON.stringify(localStorageViewConfig));
        this.props.onEditViewConfig(localStorageViewConfig[currentViewConfigIndex]);
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

  // check(dt) {
  //   if (!dt.responsibilityPerson) delete dt.responsibilityPerson;
  //   return dt;
  // }
  mapFunction = item => {
    const typeCustomer = newColumns.find(elm => elm.value === item['typeOfCustomer']);
    return {
      ...item,
      //updatedAt: Math.floor(moment.duration(moment().diff(moment(item.updatedAt))).as('day')),
      updatedAt: <p>{Math.floor(moment.duration(moment().diff(moment(item.updatedAt))).as('day'))} Ngày</p>,
      organizationUnitId: item.organizationUnitIdName,
      exchangingAgreement: item['exchangingAgreement.name'],
      typeOfCustomer: typeCustomer ? typeCustomer.title : '',
    };
  };

  render() {
    const { bos, openDialog, isEditting, crmStatusSteps, editData, pageDetail } = this.state;
    const { tab, reload, loading } = this.props.businessOpportunities;
    const { intl, profile } = this.props;
    const Bt = props => (
      <Button onClick={() => this.props.onChangeTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </Button>
    );
    const nameCallBack = 'bo';
    // const bussines = this.props.dashboardPage.roleBusinessOpportunities.roles.find(item => item.code === 'BUSSINES').data;
    // const responsibilityPerson = bussines.find(item => item.name === 'responsibilityPerson').data;
    // const supervisor = bussines.find(item => item.name === 'supervisor').data;
    // const profile = this.props.dashboardPage.profile;
    return (
      <div>
        <Helmet>
          <title>BusinessOpportunities</title>
          <meta name="description" content="Description of BusinessOpportunities" />
        </Helmet>
        {/* <Paper> */}
          <Grid container>
            <Grid item sm={12}>
              <Bt tab={1}>{intl.formatMessage(messages.report || { id: 'report' })}</Bt>
              <Bt tab={2}>{intl.formatMessage(messages.calendar || { id: 'calendar' })}</Bt>
              <Bt tab={3}>{intl.formatMessage(messages.kanban || { id: 'kanban' })}</Bt>
              <Bt tab={4}>{intl.formatMessage(messages.list || { id: 'list' })}</Bt>
              <Bt tab={5}>Automation rules</Bt>
              {/* <Bt>
              <a styles={{ color: '#999999' }} href="http://g.lifetek.vn:299/DemowebcamFaceDetection.html">
                CM
              </a>
            </Bt> */}
            </Grid>
          </Grid>
          {!this.props.match.params.id ? (
            <Grid item sm={12}>
              {tab === 3 ? (
              <div>
                <Kanban
                  isOpenSinglePage
                  enableTotal
                  titleField="name" // tên trường sẽ lấy làm title trong kanban
                  callBack={this.callBack} // sự kiện trả về kanban
                  // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                  // data={bos} // list dữ liệu
                  reload={loading}
                  path={API_BOS}
                  code="ST01" // code của danh sách trạng thái kanban
                  nameCallBack={nameCallBack} // nhan dien callBack cua cac page khac nhau
                  filter={this.state.kanbanFilter}
                  styleKb={window.innerWidth > 1500 ? '20vw' : null}
                  style={{overflowY: 'scroll'}}
                  // handleAddBo={this.handleAddBo}
                  // customFilter={
                  //   <React.Fragment>
                  //      <Grid container spacing={16}>
                  //       <Grid item xs={4}>
                  //             <DepartmentAndEmployee
                  //               department={this.state.kanbanFilter.organizationUnit}
                  //               employee={this.state.kanbanFilter.employee ? this.state.kanbanFilter.employee : ''}
                  //               onChange={this.handleChangeDepartmentAndEmployeeKanban}
                  //               profile={profile}
                  //             />
                  //           </Grid>
                  //      </Grid>
                  //   </React.Fragment>
                  // }
                  customContent={customContent}
                  customActions={[
                    {
                      action: 'comment',
                      // params: 'typeLine=4',
                    },
                  ]}
                  history={this.props.history}
                  params="BusinessOpportunities"
                />
              </div>
              ) : null}
              {tab === 4 ? (
                <ListPage
                  height="610px"
                  apiUrl={API_BOS}
                  exportExcel
                  code="BusinessOpportunities"
                  kanban="ST01"
                  kanbanKey="_id"
                  withPagination
                  settingBar={[this.addItem()]}
                  disableAdd
                  reload={reload}
                  // showDepartmentAndEmployeeFilter
                  mapFunction={this.mapFunction}
                  excludeDatetype="updatedAt"
                />
              ) : null}
              {/* {console.log('thang', pageDetail)} */}
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
                  url={API_BUS_CALENDER}
                  handleAdd={this.handleAddClick}
                  handleEdit={this.handleClickEdit}
                  code="ST01"
                />
              ) : null}
              {tab === 1 ? <BusinessOpportunitiesReport /> : null}
              {tab === 5 ? (
                <Automation
                  code="ST01" // code của danh sách trạng thái kanban
                  path="/crm/BusinessOpportunities" // path để lấy viewconfig (hiển thị danh sách các trường bắt trigger)
                  codeModule="BusinessOpportunities"
                />
              ) : null}
            </Grid>
            
          ) : null}
          {openDialog ? (
            <BoDialog
              {...this.props}
              isTrading={false}
              path="/crm/BusinessOpportunities"
              kanbanSteppers={crmStatusSteps}
              handleClose={this.handleCloseDialog}
              callBack={this.callBack}
              open={openDialog}
              isEditting={isEditting}
              editData={editData}
              disableSave={editData && `${editData.state}` === '1' && this.state.finishKbIds.includes(editData.kanbanStatus)}
            />
          ) : null}
          <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
            <BODialog
              setCoverTask={() => { }}
              profile={profile}
              taskId={this.state.kanbanData._id}
              // filterItem={innerFilterItem}
              data={this.state.kanbanData}
              API={API_BOS}
              customContent={customContent}
            />
          </Dialog>
        {/* </Paper> */}
      </div>
    );
  }

  action = key => (
    <IconButton
      onClick={() => {
        this.props.closeSnackbar(key);
      }}
    >
      <Close style={{ color: 'white' }} />
    </IconButton>
  );
}

BusinessOpportunities.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  businessOpportunities: makeSelectBusinessOpportunities(),
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetBos: pageDetail => {
      // console.log(pageDetail);
      dispatch(fetchAllBosAction(pageDetail));
    },
    onAddBo: bo => {
      dispatch(addBoAction(bo));
    },
    onUpdateBo: bo => {
      dispatch(updateBoAction(bo));
    },
    onDeleteBos: deleteIds => {
      dispatch(deleteBosAction(deleteIds));
    },
    onResetNotis: () => {
      dispatch(resetNotis());
    },
    onEditViewConfig: viewConfig => {
      dispatch(editViewConfigAction(viewConfig));
    },
    onAddLog: data => {
      dispatch(addLog(data));
    },
    onChangeTab: tab => {
      dispatch(changeTabBusAction(tab));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'businessOpportunities', reducer });
const withSaga = injectSaga({ key: 'businessOpportunities', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
)(BusinessOpportunities);
const customContent = [
  {
    title: 'Giám sát',
    fieldName: 'supervisor.0.name',
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
