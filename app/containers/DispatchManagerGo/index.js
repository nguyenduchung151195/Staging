/**
 *
 * DispatchManagerGo
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid } from '@material-ui/core';
import { Notifications, Comment as InsertCommentOutlined } from '@material-ui/icons';
import CustomButton from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
// import axios from 'axios';
// import Kanban from '../KanbanPlugin';
// import HOCTable from '../HocTable';
import Kanban from 'components/LifetekUi/Planner/PlanDemo';
import { SwipeableDrawer, Paper, Dialog } from '../../components/LifetekUi';
import { API_DISPATCH_OUTGOING, API_DISPATCH } from '../../config/urlConfig';
import makeSelectDispatchManagerGo, { makeSelectDashboardPage } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData } from './actions';
import Automation from '../PluginAutomation/Loadable';
import AddDispatchManagerPage from '../AddDispatchManagerPage';
import CalendarContainer from '../CalendarContainer';
import ListPage from '../../components/List';
import DMDialog from '../../components/LifetekUi/Planner/DMDialog';
import makeSelectEditProfilePage from '../EditProfilePage/selectors';
import ViewContent from 'components/ViewContent/Loadable';
// import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
export class DispatchManagerGo extends React.Component {
  constructor() {
    super();
    const crmSource = JSON.parse(localStorage.getItem('crmSource'));
    this.state = {
      openDialog: false,
      openModal: false,
      openDrawer: false,
      idView: null,
      id: 'add',
      crmSource,
      openKanbanDialog: false,
      taskItem: {
        priority: 1,
      },
    };
  }

  componentWillMount() {
    if (this.props.match.url.includes('outGoingDocument')) {
      this.type = '1';
    } else {
      this.type = '2';
    }
  }

  componentDidMount() {
    if (this.props.match.url.includes('outGoingDocument')) {
      this.type = '1';
    } else {
      this.type = '2';
    }
    this.setState({ id: 'add' });
  }

  callBack = (cmd, data) => {
    switch (cmd) {
      case 'kanban-dragndrop': {
        this.props.onUpdateDispatch(data); // Cập nhật lại object cơ hội kinh doanh
        break;
      }

      default:
        break;
    }
  };

  handleTab(tab) {
    this.props.mergeData({ tab });
  }

  handleAddClick = () => {
    this.setState({ openDialog: true });
  };

  handleClickEdit = data => {
    this.setState({ openDrawer: true, id: data._id });
  };

  handleDelete = () => {
    alert('Bạn không có quyền xóa');
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
  addItemKanban = id => {
    this.setState({ openDrawer: true, kanbanStatus: id });
  };
  render() {
    const { dispatchManagerGo, dashboardPage, profile } = this.props;
    const { tab, reload } = dispatchManagerGo;
    const Bt = props => (
      <CustomButton onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </CustomButton>
    );
    return (
      <div>
        <Grid container style={{ width: '100%' }}>
          <Grid item md={12}>
            <Bt tab={5}>Automation rules</Bt>
            <Bt tab={1}>Kanban</Bt>
            <Bt tab={0}>Danh sách</Bt>
            <Bt tab={2}>Lịch</Bt>
          </Grid>
          <Grid item md={12}>
            {tab === 1 ? (
              <Kanban
                module="crmStatus"
                codeModule="outGoingDocument"
                reload={reload}
                code="ST17"
                kanbanOption={{
                  code: "ST17",
                  module: "crmStatus",
                }}
                apiUrl={API_DISPATCH}
                itemComponent={this.ItemComponent}
                filter={{ type: '1' }}
                addItem={this.addItemKanban}
              />
            ) : null}
            {tab === 0 ? (
              <Paper>
                <ListPage
                  height="650px"
                  showDepartmentAndEmployeeFilter
                  exportExcel
                  mapFunction={this.mapFunction}
                  code="outDocumentary"
                  // code="Documentary"
                  codeRole="outGoingDocument"
                  apiUrl={API_DISPATCH_OUTGOING}
                  employeeFilterKey="createdBy"
                  kanban="ST17"
                  filter={{
                    type: '1',
                  }}
                />
              </Paper>
            ) : null}
            {tab === 5 ? (
              <Automation
                code="ST17" // code của danh sách trạng thái kanban
                path="/crm/Documentary" // path để lấy viewconfig (hiển thị danh sách các trường bắt trigger)
                kanbanStatus="String"
              />
            ) : null}
            {tab === 2 ? (
              <CalendarContainer
                column={{
                  Id: 'code',
                  Subject: 'name',
                  Location: 'where',
                  StartTime: 'createdAt',
                  EndTime: 'createdAt',
                  CategoryColor: '#357cd2',
                }}
                url={`${API_DISPATCH_OUTGOING}`}
                handleAdd={this.handleAddClick}
                handleEdit={this.handleClickEdit}
                handleDelete={this.handleDelete}
                code="ST14"
                querySort={{
                  filter: {
                    type: '1',
                  },
                }}
              />
            ) : null}
          </Grid>
        </Grid>
        {this.state.openDialog ? (
          <AddDispatchManagerPage
            type={this.type}
            handleClose={() => {
              if (this.props.match.params.id) {
                this.setState({ editData: undefined });
                this.props.history.push(`${this.type === '1' ? '/Documentary/outGoingDocument' : '/Documentary/inComingDocument'}`);
              } else {
                this.setState({ isEdit: false, openDialog: false, editData: undefined });
                this.onGetDispatchCustom({ skip: 0, limit: 5 });
              }
            }}
            documentType="outGoingDocument"
            dashboardPage={this.props.dashboardPage}
            isEdit={this.state.isEdit}
            editData={this.state.editData}
            {...this.props}
            open={this.state.openDialog}
          />
        ) : (
          ''
        )}
        <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
          <DMDialog profile={profile} taskId={this.state.taskItem._id} data={this.state.taskItem} />
        </Dialog>
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDrawer: false, id: 'add' })}
          open={this.state.openDrawer}
          width={window.innerWidth - 260}
        >
          <div style={{ width: window.innerWidth - 260 }}>
            <AddDispatchManagerPage id={this.state.id} callback={this.callbackTask} documentType="outGoingDocument" />
          </div>
        </SwipeableDrawer>
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
          Người gửi: <b> {data.fromUsers ? data.fromUsers.map(item => item.name).join(', ') : ''}</b>
        </p>
        <p className="kanban-planner">
          Người ký: <b> {data.receiverSign ? data.receiverSign.name : ''}</b>
        </p>

        <div className="footer-kanban-item">
          <button type="button" className="footer-kanban-item-time">
            <Notifications style={{ fontSize: '1rem' }} /> {new Date(data.receiveTime).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' })}
          </button>
          <InsertCommentOutlined style={{ cursor: 'pointer' }} onClick={() => this.handleMeetingDialog(data)} />
        </div>
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

  callbackTask = () => {
    this.setState({ openDrawer: false, reload: this.props.dispatchManagerGo.reload + 1 });
    this.setState({ id: 'add' });
  };
}

DispatchManagerGo.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  dispatchManagerGo: makeSelectDispatchManagerGo(),
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectEditProfilePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'dispatchManagerGo', reducer });
const withSaga = injectSaga({ key: 'dispatchManagerGo', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DispatchManagerGo);
