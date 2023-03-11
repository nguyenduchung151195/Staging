/**
 *
 * UsersPage
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
 import { Paper } from '@material-ui/core';
 import { withStyles } from '@material-ui/core/styles';
 import { withSnackbar } from 'notistack';
 import {
   Button,
   Typography,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Avatar,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   MenuItem,
   TextField,
   Tooltip,
 } from '@material-ui/core';
 import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
 import AccountCircle from '@material-ui/icons/AccountCircle';
 import GridUI from '@material-ui/core/Grid';
 import TableUI from '@material-ui/core/Table';
 import ExpandMore from '@material-ui/icons/ExpandMore';
 import ExpandLess from '@material-ui/icons/ExpandLess';
 import Circle from '@material-ui/icons/CheckCircle';
 import { NavLink, Link } from 'react-router-dom';
 import injectSaga from 'utils/injectSaga';
 import injectReducer from 'utils/injectReducer';
 import LoadingIndicator from '../../components/LoadingIndicator';
 import makeSelectUsersPage from './selectors';
 import reducer from './reducer';
 import saga from './saga';
 import {
   fetchAllUserAction,
   fetchConfigAction,
   fetchUpdateConfigAction,
   fetchDeleteUsersAction,
   resetNoti,
   fetchListDepartment,
   fetchChangePassword,
 } from './actions';
 import styles from './styles';
 import HOCTable from '../HocTable';
 import { serialize } from '../../utils/common';
 import HistoryLogin from './HistoryLogin';
 import ListPage from '../../components/List';
 import { API_USERS } from '../../config/urlConfig';
 import { SwipeableDrawer } from '../../components/LifetekUi';
 import avatarA from '../../images/avatar.png';
 import request from '../../utils/request';
 import axios from 'axios';
 
 /* eslint-disable react/prefer-stateless-function */
 const CustomAvt = props => <Avatar src={`${props.item.avatar}?allowDefault=true`} />;
 
 const CustomStatus = props => {
   if (props.item.status === 1) return <div style={{ color: '#40FF00' }}>Hoạt động</div>;
   return <div style={{ color: 'red' }}>Không hoạt động</div>;
 };
 const CustomGender = props => {
   if (props.item.gender === 'male') return <div>Nam</div>;
   return <div>Nữ</div>;
 };
 export class UsersPage extends React.Component {
   constructor(props) {
     super(props);
     this.child = React.createRef();
     this.state = {
       filter: null,
       data: [],
       onDelete: false,
       arrDelete: [],
       currentDepart: '',
       pageDetail: {
         currentPage: 0,
         pageSize: 10,
         totalCount: 0,
       },
       changePassword: false,
       userChangePass: '',
       newPassword: '',
       historyUser: false,
     };
   }
 
   componentWillMount() {
     const filter = {
       skip: 0,
       limit: this.state.pageDetail.pageSize,
     };
     this.props.onGetListDepartment();
   }
 
   componentWillReceiveProps(props) {
     if (props !== this.props) {
       const { usersPage } = props;
       if (usersPage.arrUser && usersPage.success) {
         this.state.data = usersPage.arrUser || [];
         this.state.pageDetail.totalCount = usersPage.count || 0;
         this.state.pageDetail.currentPage = Number(usersPage.skip || 0) || 0;
         this.state.pageDetail.pageSize = usersPage.limit || 10;
         this.props.onResetNoti();
       }
     }
   }
 
   componentDidUpdate() {
     const { usersPage } = this.props;
     if (usersPage.successDelete) {
       this.onDeleteSuccess();
       this.state.onDelete = false;
       this.props.onResetNoti();
     }
     if (usersPage.error) {
       this.props.onResetNoti();
     }
   }
   historyItem = () => {
     // const { dashboardPage } = this.props;
     // const roleCode =
     //   dashboardPage.role.roles && dashboardPage.role.roles && dashboardPage.role.roles.find(item => item.codeModleFunction === 'LoginLog');
     // const roleModule = roleCode && roleCode.methods ? roleCode.methods : [];
     // const allow = (roleModule.find(elm => elm.name === 'GET') || { allow: true }).allow;
     // if (allow) {
     return (
       <Tooltip title="Lịch sử đăng nhập">
         <AccountCircle onClick={() => this.setState({ historyUser: true })} />
       </Tooltip>
     );
     // }
     // return null;
   };
 
   handlecloseDrawer = () => {
     this.setState({ historyUser: false });
   };
 
   // checkImage = async (API_USERS) => {
   //   // const url = API_USERS;
   //   let result;
   //   let file;
   //   const config = {
   //     responseType: 'blob',
   //     headers: {
   //       Authorization: `Bearer ${localStorage.getItem('token')}`,
   //       'Content-Type': 'application/json',
   //     },
   //   };
   //   await axios.get(API_USERS, config)
   //     .then(res => file = new Blob(
   //       [res.value],
   //       { type: 'application/pdf' }))
   //   if (file && file.size) {
   //     result = true
   //   } else {
   //     result = false;
   //   }
   //   return result;
   // }
 
   mapFunction = item => {
     return {
       ...item,
       status: item.status,
       type: item.type,
       gender: item.gender === 'male' ? 'Nam' : item.gender === 'female' ? 'Nữ' : 'Khác',
       avatar: <Avatar src={item.avatar ? `${item.avatar}?allowDefault=true` : avatarA} />,
       online: item.online ? (
         <div style={{ textAlign: 'center' }}>
           <Circle style={{ color: 'green' }} />
         </div>
       ) : null,
     };
   };
 
   render() {
     const { classes, usersPage, intl } = this.props;
     const level = 0;
     const arrDepartment = usersPage.arrDepartment || [];
     // if (this.state.changeOpen === true) {
     //   this.state.changeOpen = false;
     // console.log(rowsPerPage * page, rowsPerPage * page + rowsPerPage);
 
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
         <TableCell>Tất cả nhân viên</TableCell>
       </TableRow>,
     );
     return (
       <div>
         <Helmet>
           <title>Nhân sự phòng ban</title>
           <meta name="description" content="Description of AddUserPage" />
         </Helmet>
         {/* <Paper className={classes.breadcrumbs}>
           <Breadcrumbs aria-label="Breadcrumb">
             <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
               Dashboard
             </Link>
             <Typography color="textPrimary">Danh sách nhân sự</Typography>
           </Breadcrumbs>
         </Paper> */}
         <GridUI container style={{ paddingTop: 10 }}>
           <GridUI item md={11}>
             <Button component={NavLink} to="/setting/roleGroup" style={{ marginBottom: 10, marginRight: 10 }} variant="outlined" color="primary">
               {intl.formatMessage(messages.groupdecentralization || { id: 'groupdecentralization' })}
             </Button>
             <Button
               component={NavLink}
               to="/setting/Employee/department"
               style={{ marginBottom: 10, marginRight: 10 }}
               variant="outlined"
               color="primary"
             >
               {intl.formatMessage(messages.listofunit || { id: 'listofunit' })}
             </Button>
             {/* <Button component={NavLink} to="/setting/Employee/add" style={{ marginBottom: 10, marginRight: 10 }} variant="contained" color="primary">
               Thêm mới nhân sự
             </Button> */}
           </GridUI>
         </GridUI>
 
         <Paper className={classes.tableContainer} id="table-full-width" style={{ padding: 10 }}>
           <GridUI container item md={12} spacing={32}>
             <GridUI item md={3}>
               <TableUI className={classes.table} aria-labelledby="tableTitle">
                 <TableHead>
                   <TableRow>
                     <TableCell component="th">Tên phòng ban</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>{this.state.content ? this.state.content : ''}</TableBody>
               </TableUI>
             </GridUI>
             <GridUI item md={9}>
               <ListPage
                 height="650px"
                 apiUrl={API_USERS}
                 code="Employee"
                 settingBar={[this.historyItem()]}
                 onEdit={this.handleEditClick}
                 mapFunction={this.mapFunction}
                 exportExcel
                 defaultWidth="27.5%"
                 filter={this.state.filter}
                 disableChangePassword={true}
               />
             </GridUI>
           </GridUI>
         </Paper>
         <SwipeableDrawer
           anchor="right"
           onClose={() => this.handlecloseDrawer()}
           open={this.state.historyUser}
           title="Lịch Sử Đăng Nhập"
           width={window.innerWidth - 260}
         >
           <div style={{ padding: '15px' }}>
             <HistoryLogin />
           </div>
         </SwipeableDrawer>
         <Dialog
           open={this.state.onDelete}
           onClose={this.handleCloseDelete}
           aria-labelledby="alert-dialog-title"
           aria-describedby="alert-dialog-description"
         >
           <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
           <DialogContent>
             <DialogContentText id="alert-dialog-description">Bạn có chắc chắn muốn xóa?</DialogContentText>
           </DialogContent>
           <DialogActions>
             <Button variant="outlined" color="primary" onClick={() => this.handleDelete()}>
               LƯU
             </Button>
             <Button variant="outlined" onClick={this.handleCloseDelete} color="secondary" autoFocus>
               HỦY
             </Button>
           </DialogActions>
         </Dialog>
         <Dialog
           open={this.state.changePassword}
           onClose={this.handleOpenChangePassword}
           aria-labelledby="alert-dialog-title"
           aria-describedby="alert-dialog-description"
         >
           <DialogTitle id="alert-dialog-title">Đổi mật khẩu</DialogTitle>
           <DialogContent>
             {/* <DialogContentText id="alert-dialog-description">Bạn có chắc chắn muốn xóa?</DialogContentText> */}
             {/* <TextField /> */}
             <TextField
               margin="dense"
               placeholder="Mật khẩu mới"
               variant="outlined"
               name="newPassword"
               value={this.state.newPassword}
               onChange={this.handleChange}
             />
           </DialogContent>
           <DialogActions>
             <Button color="primary" onClick={this.handleChangePassword} variant="outlined">
               LƯU
             </Button>
             <Button onClick={this.handleOpenChangePassword} variant="outlined" color="primary" autoFocus>
               HỦY
             </Button>
           </DialogActions>
         </Dialog>
         {usersPage.loading ? <LoadingIndicator /> : ''}
       </div>
     );
   }
 
   handleChange = e => {
     this.setState({
       [e.target.name]: e.target.value,
     });
   };
 
   onDeleteSuccess = () => {
     this.child.callBack('delete-success');
   };
 
   handleAddClick = () => {
     const { history } = this.props;
     history.push('/setting/Employee/add');
   };
 
   handleDelete = () => {
     this.props.onDeleteUsers(this.state.arrDelete);
   };
 
   handleCloseDelete = () => {
     this.setState({ onDelete: false });
   };
 
   handleEditClick = item => {
     const { history } = this.props;
     history.push(`/setting/Employee/add/${item._id}`);
   };
 
   handleDeleteClick = item => {
     const { data } = this.state;
     const arrDelete = [];
     item.forEach(n => {
       arrDelete.push(data[n]._id);
     });
     this.setState({ onDelete: true, arrDelete });
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
 
   selectDepartment = depart => {
     let filter = {};
     if (depart !== '') {
       filter = {
         'organizationUnit.organizationUnitId': depart._id,
       };
     }
     this.setState({ filter, currentDepart: depart._id });
   };
 
   handleOpenChangePassword = user => {
     const { changePassword } = this.state;
 
     this.setState({ userChangePass: user.userId, changePassword: !changePassword });
   };
 
   handleChangePassword = () => {
     const { userChangePass, newPassword } = this.state;
     this.props.onChangePassword({
       user: userChangePass,
       password: newPassword,
     });
     this.setState({ changePassword: false });
   };
 
   ChangePassword = props => <MenuItem onClick={() => this.handleOpenChangePassword(props)}>Đổi mật khẩu</MenuItem>;
 
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
         // <React.Fragment>
         <TableRow key={department._id} onClick={() => this.selectDepartment(department)} className={classes.tbRow}>
           <TableCell>
             <span style={{ padding: `${level}px` }} />
             {department.name}
           </TableCell>
         </TableRow>
         // </React.Fragment>
       );
     });
   };
 }
 
 UsersPage.propTypes = {
   // dispatch: PropTypes.func.isRequired,
   onGetAllUser: PropTypes.func.isRequired,
   classes: PropTypes.object,
   onDeleteUsers: PropTypes.func.isRequired,
   usersPage: PropTypes.object,
 };
 
 const mapStateToProps = createStructuredSelector({
   usersPage: makeSelectUsersPage(),
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
     onUpdateConfig: body => {
       dispatch(fetchUpdateConfigAction(body));
     },
     onDeleteUsers: body => {
       dispatch(fetchDeleteUsersAction(body));
     },
     onResetNoti: () => {
       dispatch(resetNoti());
     },
     onGetListDepartment: () => {
       dispatch(fetchListDepartment());
     },
     onChangePassword: body => {
       dispatch(fetchChangePassword(body));
     },
   };
 }
 
 const withConnect = connect(
   mapStateToProps,
   mapDispatchToProps,
 );
 
 const withReducer = injectReducer({ key: 'usersPage', reducer });
 const withSaga = injectSaga({ key: 'usersPage', saga });
 
 export default compose(
   injectIntl,
   withSnackbar,
   withReducer,
   withSaga,
   withConnect,
   withStyles(styles),
 )(UsersPage);
 