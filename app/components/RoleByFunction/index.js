/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 *
 * RoleByFunction
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { TableHead, Table, TableRow, TableCell, TableBody, Checkbox, Dialog, DialogContent } from '@material-ui/core';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';
import DetailRole from '../DetailRole';
import { ExpandMore, ExpandLess } from '@material-ui/icons';

const dataLocal = JSON.parse(localStorage.getItem('systemConfig'));
const dataDefault = [
  { code: 'Task', childCodes: ['TemplateTask', 'TaskConfig'] },
  {
    code: 'CRM',
    childCodes: [
      'BusinessOpportunities',
      'ExchangingAgreement',
      'CostEstimate',
      'SalesQuotation',
      'Contract',
      'Bill',
      'OrderPo',
      'SalesPolicy',
      'Customer',
      'Supplier',
      'ConfigCRM',
      'ContactCenter',
    ],
  },
  {
    code: 'hrm',
    childCodes: [],
  },
  { code: 'Stock', childCodes: ['Asset', 'Allocate', 'StockExport', 'StockImport', 'StockConfig'] },
  { code: 'file-manager', childCodes: [] },
  { code: 'Documentary', childCodes: ['inComingDocument', 'outGoingDocument', 'DocumentConfig'] },
  { code: 'Delivery', childCodes: [] },
  { code: 'RevenueExpenditure', childCodes: ['AdvanceRequire', 'ReimbursementRequire', 'PaymentRequire', 'BankAccount'] },
  { code: 'Calendar', childCodes: ['calendarMeeting', 'calendarWorking', 'MettingRoom', 'calendarConfig'] },
  {
    code: 'reports',
    childCodes: [],
  },
  { code: 'Kpi', childCodes: [] },
  { code: 'setting', childCodes: ['LtAccount', 'DynamicForm', 'NewsFeed', 'Email', 'Field', 'SMS', 'Employee', 'TemplateType'] },
];
const FUNCTION_REORDER = dataLocal && Array.isArray(dataLocal) && dataLocal.length > 0 ? dataLocal : dataDefault;
let ALL_MODULES = [];
FUNCTION_REORDER.forEach(c => {
  ALL_MODULES.push(c.code);
  ALL_MODULES = ALL_MODULES.concat(c.childCodes);
});
const enableReorder = true;
/* eslint-disable react/prefer-stateless-function */
class RoleByFunction extends React.Component {
  state = {
    allFunctionForAdd: [],
    dialogDetail: false,
    moduleCode: '',
    allowedDepartment: [],
    checked: '',
    openModule: null,
  };

  componentDidMount() {
    this.setState({
      allFunctionForAdd: this.props.allFunctionForAdd,
    });
  }
  componentWillReceiveProps(props) {
    // this.state.allFunctionForAdd = props.allFunctionForAdd;
    this.setState({
      allFunctionForAdd: props.allFunctionForAdd,
      allowedDepartment: props.allowedDepartment,
    });
  }

  detailRole = code => {
    this.setState({ dialogDetail: true, moduleCode: code });
  };

