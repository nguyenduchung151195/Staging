/**
 *
 * AddPersonnelPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Paper, TableHead, TableCell, TableRow, TableBody, Avatar, Tooltip, Menu, MenuItem } from '@material-ui/core';
import AddPersonnel from '../AddPersonnel';
import { createStructuredSelector } from 'reselect';
import TableUI from '@material-ui/core/Table';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import GridUI from '@material-ui/core/Grid';
import Buttons from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  ExpandMore,
  ExpandLess,
  ViewModule,
  ArrowForward,
  ArrowBack,
  InsertInvitation,
  CreateNewFolder,
  SupervisorAccount,
  Streetview,
  AccountBox,
  People,
  CalendarViewDay,
  AssignmentTurnedIn,
  AirplanemodeActive,
  Archive,
} from '@material-ui/icons';
import makeSelectAddPersonnelPage from './selectors';
import makeSelectDashboardPage, { makeSelectProfile } from '../Dashboard/selectors';
import {
  fetchAllUserAction,
  fetchListDepartment,
  fetchConfigAction,
  fetchUpdateConfigAction,
  resetNoti,
  mergeData,
  updateEmployees,
} from './actions';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import { Grid, SwipeableDrawer, Tabs, Tab, Dialog } from '../../components/LifetekUi';
// import LoadingIndicator from '../../components/LoadingIndicator';
import { API_PERSONNEL } from '../../config/urlConfig';
import Kanban from '../KanbanPlugin';
import avatarA from '../../images/default-avatar.png';
import { serialize } from '../../utils/common';
import ListPage from '../../components/List';
import HrmTree from '../HrmTree';
import VerticalDepartmentTree from '../../components/Filter/VerticalDepartmentTree';
import HrmOrganization from '../HrmOrganization/Loadable';
import FluctuationsMonth from '../../components/FluctuationsMonth';
import moment from 'moment';
import BODialog from '../../components/LifetekUi/Planner/BODialog';
const fakeData = [
  {
    name: 'Tất cả nhân sự',
    color: 'blue',
    icon: <SupervisorAccount style={{ fontSize: 50 }} />,
    type: 'all',
  },
  {
    name: 'Nhân sự mới',
    color: 'green',
    icon: <CreateNewFolder style={{ fontSize: 50 }} />,
    type: 'newStaff',
  },
  {
    name: 'Nhân sự nghỉ việc',
    color: 'blue',
    icon: <Streetview style={{ fontSize: 50 }} />,
    type: 'quitJob',
  },
  {
    name: 'Nhân sự thử việc',
    color: 'blue',
    icon: <AccountBox style={{ fontSize: 50 }} />,
    type: 'trialJob',
  },
  {
    name: 'Nhân sự chính thức',
    color: 'blue',
    icon: <People style={{ fontSize: 50 }} />,
    type: 'official',
  },
  {
    name: 'Đang thai sản',
    color: 'blue',
    icon: <CalendarViewDay style={{ fontSize: 50 }} />,
    type: 'pregnant',
  },
  {
    name: 'Thay đổi hợp đồng',
    color: 'blue',
    icon: <AssignmentTurnedIn style={{ fontSize: 50 }} />,
    type: 'contractChange',
  },
  {
    name: 'Đang nghỉ phép',
    color: 'blue',
    icon: <InsertInvitation style={{ fontSize: 50 }} />,
    type: 'takeLeave',
  },
  {
    name: 'Đang đi công tác',
    color: 'blue',
    icon: <AirplanemodeActive style={{ fontSize: 50 }} />,
    type: 'onBusiness',
  },
];

/* eslint-disable react/prefer-stateless-function */
export class AddPersonnelPage extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      tab: 0,
      tabColumn: 0,
      data: [],
      currentDepart: '',
      pageDetail: {
        currentPage: 0,
        pageSize: 0,
        totalCount: 0,
      },
      filter: {},
      expansive: true,
      widthColumn: 360,
      organizationUnitId: '',
      kanbanFilter: {},
      openDialog: false,
      crmStatusSteps: [],
      isEditting: false,
      editData: {},
      kanbanData: {},
      openKanbanDialog: false,
    };
  }
  componentWillMount() {
    const listHrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
    const listKanbanStatus = listHrmStatus ? listHrmStatus.find(item => item.code === 'ST01').data : null;
    this.setState({ listKanbanStatus });
    const filter = {
      skip: 0,
      limit: 5,
    };
    this.props.onGetAllUser(serialize(filter));
    this.props.onGetListDepartment();
  }

  onClickExpansive = () => {
    if (this.state.expansive) {
      this.setState({
        expansive: false,
        widthColumn: 50,
      });
    } else {
      this.setState({
        expansive: true,
        widthColumn: 420,
      });
    }
  };

  handleTab(tab) {
    this.setState({ tab });
  }
  callBack = (cmd, data) => {
    switch (cmd) {
      case 'kanban-dragndrop-per': {
        console.log(data, 'datadata');
        this.props.onUpdate(data);
        break;
      }
      case 'quick-add': {
        this.props.mergeData({ openDrawer: true });
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

  mapFunctionProject = item => (
    
    {
      ...item,
      name: (
        // eslint-disable-next-line react/button-has-type
        <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.props.mergeData({ openDrawer: true, id: item._id })}>
          {item.name}
        </button>
      ),
      organizatsionUnit: item.organizationUnit,
      laborStatus: item['laborStatus.title'],
      marriage: item['marriage.title'],
      title: item['title.title'],
      position: item['position.title'],
      contractType: item['contractType.title'],
      educateSystem: item['educateSystem.title'],
      specialize: item['specialize.title'],
      degree: item['degree.title'],
      informatics: item['informatics.title'],
      language1: item['language1.title'],
      role: item['role.roleName'],
      language2: item['language2.title'],
      nation: item['nation.title'],
      religion: item['religion.title'],
      shift: item['shift.title'],
      graduateSchool: item['graduateSchool.title'],
      bloodGroup: item['bloodGroup.title'],
      birthday: moment(item.birthday, 'YYYY-MM-DD').isValid() ? moment(item.birthday, 'YYYY-MM-DD').format('DD/MM/YYYY') : '',
      // birthday: moment(item.birthday, 'YYYY-MM-DD').isValid() ? moment(item.birthday, 'YYYY-MM-DD').format('DD/MM/YYYY') : moment(item['employeeId.dob'], 'YYYY-MM-DD').format('DD/MM/YYYY'),
      avatar: <Avatar src={item.avatar ? `${item.avatar}?allowDefault=true` : avatarA} />,
      organizationUnit: item['organizationUnit.name'],
      contractEndDate: item.contractEndDate ? item.contractEndDate : null,
      phoneNumber: item.phoneNumber ? item.phoneNumber : item['employeeId.phoneNumber'],
      identityCardNumber: item.identityCardNumber ? item.identityCardNumber : item['employeeId.identityCardNumber'],
      note: item.note ? item.note : item['employeeId.note'],
      address: item.address ? item.address : item['employeeId.address'],
    });

  render() {
    const { tab, filter, expansive, widthColumn, organizationUnitId, tabColumn, openDialog, crmStatusSteps, isEditting, editData } = this.state;
    const { addPersonnelPage, classes, reload, profile } = this.props;
    const { openDrawer, id } = addPersonnelPage;
    const level = 0;
    const arrDepartment = addPersonnelPage.arrDepartment || [];
    this.state.content = arrDepartment.map(depart => {
      if (depart.child && depart.child.length > 0) {
        return (
          <React.Fragment key={depart._id}>
            <TableRow onClick={() => this.selectDepartment(depart)} className={classes.tbRow}>
              <TableCell onClick={() => this.clickOpen(depart)}>
                {depart.open ? <ExpandLess /> : <ExpandMore />}
                &nbsp;
                {depart.name}
              </TableCell>
            </TableRow>
            {depart.open ? this.displayTableContent(depart.child, level + 20) : null}
          </React.Fragment>
        );
      }
      return (
        // <React.Fragment>
        <TableRow key={depart._id} onClick={() => this.selectDepartment(depart)} className={classes.tbRow}>
          <TableCell>{depart.name}</TableCell>
        </TableRow>
        // </React.Fragment>
      );
    });
    this.state.content.unshift(
      <TableRow onClick={() => this.selectDepartment('')} className={classes.tbRow}>
        <TableCell>Sơ đồ tổ chức</TableCell>
      </TableRow>,
    );
    const Bt = props => (
      <Buttons onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </Buttons>
    );

    const nameCallBack = 'per';
    return (
      <div>
        <Paper>
          <Grid container>
            <Grid item md={12}>
              <Bt tab={1}>Kanban</Bt>
              <Bt tab={2}>Biểu đồ</Bt>
              <Bt tab={0}>Danh sách</Bt>
            </Grid>
          </Grid>

          {tab === 0 ? (
            <Grid container spacing={16} direction="row" justify="flex-start" alignItems="flex-start" style={{ width: '100%' }}>
              {expansive ? (
                <Grid item container style={{ width: `${widthColumn}px` }}>
                  <VerticalDepartmentTree
                    show={true}
                    listData={fakeData}
                    openDetail={this.selectFluctuation}
                    addUser={false}
                    addHrm={true}
                    departments={arrDepartment}
                    onChange={this.selectDepartment}
                    departmentId={organizationUnitId}
                  />
                </Grid>
              ) : (
                <Grid item container style={{ width: `${widthColumn}px` }}>
                  <Grid item container className="ml-1">
                    <ArrowForward color="primary" onClick={this.onClickExpansive} />
                  </Grid>
                </Grid>
              )}
              <Grid item style={{ width: `calc(100% - ${widthColumn}px)` }}>
                <ListPage
                  filterWidth="25%"
                  code="hrm"
                  // codeModule="hrmPersonnelRecordsManagement"
                  status="hrmStatus"
                  kanban="ST01"
                  exportExcel
                  kanbanKey="_id"
                  apiUrl={API_PERSONNEL}
                  mapFunction={this.mapFunctionProject}
                  filter={filter}
                />
              </Grid>
            </Grid>
          ) : null}

          {tab === 1 ? (
            <Kanban
              isOpenSinglePage
              propsAll={this.props}
              enableAdd
              statusType="hrmStatus"
              titleField="name" // tên trường sẽ lấy làm title trong kanban
              callBack={this.callBack} // sự kiện trả về kanban
              path={API_PERSONNEL}
              code="ST01" // code của danh sách trạng thái kanban
              reload={reload}
              filter={this.state.kanbanFilter}
              customContent={customContent}
              nameCallBack={nameCallBack}
              customActions={[
                {
                  action: 'comment',
                  // params: 'typeLine=4',
                },
              ]}
              history={this.props.history}
              params="personnel"
            />
          ) : null}
          {tab === 2 ? <HrmOrganization {...this.props.history} /> : null}
          <SwipeableDrawer
            anchor="right"
            onClose={() => this.props.mergeData({ openDrawer: false })}
            open={openDrawer}
            width={window.innerWidth - 260}
          >
            <div style={{ width: window.innerWidth - 260 }}>
              <AddPersonnel id={id} propsAll={this.props} onClose={() => this.props.mergeData({ openDrawer: false })} />
            </div>
          </SwipeableDrawer>
          <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
            <BODialog
              setCoverTask={() => { }}
              profile={profile}
              taskId={this.state.kanbanData._id}
              data={this.state.kanbanData}
              API={API_PERSONNEL}
              customContent={customContent}
            />
          </Dialog>
        </Paper>
      </div>
    );
  }

  onGetAllItemsCustom = params1 => {
    const { currentDepart } = this.state;
    let body = '';
    body = serialize(params1);
    if (currentDepart !== '') {
      const filter = {
        filter: {
          'organizationUnit.organizationUnitId': currentDepart,
        },
      };
      body += `&${serialize(filter)}`;
    }
    this.props.onGetAllUser(body);
  };

  selectDepartment = depart => {
    // console.log(depart,'departdepart');
    if (depart !== '') {
      const filter = {
        organizationUnit: depart._id,
      };
      this.setState({ filter });
    }
  };

  selectFluctuation = fluc => {
    // console.log(fluc,'flucfluc');
    let filter;
    if (fluc === 'all') {
      filter = {};
    } else if (fluc === 'newStaff') {
      // nhân sự mới
      filter = {
        createdAt: {
          $gte: moment().startOf('month').format(),
          $lte: moment().endOf('month').format(),
          $exists: "true"
        },
      };
    } else if (fluc === 'quitJob') {
      // nhân sự nghỉ vc
      filter = {
        inactivityDate: {
          $gte: moment().startOf('month').format(),
          $lte: moment().endOf('month').format(),
          $exists: "true"
        },
        // inactivityDate: {
        //   $gte: moment().endOf('month').toDate()
        // },
        // inactivityDate: {
        //   $exists: "true"
        // },
        restStatus: 'true',
      };
    } else if (fluc === 'trialJob') {
      // nhân sự thử vc
      filter = { 
        ['contractType.value']: 'TVC', 
        restStatus: 'false',
        // type: 'probation',
        contractStartDate: {
          $lte: moment().add(1, 'M').startOf('month').format()
        },
        contractEndDate : {
          $gte: moment().endOf('month').format('YYYY-MM'),
        }
      };
    } else if (fluc === 'official') {
      // nhân sự chính thức
      filter = { 
        ['contractType.value']: 'NVCT',
        restStatus: 'false',
        // type: 'official',
        contractStartDate: {
          $lte: moment().add(1, 'M').startOf('month').format()
        },
        contractEndDate : {
          $gte: moment().endOf('month').format('YYYY-MM'),
        }

      };
    } else if (fluc === 'pregnant') {
      // đg thai sản
      filter = {
        // maternityProcess: {$lte: moment()
        // .endOf('day')
        // .format()},
        type: 'pregnant',
        restStatus: 'false'
      };
    } else if (fluc === 'contractChange') {
      // thay đổi hợp đồng
      filter = {
        // contractProcess: {$lte: moment()
        //   .endOf('day')
        //   .format()},
        type: 'contractChange',
      };
    } else if (fluc === 'takeLeave') {
      // đg nghỉ phép
      filter = {
        type: 'takeLeave',
        restStatus: 'false'
      };
    } else if (fluc === 'onBusiness') {
      // đg đi công tác
      filter = {
        type: 'onBusiness',
        restStatus: 'false'
      };
    } else {
      filter = {
        type: fluc,
      };
    }
    this.setState({ filter });
  };

  clickOpen = depart => {
    /* eslint-disable */
    if (!depart.open) {
      depart.open = true;
    } else {
      depart.open = false;
    }
    this.setState({ changeOpen: true });
    /* eslint-enable */
  };

  displayTableContent = (dataList, level) => {
    // eslint-disable-line
    const { classes } = this.props;
    this.state.changeOpen = false;
    return dataList.map(department => {
      if (department.child && department.child.length > 0) {
        return (
          <React.Fragment key={department._id}>
            <TableRow onClick={() => this.selectDepartment(department)} className={classes.tbRow}>
              <TableCell onClick={() => this.clickOpen(department)}>
                <span style={{ padding: `${level}px` }} />
                {department.open ? <ExpandLess /> : <ExpandMore />}
                &nbsp;
                {department.name}
              </TableCell>
            </TableRow>

            {department.open ? this.displayTableContent(department.child, level + 20) : null}
          </React.Fragment>
        );
      }
      return (
        <TableRow key={department._id} onClick={() => this.selectDepartment(department)} className={classes.tbRow}>
          <TableCell>
            <span style={{ padding: `${level}px` }} />
            {department.name}
          </TableCell>
        </TableRow>
      );
    });
  };
}

AddPersonnelPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
  onGetAllUser: PropTypes.func.isRequired,
  addPersonnelPage: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  addPersonnelPage: makeSelectAddPersonnelPage(),
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAllUser: id => {
      dispatch(fetchAllUserAction(id));
    },

    onGetConfig: () => {
      dispatch(fetchConfigAction());
    },
    onUpdate: body => {
      dispatch(updateEmployees(body));
    },
    onUpdateConfig: body => {
      dispatch(fetchUpdateConfigAction(body));
    },

    onResetNoti: () => {
      dispatch(resetNoti());
    },
    onGetListDepartment: () => {
      dispatch(fetchListDepartment());
    },
    mergeData: data => {
      dispatch(mergeData(data));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addPersonnelPage', reducer });
const withSaga = injectSaga({ key: 'addPersonnelPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddPersonnelPage);
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
