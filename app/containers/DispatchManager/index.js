/* eslint-disable no-unused-vars */
/**
 *
 * DispatchManager
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, Menu, MenuItem, ListItemText, l } from '@material-ui/core';
import { Notifications, Comment as InsertCommentOutlined } from '@material-ui/icons';
import CustomButton from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import Kanban from '../KanbanPlugin';
// import HOCTable from '../HocTable';
import Kanban from 'components/LifetekUi/Planner/PlanDemo';
import { SwipeableDrawer, Paper, Dialog } from '../../components/LifetekUi';
import { API_DISPATCH, API_DISPATCH_INCOMING } from '../../config/urlConfig';
import makeSelectDispatchManager, { makeSelectDashboardPage } from './selectors';
import reducer from './reducer';
import { serialize, getHost, getCurrentUrl } from '../../utils/common';
import saga from './saga';
import { changeTabAct, resetNoti, getAllDispatchAct, deleteDispatchAct, updateDispatchAction } from './actions';
import AddDispatchManagerPage from '../AddDispatchManagerPage';

import Automation from '../PluginAutomation/Loadable';
import CalendarContainer from '../CalendarContainer';
import ListPage from '../../components/List';
import DMDialog from '../../components/LifetekUi/Planner/DMDialog';
import makeSelectEditProfilePage from '../EditProfilePage/selectors';
import ViewContent from 'components/ViewContent/Loadable';
import { mergeData as MergeData } from '../Dashboard/actions';

/* eslint-disable react/prefer-stateless-function */
export class DispatchManager extends React.Component {
  constructor() {
    super();
    const crmSource = JSON.parse(localStorage.getItem('crmSource'));
    this.state = {
      openDrawer: false,
      openModal: false,
      id: 'add',
      crmSource,
      idView: null,
      openSelectDocumentType: null,
      AddDispatchManager: false,
      openKanbanDialog: false,
      taskItem: {
        priority: 1,
      },
      count: 0,
      tab: 0
    };
  }

  componentWillMount() {
    console.log(this.props.match.url, 'this.props.match.url')
    if (this.props.match.url.includes('outGoingDocument')) {
      this.type = '1';
    } else if (this.props.match.url.includes('inComingDocument')) {
      this.type = '2';
    } else {
      this.type = '0';
    }
  }

  componentDidMount() {
    if (this.props.match.url.includes('outGoingDocument')) {
      this.type = '1';
    } else if (this.props.match.url.includes('inComingDocument')) {
      this.type = '2';
    } else {
      this.type = '0';
    }
    this.setState({ id: 'add' });
    const { id } = this.props.match.params;
  }

  callBack = (cmd, data) => {
    const { id } = this.props.match.params;
    switch (cmd) {
      case 'kanban-dragndrop': {
        this.props.onUpdateDispatch(data); // Cập nhật lại object cơ hội kinh doanh
        break;
      }

      default:
        break;
    }
  };

  handleAddClick = () => {
    this.setState({ openDrawer: true, id: 'add' });
  };

  handleClickEdit = data => {
    this.setState({ openDrawer: true, id: data._id, documentType: data.type === '2' ? 'inComingDocument' : 'outGoingDocument' });
  };

  handleDelete = () => {
    alert('Bạn không có quyền xóa');
  };

  callbackTask = () => {
    this.setState({ openDrawer: false, reload: this.props.dispatchManager.reload + 1 });
    this.props.onChangeTab(0);
    setTimeout(() => {
      this.props.onMergeData({ hiddenHeader: false });
      this.props.onChangeTab(1);
      this.setState({ id: 'add' });
    }, 1);
  };

  onAddFunctionClick = e => {
    this.setState({ openSelectDocumentType: e.target });
  };

  addItemKanban = id => {
    this.setState({ openDrawer: true, kanbanStatus: id });
  };

