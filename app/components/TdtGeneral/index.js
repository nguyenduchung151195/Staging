/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-useless-escape */
/**
 *
 * TdtGeneral
 *
 */

import React, { Suspense } from 'react';

import {
  Paper,
  Divider,
  // TextField,
  IconButton,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  MenuItem,
  SwipeableDrawer,
  AppBar,
  Toolbar,
} from '@material-ui/core';
import { Clear, Search, Close } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import dot from 'dot-object';
import lodash from 'lodash';
import { FileUpload } from '../LifetekUi';
import './styles.css';
import TimelineComponent from '../TimelineEvent';
import LoadingIndicator from '../LoadingIndicator';
import HOCFindPeopleDialog from '../../containers/HocFindPeopleDialog';
import EmployeeDetailDialog from '../EmployeesDetailDialog';
import { renderFieldByType, renderNewFieldContent } from './customfield';
import { convertStrToSlug, viewConfigCheckForm } from '../../utils/common';
const AddCustomerPage = React.lazy(() => import('../../containers/AddCustomerPage/Loadable'));
/* eslint-disable react/prefer-stateless-function */

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  //   dir: PropTypes.string.isRequired,
};

const fieldType = [
  {
    value: 'String',
    label: 'Văn bản',
  },
  {
    value: 'Money',
    label: 'Tiền tệ',
  },
  {
    value: 'Source',
    label: 'Danh sách',
  },

  {
    value: 'Date',
    label: 'Ngày tháng',
  },
  {
    value: 'Number',
    label: 'Số',
  },
  {
    value: 'Link',
    label: 'Link',
  },
  {
    value: 'Relation',
    label: 'Relation',
  },
  // {
  //   value: 'File',
  //   label: 'File',
  // },

  // {
  //   value: 'Boolen',
  //   label: 'Có / Không',
  // },
];

const relationType = [
  {
    value: 'Customer',
    label: 'Khách hàng',
  },
  {
    value: 'Supplier',
    label: 'Nhà cung cấp',
  },
  {
    value: 'Employee',
    label: 'Nhân viên',
  },
];

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  chip: {
    margin: theme.spacing.unit,
  },
  customTab: {
    minWidth: 0,
    '& span': {
      padding: 2.5,
    },
  },
  reactSelect: {
    zIndex: 999,
  },
});

