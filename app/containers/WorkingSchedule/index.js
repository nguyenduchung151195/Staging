/**
 *
 * WorkingSchedule
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List';
import { Notifications, Comment as InsertCommentOutlined } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import Kanban from 'components/LifetekUi/Planner/PlanDemo';
import AddProjects from 'containers/AddProjects';
import AddWorkingSchedule from 'containers/AddWorkingSchedule';
import injectReducer from 'utils/injectReducer';
import { API_MEETING } from '../../config/urlConfig';
import { Paper, SwipeableDrawer, Dialog } from '../../components/LifetekUi';
import makeSelectWorkingSchedule from './selectors';
import { makeSelectMiniActive } from '../Dashboard/selectors';
import { Grid as GridMUI ,Tab, Tabs } from '@material-ui/core';
import reducer from './reducer';
import saga from './saga';
import { getData } from './actions';
// import { calendarColumns } from '../../variable';
import CalendarComponent from '../../components/Calendar';
import Automation from '../PluginAutomation/Loadable';
import messages from './messages';
import { injectIntl } from 'react-intl';
import DemoDialog from '../../components/LifetekUi/Planner/DemoDialog';
import MeetingDialogContent from '../../components/MeetingDialogContent/Loadable';
import makeSelectEditProfilePage from '../EditProfilePage/selectors';

/* eslint-disable react/prefer-stateless-function */
export class WorkingSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      id: 'add',
      openDrawer: false,
      openDrawerMeeting: false,
      openKanbanDialog: false,
      kanbanStatus: 0,
      data: {},
    };
  }

  componentDidMount() {
    this.props.getData();
  }

  mapFunctionCalendar = item => ({
    ...item,
    typeCalendar: item.typeCalendar === '1' ? 'Lịch họp' : 'Lịch công tác',
    organizer: item['organizer.name'],
    task: item['task.name'],
    roomMetting: item['roomMetting.name'],
    approved: item['approved.name'],
    createdBy: item.createdByName ? item.createdByName : null,
  });

  handleChangeTask = id => {
    this.setState({ openDrawer: true, id });
  };

  render() {
    const { tabIndex } = this.state;
    const { workingSchedule, intl, miniActive , profile} = this.props;
    return (
      <div>
        <Helmet>
          <title>Lịch Họp</title>
          <meta name="description" content="Description of MeetingPage" />
        </Helmet>
        <Tabs value={tabIndex} onChange={(e, tabIndex) => this.setState({ tabIndex })} aria-label="simple tabs example">
          <Tab value={0} label={intl.formatMessage(messages.list || { id: 'list' })} />
          <Tab value={1} label={intl.formatMessage(messages.calendar || { id: 'calendar' })} />
          <Tab value={2} label={intl.formatMessage(messages.kanban || { id: 'kanban' })} />
          <Tab value={3} label="AutoMation Rules" />
        </Tabs>
        <div>
          {tabIndex === 0 ? (
            <Paper>
              <ListPage
                height="640px"
                showDepartmentAndEmployeeFilter
                kanban="ST16"
                // reload={calendarPage.reload}
                exportExcel
                filter={{ typeCalendar: '2' }}
                // columns={calendarColumns}
                code="Calendar"
                apiUrl={API_MEETING}
                mapFunction={this.mapFunctionCalendar}
                columnExtensions={[{ columnName: 'editcustom', width: 180 }, { columnName: 'edit', width: 150 }]}
              />
            </Paper>
          ) : null}

          {tabIndex === 1 ? (
            <CalendarComponent
              meetings={workingSchedule.mettings}
              filter={{typeCalendar: '2'}}
              // visits={visits}
            />
          ) : null}
          {tabIndex === 2 ? (
            <Kanban
              addItem={this.addItemKanban}
              module="crmStatus"
              code="ST16"
              kanbanOption={{
                code: "ST16",
                module: "crmStatus",
              }}
              apiUrl={API_MEETING}
              itemComponent={this.ItemComponent}
              filter={{ typeCalendar: '2' }}
            />
          ) : null}
        </div>
        {tabIndex === 3 ? (
          <Automation
            code="ST16" // code của danh sách trạng thái kanban
            path="/crm/Calendar" // path để lấy viewconfig (hiển thị danh sách các trường bắt trigger)
            kanbanStatus="String"
          />
        ) : null}
        <GridMUI item sm={12}>
            <Dialog fullWidth maxWidth="lg" open={this.state.openDialog}>
              <MeetingDialogContent
                closeDialog={() => {
                  this.setState({ openDialog: false });
                }}
                {...this.props}
                editData={this.state.editData}
                isEditting={this.state.isEditting}
              />
            </Dialog>
            <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
              <DemoDialog profile={profile} taskId={this.state.data._id} data={this.state.data} />
            </Dialog>
        </GridMUI>
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDrawer: false, id: 'add' })}
          open={this.state.openDrawer}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <div>
            <AddProjects
              mettingSchedule={this.state.id}
              data={{ isProject: false }}
              id="add"
              callback={this.callbackTask}
              onClose={() => this.setState({ openDrawer: false, id: 'add' })}
            />
          </div>
        </SwipeableDrawer>

        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDrawerMeeting: false, id: 'add' })}
          open={this.state.openDrawerMeeting}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <div style={{ width: window.innerWidth - 260 }}>
            <AddWorkingSchedule id="add" callback={this.callback}  kanbanStatus={this.state.kanbanStatus} propsAll={this.props} />
          </div>
        </SwipeableDrawer>
      </div>
    );
  }

  addItemKanban = id => {
    this.setState({ openDrawerMeeting: true, kanbanStatus: id });
  };

  callbackTask = () => {
    this.setState({ openDrawer: false });
  };
  callback = () => {
    this.setState({ openDrawerMeeting: false, reload: this.props.workingSchedule.reload + 1 });
  };
  ItemComponent = data => (
    <div
      style={{
        padding: '20px 5px',
        margin: '20px 5px',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
      }}
    >
      <p className="kanban-planner" onClick={() => this.handleMeetingPage(data._id)}>
        Tên cuộc họp: <b> {data.name}</b>
      </p>
      <p className="kanban-planner">
        Người tham gia: <b> {data.people ? data.people.map(item => item.name).join(', ') : ''}</b>
      </p>
      <p className="kanban-planner">
        Địa điểm: <b> {data.address}</b>
      </p>

      <div className="footer-kanban-item">
        <button type="button" className="footer-kanban-item-time">
          <Notifications style={{ fontSize: '1rem' }} /> {new Date(data.date).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' })}
        </button>
        <InsertCommentOutlined style={{ cursor: 'pointer' }} onClick={() => this.handleMeetingDialog(data)}/>
      </div>
    </div>
  );
  handleMeetingDialog = data => {
    this.setState({ data, openKanbanDialog: true });
  };
  handleMeetingPage = id => {
    this.setState({ id, openDrawerMeeting: true });
  };
}

WorkingSchedule.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  workingSchedule: makeSelectWorkingSchedule(),
  miniActive: makeSelectMiniActive(),
  profile: makeSelectEditProfilePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getData: () => dispatch(getData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'workingSchedule', reducer });
const withSaga = injectSaga({ key: 'workingSchedule', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(WorkingSchedule);
