/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-danger */
/**
 *
 * ApprovePage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import messages from './messages';
import { injectIntl } from 'react-intl';
import CustomAppBar from 'components/CustomAppBar';
import { PagingState, IntegratedPaging, SearchState, IntegratedFiltering } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel, Toolbar, SearchPanel } from '@devexpress/dx-react-grid-material-ui';
import {
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogTitle,
  // MenuItem,
  // TextField,
  // Button,
  // FormControlLabel,
  // Checkbox,
  // TextField,
  // MenuItem,
  Paper,
  Grid as GridMatarialUI,
  Avatar,
  Badge,
  Tabs,
  Tab,
  // Button,
  // IconButton,
  TextField,
  MenuItem,
  Fab,
} from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import { ArrowRightAlt, VoiceOverOff, Done, Clear, HourglassEmpty, Assignment } from '@material-ui/icons';
import injectReducer from 'utils/injectReducer';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import ApproveDialog from '../../components/ApproveDialog';
import makeSelectApprovePage from './selectors';
import reducer from './reducer';
import { clientId } from '../../variable';
import { getDataBeforeSend } from '../../helper';
import request from 'utils/request';
import { API_COMMON_MODULE } from 'config/urlConfig';
import saga from './saga';
import { getApproveAction, resetNotis, updateApproveAction } from './actions';
import ApproveFormDialog from './approveFormDialog';
import { Comment, FileUpload } from '../../components/LifetekUi';
import LtTab from '../../components/TabContainer';
import CustomInputField from '../../components/Input/CustomInputField';

/* eslint-disable react/prefer-stateless-function */
const columns = [
  { name: 'name', title: 'Tên' },
  { name: 'subCode', title: 'Quy trình' },
  { name: 'detail', title: 'Thông tin chi tiết' },
  { name: 'groupInfo', title: 'Trạng thái phê duyệt' },
  { name: 'actions', title: 'Hành động' },
];
// const moduleList = [
//   {
//     value: 'all',
//     label: 'Tất cả',
//   },
//   {
//     value: 'BusinessOpportunities',
//     label: 'Cơ hội kinh doanh',
//   },
// ];
const styles = () => ({
  badge: {
    background: '#f37736',
    width: 16,
  },
  accepted: {
    background: '#7bc043',
    width: 16,
  },
  denied: {
    background: '#ee4035',
    width: 16,
  },
});
const CustomGroup = props => (
  <div>
    <p>
      <b>Biểu mẫu chi tiết: </b>
      <span
        onClick={() => {
          props.handleViewForm(props.rowData);
        }}
        style={{ color: '#0392cf', cursor: 'pointer' }}
      >
        Chi tiết
      </span>
    </p>
    <p>
      <b>Ngày tạo:</b> {moment(props.rowData.createdAt).format('DD-MM-YYYY')}
    </p>
  </div>
);
const CustomApproveStatus = props => (
  <div className="py-2">
    <GridMatarialUI container>
      {props.rowData.groupInfo.map((item, index) => (
        <GridMatarialUI item sm={4}>
          <GridMatarialUI container className="my-1">
            {!item.userId ? (
              <GridMatarialUI item sm={6}>
                <Avatar style={{ height: 32, width: 32, border: '2px solid red' }}>
                  <VoiceOverOff style={{ fontSize: '24px!important' }} />
                </Avatar>
              </GridMatarialUI>
            ) : (
              <GridMatarialUI item sm={6}>
                {item.approve === 1 ? (
                  <Badge badgeContent={<Done style={{ fontSize: 12 }} />} color="primary" classes={{ badge: props.classes.accepted }}>
                    <Avatar style={{ height: 32, width: 32, border: '2px solid #7bc043' }} src={item.avatar} />
                  </Badge>
                ) : (
                  ''
                )}
                {item.approve === 2 ? (
                  <Badge badgeContent={<Clear style={{ fontSize: 12 }} />} color="primary" classes={{ badge: props.classes.denied }}>
                    <Avatar style={{ height: 32, width: 32, border: '2px solid #ee4035' }} src={item.avatar} />{' '}
                  </Badge>
                ) : (
                  ''
                )}
                {item.approve === 0 && props.rowData.approveIndex !== item.order ? (
                  <Avatar style={{ height: 32, width: 32 }} src={item.avatar} />
                ) : (
                  ''
                )}
                {props.rowData.approveIndex === item.order && item.approve === 0 ? (
                  <Badge badgeContent={<HourglassEmpty style={{ fontSize: 12 }} />} color="primary" classes={{ badge: props.classes.badge }}>
                    <Avatar
                      onClick={() => {
                        props.handleAvatarClick(props.rowData);
                      }}
                      style={{ height: 32, width: 32, cursor: 'pointer' }}
                      src={item.avatar}
                    />
                  </Badge>
                ) : (
                  ''
                )}
              </GridMatarialUI>
            )}

            {index !== props.rowData.groupInfo.length - 1 ? (
              <GridMatarialUI item sm={6}>
                <ArrowRightAlt />
              </GridMatarialUI>
            ) : (
              ''
            )}
          </GridMatarialUI>
        </GridMatarialUI>
      ))}
    </GridMatarialUI>
  </div>
);
export class ApprovePage extends React.Component {
  state = {
    listApproveRequest: [],
    currentUserRequestOrigin: [],
    open: false,
    openForm: false,
    formContent: '',
    dialogData: {},
    currentUser: {},
    currentModuleCode: 'all',
    tabIndex: 0,
    id: undefined,
    listSubApprove: '',
    moduleList: [],
    // isCurrentUserTurn: false,
  };

