/* eslint-disable eqeqeq */
/**
 *
 * AddEmailCampaign
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import { compose } from 'redux';
import { Grid, Button, MenuItem, Checkbox, AppBar, Toolbar, IconButton } from '@material-ui/core';
import Buttons from 'components/CustomButtons/Button';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { Add, Close } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { TextField, Paper, Typography, Autocomplete, AsyncAutocomplete } from 'components/LifetekUi';
import { API_CUSTOMERS, API_USERS } from '../../config/urlConfig';
import makeSelectAddEmailCampaign from './selectors';
import { mergeData, getData, postData, getDefault, getCurrent, putData } from './actions';
import reducer from './reducer';
import { injectIntl } from 'react-intl';
import messages from './messages';
import './style.scss';
import saga from './saga';
import { changeSnackbar } from '../Dashboard/actions';
import CustomAppBar from 'components/CustomAppBar';

import { CUSTOMER_TYPE_CODE } from '../../utils/constants';
const {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  OrderedList,
  UnorderedList,
  Undo,
  Redo,
  FontSize,
  FontName,
  FormatBlock,
  Link,
  Unlink,
  InsertImage,
  ViewHtml,
  InsertTable,
  AddRowBefore,
  AddRowAfter,
  AddColumnBefore,
  AddColumnAfter,
  DeleteRow,
  DeleteColumn,
  DeleteTable,
  MergeCells,
  SplitCell,
} = EditorTools;
/* eslint-disable react/prefer-stateless-function */
export class AddEmailCampaign extends React.Component {
  state = {
    tab: 0,
    localMessagesName: 'Tên chiến dịch không được để trống',
    localMessagesSender: 'Người gửi không được để trống',
    localMessagesGroupCustomer: 'Nhóm khách hàng không được để trống',
    localMessagesTypeCustomer: 'Loại khách hàng không được để trống',
    localMessagesCustomer: 'Khách hàng không được để trống',
    localMessagesForm: 'Biểu mẫu không được để trống',
    localMessagesSenderName: 'Nhân viên không được để trống',
  };

  componentDidMount() {
    this.props.getData();
    if (this.props.id === 'add') this.props.getDefault();
    else this.props.getCurrent(this.props.id);
    if (this.props.id && this.props.id !== "add") {
      this.setState({
        localMessagesName: '',
        localMessagesSender: '',
        localMessagesGroupCustomer: '',
        localMessagesTypeCustomer: '',
        localMessagesCustomer: '',
        localMessagesForm: '',
        localMessagesSenderName: '',
      })
    }
  }

  handleTab(tab) {
    this.setState({ tab });
  }

  handleDateChange = value => {
    this.props.mergeData({ timer: value });
  };

  handleChange = (name, value) => {
    if (name === 'name') {
      if (value === '' || value === null) {
        this.setState({ localMessagesName: 'Tên chiến dịch không được để trống' })
        return;
      } else {
        this.setState({ localMessagesName: '' })
      }
    }
    if (name === 'groupCustomer') {
      if (value === [] || value === '' || value === null) {
        this.setState({ localMessagesGroupCustomer: 'Nhóm khách hàng không được để trống' })
        return;
      } else {
        this.setState({ localMessagesGroupCustomer: '' })
      }
    } if (name === 'typeCustomer') {
      if (value === [] || value === '' || value === null) {
        this.setState({ localMessagesTypeCustomer: 'Loại khách hàng không được để trống' })
        return;
      } else {
        this.setState({ localMessagesTypeCustomer: '' })
      }
    } if (name === 'customer') {
      if (value === [] || value === '' || value === null) {
        this.setState({ localMessagesCustomer: 'Khách hàng không được để trống' })
        return;
      } else {
        this.setState({ localMessagesCustomer: '' })
      }
    }
  }

  handleChangeSender = e => {
    this.props.mergeData({ sender: e.target.value });
    if (e.target.value === '' || e.target.value === null) {
      this.setState({ localMessagesSender: 'Người gửi không được để trống' })
      return;
    } else {
      this.setState({ localMessagesSender: '' })
    }
  };

  handleTemplate = value => {
    this.props.mergeData({ form: value });
    if (value === null) {
      this.setState({ localMessagesForm: 'Biểu mẫu không được để trống' })
      return;
    } else {
      this.setState({ localMessagesForm: '' })
    }
    this.setHtml(value.content);
  };

  setHtml = value => {
    console.log('sethtml', this.editor.view);
    EditorUtils.setHtml(this.editor.view, value);
  };

  selectCustomer = senderName => {
    this.props.mergeData({ senderName });
    if (senderName === null) {
      this.setState({ localMessagesSenderName: 'Nhân viên không được để trống' })
      return;
    } else {
      this.setState({ localMessagesSenderName: '' })
    }
  };