  handleCheckbox = e => {
    const { allFunctionForAdd } = this.state;
    // console.log('allFunctionForAdd',allFunctionForAdd)

    const foundCodeModuleFunction = allFunctionForAdd;
    // const GET = foundCodeModuleFunction[0].methods && foundCodeModuleFunction[0].methods.find(item => item.name === 'GET') ;
    // console.log(GET)

    if (e.target.name === 'View') {
      for (const element of foundCodeModuleFunction) {
        if (!ALL_MODULES.find(c => c === element.codeModleFunction)) {
          const newMethod = element.methods.find(item => item.name === 'GET');
          newMethod.allow = false;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        } else {
          const newMethod = element.methods.find(item => item.name === 'GET');
          newMethod.allow = e.target.checked;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        }
      }
    }
    if (e.target.name === 'Add') {
      for (const element of foundCodeModuleFunction) {
        if (!ALL_MODULES.find(c => c === element.codeModleFunction)) {
          const newMethod = element.methods.find(item => item.name === 'POST');
          newMethod.allow = false;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        } else {
          const newMethod = element.methods.find(item => item.name === 'POST');
          newMethod.allow = e.target.checked;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        }
      }
    }
    if (e.target.name === 'Edit') {
      for (const element of foundCodeModuleFunction) {
        if (!ALL_MODULES.find(c => c === element.codeModleFunction)) {
          const newMethod = element.methods.find(item => item.name === 'PUT');
          newMethod.allow = false;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        } else {
          const newMethod = element.methods.find(item => item.name === 'PUT');
          newMethod.allow = e.target.checked;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        }
      }
    }
    if (e.target.name === 'Delete') {
      for (const element of foundCodeModuleFunction) {
        if (!ALL_MODULES.find(c => c === element.codeModleFunction)) {
          const newMethod = element.methods.find(item => item.name === 'DELETE');
          newMethod.allow = false;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        } else {
          const newMethod = element.methods.find(item => item.name === 'DELETE');
          newMethod.allow = e.target.checked;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        }
      }
    }
    if (e.target.name === 'Import') {
      for (const element of foundCodeModuleFunction) {
        if (!ALL_MODULES.find(c => c === element.codeModleFunction)) {
          const newMethod = element.methods.find(item => item.name === 'IMPORT');
          newMethod.allow = false;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        } else {
          const newMethod = element.methods.find(item => item.name === 'IMPORT');
          newMethod.allow = e.target.checked;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        }
      }
    }
    if (e.target.name === 'Export') {
      for (const element of foundCodeModuleFunction) {
        if (!ALL_MODULES.find(c => c === element.codeModleFunction)) {
          const newMethod = element.methods.find(item => item.name === 'EXPORT');
          newMethod.allow = false;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        } else {
          const newMethod = element.methods.find(item => item.name === 'EXPORT');
          newMethod.allow = e.target.checked;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        }
      }
    }
    if (e.target.name === 'ViewConfig') {
      for (const element of foundCodeModuleFunction) {
        if (!ALL_MODULES.find(c => c === element.codeModleFunction)) {
          const newMethod = element.methods.find(item => item.name === 'VIEWCONFIG') || { name: '' }.name;
          newMethod.allow = false;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        } else {
          const newMethod = element.methods.find(item => item.name === 'VIEWCONFIG') || { name: '' }.name;
          newMethod.allow = e.target.checked;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        }
      }
    }
  };

  handleOnChange = (e, moduleCode) => {
    const [codeModleFunction, method] = e.target.name.split('/');
    const { allFunctionForAdd } = this.state;
    const currentFunction = allFunctionForAdd.find(item => item.codeModleFunction === codeModleFunction);
    const currentMethod = currentFunction.methods.find(item => item.name === method);
    currentMethod.allow = e.target.checked;
    const found = FUNCTION_REORDER.find(c => c.code === moduleCode);
    if (found && found.childCodes) {
      found.childCodes.forEach(c => {
        const currChildModule = allFunctionForAdd.find(item => item.codeModleFunction === c);
        const currChildMethod = currChildModule.methods.find(item => item.name === method);
        currChildMethod.allow = e.target.checked;
      });
    }
    // this.state.allFunctionForAdd = allFunctionForAdd;
    this.setState({ allFunctionForAdd });
    this.props.handleChangeRole(allFunctionForAdd);
  };

  renderDetailRole = () => {
    let xhtml = null;
    const foundCodeModuleFunction = this.state.allFunctionForAdd.find(row => this.state.moduleCode === row.codeModleFunction);

    const { allowedDepartment } = this.props;
    // console.log(allowedDepartment);
    let cloneAllowedDepartment = { ...allowedDepartment };

    let newDepartment = [];
    if (cloneAllowedDepartment && cloneAllowedDepartment.roles && foundCodeModuleFunction) {
      const GET = foundCodeModuleFunction.methods && foundCodeModuleFunction.methods.find(item => item.name === 'GET').allow;
      const PUT = foundCodeModuleFunction.methods && foundCodeModuleFunction.methods.find(item => item.name === 'PUT').allow;
      const DELETE = foundCodeModuleFunction.methods && foundCodeModuleFunction.methods.find(item => item.name === 'DELETE').allow;
      // newDepartment = cloneAllowedDepartment.roles.map(it => ({ ...it, data: it.data.map(i => ({ ...i, data: { view: GET ? i.data.view : false, edit: PUT ? i.data.edit : false, delete: DELETE ? i.data.delete : false } })) }))
      newDepartment = !this.props.applyEmployeeOrgToModuleOrg
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
    }
    cloneAllowedDepartment = { ...cloneAllowedDepartment, roles: newDepartment };

    if (this.props.id === 'add' && !this.props.employeeId) {
      const departments =
        Array.isArray(newDepartment) && newDepartment.length > 0 ? newDepartment[0].data.map(it => ({ ...it.data, id: it.id })) : [];
      return (xhtml = (
        <DepartmentSelect allowedDepartmentIds={departments || []} onSave={this.handleSave} onClose={() => this.setState({ dialogDetail: false })} />
      ));
    }
    if (
      foundCodeModuleFunction &&
      cloneAllowedDepartment &&
      Array(cloneAllowedDepartment.roles) &&
      cloneAllowedDepartment.roles.length > 0 &&
      !this.props.fromAddUser
    ) {
      xhtml = (
        <DetailRole
          moduleCode={this.state.moduleCode}
          closeDialog={() => this.setState({ dialogDetail: false })}
          employeeId={this.props.employeeId}
          isDialog={true}
          departments={cloneAllowedDepartment ? cloneAllowedDepartment.roles : []}
        />
      );
    } else {
      xhtml = (
        <DetailRole
          moduleCode={this.state.moduleCode}
          closeDialog={() => this.setState({ dialogDetail: false })}
          employeeId={this.props.employeeId}
          isDialog={true}
        />
      );
    }

    return xhtml;
  };