  componentWillMount() {
    const { match } = this.props;
    if (match.params) {
      const id = match.params.id;
      if (id) {
        this.state.open = true;
        this.state.id = id;
      }
    }
  }

  async getModuleList() {
    try {
      const res = await request(API_COMMON_MODULE, { method: 'GET' });
      const newModuleList = [];
      Object.keys(res).forEach(key => {
        if (key) {
          newModuleList.push({
            value: key,
            label: res[key].title,
          });
        }
      });
      const allModule = [
        { value: 'all', label: 'Tất cả' },
        ...newModuleList.sort((a, b) => {
          if (a.label > b.label) return 1;
          return -1;
        }),
      ];
      console.log('allModule', allModule);
      this.setState({ moduleList: allModule });
      // console.log('res', res);
    } catch (e) {
      console.log('e', e);
    }
  }

  componentDidMount() {
    this.props.onGetApprove();
    this.getModuleList();
  }

  componentWillReceiveProps(props) {
    const { approvePage } = props;
    const newData = [];
    const originData = [];
    if (approvePage.approveRequest && this.state.tabIndex === 0) {
      approvePage.approveRequest.forEach(item => {
        item.groupInfo.forEach(person => {
          if (person.person === approvePage.currentUser.userId) {
            originData.push(item);
          }
        });
      });
      originData.forEach(item => {
        let notFinish = false;
        item.groupInfo.forEach(element => {
          if (element.approve === 0) {
            notFinish = true;
          }
        });
        if (notFinish) {
          newData.push(item);
        }
      });
      this.state.listApproveRequest = newData;
      this.state.listSubApprove = [...new Set(newData.map(item => item.subCode))];
      this.state.currentUser = approvePage.currentUser;
      this.state.currentUserRequestOrigin = originData;
      if (this.state.id) {
        const dialogData = originData.find(item => item._id === this.state.id);
        if (dialogData) {
          this.state.dialogData = dialogData;
        }
      }
      if (this.state.currentUser) {
        const newData = [];
        originData.forEach(item => {
          const user = item.groupInfo.find(d => d.person === this.state.currentUser.userId);
          if (user.approve === 0) {
            newData.push(item);
          }
        });
        this.state.listApproveRequest = newData;
      }
    }
    this.props.onResetNotis();
  }

  handleOpenApproveDialog = data => {
    // eslint-disable-next-line react/no-access-state-in-setstate

    this.setState({ open: true, dialogData: data });
  };

  handleViewForm = async data => {
    const html = await getDataBeforeSend({
      templateId: data.dynamicForm,
      dataId: data.dataInfo.idOb ? data.dataInfo.idOb : data.dataInfo._id,
      moduleCode: data.collectionCode,
    });
    this.setState({ openForm: true, formContent: html });
  };

  dialogCallBack = (cmd, data) => {
    switch (cmd) {
      case 'form-close':
        this.setState({ openForm: false });
        break;
      case 'close':
        this.setState({ open: false });
        break;
      case 'approve-result': {
        data.approveData.clientId = clientId;
        this.props.onSendApprove(this.state.dialogData, data, this.state.currentUser);
        const { dialogData } = this.state;
        dialogData.groupInfo[dialogData.approveIndex].approve = data.approveData.approveCommand;
        dialogData.groupInfo[dialogData.approveIndex].reason = data.approveData.reason;
        this.setState({ dialogData });
        break;
      }
      default:
        break;
    }
  };

  handleChangeTab = (event, value) => {
    console.log(value, "ssss");
    const newData = [];
    this.state.currentUserRequestOrigin.forEach(item => {
      const user = item.groupInfo.find(d => d.person === this.state.currentUser.userId);
      if (user.approve === value) {
        newData.push(item);
      }
    });
    this.setState({ tabIndex: value, listApproveRequest: newData });
  };

