/**
 *
 * AddRolesGroupPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { changeSnackbar } from '../Dashboard/actions';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Paper, Typography, TextField, Button, Tabs, Tab, Grid, AppBar, Toolbar, IconButton, Checkbox } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
// import TreeView from 'devextreme-react/tree-view';
import { Edit, Settings, Close } from '@material-ui/icons';
import { injectIntl } from 'react-intl';

import { withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import { Link } from 'react-router-dom';
import makeSelectAddRolesGroupPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getModuleAct, addRoleGroup, getInforRoleGroupAction, editRoleGroupAct } from './actions';
import styles from './styles';
import RoleByFunction from '../../components/RoleByFunction';
import { clientId } from '../../variable';
import { getUserRole } from '../../utils/common';
import messages from './messages';
import DepartmentSelect from './DetailDepartment';
import CustomAppBar from 'components/CustomAppBar';

import { flatChild } from '../../helper';
/* eslint-disable react/prefer-stateless-function */
export class AddRolesGroupPage extends React.Component {
  state = {
    roleName: '',
    roleDes: '',
    code: '',
    // departmentList: [
    //   // danh sách các hành động trong quyền
    //   {
    //     id: '1',
    //     text: 'Section',
    //     expanded: true,
    //     items: [
    //       {
    //         id: '1_1',
    //         text: 'Phòng kinh doanh:',
    //         items: [
    //           {
    //             id: '1_1_1',
    //             text: 'Phòng kinh doanh 1',
    //           },
    //           {
    //             id: '1_1_2',
    //             text: 'Phòng kinh doanh 2',
    //           },
    //         ],
    //       },
    //       {
    //         id: '1_2',
    //         text: 'Phòng nhân sự:  ',
    //         items: [
    //           {
    //             id: '1_2_1',
    //             text: 'Phòng nhân sự 1',
    //           },
    //           {
    //             id: '1_2_2',
    //             text: 'Phòng nhân sự 2',
    //           },
    //           {
    //             id: '1_2_3',
    //             text: 'Phòng nhân sự 3',
    //           },
    //         ],
    //       },
    //       {
    //         id: '1_3',
    //         text: 'Phòng IT:',
    //         items: [
    //           {
    //             id: '1_3_1',
    //             text: 'Phòng IT 1',
    //           },
    //           {
    //             id: '1_3_2',
    //             text: 'Phòng IT 2',
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ],
    // selectAllDepartment: false,
    valueForTabs: 0,
    // valueForSubTabs: 0,
    // businessReportRole: {
    //   view: false,
    //   export: false,
    // },
    // personalReportRole: {
    //   view: false,
    //   export: false,
    // },
    // waringList: [
    //   {
    //     id: '1',
    //     text: 'Cảnh báo',
    //     expanded: true,
    //     items: [
    //       {
    //         id: '1_1',
    //         text: 'Cảnh báo nhân sự nghỉ quá nhiều',
    //       },
    //       {
    //         id: '1_2',
    //         text: 'Cảnh báo công việc chậm tiến độ',
    //       },
    //     ],
    //   },
    // ],
    // approveList: [
    //   {
    //     id: '1',
    //     text: 'Phê duyệt',
    //     expanded: true,
    //     items: [
    //       {
    //         id: '1_1',
    //         text: 'Phê duyệt nghỉ phép',
    //       },
    //       {
    //         id: '1_2',
    //         text: 'Phê duyệt bảng lương',
    //       },
    //       {
    //         id: '1_3',
    //         text: 'Phê duyệt chi',
    //       },
    //       {
    //         id: '1_4',
    //         text: 'Phê duyệt thu',
    //       },
    //       {
    //         id: '1_5',
    //         text: 'Phê duyệt điều chuyển công tác',
    //       },
    //     ],
    //   },
    // ],
    departmentCheckedList: [],
    waringCheckedList: [],
    approveCheckedList: [],
    allFunctionForAdd: [],
    applyEmployeeOrgToModuleOrg: true,
    messages: {
      errorCode: '',
      errorRoleName: '',
    },
    errorRoleName: false,
    errorCode: false,
  };

  componentWillMount() {
    this.props.onGetModule();
    const { match } = this.props;
    if (match.params.id) {
      this.props.onGetInfor(match.params.id);
    }
  }

  componentWillReceiveProps(props) {
    if (props.addRolesGroupPage !== this.props.addRolesGroupPage) {
      // console.log(props);
      const { addRolesGroupPage } = props;
      const modules = addRolesGroupPage.modules || [];
      const roleGroup = addRolesGroupPage.roleGroup;
      let { roles } = roleGroup;
      const { match } = this.props;
      if (!match.params.id) {
        roles = [];
      }
      const allFunctionForAdd = getUserRole(roles, modules, clientId);

      this.setState({ allFunctionForAdd });
      if (
        roleGroup !== null &&
        props.addRolesGroupPage.roleGroup !== this.props.addRolesGroupPage.roleGroup &&
        String(roleGroup._id) === String(this.props.match.params.id)
      ) {
        this.state.code = roleGroup.code;
        this.state.roleName = roleGroup.name;
        this.state.roleDes = roleGroup.description;
        this.state.allFunctionForAdd = roleGroup.roles;
        this.state.applyEmployeeOrgToModuleOrg = roleGroup.applyEmployeeOrgToModuleOrg;
        const departments =
          roleGroup.departments && roleGroup.departments.roles.find(it => it.code === 'DERPARTMENT').data.map(it => ({ ...it.data, id: it.id }));
        this.state.departments = departments || [];
        this.state.allowedDepartments = roleGroup.departments;
      }
    }
  }
  getMessages = () => {
    const { messages } = this.state;
    let newMessages = {};

    Object.keys(messages).map(item => {
      if (messages[item].length === 0) {
        this.setState({
          [item]: true,
        });
        if (item === 'errorRoleName') newMessages[`${item}`] = `Tên vai trò không được để trống!`;
        if (item === 'errorCode') newMessages[`${item}`] = `Mã vai trò không được để trống!`;
      }
    });
    this.setState(prevState => ({
      ...prevState,
      messages: newMessages,
    }));
  };
  componentDidMount() {
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    if (addStock === 'add') this.getMessages();
  }
  handleChangeRole = allFunctionForAdd => {
    this.state.allFunctionForAdd = allFunctionForAdd;
  };
  handleChangeAllowedDepart = (departments, row) => {
    // thay doi phong ban them moi
    const roles = [...departments];
    const moduleCode = 'applyEmployeeOrgToModuleOrg';
    const allowedDepartment = {
      moduleCode,
      roles: [
        {
          code: 'DERPARTMENT',
          column: [
            {
              name: 'view',
              title: 'Xem',
            },
            {
              name: 'edit',
              title: 'Sửa',
            },
            {
              name: 'delete',
              title: 'Xóa',
            },
          ],
          data: roles.map(item => ({ data: item.data, expand: item.expand, id: item.id, name: item.name, open: item.open, slug: item.slug })),
          type: 0,
          name: 'Phòng ban',
          row,
        },
      ],
    };
    this.setState({ allowedDepartment });
  };

  render() {
    const { classes, theme, intl } = this.props;
    const {
      roleName,
      roleDes,
      code,
      valueForTabs,
      // customerRole,
      // contractRole,
      // serviceRole,
      // reportRole,
      // businessReportRole,
      // personalReportRole,
      // valueForSubTabs,
      applyEmployeeOrgToModuleOrg,
    } = this.state;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    return (
      <div>
        {/* <AppBar className={classes.HeaderAppBarRoleGroup}>
              <Toolbar>
                <IconButton
                  className={classes.BTNRoleGroup}
                  color="inherit"
                  variant="contained"
                  onClick={()=> this.props.history.goBack()}
                  aria-label="Close"
                >
                  <Close />
                </IconButton>
                <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
                  {addStock === "add"
                    ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật' })}`}
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={!this.props.match.params.id ? this.onSubmit : this.onEditRoleGroup}
                >
                  {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
                </Button>
              </Toolbar>
            </AppBar> */}
        <CustomAppBar
          title={
            addStock === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới vai trò' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật vai trò' })}`
          }
          onGoBack={() => this.props.history.goBack()}
          onSubmit={!this.props.match.params.id ? this.onSubmit : this.onEditRoleGroup}
        />
        <Helmet>
          <title>{this.props.match.params.id ? 'Chỉnh sửa vai trò' : 'Tạo mới vai trò'}</title>
          <meta name="description" content="Chỉnh sửa và thêm mới vai trò" />
        </Helmet>
        {/* <FormattedMessage {...messages.header} /> */}
        {/* <Paper className={classes.breadcrumbs}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/setting/Employee">
              Danh sách nhân sự
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/setting/roleGroup">
              Danh sách vai trò
            </Link>
            <Typography color="textPrimary">Thêm mới vai trò</Typography>
          </Breadcrumbs>
        </Paper> */}
        <Paper className={classes.paper}>
          <Typography component="p" className={classes.paperTitle}>
            <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Thông tin cơ bản vai trò{' '}
            <span className={classes.spanTitle}>Các trường màu đỏ là cần nhập</span>
          </Typography>
          <TextField
            value={code}
            className={classes.textField}
            name="code"
            onChange={this.handleChange}
            label="Mã vai trò"
            required
            helperText={this.state.messages && this.state.messages.errorCode}
            error={this.state.errorCode}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            value={roleName}
            className={classes.textField}
            name="roleName"
            onChange={this.handleChange}
            label="Tên vai trò"
            required
            helperText={this.state.messages && this.state.messages.errorRoleName}
            error={this.state.errorRoleName}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            value={roleDes}
            label="Mô tả vai trò"
            name="roleDes"
            className={classes.textField}
            onChange={this.handleChange}
            multiline
            rows="3"
            InputLabelProps={{
              shrink: true,
            }}
          />
          {/* {!this.props.match.params.id ? (
            <Button variant="contained" color="primary" className={classes.btn} onClick={this.onSubmit}>
              Thêm mới
            </Button>
          ) : (
              <Button variant="contained" color="primary" style={{ marginTop: 20 }} onClick={this.onEditRoleGroup}>
                Cập nhập
              </Button>
            )} */}
        </Paper>
        <Paper className={classes.paper}>
          <Typography component="p" className={classes.paperTitle}>
            <Settings style={{ fontSize: '20px', marginBottom: '5px' }} /> Phân quyền truy cập cho vai trò
          </Typography>
          {/* <TreeView
            className={classes.treeView}
            items={this.state.rolesList}
            showCheckBoxesMode="normal"
            onItemSelectionChanged={this.selectionChanged}
            // itemRender={this.renderTreeViewItem}
          /> */}
          <Tabs value={this.state.valueForTabs} onChange={this.handleChangeTab} indicatorColor="primary" scrollButtons="on" variant="scrollable">
            <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Phân quyền chức năng" />
            <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Phân quyền phòng ban" />
            {/* <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Phân quyền phòng ban" />
            <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Phân quyền báo cáo" />
            <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Phân quyền cảnh báo & phê duyệt" /> */}
          </Tabs>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={valueForTabs}
            onChangeIndex={this.handleChangeIndex}
            width={window.innerWidth - 260}
          >
            <TabContainer dir={theme.direction}>
              <RoleByFunction
                isGroup={true}
                employeeId={this.props.match.params.id}
                allFunctionForAdd={this.state.allFunctionForAdd}
                handleChangeRole={this.handleChangeRole}
                departments={this.state.departments}
                addStock={addStock === 'add' ? true : false}
                applyEmployeeOrgToModuleOrg={this.state.applyEmployeeOrgToModuleOrg}
              />
            </TabContainer>
            <TabContainer dir={theme.direction}>
              <Checkbox
                onClick={() => {
                  this.setState({ applyEmployeeOrgToModuleOrg: !applyEmployeeOrgToModuleOrg });
                  if (applyEmployeeOrgToModuleOrg) {
                    const { addRolesGroupPage } = this.props;
                    let listOrganizationUnit = addRolesGroupPage.listOrganizationUnit || [];
                    listOrganizationUnit = flatChild(listOrganizationUnit);
                    const moduleCode = 'applyEmployeeOrgToModuleOrg';
                    const allowedDepartment = {
                      moduleCode,
                      roles: [
                        {
                          code: 'DERPARTMENT',
                          column: [
                            {
                              name: 'view',
                              title: 'Xem',
                            },
                            {
                              name: 'edit',
                              title: 'Sửa',
                            },
                            {
                              name: 'delete',
                              title: 'Xóa',
                            },
                          ],
                          data: listOrganizationUnit.map(item => ({
                            data: { view: false, edit: false, delete: false },
                            expand: false,
                            id: item._id,
                            name: item._id,
                            open: true,
                            slug: item.slug,
                          })),
                          type: 0,
                          name: 'Phòng ban',
                          row: listOrganizationUnit.map(l => ({
                            access: false,
                            expand: false,
                            id: l._id,
                            level: l.level,
                            name: l._id,
                            open: false,
                            parent: l.parent,
                            slug: l.slug,
                            title: l.name,
                          })),
                        },
                      ],
                    };
                    this.setState({ allowedDepartment });
                  }
                }}
                checked={this.state.applyEmployeeOrgToModuleOrg}
              />{' '}
              <span>Phân quyền theo Phòng ban/Chi nhánh</span>
              {!applyEmployeeOrgToModuleOrg ? (
                <DepartmentSelect
                  allowedDepartmentIds={this.state.departments || []}
                  // allowedDepartment={(departments) => this.setState({ departments })}
                  allowedDepartment={this.handleChangeRoles}
                  onChange={this.handleChangeAllowedDepart}
                  disabledAction
                  applyEmployeeOrgToModuleOrg={!applyEmployeeOrgToModuleOrg}
                />
              ) : null}
            </TabContainer>
            {/* <TabContainer dir={theme.direction}>
              <TreeView
                className={classes.treeView}
                items={this.state.departmentList}
                showCheckBoxesMode="normal"
                name="departmentTree"
                onItemSelectionChanged={this.selectionChanged('departmentTree')}
                // itemRender={this.renderTreeViewItem}
              />
            </TabContainer>
            <TabContainer dir={theme.direction}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Báo cáo</TableCell>
                    <TableCell style={{ paddingLeft: 40 }}>Xem</TableCell>
                    <TableCell style={{ paddingLeft: 40 }}>Xuất báo cáo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Báo cáo hoạt động kinh doanh</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={businessReportRole.view}
                        onChange={this.handleChangeCheckbox('businessReportRole', 'view')}
                        value="businessReportRole view"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={businessReportRole.export}
                        onChange={this.handleChangeCheckbox('businessReportRole', 'export')}
                        value="businessReportRole export"
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Báo cáo hoạt động kinh doanh</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={personalReportRole.view}
                        onChange={this.handleChangeCheckbox('personalReportRole', 'view')}
                        value="personalReportRole view"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={personalReportRole.export}
                        onChange={this.handleChangeCheckbox('personalReportRole', 'export')}
                        value="personalReportRole export"
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabContainer>
            <TabContainer dir={theme.direction}>
              <Tabs value={this.state.valueForSubTabs} onChange={this.handleChangeTabSub} indicatorColor="primary">
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Phân loại khách hàng" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Người đại diện" />
              </Tabs>
              <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={valueForSubTabs} onChangeIndex={this.handleChangeIndexSub}>
                <TabContainer dir={theme.direction}>
                  <TreeView
                    className={classes.treeView}
                    items={this.state.waringList}
                    showCheckBoxesMode="normal"
                    onItemSelectionChanged={this.selectionChanged('warningTree')}
                    name="warningTree"
                    // itemRender={this.renderTreeViewItem}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <TreeView
                    className={classes.treeView}
                    items={this.state.approveList}
                    showCheckBoxesMode="normal"
                    name="approveTree"
                    onItemSelectionChanged={this.selectionChanged('approveTree')}
                    // itemRender={this.renderTreeViewItem}
                  />
                </TabContainer>
              </SwipeableViews>
            </TabContainer>
          */}
          </SwipeableViews>
        </Paper>
      </div>
    );
  }
  // checkValidate = () => {
  //   const { roleName, code } = this.state;
  //   if (roleName.trim().length < MIN_CODE_LENGTH) {
  //     return false;
  //   }

  //   if (code.trim().length < MIN_TITLE_LENGTH) {
  //     return false;
  //   }

  //   return true;
  // };

  onSubmit = () => {
    // if (!this.checkValidate()) {
    //   return;
    // }
    const { roleName, roleDes, code, allFunctionForAdd, applyEmployeeOrgToModuleOrg, allowedDepartments, roles } = this.state;
    const body = {
      clientId,
      roleName,
      roleDes,
      code,
      allFunctionForAdd,
      applyEmployeeOrgToModuleOrg,
      departments: this.state.allowedDepartment || allowedDepartments,
    };
    if (roleName && code) {
      this.props.onAddRoleGroup(body, roles, null);
    } else {
      this.props.onChangeSnacker({ variant: 'error', message: 'Thêm mới thất bại', status: true });
    }
  };

  handleChangeRoles = departments => {
    this.setState({ departments });
    const { allFunctionForAdd, applyEmployeeOrgToModuleOrg, allowedDepartment } = this.state;
    const roles = [];
    if (allowedDepartment)
      allFunctionForAdd.map(row => {
        const GET = row.methods.find(item => item.name === 'GET').allow;
        const PUT = row.methods.find(item => item.name === 'PUT').allow;
        const DELETE = row.methods.find(item => item.name === 'DELETE').allow;
        const role = !applyEmployeeOrgToModuleOrg
          ? allowedDepartment.roles.map(it => ({
            ...it,
            name: 'Phòng ban',
            data: it.data.map(i => ({
              ...i,
              data: { view: GET ? i.data.view : false, edit: PUT ? i.data.edit : false, delete: DELETE ? i.data.delete : false },
            })),
          }))
          : allowedDepartment.roles.map(it => ({
            ...it,
            name: 'Phòng ban',
            data: it.data.map(i => ({ ...i, data: { view: false, edit: false, delete: false } })),
          }));
        roles.push({ moduleCode: row.codeModleFunction, roles: role });
        // row.methods.find(item => item.name === 'GET').allow && roles.push({ moduleCode: row.codeModleFunction, roles: allowedDepartment.roles })
      });
    this.setState({ roles });
  };
  onEditRoleGroup = () => {
    const { roleName, roleDes, code, allFunctionForAdd, applyEmployeeOrgToModuleOrg, allowedDepartment, allowedDepartments } = this.state;
    const id = this.props.match.params.id;
    const body = {
      clientId,
      roleName,
      roleDes,
      code,
      allFunctionForAdd,
      applyEmployeeOrgToModuleOrg,
      id,
      departments: this.state.allowedDepartment || allowedDepartments,
    };
    const roles = [];
    if (allowedDepartment)
      allFunctionForAdd.map(row => {
        const GET = row.methods.find(item => item.name === 'GET').allow;
        const PUT = row.methods.find(item => item.name === 'PUT').allow;
        const DELETE = row.methods.find(item => item.name === 'DELETE').allow;
        const role = !applyEmployeeOrgToModuleOrg
          ? allowedDepartment.roles.map(it => ({
            ...it,
            name: 'Phòng ban',
            data: it.data.map(i => ({
              ...i,
              data: { view: GET ? i.data.view : false, edit: PUT ? i.data.edit : false, delete: DELETE ? i.data.delete : false },
            })),
          }))
          : allowedDepartment.roles.map(it => ({
            ...it,
            name: 'Phòng ban',
            data: it.data.map(i => ({ ...i, data: { view: false, edit: false, delete: false } })),
          }));
        roles.push({ moduleCode: row.codeModleFunction, roles: role });
      });
    const bodyAddAllowedDepartment = {
      groupId: id,
      listRoles: roles,
    };
    if (roleName && code) {
      this.props.onEditRoleGroup(body);
      // if (allowedDepartment) {
      //   this.props.postPermissionDepartment(bodyAddAllowedDepartment);
      //   // this.props.postPermissionGeneralDepartment(allowedDepartment)
      // }
    } else {
      this.props.onChangeSnacker({ variant: 'error', message: 'Cập nhật thất bại 2', status: true });
    }
    // this.props.onEditRoleGroup(body);
  };

  handleChange = e => {
    if (e.target.name === 'code') {
      if (e.target.value === '') {
        this.setState({
          errorCode: true,
          messages: { ...messages, errorCode: `Mã vai trò không được để trống!` },
        });
      } else
        this.setState({
          errorCode: false,
          messages: { ...messages, errorCode: '' },
        });
    }

    if (e.target.name === 'roleName') {
      if (e.target.value === '') {
        this.setState({
          errorRoleName: true,
          messages: { ...messages, errorRoleName: `Tên vai trò không được để trống!` },
        });
      } else
        this.setState({
          errorRoleName: false,
          messages: { ...messages, errorRoleName: '' },
        });
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangeCheckAll = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleChangeTab = (event, value) => {
    this.setState({ valueForTabs: value });
  };

  handleChangeIndex = index => {
    this.setState({ valueForTabs: index });
  };

  selectionChanged = name => e => {
    const value = e.node;
    if (this.isRole(value)) {
      this.processRoles(
        {
          id: value.key,
          text: value.text,
          itemData: value.itemData,
          selected: value.selected,
          category: value.parent.text,
        },
        name,
      );
    } else {
      value.items.forEach(role => {
        this.processRoles(
          {
            id: role.key,
            text: role.text,
            itemData: role.itemData,
            selected: role.selected,
            category: value.text,
          },
          name,
        );
      });
    }
  };

  isRole = data => !data.items.length;

  processRoles = (role, name) => {
    /* eslint-disable */
    this.setState(prevState => {
      if (name === 'approveTree') {
        let itemIndex = -1;
        const { approveCheckedList } = prevState;
        approveCheckedList.forEach((item, index) => {
          if (item.id === role.id) {
            itemIndex = index;
            return false;
          }
        });
        if (role.selected && itemIndex === -1) {
          approveCheckedList.push(role);
        } else if (!role.selected) {
          approveCheckedList.splice(itemIndex, 1);
        }
        return { approveCheckedList: approveCheckedList.slice(0) };
      }
      if (name === 'warningTree') {
        let itemIndex = -1;
        const { waringCheckedList } = prevState;
        waringCheckedList.forEach((item, index) => {
          if (item.id === role.id) {
            itemIndex = index;
            return false;
          }
        });
        if (role.selected && itemIndex === -1) {
          waringCheckedList.push(role);
        } else if (!role.selected) {
          waringCheckedList.splice(itemIndex, 1);
        }
        return { waringCheckedList: waringCheckedList.slice(0) };
      }
      if (name === 'departmentTree') {
        let itemIndex = -1;
        const { departmentCheckedList } = prevState;
        departmentCheckedList.forEach((item, index) => {
          if (item.id === role.id) {
            itemIndex = index;
            return false;
          }
        });
        if (role.selected && itemIndex === -1) {
          departmentCheckedList.push(role);
        } else if (!role.selected) {
          departmentCheckedList.splice(itemIndex, 1);
        }
        return { departmentCheckedList: departmentCheckedList.slice(0) };
      }
    });
    /* eslint-enable */
  };

  renderTreeViewItem = value => <div style={{ padding: 5 }}>{value.text}</div>;
}

function TabContainer({ children, dir }) {
  return (
    <Grid item md={12} dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Grid>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

AddRolesGroupPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  onAddRoleGroup: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addRolesGroupPage: makeSelectAddRolesGroupPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetModule: () => {
      dispatch(getModuleAct());
    },
    onAddRoleGroup: (body, roles, newAllowedDepartment) => {
      dispatch(addRoleGroup(body, roles, newAllowedDepartment));
    },
    onGetInfor: id => {
      dispatch(getInforRoleGroupAction(id));
    },
    onChangeSnacker: obj => dispatch(changeSnackbar(obj)),
    onEditRoleGroup: body => {
      dispatch(editRoleGroupAct(body));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addRolesGroupPage', reducer });
const withSaga = injectSaga({ key: 'addRolesGroupPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles, { withTheme: true }),
)(AddRolesGroupPage);