  handleSave = (data, row) => {
    const foundCodeModuleFunction = this.state.allFunctionForAdd.find(row => this.state.moduleCode === row.codeModleFunction);

    const { allowedDepartment } = this.state;
    let cloneAllowedDepartment = { ...allowedDepartment };

    let newDepartment = [];
    if (cloneAllowedDepartment && cloneAllowedDepartment.roles && foundCodeModuleFunction) {
      // newDepartment = cloneAllowedDepartment.roles.map(it => ({ ...it, data: it.data.map(i => ({ ...i, data: { view: GET ? i.data.view : false, edit: PUT ? i.data.edit : false, delete: DELETE ? i.data.delete : false } })) }))
      newDepartment = allowedDepartment.roles.map(it => ({ ...it, name: 'Phòng ban', data }));
      cloneAllowedDepartment = { ...cloneAllowedDepartment, roles: newDepartment };
    } else {
      const { moduleCode } = this.state;

      // module code
      if (moduleCode) {
        const roles = {
          module: moduleCode,
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
              data,
              type: 0,
              name: 'Phòng ban',
              row,
            },
          ],
        };
        if (this.props.handleSaveDepartmentLocal) this.props.handleSaveDepartmentLocal(roles);
        cloneAllowedDepartment = { ...roles };
      }
    }
    this.setState({ allowedDepartment: cloneAllowedDepartment });
  };

  render() {
    const { allFunctionForAdd } = this.state;
    let newAllFunctionForAdd = allFunctionForAdd;
    const addStock = this.props.addStock
    if (FUNCTION_REORDER.length && allFunctionForAdd.length && enableReorder) {
      newAllFunctionForAdd = [];
      FUNCTION_REORDER.forEach(reo => {
        const found = allFunctionForAdd.find(a => a.codeModleFunction === reo.code);
        if (found) {
          newAllFunctionForAdd.push(found);
          if (reo.childCodes && reo.childCodes.length) {
            reo.childCodes.forEach(k => {
              const foundChild = allFunctionForAdd.find(a => a.codeModleFunction === k);
              if (foundChild) {
                newAllFunctionForAdd.push(foundChild);
              }
            });
          }
        }
      });
    }
    return (
      <React.Fragment>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Phân quyền chức năng</TableCell>
              <TableCell>
                <Checkbox onChange={this.handleCheckbox} name="View" checked={this.state.cheker} />
                Xem
              </TableCell>
              <TableCell>
                <Checkbox onChange={this.handleCheckbox} name="Add" checked={this.state.cheker} />
                Thêm
              </TableCell>
              <TableCell>
                <Checkbox onChange={this.handleCheckbox} name="Edit" checked={this.state.cheker} />
                Sửa
              </TableCell>
              <TableCell>
                <Checkbox onChange={this.handleCheckbox} name="Delete" checked={this.state.cheker} />
                Xóa
              </TableCell>
              <TableCell>
                <Checkbox onChange={this.handleCheckbox} name="Export" checked={this.state.cheker} />
                Xuất file
              </TableCell>
              <TableCell>
                <Checkbox onChange={this.handleCheckbox} name="Import" checked={this.state.cheker} />
                Import file
              </TableCell>
              <TableCell>
                <Checkbox onChange={this.handleCheckbox} name="ViewConfig" checked={this.state.cheker} />
                View Config
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newAllFunctionForAdd.map(row => {
              const parent = FUNCTION_REORDER.find(c => c.code === row.codeModleFunction);
              let foundParent;
              let isChildOpen;
              if (!parent) {
                foundParent = FUNCTION_REORDER.find(c => c.code === this.state.openModule);
                if (foundParent) {
                  isChildOpen = foundParent.childCodes.find(c => c === row.codeModleFunction);
                }
              }
              if (parent) {
                return (
                  <TableRow key={row.codeModleFunction}>
                    <TableCell>
                      <div style={{ display: 'flex' }}>
                        <p onClick={() => {
                          if (addStock) return;
                          this.detailRole(row.codeModleFunction)
                        }} style={{ color: '#2196F3', cursor: 'pointer' }}>
                          {row.titleFunction}
                        </p>
                        <p
                          style={{ paddingRight: '10px' }}
                          onClick={() => {
                           
                            if (this.state.openModule && this.state.openModule === row.codeModleFunction) {
                              this.setState({ openModule: '' });
                            } else {
                              this.setState({ openModule: row.codeModleFunction });
                            }
                          }}
                        >
                          {parent.childCodes.length ? <>{row.codeModleFunction === this.state.openModule ? <ExpandLess /> : <ExpandMore />}</> : null}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        onChange={e => {
                          this.handleOnChange(e, row.codeModleFunction);
                        }}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'GET').name}`}
                        checked={row.methods.find(item => item.name === 'GET').allow}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        onChange={e => {
                          this.handleOnChange(e, row.codeModleFunction);
                        }}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'POST').name}`}
                        checked={row.methods.find(item => item.name === 'POST').allow}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        onChange={e => {
                          this.handleOnChange(e, row.codeModleFunction);
                        }}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'PUT').name}`}
                        checked={row.methods.find(item => item.name === 'PUT').allow}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        onChange={e => {
                          this.handleOnChange(e, row.codeModleFunction);
                        }}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'DELETE').name}`}
                        checked={row.methods.find(item => item.name === 'DELETE').allow}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        onChange={e => {
                          this.handleOnChange(e, row.codeModleFunction);
                        }}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'EXPORT').name}`}
                        checked={row.methods.find(item => item.name === 'EXPORT').allow}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        onChange={e => {
                          this.handleOnChange(e, row.codeModleFunction);
                        }}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'IMPORT').name}`}
                        checked={row.methods.find(item => item.name === 'IMPORT').allow}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        onChange={e => {
                          this.handleOnChange(e, row.codeModleFunction);
                        }}
                        name={`${row.codeModleFunction}/${(row.methods.find(item => item.name === 'VIEWCONFIG') || { name: '' }).name}`}
                        checked={(row.methods.find(item => item.name === 'VIEWCONFIG') || { allow: false }).allow}
                      />
                    </TableCell>
                  </TableRow>
                );
              }
              if (isChildOpen)
                return (
                  <TableRow key={row.codeModleFunction}>
                    <TableCell>
                      <p onClick={() => {
                       
                        if (addStock) return;
                        this.detailRole(row.codeModleFunction)
                      }} style={{ color: '#2196F3', cursor: 'pointer', paddingLeft: '20px' }}>
                        {row.titleFunction}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        onChange={this.handleOnChange}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'GET').name}`}
                        checked={row.methods.find(item => item.name === 'GET').allow}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        onChange={this.handleOnChange}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'POST').name}`}
                        checked={row.methods.find(item => item.name === 'POST').allow}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        onChange={this.handleOnChange}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'PUT').name}`}
                        checked={row.methods.find(item => item.name === 'PUT').allow}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        onChange={this.handleOnChange}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'DELETE').name}`}
                        checked={row.methods.find(item => item.name === 'DELETE').allow}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        onChange={this.handleOnChange}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'EXPORT').name}`}
                        checked={row.methods.find(item => item.name === 'EXPORT').allow}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        onChange={this.handleOnChange}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'IMPORT').name}`}
                        checked={row.methods.find(item => item.name === 'IMPORT').allow}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        onChange={this.handleOnChange}
                        name={`${row.codeModleFunction}/${(row.methods.find(item => item.name === 'VIEWCONFIG') || { name: '' }).name}`}
                        checked={(row.methods.find(item => item.name === 'VIEWCONFIG') || { allow: false }).allow}
                      />
                    </TableCell>
                  </TableRow>
                );
            })}
          </TableBody>
        </Table>
        <Dialog fullWidth maxWidth="lg" onClose={() => this.setState({ dialogDetail: false })} open={this.state.dialogDetail}>
          <DialogContent>
            <DetailRole
              isGroup={this.props.isGroup}
              groupId={this.props.groupId}
              // {...this.props}
              moduleCode={this.state.moduleCode}
              closeDialog={() => this.setState({ dialogDetail: false })}
              employeeId={this.props.employeeId}
            />
          </DialogContent>
          {/* <DialogActions>
             <Button variant="outlined" color="primary" onClick={() => this.setState({ dialogDetail: false })}>
               Lưu
             </Button>
           </DialogActions> */}
        </Dialog>
      </React.Fragment>
    );
  }
}

RoleByFunction.propTypes = {};

export default RoleByFunction;