class TdtGeneral extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
    this.state = {
      generalData: {},
      openHOCFindPeopleDialog: false,
      peopleType: 'customer',
      others: {},
      othersList: [],
      openingAddFieldDialog: false,
      newFieldConfig: {
        name: '',
        type: 'String',
        title: '',
        fromSouce: '',
      },
      // isEditting: false,
      defaultCurrency: 'USD',
      openAddCustomer: false,
      idForCustomer: 'add',
      relationChooseList: [],
      localMessages: {},
    };
    this.general = React.createRef();
  }

  componentDidMount() {
    const { generalData } = this.props;
    this.setState({ generalData });
  }
  componentWillReceiveProps(props) {
    const { generalData } = props;
    const messages = viewConfigCheckForm(this.props.moduleCode, generalData);
    this.setState({
      localMessages: messages,
    });
  }

  /* eslint-disable no-unused-vars */
  callBack = (command, data, extraData, isDate) => {
    // console.log(this.state.generalData)
    switch (command) {
      case 'view-people-detail': {
        const { generalData } = this.state;
        if (data === 'customer') {
          this.setState({
            openAddCustomer: true,
            idForCustomer: generalData.customer ? generalData.customer.customerId : generalData['customer.customerId'],
          });
          // this.props.history.push(`/crm/customers/${generalData.customer ? generalData.customer.customerId : generalData['customer.customerId']}`);
        } else {
          this.props.history.push(`/setting/Employee/add/${data}`);
        }
        break;
      }
      case 'close-find-people-dialog':
        this.setState({ openHOCFindPeopleDialog: false });
        break;
      case 'open-find-people':
        this.setState({ openHOCFindPeopleDialog: true, peopleType: data });
        break;
      case 'select-people': {
        let { generalData } = this.state;
        if (extraData === 'customer') {
          generalData['customer.customerId'] = data._id;
          generalData['customer.name'] = data.name;
        }
        if (extraData === 'responsibilityPerson') {
          // console.log(data);
          const val = data && data.length > 0 ? data.map(item => ({ name: item.name, employeeId: item.value })) : [];
          const y = dot.object(Object.assign({}, generalData));
          y.responsibilityPerson = val;
          generalData = y;
          // generalData['responsibilityPerson.employeeId'] = data._id;
          // generalData['responsibilityPerson.name'] = data.name;
        }
        if (extraData === 'supervisor') {
          const val = data && data.length > 0 ? data.map(item => ({ name: item.name, employeeId: item.value })) : [];
          const y = dot.object(Object.assign({}, generalData));
          y.supervisor = val;
          generalData = y;
          // generalData['supervisor.employeeId'] = data._id;
          // generalData['supervisor.name'] = data.name;
        }
        this.setState({ generalData: dot.dot(generalData), openHOCFindPeopleDialog: false });
        this.props.callBack('change-input', dot.dot(generalData));
        break;
      }
      case 'edit-people': {
        this.setState({ peopleType: data, openHOCFindPeopleDialog: true });
        break;
      }
      case 'custom-field-input-change': {
        this.setState({ generalData: dot.dot(data) });
        this.props.callBack('change-input', dot.dot(data));
        break;
      }

      default:
        break;
    }
  };

  handleChangeSwitch = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleAddNewField = () => {
    const { othersList, newFieldConfig, generalData, others } = this.state;
    const newOther = {
      checked: true,
      isFilter: false,
      isRequire: false,
      isSort: false,
      name: `others.${newFieldConfig.name}`,
      order: -1,

      title: newFieldConfig.title,
      type: newFieldConfig.type,
    };
    if (newFieldConfig.type === 'Source') {
      newOther.fromSource = newFieldConfig.fromSource;
    }
    if (newFieldConfig.type === 'Relation') {
      newOther.type = `Relation|${JSON.stringify({ ref: newFieldConfig.fromSource, select: newFieldConfig.fieldRela })}`;
      newOther.name = `others.${newFieldConfig.name}.${newFieldConfig.fieldRela}`;
    }
    this.props.callBack('push-to-others-viewconfig', newOther);
    this.props.callBack('change-input', generalData);
    this.setState({ newFieldConfig: { name: '', title: '', type: '', fromSource: '' }, openingAddFieldDialog: false });
  };

  handleCancelAddNewField = () => {
    const { newFieldConfig, generalData } = this.state;
    // console.log('ddd', generalData);

    delete generalData[`others.${newFieldConfig.name}`];

    this.props.callBack('cancel-add-field', generalData);
    this.setState({ newFieldConfig: { name: '', title: '', type: '', fromSource: '' }, openingAddFieldDialog: false, generalData });
  };

  handelDeleteField = row => {
    const { generalData } = this.state;
    const r = confirm('Bạn muốn xóa trường dữ liệu này ?');
    if (r) {
      delete generalData[`others.${row.name}`];
      this.props.callBack('delete-an-others-column', row);
      // this.props.callBack('delete-column', row);
    }
  };

  handleChangeDate = date => {
    this.date = moment(date);
  };
  closeCustomer = () => {
    this.setState({ openAddCustomer: false });
  };
  render() {
    const id = this.props.match && this.props.match.params && this.props.match.params.id;
    const { generalData, others, othersList } = this.state;
    const { viewConfig, kanbanSteppers } = this.props;
    const dotGeneralData = Object.assign({}, dot.dot(generalData));
    const displayRows = [];
    const listSources = JSON.parse(localStorage.getItem('crmSource'));
    if (!lodash.isEmpty(generalData)) {
      viewConfig.sort((a, b) => a.order - b.order).forEach(element => {
        if (element.checked || element.name === 'code') {
          if (element.name.includes('.') && !element.name.includes('others')) {
            const groupName = element.name.substring(0, element.name.indexOf('.'));
            if (displayRows.findIndex(d => d.name === groupName) === -1) {
              if (element.name.includes('value')) {
                displayRows.push({ ...element, ...{ name: groupName, type: 'Money' }, label: "Đơn Vị" });
              } else if (element.name === 'customer.name') {
                displayRows.push({ ...element, ...{ name: groupName, type: 'People' } });
              }
            }
          } else if (element.name === 'source') {
            displayRows.push({ ...element, ...{ type: 'Source' } });
          } else if (element.name === 'responsibilityPerson' || element.name === 'supervisor') {
            displayRows.push({ ...element, ...{ type: 'People Array' } });
          } else {
            displayRows.push(element);
          }
          // if (element.name === 'avatar') {
          //   displayRows.push({ ...element, ...{ type: 'Avatar' } });
          // }
        }
      });
    }
    return (
      <div>
        <Grid container>
          <Grid item md={5} xl={5} lg={5}>
            <Paper elevation={1} className="px-3 mt-2 mb-4">
              <Grid justify="center" alignItems="center" container className="row align-items-center">
                <Grid item md={6} xl={6} lg={6} className="align-items-center">
                  <p className="mb-0">Thông tin cơ hội</p>
                </Grid>
                <Grid item md={6} xl={6} lg={6} className="col-6 text-right">
                  <IconButton
                    size="small"
                    onClick={() => {
                      this.setState({ openingAddFieldDialog: true, newFieldConfig: { name: '', title: '', type: '', fromSource: '' } });
                    }}
                  >
                    <i className="far fa-plus-square fa-xs text-primary" />
                  </IconButton>
                </Grid>
              </Grid>
              {id ? (
                <>
                  <Typography variant="subtitle2" style={{ padding: '20px 0px' }}>
                    File Upload
                  </Typography>
                  <FileUpload hiddenPadding name={generalData.name} id={id} code="BusinessOpportunities" />
                </>
              ) : null}
              {/* <Grid item md={6} xl={6} lg={6} className="align-items-center">
                <FileUpload name="name" id={id} code="BusinessOpportunities" />
              </Grid> */}
              <Divider />
              {/* {console.log(generalData)} */}
              {lodash.isEmpty(generalData) ? (
                ''
              ) : (
                <div>

                  {displayRows.filter(item => item.name !== 'typeOfCustomer').map((row, index) => {
                    // const state = Object.assign({}, this.state);
                    return (
                      <div key={row.name}>
                        <Grid className="my-1" container alignItems="center">
                          <Grid item sm={10}>
                            {renderFieldByType(
                              row,
                              dotGeneralData,
                              this.callBack,
                              this.props.currency,
                              this.props.classes,
                              this.props.isTrading,
                              this.state.localMessages,
                            )}
                          </Grid>
                          <Grid item sm={1} />
                          {row.name.includes('others.') ? (
                            <Grid item sm={1}>
                              <IconButton
                                onClick={() => {
                                  this.handelDeleteField(row);
                                }}
                              >
                                <Clear fontSize="small" />
                              </IconButton>
                            </Grid>
                          ) : (
                            ''
                          )}
                          {row.type === 'People' && row.name !== 'contactCenter' ? (
                            !generalData[`${row.name}`] && generalData[`${row.name}.name`] !== null ? (
                              <Grid item sm={1}>
                                <IconButton
                                  onClick={() => {
                                    this.callBack('open-find-people', row.name);
                                  }}
                                >
                                  <Search fontSize="small" />
                                </IconButton>
                              </Grid>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )}
                        </Grid>
                        {/* <Divider /> */}
                      </div>
                    );
                  })}
                </div>
              )}
            </Paper>
          </Grid>
          <Grid item md={7} xl={7} lg={7}>
            <TimelineComponent
              {...this.props}
              data={dotGeneralData}
              onChangeSnackbar={this.props.onChangeSnackbar}
              profile={this.props.profile}
              mergeData={this.props.mergeData} // cong viec du an
              businessOpportunities1={this.props.businessOpportunities1} // cong viec du an
            />
          </Grid>
        </Grid>

        <Dialog open={this.state.openingAddFieldDialog} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
          <DialogTitle id="form-dialog-title">Thêm Field</DialogTitle>
          <DialogContent>
            <Grid container justify="center" alignItems="center">
              <ValidatorForm style={{ width: '100%', zIndex: 0, display: 'inline' }} onSubmit={this.handleAddNewField}>
                <Grid item sm={12}>
                  <Grid item sm={8} style={{ display: 'inline' }}>
                    <TextValidator
                      autoFocus
                      margin="normal"
                      id="name"
                      label="Tên Field"
                      // fullWidth
                      style={{ width: '100%' }}
                      variant="outlined"
                      onChange={event => {
                        const { newFieldConfig } = this.state;
                        newFieldConfig.title = event.target.value;
                        newFieldConfig.name = convertStrToSlug(newFieldConfig.title);
                        this.setState({ newFieldConfig });
                      }}
                      value={this.state.newFieldConfig.title}
                      validators={['required', 'trim', 'matchRegexp:^[a-zA-Z0-9_]+$']}
                      errorMessages={['Không được để trống', 'Không được điền khoảng trắng', 'Không được chứa khoảng trắng vào kí tự đặc biệt!']}
                    />
                  </Grid>
                  {/* <Grid item sm={1} /> */}
                  <Grid item sm={3} style={{ display: 'inline' }}>
                    <TextValidator
                      // fullWidth
                      variant="outlined"
                      id="standard-select-currency"
                      select
                      margin="normal"
                      style={{ width: '100%' }}
                      label="Loại field"
                      value={this.state.newFieldConfig.type}
                      onChange={event => {
                        const { newFieldConfig } = this.state;
                        newFieldConfig.type = event.target.value;
                        // const counterFields = lodash.countBy(displayRows, 'type');
                        // newFieldConfig.name = `${newFieldConfig.type}${counterFields[newFieldConfig.type] + 1}`;
                        this.setState({ newFieldConfig });
                      }}
                      validators={['required']}
                      errorMessages={['Không được để trống']}
                    >
                      {fieldType.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextValidator>
                  </Grid>
                </Grid>
                {this.state.newFieldConfig.type === 'Source' ? (
                  <Grid item sm={12} className="my-3">
                    <TextValidator
                      variant="outlined"
                      fullWidth
                      select
                      label="Chọn danh sách loại"
                      value={this.state.newFieldConfig.fromSource}
                      onChange={event => {
                        const { newFieldConfig } = this.state;
                        newFieldConfig.fromSource = event.target.value;
                        generalData[`others.${newFieldConfig.name}`] = '';
                        this.setState({ newFieldConfig, generalData });
                      }}
                      validators={['required']}
                      errorMessages={['Không được để trống']}
                    >
                      {listSources.map(option => (
                        <MenuItem key={option._id} value={option._id}>
                          {option.title}
                        </MenuItem>
                      ))}
                    </TextValidator>
                  </Grid>
                ) : (
                  ''
                )}
                {this.state.newFieldConfig.type === 'Relation' ? (
                  <Grid item sm={12} className="my-3">
                    <Grid>
                      <TextValidator
                        variant="outlined"
                        fullWidth
                        select
                        margin="normal"
                        label="Chọn danh sách Relation"
                        value={this.state.newFieldConfig.fromSource}
                        onChange={event => {
                          const { newFieldConfig } = this.state;
                          newFieldConfig.fromSource = event.target.value;
                          generalData[`others.${convertStrToSlug(newFieldConfig.title)}`] = {};
                          const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
                          const cur = viewConfig.find(x => String(x.code) === String(event.target.value));
                          const listDis = cur.listDisplay.type.fields.type;
                          const list = listDis.columns.concat(listDis.others);
                          this.setState({ newFieldConfig, generalData, relationChooseList: list });
                        }}
                        validators={['required']}
                        errorMessages={['Không được để trống']}
                      >
                        {relationType.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextValidator>
                    </Grid>
                    <Grid>
                      <TextValidator
                        variant="outlined"
                        fullWidth
                        select
                        margin="normal"
                        label="Chọn trường Relation"
                        value={this.state.newFieldConfig.fieldRela || ''}
                        onChange={event => {
                          const { newFieldConfig } = this.state;
                          newFieldConfig.fieldRela = event.target.value;
                          this.setState({ newFieldConfig });
                        }}
                        validators={['required']}
                        errorMessages={['Không được để trống']}
                      >
                        {this.state.relationChooseList.map(option => (
                          <MenuItem key={option.name} value={option.name}>
                            {option.title}
                          </MenuItem>
                        ))}
                      </TextValidator>
                    </Grid>
                  </Grid>
                ) : (
                  ''
                )}
                <div style={{ display: 'none' }}>
                  <button ref={this.submitBtn} type="submit" />
                </div>
              </ValidatorForm>
            </Grid>

            {this.state.newFieldConfig.name !== '' ? renderNewFieldContent(this.state, this.callBack) : ''}
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="primary"
              className="border-primary text-primary"
              onClick={() => {
                this.submitBtn.current.click();
              }}
            >
              LƯU
            </Button>
            <Button onClick={this.handleCancelAddNewField} color="secondary" variant="outlined" className="border-danger text-danger">
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
        {this.state.openHOCFindPeopleDialog ? (
          <HOCFindPeopleDialog
            peopleType={this.state.peopleType}
            isOpeningFindPeopleDialog={this.state.openHOCFindPeopleDialog}
            callBack={this.callBack}
            handleOpenAddCustomer={this.handleOpenAddCustomer}
          />
        ) : (
          ''
        )}
        <SwipeableDrawer
          width={window.innerWidth - 260}
          anchor="right"
          onClose={() => {
            this.setState({ openAddCustomer: false });
          }}
          open={this.state.openAddCustomer}
        >
          <div style={{ width: window.innerWidth - 260 ,paddingTop : 60 }}>
            <Suspense fallback={<LoadingIndicator />}>
              <AppBar style={{ zIndex: 0 }}>
                <Toolbar>
                  <IconButton
                    color="inherit"
                    onClick={() => {
                      this.setState({ openAddCustomer: false });
                    }}
                    aria-label="Close"
                  >
                    <Close />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <AddCustomerPage closeCustomer={this.closeCustomer} callback={this.addCustomer} id={this.state.idForCustomer} />
            </Suspense>
          </div>
        </SwipeableDrawer>
        <EmployeeDetailDialog isOpeningEmloyeeDialog={this.isOpeningEmloyeeDialog} callBack={this.callBack} />
      </div>
    );
  }

  addCustomer = data => {
    const item = Object.assign({}, data);
    const { generalData } = this.state;
    generalData['customer.customerId._id'] = item && item._id;
    generalData['customer.name'] = item.name;
    this.setState({ generalData, openHOCFindPeopleDialog: false, openAddCustomer: false });
  };

  handleOpenAddCustomer = () => {
    this.setState({ openAddCustomer: true });
  };
}

TdtGeneral.propTypes = {
  //   classes: PropTypes.object.isRequired,
  //   theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TdtGeneral);