  mapFunction = item => {
    // console.log(item,'item');
    const { crmSource } = this.state;
    const typeDocumentArr = (crmSource.find(elm => elm.code === 'S19') || { data: [] }).data;
    const urgencyArr = (crmSource.find(elm => elm.code === 'S20') || { data: [] }).data;
    const whereArr = (crmSource.find(elm => elm.code === 'S23') || { data: [] }).data;
    const storageArr = (crmSource.find(elm => elm.code === 'S22') || { data: [] }).data;
    const densityArr = (crmSource.find(elm => elm.code === 'S21') || { data: [] }).data;

    return {
      ...item,
      // receivingUnit: item.receivingUnit ? item.receivingUnitName : '',
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

  // componentWillReceiveProps(prevProps, prevState) {
  //   if (prevState.id !== this.state.id) {
  //     console.log(this.state.id, prevState);
  //     return true;
  //   }
  // }

  render() {
    const { dispatchManager, dashboardPage, profile } = this.props;
    const { tab } = this.state;

    const { reload } = dispatchManager;
    const Bt = props => (
      <CustomButton onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </CustomButton>
    );
    // const codeModule = this.type == 2 || this.type == 1 ?  'inComingDocument' : 'Documentary';
    // const roleCode = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === codeModule);
    // const roleModule = roleCode && roleCode.methods ? roleCode.methods : [];

    return (
      <div>
        <Grid container style={{ width: '100%' }}>
          <Grid item md={12}>
            <Bt tab={5}>Automation rules</Bt>
            <Bt tab={1}>Kanban</Bt>
            <Bt tab={0}>Danh sách</Bt>
            {/* <Bt tab={2}>Lịch</Bt> */}
          </Grid>
          <Grid item md={12}>
            {tab === 1 ? (
              <Kanban
                module="crmStatus"
                codeModule={this.type == 2 || this.type == 1 ? 'inComingDocument' : 'Documentary'}
                dashboardPage={this.props.dashboardPage}
                reload={reload}
                code="ST14"
                kanbanOption={{
                  code: "ST14",
                  module: "crmStatus",
                }}
                apiUrl={this.type == 2 || this.type == 1 ? API_DISPATCH : API_DISPATCH}
                addItem={this.addItemKanban}
                itemComponent={this.ItemComponent}
                filter={
                  this.type == 2 || this.type == 1
                    ? {
                      type: 2,
                    }
                    : {
                      $or: [{ type: 2 }, { type: 1 }],
                    }
                }
              />
            ) : null}
            {tab === 0 ? (
              <Paper>
                <ListPage
                  height="650px"
                  showDepartmentAndEmployeeFilter
                  exportExcel
                  enableView
                  disableTodo
                  disableCreateTodo
                  disableSeenMail
                  disableSMS
                  addFunction={getCurrentUrl() === 'inComingDocument' ? null : this.onAddFunctionClick}
                  mapFunction={this.mapFunction}
                  // code="Documentary"
                  code={this.props.match.url.includes('inComingDocument') ? "inDocumentary" : "Documentary"}
                  codeRole={this.type == 2 || this.type == 1 ? 'inComingDocument' : null}
                  employeeFilterKey="createdBy"
                  apiUrl={this.type == 2 || this.type == 1 ? API_DISPATCH_INCOMING : API_DISPATCH}
                  kanban="ST14"
                  customUrl={item => (item.type === '2' ? `${getHost()}/Documentary/inComingDocument` : `${getHost()}/Documentary/outGoingDocument`)}
                  filter={
                    this.type == 2 || this.type == 1
                      ? {
                        type: 2,
                      }
                      : {
                        $or: [{ type: 2 }, { type: 1 }],
                      }
                  }
                />
              </Paper>
            ) : null}
            {tab === 5 ? (
              <Automation
                code="ST14" // code của danh sách trạng thái kanban
                path="/crm/Documentary" // path để lấy viewconfig (hiển thị danh sách các trường bắt trigger)
                kanbanStatus="String"
              />
            ) : null}
            {/* {tab === 2 ? (
              <CalendarContainer
                column={{
                  Id: 'code',
                  Subject: 'name',
                  Location: 'where',
                  StartTime: 'createdAt',
                  EndTime: 'createdAt',
                  CategoryColor: '#357cd2',
                }}
                url={`${this.type == 2 || this.type == 1 ? API_DISPATCH_INCOMING : API_DISPATCH}`}
                handleAdd={() => this.handleAddClick()}
                handleEdit={() => this.handleClickEdit()}
                handleDelete={this.handleDelete}
                code="ST14"
                querySort={{
                  filter: {
                    type: '2',
                  },
                }}
              />
            ) : null} */}
          </Grid>
        </Grid>
        <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
          {
            this.state.openKanbanDialog && <DMDialog profile={profile} taskId={this.state.taskItem._id} data={this.state.dataTask} />
          }
        </Dialog>
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDrawer: false, id: 'add' })}
          open={this.state.openDrawer}
          width={window.innerWidth - 260}
        >
          <div style={{ width: window.innerWidth - 260 }}>
            <AddDispatchManagerPage id={this.state.id} callback={this.callbackTask} type={this.type} documentType={this.state.documentType} close={true} />
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

  ItemComponent = (data, role, code) => (
    <>
      <div
        style={{
          padding: '20px 5px',
          margin: '20px 5px',
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'column',
        }}
      >
        {(role.find(elm => elm.name === 'PUT') || { allow: false }).allow === true ? (
          <p className="kanban" onClick={() => this.handleDispatchManager(data._id)}>
            Tên công văn: <b> {data.name}</b>
          </p>
        ) : (
          <p className="kanban" onClick={() => this.handleOpenModal(data._id)}>
            Tên công văn: <b> {data.name}</b>
          </p>
        )}

        <p className="kanban-planner">
          Người tiếp nhận: <b> {data.toUsers ? data.toUsers.map(item => item.name).join(', ') : ''}</b>
        </p>
        <p className="kanban-planner">
          Người ký: <b> {data.receiverSign ? data.receiverSign.name : ''}</b>
        </p>

        <div className="footer-kanban-item">
          <button type="button" className="footer-kanban-item-time">
            <Notifications style={{ fontSize: '1rem' }} />{' '}
            {new Date(data.replyDeadline).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' })}
          </button>
          <InsertCommentOutlined style={{ cursor: 'pointer' }} onClick={() => this.handleMeetingDialog(data)} />
        </div>
        <Dialog
          title="Xem thông tin"
          // onSave={this.handleSaveData}
          onClose={this.handleCloseEdit}
          open={this.state.openModal}
          dialogAction={false}
        >
          <ViewContent code="Documentary" id={this.state.idView} />
        </Dialog>
      </div>
    </>
  );

  handleMeetingDialog = data => {
    this.setState({
      taskItem: {
        ...this.state.taskItem,
        _id: data._id
      }, openKanbanDialog: true, dataTask: data
    });
  };

  handleDispatchManager = id => {
    this.setState({ id, openDrawer: true });
  };
  handleOpenModal = id => {
    this.setState({ idView: id, openModal: true });
    console.log(this.state.idView, '000000');
  };
  handleCloseEdit = () => {
    this.setState({ openModal: false });
  };

  onGetDispatchCustom = params1 => {
    const { dashboardPage } = this.props;
    let filter = {};
    if (Number(this.type) === 2) {
      // công văn đến bằng 2
      filter.filter = {
        toUsers: {
          $in: [`${dashboardPage.profile ? dashboardPage.profile._id : ''}`],
        },
      };
    } else {
      filter.filter = {
        fromUsers: {
          $in: [`${dashboardPage.profile ? dashboardPage.profile._id : ''}`],
        },
      };
    }
    delete filter.skip;
    delete filter.limit;
    filter = {
      ...filter,
      ...params1,
    };
    this.props.onGetallDispatch(filter);
  };

  handleTab(tab) {
    // this.props.onChangeTab(tab);
    this.setState({ tab: tab })
  }
}

DispatchManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  dispatchManager: makeSelectDispatchManager(),
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectEditProfilePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetallDispatch: query => {
      dispatch(getAllDispatchAct(query));
    },
    onDeleteDispatch: ids => {
      dispatch(deleteDispatchAct(ids));
    },
    onUpdateDispatch: data => {
      dispatch(updateDispatchAction(data));
    },
    onResetNoti: () => {
      dispatch(resetNoti());
    },
    onChangeTab: val => {
      dispatch(changeTabAct(val));
    },
    onMergeData: data => dispatch(MergeData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'dispatchManager', reducer });
const withSaga = injectSaga({ key: 'dispatchManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DispatchManager);
