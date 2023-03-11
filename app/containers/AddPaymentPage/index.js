/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/**
 *
 * AddPaymentPage
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { AsyncAutocomplete } from '../../components/LifetekUi';

import { compose } from 'redux';
import {
  withStyles,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  AppBar,
  Toolbar,
  Fab,
  Avatar,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { Add, Edit, Delete, SaveAlt, Close } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import NumberFormat from 'react-number-format';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddPaymentPage, { makeSelectDashboardPage } from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import { injectIntl } from 'react-intl';
import messages from './messages';
import CustomAppBar from 'components/CustomAppBar';
import { changeSnackbar } from '../Dashboard/actions';
import { getCommandAct, createPaymentRecordAct, resetNotiAct, getPaymentRecordByIdAct, updatePaymentRecordAct } from './actions';
import { provinceData } from '../../utils/provinceData';
import LoadingIndicator from '../../components/LoadingIndicator';
import { API_USERS, API_BOS } from '../../config/urlConfig';
import { convertDatetimeToDate, getLabelName, viewConfigCheckForm, viewConfigCheckRequired, viewConfigHandleOnChange } from '../../utils/common';
import CustomInputBase from '../../components/Input/CustomInputBase';
import dot from 'dot-object';
import KanbanStepper from '../../components/KanbanStepper';

const tempDate = new Date();
const date = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1 < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1}-${tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()
  }`;

function formatNumber(num) {
  if (num) return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  return '';
}

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
    />
  );
}

/* eslint-disable react/prefer-stateless-function */
export class AddPaymentPage extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
    this.addItemBtn = React.createRef();
    const moduleCode = 'PaymentRequire';
    const checkRequired = viewConfigCheckRequired(moduleCode, 'required');
    const checkShowForm = viewConfigCheckRequired(moduleCode, 'showForm');
    this.state = {
      commandChoose: {},
      code: '',
      advanceDate: date,
      currentItem: {
        content: '',
        amount: 0,
        province: '',
        provinceCode: '',
      },
      advancePerson: {
        name: '',
        employeeId: '',
      },
      businessOpportunities: "",
      items: [],
      open: false,
      errorProvince: false,
      provinceList: [],
      provinceChoose: {},
      isEditItem: -1,
      commandList: [],
      isEditPage: false,
      fieldAdded: [],
      createdBy: {},
      fileRecived: '',
      statusList: [
        {
          code: '0',
          name: 'Yêu cầu phê duyệt',
        },
        {
          code: '1',
          name: 'Đã phê duyệt',
        },
        {
          code: '2',
          name: 'Không phê duyệt',
        },
        {
          code: '3',
          name: 'Không cần phê duyệt',
        },

        {
          code: '4',
          name: 'Đã hoàn thành',
        },
      ],
      state: 0,
      note: '',
      total: 0,
      moduleCode,
      checkRequired,
      checkShowForm,
      localMessages: {},
      listKanbanStatus: [],
      kanbanStatus: "",
      disableAdd: false,
    };
  }

  componentWillMount() {
    console.log(this.state.kanbanStatus, 1);
    this.props.onGetCommand();
    const { match } = this.props;
    if (match.params.id) {
      this.props.onGetAdvanceRecordById(match.params.id);
      this.state.isEditPage = true;
    } else {
      this.state.isEditPage = false;
    }
  }

  async componentDidMount() {
    const provinceList = [];
    const provinceDataRaw = JSON.parse(provinceData);
    const keys = Object.keys(provinceDataRaw);
    keys.forEach((item, index) => {
      provinceList.push({
        label: provinceDataRaw[item].name,
        value: index + 1,
      });
    });
    console.log(this.state.kanbanStatus, 2);
    this.setState({ provinceList });
    const listViewConfig = await JSON.parse(localStorage.getItem('viewConfig')) || [];
    const currentViewConfig = listViewConfig.find(item => item.code === 'PaymentRequire');
    if (currentViewConfig && this.state.fieldAdded.length === 0) {
      const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const addVaue = fieldAdded.map(item => ({
        ...item,
        value: '',
      }));
      this.setState({ fieldAdded: addVaue });
    }
    if (this.props.dashboardPage.profile) {
      this.state.createdBy = {
        employeeId: this.props.dashboardPage.profile._id,
        name: this.props.dashboardPage.profile.name,
      };
    }
    try {
      const listKanBan = JSON.parse(localStorage.getItem('crmStatus'));

      let listKanbanStatus = listKanBan.find(p => p.code === 'ST256')
      this.setState({ listKanbanStatus: listKanbanStatus && listKanbanStatus.data || [] })
      if (!this.state.isEditPage && listKanbanStatus && listKanbanStatus.data && Array.isArray(listKanbanStatus.data) && listKanbanStatus.data.length) {
        // kanbanStatus
        this.setState({ kanbanStatus: listKanbanStatus.data[0]._id })
        console.log(this.state.kanbanStatus, 3);
      }
    } catch (error) {
      console.log(error, 'error')
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.dashboardPage.profile) {
      this.state.createdBy = {
        employeeId: this.props.dashboardPage.profile._id,
        name: this.props.dashboardPage.profile.name,
      };
    }
    if (props !== this.props) {
      const { addPaymentPage, location } = props;
      // const listData = location.state.dataItem;
      const list = addPaymentPage.allCommand || [];
      if (list.length > 0) {
        const commandList = [];
        list.forEach(item => {
          commandList.push({
            label: item.name,
            value: item._id,
            ...item,
          });
        });
        this.setState({ commandList });
      } else {
        const commandList = [];
        list.forEach(item => {
          commandList.push({
            label: item.name,
            value: item._id,
            ...item,
          });
        });
        this.setState({ commandList });
      }
      const { recordSelected } = addPaymentPage;
      if (this.state.isEditPage && recordSelected !== this.props.addPaymentPage.recordSelected) {
        this.state.commandChoose = list.find(item => item.name === recordSelected.commandNumber);
        if (this.state.commandChoose) {
          this.state.commandChoose.label = this.state.commandChoose.name;
          this.state.commandChoose.value = this.state.commandChoose._id;
        } else {
          // this.props.onChangeSnackbar({ status: true, message: 'Công lệnh đã bị xóa!', variant: 'error' });
        }
        this.state.code = recordSelected.code;
        this.state.createdBy = recordSelected.createdBy || {};
        this.state.businessOpportunities = recordSelected.businessOpportunities || {};
        this.state.state = recordSelected.state || 0;
        this.state.fileRecived = recordSelected.file;
        this.state.advancePerson = recordSelected.advancePerson || {};
        this.state.note = recordSelected.note || '';
        this.state.advanceDate = convertDatetimeToDate(recordSelected.paymentDate);
        this.state.kanbanStatus = recordSelected.kanbanStatus || '';
        this.state.items = recordSelected.items;
        if (recordSelected.others && Object.keys(recordSelected.others).length > 0) {
          const { fieldAdded } = this.state;
          const keys = Object.keys(recordSelected.others);
          fieldAdded.forEach(item => {
            const index = keys.findIndex(n => n === item.name.replace('others.', ''));
            if (index > -1) {
              item.value = recordSelected.others[keys[index]];
            }
          });
          this.state.fieldAdded = fieldAdded;
        }
      }
    }
  }

  // static getDerivedStateFromProps(props, state) {
  //   const {
  //     commandChoose,
  //     code,
  //     advanceDate,
  //     items,
  //     businessOpportunities,
  //     employee,
  //     isEditPage,
  //     fieldAdded,
  //     createdBy,
  //     note,
  //     state: localState,
  //     total,
  //     file,
  //   } = state;
  //   const error = false;
  //   if (!error) {
  //     // const businessOpportunitiesRaw = {
  //     //   name: businessOpportunities.name,
  //     //   businessOpportunitiesId: businessOpportunities._id,
  //     // };
  //     // const advancePerson = {
  //     //   name: employee.name,
  //     //   employeeId: employee.employeeId,
  //     // };
  //     const others = {};
  //     if (fieldAdded.length > 0) {
  //       fieldAdded.forEach(item => {
  //         others[item.name.replace('others.', '')] = item.value;
  //       });
  //     }
  //     const body = {
  //       businessOpportunities,
  //       // : businessOpportunitiesRaw,
  //       code,
  //       commandNumber: commandChoose.name,
  //       advancePerson: employee,
  //       paymentDate: advanceDate,
  //       totalPayment: total,
  //       items,
  //       others,
  //       createdBy,
  //       note,
  //       file,
  //       state: localState,
  //     };
  //     const data = dot.dot(body);
  //     const messages = viewConfigCheckForm(state.moduleCode, data);
  //     return {
  //       localMessages: messages,
  //     };
  //   }
  // }

  componentDidUpdate(props) {
    const { successCreate } = props.addPaymentPage;
    if (successCreate) {
      this.props.onResetNoti();
      this.props.history.value = 5;
      this.props.history.push('/RevenueExpenditure');
    }
  }

  render() {
    const { classes, addPaymentPage, intl } = this.props;
    const { businessOpportunities, localMessages, checkRequired, checkShowForm, listKanbanStatus, kanbanStatus } = this.state;
 
    this.state.total = 0;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    return (
      <div>
        <CustomAppBar
          className
          title={
            addStock === 'add'
              ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới thanh toán' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật thanh toán' })}`
          }
          onGoBack={() => {
            this.props.history.goBack();
            this.props.history.value = 5;
          }}
          onSubmit={this.handleSubmitForm}
          disableAdd={this.state.disableAdd}
        />

        <KanbanStepper
          listStatus={listKanbanStatus}
          onKabanClick={(value) => {
            this.setState({ kanbanStatus: value });
          }}
          activeStep={kanbanStatus}
        />
        {addPaymentPage.loading ? <LoadingIndicator /> : null}
        <Helmet>
          <title>Tạm ứng</title>
          <meta name="description" content="Description of addPaymentPage" />
        </Helmet>
        <Grid>
          <Paper style={{ padding: '20px' }}>
            <ValidatorForm>
              <Grid container md={12} item spacing={24} style={{ width: '100%' }}>
                {/* <Grid item md={6} style={{ paddingTop: '17px' }}> */}
                {/* <CustomInputBase
                    label={getLabelName('businessOpportunities.name', 'PaymentRequire')}
                    value={Object.keys(businessOpportunities).length > 0 ? businessOpportunities.name : ''}
                    // disabled
                    name="businessOpportunities"
                    onChange={event => {
                      let { businessOpportunities } = this.state;
                      businessOpportunities.name = event.target.value;
                      this.setState({ businessOpportunities });
                    }}
                    error={localMessages && localMessages['businessOpportunities.name']}
                    helperText={localMessages && localMessages['businessOpportunities.name']}
                    required={checkRequired['businessOpportunities.name']}
                    checkedShowForm={checkShowForm['businessOpportunities.name']}
                  /> */}
                {/* </Grid> */}
                {/* <Grid item md={6}>
                  <Typography component="p" style={{ color: '#a4a4a4' }}>
                    {getLabelName('commandNumber', 'PaymentRequire')}
                  </Typography>
                  <AsyncSelect
                    // cacheOptions
                    value={this.state.commandChoose}
                    className={classes.reactSelect}
                    isDisabled={this.state.isEditPage}
                    loadOptions={this.loadOptions}
                    defaultOptions={this.state.commandList}
                    onInputChange={this.handleInputChange}
                    onChange={this.handleChangeSelect}
                    theme={theme => ({
                      ...theme,
                      spacing: {
                        ...theme.spacing,
                        controlHeight: '55px',
                      },
                    })}
                  />
                </Grid> */}
                <Grid item md={6}>
                  <AsyncAutocomplete
                    // isMulti
                    label={getLabelName('businessOpportunities.name', 'PaymentRequire')}
                    onChange={value => {
                   
                      if (!value) {
                        this.setState({ businessOpportunities: null });
                      }
                      else {
                        const businessOpportunities = {
                          businessOpportunitiesId: value._id,
                          name: value.name
                        }
                        this.setState({ businessOpportunities: businessOpportunities });
                      }
                    }}
                    error={localMessages && localMessages['businessOpportunities.name']}
                    helperText={localMessages && localMessages['businessOpportunities.name']}
                    required={checkRequired['businessOpportunities.name']}
                    checkedShowForm={checkShowForm['businessOpportunities.name']}
                    value={this.state.businessOpportunities}
                    url={API_BOS}
                  />
                </Grid>
                <Grid item md={6}>
                  <CustomInputBase
                    label={getLabelName('code', 'PaymentRequire')}
                    name="code"
                    disabled={this.state.isEditPage}
                    value={this.state.code}
                    onChange={this.handleChange}
                    error={localMessages && localMessages.code}
                    helperText={localMessages && localMessages.code}
                    required={checkRequired.code}
                    checkedShowForm={checkShowForm.code}
                  />
                </Grid>
                <Grid item md={6}>
                  <Typography component="p" style={{ color: '#a4a4a4' }}>
                    {getLabelName('advancePerson.name', 'PaymentRequire')}
                  </Typography>
                  <AsyncSelect
                    // cacheOptions
                    value={this.state.advancePerson}
                    className={classes.reactSelect3}
                    placeholder="Tìm kiếm nhân viên ..."
                    loadOptions={(newValue, callback) => this.loadOptions2(newValue, callback, API_USERS)}
                    loadingMessage={() => 'Đang tải ...'}
                    components={{ Option, SingleValue }}
                    isDisabled={this.state.isEditPage}
                    onChange={this.handleEmployee}
                    theme={theme => ({
                      ...theme,
                      spacing: {
                        ...theme.spacing,
                        controlHeight: '55px',
                      },
                    })}
                  />
                </Grid>
                <Grid item md={6}>
                  <CustomInputBase
                    label={getLabelName('createdBy.name', 'PaymentRequire')}
                    disabled
                    value={Object.keys(this.state.createdBy).length > 0 ? this.state.createdBy.name : ''}
                    error={localMessages && localMessages['createdBy.name']}
                    helperText={localMessages && localMessages['createdBy.name']}
                    required={checkRequired['createdBy.name']}
                    checkedShowForm={checkShowForm['createdBy.name']}
                  />
                </Grid>
                {/* <Grid item md={6}>
                  <CustomInputBase
                    label={getLabelName('advanceDate', 'PaymentRequire')}
                    type="date"
                    onChange={this.handleChange}
                    name="advanceDate"
                    value={this.state.advanceDate}
                    error={localMessages && localMessages.advanceDate}
                    helperText={localMessages && localMessages.advanceDate}
                    required={checkRequired.advanceDate}
                    checkedShowForm={checkShowForm.advanceDate}
                  />
                </Grid> */}
                <Grid item md={6}>
                  <CustomInputBase
                    label="Trạng thái"
                    name="state"
                    select
                    // disabled
                    value={this.state.state}
                    onChange={this.handleChange}
                    error={localMessages && localMessages.state}
                    helperText={localMessages && localMessages.state}
                    required={checkRequired.state}
                    checkedShowForm={checkShowForm.state}
                  >
                    {this.state.statusList.map(item => (
                      <MenuItem value={item.code} key={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </CustomInputBase>
                </Grid>
                <Grid item md={6}>
                  <CustomInputBase
                    label="Ghi chú"
                    onChange={this.handleChange}
                    name="note"
                    value={this.state.note}
                    error={localMessages && localMessages.note}
                    helperText={localMessages && localMessages.note}
                    required={checkRequired.note}
                    checkedShowForm={checkShowForm.note}
                    multiline
                    rows={3}
                  />
                </Grid>
                {this.state.fieldAdded.length > 0
                  ? this.state.fieldAdded.map((item, index) => {
                    if (item.checked) {
                      return (
                        <Grid item md={6} key={item.name}>
                          <CustomInputBase
                            label={item.title}
                            type={item.type === 'string' ? 'text' : item.type}
                            value={item.value}
                            onChange={event => this.handleChangeAddedField(index, event)}
                            error={localMessages && localMessages[`${item.name}`]}
                            helperText={localMessages && localMessages[`${item.name}`]}
                            required={checkRequired[`${item.name}`]}
                            checkedShowForm={checkShowForm[`${item.name}`]}
                          />
                        </Grid>
                      );
                    }
                  })
                  : ''}
                {/* <Grid item md={12}>
                  <Button
                    onClick={this.handleSubmitForm}
                    variant="contained"
                    color="primary"
                    autoFocus
                  >
                    Lưu
                  </Button>
                  &nbsp;&nbsp;
                  <Button
                    onClick={() => {
                      this.props.history.goBack();
                      this.props.history.value = 5;
                    }}
                    variant="contained"
                  >
                    Quay lại
                  </Button>
                </Grid> */}
                <Grid item md={6} style={{ padding: 0, paddingLeft: '12px' }}>
                  <Typography component="p">Tạm ứng chi phí chi tiết cho từng khoản mục</Typography>
                </Grid>
                <Grid item md={12}>
                  <Fab color="primary" aria-label="Add" size="small" onClick={this.handleOpenAddItem}>
                    <Add />
                  </Fab>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nội dung</TableCell>
                        <TableCell>Số tiền</TableCell>
                        <TableCell>Tỉnh</TableCell>
                        <TableCell>Mã tỉnh</TableCell>
                        <TableCell>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.items.length > 0
                        ? this.state.items.map((item, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <TableRow key={index}>
                            <TableCell>{item.content}</TableCell>
                            <TableCell>
                              {formatNumber(Number(item.amount))}
                              <Typography style={{ display: 'none' }}>{(this.state.total += Number(item.amount))}</Typography>
                            </TableCell>
                            <TableCell>{item.province}</TableCell>
                            <TableCell>{item.provinceCode}</TableCell>
                            <TableCell>
                              <Fab color="primary" aria-label="Add" size="small" onClick={() => this.editItem(index)}>
                                <Edit />
                              </Fab>
                              &nbsp;&nbsp;
                              <Fab color="secondary" aria-label="Add" size="small" onClick={() => this.deleteItem(index)}>
                                <Delete />
                              </Fab>
                            </TableCell>
                          </TableRow>
                        ))
                        : ''}
                      <TableRow>
                        <TableCell>Tổng số tiền</TableCell>
                        <TableCell>{formatNumber(Number(this.state.total))}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    label="Tệp đính kèm"
                    style={{ width: '100%' }}
                    variant="outlined"
                    name="note"
                    type="file"
                    onChange={this.handleChangeFile}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {this.state.isEditPage && this.state.fileRecived !== '' ? (
                            <IconButton edge="end" style={{ cursor: 'pointer' }} onClick={() => window.open(this.state.fileRecived)}>
                              <SaveAlt color="primary" />
                            </IconButton>
                          ) : (
                            ''
                          )}
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
              <div style={{ display: 'none' }}>
                <button ref={this.submitBtn} type="submit" />
              </div>
            </ValidatorForm>
          </Paper>
        </Grid>
        <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="md">
          <DialogTitle id="alert-dialog-title" onClose={this.handleClose}>
            Cập nhật chi phí
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px', height: '400px' }}>
            <ValidatorForm style={{ width: '100%', display: 'inline' }} onSubmit={this.handleAddItem}>
              <TextValidator
                label="Nội dung"
                onChange={this.handleChangeItem('content')}
                name="content"
                value={this.state.currentItem.content}
                style={{ width: '100%' }}
                variant="outlined"
                margin="normal"
                validators={['required', 'trim']}
                errorMessages={['Không được để trống trường này', 'Không được để trống trường này']}
              />
              <TextValidator
                label="Số tiền"
                variant="outlined"
                value={this.state.currentItem.amount}
                name="amount"
                margin="normal"
                style={{ width: '100%' }}
                onChange={this.handleChangeItem('amount')}
                validators={['minNumber:0', 'required']}
                errorMessages={['Không được nhỏ hơn 0', 'Không được để trống trường này']}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
              <Typography component="p" style={{ color: '#a4a4a4' }}>
                Tỉnh thành
              </Typography>
              <AsyncSelect
                // cacheOptions
                value={this.state.provinceChoose}
                className={classes.reactSelect2}
                loadOptions={this.loadOptionsProvince}
                defaultOptions={this.state.provinceList}
                onInputChange={this.handleInputChange}
                onChange={this.handleChangeSelectProvince}
                theme={theme => ({
                  ...theme,
                  spacing: {
                    ...theme.spacing,
                    controlHeight: '55px',
                  },
                })}
              />
              {this.state.errorProvince ? (
                <Typography component="p" style={{ color: 'red' }}>
                  Không được để trống trường này
                </Typography>
              ) : (
                ''
              )}
              <div style={{ display: 'none' }}>
                <button ref={this.addItemBtn} type="submit" />
              </div>
            </ValidatorForm>
          </DialogContent>
          <DialogActions style={{ zIndex: 999 }}>
            <Button
              style={{ margin: 20 }}
              onClick={() => {
                this.addItemBtn.current.click();
              }}
              variant="outlined"
              color="primary"
              autoFocus
            >
              Lưu
            </Button>
            <Button style={{ margin: 20 }} onClick={this.handleClose} color="secondary" variant="outlined">
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  handleChangeAddedField = (index, e) => {
    const { fieldAdded } = this.state;
    const fields = [...fieldAdded];
    fieldAdded[index].value = e.target.value;
    this.setState({ fieldAdded: fields });
  };

  handleSubmitForm = () => {
    this.setState({ disableAdd: true });
    setTimeout(() => {
      this.setState({ disableAdd: false });
    }, 3000);
    const id = this.props && this.props.location && this.props.location.state && this.props.location.state.dataItem && this.props.location.state.dataItem._id
    const {
      commandChoose,
      code,
      advanceDate,
      items,
      businessOpportunities,
      advancePerson,
      isEditPage,
      fieldAdded,
      createdBy,
      note,
      state,
      total,
      statusList,
      // file,
      moduleCode,
      kanbanStatus
    } = this.state
    // window.alert('okkkk')
    let data = {
      id: id,
      businessOpportunities: businessOpportunities,
      code,
      advancePerson,
      isEditPage,
      fieldAdded,
      statusList,
      // commandNumber: commandChoose.name,
      // advancePerson,
      paymentDate: advanceDate,
      totalPayment: total,
      items,
      // others,
      createdBy,
      note,
      // file,
      state,
      moduleCode,
      kanbanStatus
    };
    let dataClone = {
      ...data,
      "businessOpportunities.businessOpportunitiesId": businessOpportunities
    }
    const messages = viewConfigCheckForm('PaymentRequire', dataClone);
    if (Object.keys(messages).length === 0) {
      if (isEditPage === true) { 
        const { match } = this.props;
        data.id = match.params.id;
        this.props.onUpdateAdvanceRecord(data) 
      }
      else { this.props.onCreateAdvanceRecord(data); }
    } else {
      let mess = ''
      for (const mes in messages) {
        
        if (!mess)
          mess = mess + `${messages[mes]}`
        else mess = mess + `, ${messages[mes]}`
      }
    
      this.props.onChangeSnackbar && this.props.onChangeSnackbar({ status: true, message: mess || 'Thêm dữ liệu thất bại', variant: 'error' });
    }
  }
  //   handleSubmitForm = () => {
  //   const {
  //     commandChoose,
  //     code,
  //     advanceDate,
  //     items,
  //     businessOpportunities,
  //     employee,
  //     isEditPage,
  //     fieldAdded,
  //     createdBy,
  //     note,
  //     state,
  //     total,
  //     file,
  //   } = this.state;
  //   const error = false;
  //   if (!error) {
  //     const businessOpportunitiesRaw = {
  //       name: businessOpportunities.name,
  //       businessOpportunitiesId: businessOpportunities._id,
  //     };
  //     const advancePerson = {
  //       name: employee.name,
  //       employeeId: employee.employeeId,
  //     };
  //     const others = {};
  //     if (fieldAdded.length > 0) {
  //       fieldAdded.forEach(item => {
  //         others[item.name.replace('others.', '')] = item.value;
  //       });
  //     }
  //     const body = {
  //       businessOpportunities: businessOpportunitiesRaw,
  //       code,
  //       commandNumber: commandChoose.name,
  //       advancePerson,
  //       paymentDate: advanceDate,
  //       totalPayment: total,
  //       items,
  //       others,
  //       createdBy,
  //       note,
  //       file,
  //       state,
  //     };
  //     if (!isEditPage) {
  //       this.props.onCreateAdvanceRecord(body);
  //     } else {
  //       const { match } = this.props;
  //       body.id = match.params.id;
  //       body.businessOpportunities = businessOpportunities;
  //       body.advancePerson = employee;
  //       body.fileRecived = this.state.fileRecived;
  //       this.props.onUpdateAdvanceRecord(body);
  //     }
  //   }
  // };

  handleChangeFile = e => {
    this.setState({ file: e.target.files[0] });
  };

  editItem = index => {
    const { items } = this.state;
    const current = Object.assign(items[index]);
    const choose = {
      label: current.province,
      value: current.provinceCode,
    };
    this.setState({ currentItem: current, provinceChoose: choose, open: true, isEditItem: index });
  };

  deleteItem = index => {
    const { items } = this.state;
    items.splice(index, 1);
    this.setState({ items });
  };

  loadOptions2 = (newValue, callback, api) => {
    const token = localStorage.getItem('token');
    const url = `${api}?filter%5Bname%5D%5B%24regex%5D=${newValue}&filter%5Bname%5D%5B%24options%5D=gi`;
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(myJson => {
        const { data } = myJson;
        callback(
          data.map(item => ({
            ...item,
            value: item._id,
            avatar: item.avatar || item.logo,
          })),
        );
      });
  };

  handleAddItem = () => {
    const { provinceChoose, currentItem, items, isEditItem } = this.state;
    let error = false;
    if (Object.keys(provinceChoose).length === 0) {
      error = true;
      this.setState({ errorProvince: true });
    }
    if (!error) {
      currentItem.province = provinceChoose.label;
      currentItem.provinceCode = provinceChoose.value;
      const cur = {
        content: '',
        amount: 0,
        province: '',
        provinceCode: '',
      };
      if (isEditItem === -1) {
        items.push(currentItem);
      } else {
        items[isEditItem] = currentItem;
      }
      this.setState({ items, currentItem: cur, open: false, isEditItem: -1, provinceChoose: {} });
    }
  };

  handleOpenAddItem = () => {
    const cur = {
      content: '',
      amount: 0,
      province: '',
      provinceCode: '',
    };
    this.setState({ open: true, currentItem: cur });
  };

  handleChangeItem = name => e => {
    const { currentItem } = this.state;
    currentItem[name] = e.target.value;
    this.setState({ currentItem });
  };

  handleClose = () => {
    const cur = {
      content: '',
      amount: 0,
      province: '',
      provinceCode: '',
    };
    this.setState({ open: false, currentItem: cur });
  };

  handleInputChange = newValue => newValue;

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    const messages = viewConfigHandleOnChange(this.state.moduleCode, this.state.localMessages, e.target.name, e.target.value);
    this.setState({
      localMessages: messages,
    });
  };

  handleEmployee = value => {
    const advancePerson = {
      employeeId: value._id,
      name: value.name,
      avatar: value.avatar,
    };
    this.setState({ advancePerson });
  };

  handleChangeSelect = selectedOption => {
    if (selectedOption.dataduan && selectedOption.dataduan !== '') {
      // eslint-disable-next-line no-unused-vars
      const businessOpportunities = this.callApi(API_BOS, selectedOption.dataduan);
    } else {
      this.setState({ businessOpportunities: {} });
    }
    if (selectedOption.canbokinhdoanh && selectedOption.canbokinhdoanh !== '') {
      // eslint-disable-next-line no-unused-vars
      const advancePerson = this.callApi(API_USERS, selectedOption.canbokinhdoanh);
    } else {
      this.setState({ advancePerson: {} });
    }
    // const employeeId = selectedOption.canbokinhdoanh;
    // // eslint-disable-next-line no-unused-vars
    // const employee = this.callApi(API_USERS, employeeId);
    this.setState({ commandChoose: selectedOption });
  };

  callApi = (api, newValue) => {
    const token = localStorage.getItem('token');
    return fetch(`${api}/${newValue}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(myData => {
        if (api.includes('employee')) {
          this.setState({ advancePerson: myData.data });
        }
        this.setState({ businessOpportunities: myData });
      });
  };

  handleChangeSelectProvince = selectedOption => {
    this.setState({ provinceChoose: selectedOption, errorProvince: false });
  };

  filterColors = newValue => {
    const { commandList } = this.state;
    // console.log(newValue)
    return commandList.filter(i =>
      String(i.label)
        .toLowerCase()
        .includes(
          String(newValue)
            .toLowerCase()
            .trim(),
        ),
    );
  };

  loadOptions = (newValue, callback) =>
    // eslint-disable-next-line no-unused-vars
    new Promise(resolve => {
      // console.log(action)
      setTimeout(() => {
        callback(this.filterColors(newValue));
      }, 500);
    });

  filterProvince = newValue => {
    const { provinceList } = this.state;
    // console.log(newValue)
    return provinceList.filter(i => i.label.toLowerCase().includes(newValue.toLowerCase().trim()));
  };

  loadOptionsProvince = (newValue, callback) =>
    // eslint-disable-next-line no-unused-vars
    new Promise(resolve => {
      // console.log(action)
      setTimeout(() => {
        callback(this.filterProvince(newValue));
      }, 500);
    });
}

const Option = props => (
  <components.Option {...props}>
    <div style={{ display: 'flex', justifyContent: 'flex-start', zIndex: 100 }}>
      <Avatar src={`${props.data.avatar}?allowDefault=true`} />
      <div style={{ marginTop: 10, marginLeft: 20 }}>{props.data.name}</div>
    </div>
  </components.Option>
);

const SingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Avatar style={{ height: 30, width: 30 }} src={props.data.avatar} />
      <div style={{ marginTop: 5, marginLeft: 20 }}>{props.data.name}</div>
    </div>
  </components.SingleValue>
);

AddPaymentPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addPaymentPage: makeSelectAddPaymentPage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetCommand: () => {
      dispatch(getCommandAct());
    },
    onCreateAdvanceRecord: body => {
      dispatch(createPaymentRecordAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNotiAct());
    },
    onGetAdvanceRecordById: body => {
      dispatch(getPaymentRecordByIdAct(body));
    },
    onUpdateAdvanceRecord: body => {
      dispatch(updatePaymentRecordAct(body));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addPaymentPage', reducer });
const withSaga = injectSaga({ key: 'addPaymentPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddPaymentPage);