  render() {
    const { listApproveRequest, open, currentUser, tabIndex, dialogData, openForm, formContent, moduleList } = this.state;
    const { intl } = this.props;
    // const currentItemViewconfig = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === this.state.currentItem.code);
    // const columns = [...currentItemViewconfig.view.listDisplay.type.fields.type.columns, ...currentItemViewconfig.view.listDisplay.type.fields.type.others];
 
    const newRows = listApproveRequest.map(item => {
      const newItem = Object.assign({}, item);
      newItem.groupInfo = <CustomApproveStatus handleAvatarClick={this.handleOpenApproveDialog} {...this.props} rowData={item} />;
      newItem.detail = <CustomGroup handleViewForm={this.handleViewForm} {...this.props} rowData={item} />;
      return {
        ...newItem,
        actions: (
          <Fab
            size="small"
            onClick={() => {
              this.handleOpenApproveDialog(item);
            }}
            variant="outlined"
            color="primary"
          >
            <Assignment />
          </Fab>
        ),
      };
    });
    // console.log(newRows);
    let notApprove = 0;
    let notApproved = 0;
    let approved = 0;
    this.state.currentUserRequestOrigin.forEach(item => {
      const user = item.groupInfo.find(d => d.person === this.state.currentUser.userId);
      if (user.approve === 1) {
        approved++;
      }
      if (user.approve === 2) {
        notApproved++;
      }
      if (user.approve === 0) {
        notApprove++;
      }
    });
    return (
      <>
        <CustomAppBar title="Phê Duyệt" onGoBack={() => this.props.history.goBack()} disableAdd />
        <div>
          <Paper className="p-4">
            {/* <LtTab>
            <Tab title="Phê duyệt">

            </Tab>
            <Tab title="Nội dung">
              {columns.map(cols => (
                <CustomInputField 
                  value={this.state.currentItem[cols.name]}
                  name={cols.name}
                  type={cols.type}
                  label={cols.title}
                  configType="crmSource"
                  configCode={cols.code}
                  configId={cols.id}
                  // onChange={handleChange}
                />
              ))}
            </Tab>
            <Tab title="Tài liệu">
              <FileUpload code={this.state.currentItem.code} id={this.state.currentItem.objectId} />
            </Tab>
            <Tab title="Bình luận">
              <Comment profile={this.state.currentUser} code={this.state.currentItem.code} id={this.state.currentItem.objectId} />
            </Tab>
          </LtTab> */}
            <GridMatarialUI container>
              <GridMatarialUI item sm={2}>
                <TextField
                  fullWidth
                  id="outlined-select-currency"
                  select
                  value={this.state.currentModuleCode}
                  margin="normal"
                  variant="outlined"
                  onChange={event => {
                    const newData = [];
                    if (event.target.value === 'all') {
                      this.state.currentUserRequestOrigin.forEach(item => {
                        const user = item.groupInfo.find(d => d.person === this.state.currentUser.userId);
                        if (user.approve === this.state.tabIndex) {
                          newData.push(item);
                        }
                      });
                    } else {
                      this.state.currentUserRequestOrigin.forEach(item => {
                        if (item.collectionCode === event.target.value) {
                          const user = item.groupInfo.find(d => d.person === this.state.currentUser.userId);
                          if (user.approve === this.state.tabIndex) {
                            newData.push(item);
                          }
                        }
                      });
                    }
                    this.setState({ currentModuleCode: event.target.value, listApproveRequest: newData });
                  }}
                >
                  {moduleList.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </GridMatarialUI>
            </GridMatarialUI>

            <Tabs indicatorColor="primary" color="primary" value={tabIndex} >
              <Tab
              onClick={()=>this.handleChangeTab("", 0)}
                label={
                  <Badge color="primary" badgeContent={notApprove}>
                    {intl.formatMessage(messages.hasntbeenapproved || { id: 'hasntbeenapproved' })}
                  </Badge>
                }
              />
              <Tab
               onClick={()=>this.handleChangeTab("", 1)}
                label={
                  <Badge color="primary" badgeContent={approved}>
                    {intl.formatMessage(messages.approved || { id: 'approved' })}
                  </Badge>
                }
              />
              <Tab
               onClick={()=>this.handleChangeTab("", 2)}
                label={
                  <Badge color="primary" badgeContent={notApproved}>
                    {intl.formatMessage(messages.notapproved || { id: 'notapproved' })}
                  </Badge>
                }
              />
            </Tabs>
            <Paper>
              <Grid rows={newRows} columns={columns}>
                <SearchState />
                <PagingState defaultCurrentPage={0} pageSize={5} />
                <IntegratedFiltering />
                <IntegratedPaging />
                <Table />
                <TableHeaderRow />
                <PagingPanel />
                <Toolbar />
                <SearchPanel searchPlaceholder="Tìm kiếm" />
              </Grid>
            </Paper>
          </Paper>
          {open ? <ApproveDialog currentUser={currentUser} dialogData={dialogData} callBack={this.dialogCallBack} open={open} /> : ''}
          {openForm ? <ApproveFormDialog content={formContent} callBack={this.dialogCallBack} open={openForm} /> : ''}
        </div>
      </>
    );
  }
}

ApprovePage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  approvePage: makeSelectApprovePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onResetNotis: () => {
      dispatch(resetNotis());
    },
    onGetApprove: () => {
      dispatch(getApproveAction());
    },
    onSendApprove: (approve, result, user) => {
      dispatch(updateApproveAction(approve, result, user));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'approvePage', reducer });
const withSaga = injectSaga({ key: 'approvePage', saga });

export default compose(
  injectIntl,
  withStyles(styles),
  withReducer,
  withSaga,
  withConnect,
)(ApprovePage);