  addItem = code => {
    const dataRenderLocal = JSON.parse(localStorage.getItem('crmSource')) || null;
    const dataRender = dataRenderLocal ? dataRenderLocal.find(item => item.code === code) : null;
    if (dataRender) return dataRender.data;
    return [];
  };

  handleType = value => {
    this.props.mergeData({ type: value });
  };
  onGoBack = () => {
    this.props.propsAll.history.goBack();
  };

  render() {
    // console.log('tesst', this.props.addEmailCampaign);
    const { tab } = this.state;
    const { addEmailCampaign, intl, miniActive, callback } = this.props;
    const { timer, minute, active } = this.props.addEmailCampaign;
    const Bt = props => (
      <Buttons onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : ''} left round size="md">
        {props.children}
      </Buttons>
    );
    return (
      <div style={{ width: 'calc(100vw - 260px)' }}>
        {/* <AppBar className='HeaderAppBarEmailCampain'>
              <Toolbar>
                <IconButton
                  // className={addStock === "criteria" ? 'BTNClose' : ''}
                  className='BTNEmailCampain'
                  color="inherit"
                  variant="contained"
                  onClick={this.onGoBack}
                  aria-label="Close"
                >
                  <Close />
                </IconButton>
                <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
                  {this.props.id === 'add'
                    ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật' })}`}
                </Typography>

                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={this.onSaveData}
                >
                  {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
                </Button>
              </Toolbar>
            </AppBar> */}
        <CustomAppBar
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
          title={
            this.props.id === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật' })}`
          }
          onGoBack={this.props.callback}
          onSubmit={this.onSaveData}
        />
        <Paper style={{ paddingTop: 80, width: window.innerWidth - 260 }}>
          <Grid container>
            {/* <h4 style={{ fontWeight: 'bold', display: 'inline' }}>
              <Add />
              Thêm mới chiến dịch Email
            </h4>{' '} */}
            <Grid item md={12}>
              <TextField
                label="Tên chiến dịch *"
                fullWidth
                onChange={e => {
                  this.props.mergeData({ name: e.target.value });
                  this.handleChange('name', e.target.value)
                }}
                value={addEmailCampaign.name}
                // style={{ padding: 5 }}
                error={this.state.localMessagesName}
                helperText={this.state.localMessagesName}
              />
              <TextField
                select
                label="Người gửi *"
                fullWidth
                onChange={this.handleChangeSender}
                value={addEmailCampaign.sender}
              // style={{ padding: 5 }}
              >
                <MenuItem key="1" value={1}>
                  Cá nhân
                </MenuItem>
                <MenuItem key="2" value={2}>
                  Nhóm
                </MenuItem>
              </TextField>
              {addEmailCampaign.sender == 1 ? (
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '50%', paddingRight: 5 }}>
                    <AsyncAutocomplete
                      name="Chọn..."
                      label="Nhân viên *"
                      onChange={this.selectCustomer}
                      url={API_USERS}
                      value={addEmailCampaign.senderName}
                      error={this.state.localMessagesSenderName}
                      helperText={this.state.localMessagesSenderName}
                    />
                  </div>
                  <TextField
                    style={{ width: '50%' }}
                    label="Email"
                    onChange={e => this.props.mergeData({ mail: e.target.value })}
                    value={
                      addEmailCampaign && addEmailCampaign.senderName && addEmailCampaign.senderName.email
                        ? addEmailCampaign.senderName.email
                        : addEmailCampaign.mail
                    }
                  />
                </div>
              ) : null}
              {addEmailCampaign.sender === 2 ? (
                <TextField
                  style={{ width: '50%' }}
                  label="Email"
                  onChange={e => this.props.mergeData({ mail: e.target.value })}
                  value={addEmailCampaign.mail}
                />
              ) : null}
              <Typography>Người nhận</Typography>
              {addEmailCampaign.totalSend === false ? (
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '33%' }}>
                    <Autocomplete
                      isMulti
                      name="Chọn... "
                      label="Nhóm khách hàng *"
                      suggestions={this.addItem('S07')}
                      // onChange={value => this.props.mergeData({ groupCustomer: value })}
                      onChange={value => {
                        this.props.mergeData({ groupCustomer: value });
                        this.handleChange('groupCustomer', value)
                      }}
                      value={addEmailCampaign.groupCustomer}
                      optionLabel="title"
                      optionValue="value"
                      error={this.state.localMessagesGroupCustomer}
                      helperText={this.state.localMessagesGroupCustomer}
                    />
                  </div>{' '}
                  <div style={{ width: '33%', paddingLeft: 15 }}>
                    <Autocomplete
                      isMulti
                      name="Chọn... "
                      label="Loại khách hàng *"
                      suggestions={this.addItem(CUSTOMER_TYPE_CODE)}
                      // onChange={value => this.props.mergeData({ typeCustomer: value })}
                      onChange={value => {
                        this.props.mergeData({ typeCustomer: value });
                        this.handleChange('typeCustomer', value)
                      }}
                      value={addEmailCampaign.typeCustomer}
                      optionLabel="title"
                      optionValue="value"
                      error={this.state.localMessagesTypeCustomer}
                      helperText={this.state.localMessagesTypeCustomer}
                    />
                  </div>
                  <div style={{ width: '33%', paddingLeft: 15 }}>
                    <AsyncAutocomplete
                      name="Chọn..."
                      label="Khách hàng *"
                      // onChange={value => this.props.mergeData({ customer: value })}
                      onChange={value => {
                        this.props.mergeData({ customer: value });
                        this.handleChange('customer', value)
                      }}
                      url={API_CUSTOMERS}
                      value={addEmailCampaign.customer}
                      error={this.state.localMessagesCustomer}
                      helperText={this.state.localMessagesCustomer}
                    />
                  </div>
                </div>
              ) : null}
              <div style={{ padding: 10 }}>
                Gửi cho tất cả khách hàng
                <Checkbox
                  color="primary"
                  checked={addEmailCampaign.totalSend}
                  onChange={e => this.props.mergeData({ totalSend: e.target.checked })}
                />
              </div>
              <div
              // style={{ padding: 5 }}
              >
                <Autocomplete
                  name="Chọn... "
                  label="Biểu mẫu Email *"
                  suggestions={addEmailCampaign.templates}
                  onChange={value => this.handleTemplate(value)}
                  value={addEmailCampaign.form}
                  optionLabel="title"
                  error={this.state.localMessagesForm}
                  helperText={this.state.localMessagesForm}
                />
              </div>
              <TextField
                label="Tiêu đề gửi Email"
                fullWidth
                onChange={e => this.props.mergeData({ title: e.target.value })}
                value={addEmailCampaign.title}
              // style={{ padding: 5 }}
              />
              {/* <TextField
                value={addEmailCampaign.code}
                onChange={e => this.props.mergeData({ code: e.target.value })}
                required
                label="Mã"
                fullWidth
                validators={['required']}
                errorMessages={['Không được bỏ trống']}
              /> */}
              <h4>Nội dung gửi Email</h4>
              <Editor
                tools={[
                  [Bold, Italic, Underline, Strikethrough],
                  [Subscript, Superscript],
                  [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                  [Indent, Outdent],
                  [OrderedList, UnorderedList],
                  FontSize,
                  FontName,
                  FormatBlock,
                  [Undo, Redo],
                  [Link, Unlink, InsertImage, ViewHtml],
                  [InsertTable],
                  [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                  [DeleteRow, DeleteColumn, DeleteTable],
                  [MergeCells, SplitCell],
                ]}
                contentStyle={{ height: 300 }}
                contentElement={addEmailCampaign.content}
                ref={editor => (this.editor = editor)}
              />
              <Typography>Cài đặt thời gian chiến dịch</Typography>
              <div>
                <Bt tab={0}>Hẹn giờ</Bt>
                <Bt tab={1}>Lặp lại sau n phút</Bt>
                <Bt tab={2}>Hàng ngày</Bt>
                <Bt tab={3}>Hàng tháng</Bt>
                <Bt tab={4}>Tùy chỉnh</Bt>
                {tab === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DateTimePicker
                        inputVariant="outlined"
                        format="DD/MM/YYYY HH:mm"
                        value={timer}
                        onChange={value => this.handleDateChange(value)}
                        variant="outlined"
                        label="Thời gian"
                        margin="dense"
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                ) : null}
                {tab === 1 ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>Lặp lại</Typography>
                    <TextField
                      variant="outlined"
                      onChange={e => this.props.mergeData({ minute: e.target.value })}
                      type="number"
                      value={minute}
                      style={{ width: 150 }}
                    />
                    <Typography>phút một lần</Typography>
                  </div>
                ) : null}
                {tab === 2 ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>Lặp lại mỗi ngày vào lúc:</Typography>
                    <TextField
                      variant="outlined"
                      onChange={e => this.props.mergeData({ minute: e.target.value })}
                      type="number"
                      value={addEmailCampaign.hours}
                      style={{ width: 150 }}
                    />
                    <Typography>giờ</Typography>
                    <TextField
                      variant="outlined"
                      onChange={e => this.props.mergeData({ minute: e.target.value })}
                      type="number"
                      value={minute}
                      style={{ width: 150 }}
                    />
                    <Typography>phút</Typography>
                  </div>
                ) : null}

                {tab === 3 ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>Lặp lại mỗi tháng vào ngày:</Typography>
                    <TextField variant="outlined" onChange={this.changeCostPrice} type="number" value={addEmailCampaign.day} style={{ width: 150 }} />
                    <Typography>lúc</Typography>
                    <TextField
                      variant="outlined"
                      onChange={this.changeCostPrice}
                      type="number"
                      value={addEmailCampaign.hours}
                      style={{ width: 150 }}
                    />
                    <Typography>giờ</Typography>
                    <TextField variant="outlined" onChange={this.changeCostPrice} type="number" value={minute} style={{ width: 150 }} />
                    <Typography>phút</Typography>
                  </div>
                ) : null}
              </div>
              Kích hoạt chiến dịch
              <Checkbox color="primary" checked={active} onChange={e => this.props.mergeData({ active: e.target.checked })} />
              {/* <div>
                <Button onClick={this.onSaveData} style={{ float: 'right', padding: '5px', margin: '5px' }} color="primary" variant="outlined">
                  Thực hiện
                </Button>
              </div> */}
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }

  onSaveData = () => {
    const view = this.editor.view;
    const { addEmailCampaign } = this.props;
    //   if (addEmailCampaign.name === '' || addEmailCampaign.name === null) {
    //     this.setState({ localMessagesName: 'Tên chiến dịch không được để trống' })
    //     return;
    //   } else {
    //     this.setState({ localMessagesName: '' })
    //   }
    //   if (addEmailCampaign.groupCustomer === [] || addEmailCampaign.groupCustomer === '' || addEmailCampaign.groupCustomer === null) {
    //     this.setState({ localMessagesGroupCustomer: 'Nhóm khách hàng không được để trống' })
    //     return;
    //   } else {
    //     this.setState({ localMessagesGroupCustomer: '' })
    //   }
    //   if (addEmailCampaign.typeCustomer === [] || addEmailCampaign.typeCustomer === '' || addEmailCampaign.typeCustomer === null) {
    //     this.setState({ localMessagesTypeCustomer: 'Loại khách hàng không được để trống' })
    //     return;
    //   } else {
    //     this.setState({ localMessagesTypeCustomer: '' })
    //   }
    //   if (addEmailCampaign.customer === [] || addEmailCampaign.customer === '' || addEmailCampaign.customer === null) {
    //     this.setState({ localMessagesCustomer: 'Khách hàng không được để trống' })
    //     return;
    //   } else {
    //     this.setState({ localMessagesCustomer: '' })
    //   }

    // if (addEmailCampaign.form === {} || addEmailCampaign.form === [] || addEmailCampaign.form === '' || addEmailCampaign.form === null) {
    //   this.setState({ localMessagesForm: 'Biểu mẫu không được để trống' })
    //   return;
    // } else {
    //   this.setState({ localMessagesForm: '' })
    // }

    // if (addEmailCampaign.sender === '' || addEmailCampaign.sender === null) {
    //   this.setState({ localMessagesSender: 'Người gửi không được để trống' })
    //   return;
    // } else {
    //   this.setState({ localMessagesSender: '' })
    // }

    // console.log(addEmailCampaign.groupCustomer,'addEmailCampaign.groupCustomeraddEmailCampaign.groupCustomer');
    const data = {
      name: addEmailCampaign.name,
      sender: addEmailCampaign.sender,
      senderName: addEmailCampaign.senderName,
      mail: addEmailCampaign.mail,
      receiver: { groupCustomer: addEmailCampaign.groupCustomer, typeCustomer: addEmailCampaign.typeCustomer, customer: addEmailCampaign.customer },
      form: addEmailCampaign.form,
      title: addEmailCampaign.title,
      content: EditorUtils.getHtml(view.state),
      formType: 'email',
      totalSend: addEmailCampaign.totalSend,
      timer: addEmailCampaign.timer,
      active: addEmailCampaign.active,
      callback: this.props.callback,
      code: `E-${new Date() * 1}`
    };

    // this.props.postData(data);
    const id = this.props.id
    if (id && id === "add" || !id) {
      this.props.postData(data);
    }
    else {
      this.props.putData(data, id);
    }
  };
}

AddEmailCampaign.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addEmailCampaign: makeSelectAddEmailCampaign(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getData: () => dispatch(getData()),
    postData: data => dispatch(postData(data)),
    putData: (data, id) => dispatch(putData(data, id)),
    getDefault: () => dispatch(getDefault()),
    getCurrent: id => dispatch(getCurrent(id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addEmailCampaign', reducer });
const withSaga = injectSaga({ key: 'addEmailCampaign', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(AddEmailCampaign);
