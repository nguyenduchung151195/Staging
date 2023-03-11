/**
 *
 * AddEmail
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import { compose } from 'redux';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { Grid, List, ListItem, MenuItem, Button, withStyles, Typography, AppBar, Toolbar, IconButton } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Dialog, TextField } from 'components/LifetekUi';
import { Edit, Close } from '@material-ui/icons';
import RegularCard from 'components/Cards/RegularCard';
import makeSelectAddEmail from './selectors';
import reducer from './reducer';
import saga from './saga';
import { injectIntl } from 'react-intl';
import messages from './messages';
import './style.scss';
import { mergeData, getTemplate, postTemplate, putTemplate } from './actions';
import CustomAppBar from '../../components/CustomAppBar';
import CustomGroupInputField from '../../components/Input/CustomGroupInputField';
import { changeSnackbar } from '../Dashboard/actions';
import { viewConfigCheckRequired, viewConfigCheckForm, } from '../../utils/common';
import dot from 'dot-object';
import { clientId } from '../../variable';
/* eslint-disable react/prefer-stateless-function */
const styles = {
  textField: {
    marginBottom: '25px',
    color: 'black',
  },
};

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

function PrintData({ data, column = 3 }) {
  if (!data.length) return <p>Không có viewConfig cho tham chiếu này</p>;
  const number = Math.ceil(data.length / column);
  const dataColumn = [];
  const count = column - 1;
  for (let index = 0; index <= count; index++) {
    switch (index) {
      case 0:
        dataColumn[index] = data.slice(0, number);
        break;
      case count:
        dataColumn[index] = data.slice(number * count, data.length);
        break;
      default:
        dataColumn[index] = data.slice(number * index, number * (index + 1));
        break;
    }
  }

  return (
    <React.Fragment>
      {dataColumn.map(item => (
        <List>
          {item.map(element => (
            <ListItem>{element}</ListItem>
          ))}
        </List>
      ))}
    </React.Fragment>
  );
}

export class AddEmail extends React.Component {
  state = {
    // modules: JSON.parse(localStorage.getItem('viewConfig')),
    modules: [],
    checkShowForm: viewConfigCheckRequired('Email', 'showForm'),
    checkRequired: viewConfigCheckRequired('Email', 'required'),
    localMessages: {},
  };

  componentDidMount() {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    this.props.getTemplate(id, this.setHtml);

    let options = JSON.parse(localStorage.getItem('viewConfig'))
    let allModules = JSON.parse(localStorage.getItem('allModules'))
    let arr = [];
    options.map(item => {
      arr.push({
        ...item,
        title:
          allModules && allModules[item.code] ? allModules[item.code].title : item.code,
        code: item.code,
      });
    });
    console.log(arr, "options")
    console.log(allModules, "options")

    this.setState({ modules: arr || [] })

  }
  getMessages() {
    const { title, code, categoryDynamicForm, moduleCode } = this.state
    const body = { title, code, categoryDynamicForm, moduleCode }
    const data = dot.dot(body);
    const messages = viewConfigCheckForm('Email', data);
    this.state.localMessages = messages;
  }
  setHtml = () => {
    const view = this.editor.view;
    EditorUtils.setHtml(view, this.props.addEmail.content);
  };
  componentDidUpdate() {
    this.getMessages();
  }
  referenceDialog = (code = 'Customer', name) => {
    this.props.mergeData({ codeRef: code, dialogRef: true, name });
  };

  convertData = (code, ref = true, prefix = false) => {
    const result = [];
    if (code) {
      const data = this.state.modules.find(item => item.code === code);
      if (!data) return [];
      const viewArr = data.listDisplay.type.fields.type;
      const newData = [...viewArr.columns, ...viewArr.others];
      newData.forEach((item, index) => {
        const dt = prefix ? `{${prefix}.${item.name}} : ${item.title}` : `{${item.name}} : ${item.title}`;
        if (!ref) result[index] = dt;
        else if (item.type && item.type.includes('ObjectId')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p
              onClick={() => this.referenceDialog(item.type.substring(9), item.name)}
              onKeyDown={this.handleKeyDown}
              style={{ color: '#2196f3', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {dt}
            </p>
          );
        } else if (item.type && item.type.includes('Array')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p
              onClick={() => this.referenceArray(item.type)}
              onKeyDown={this.handleKeyDown}
              style={{ color: '#9c27b0', fontWeight: 'bold', cursor: 'pointer' }}
            >{`{{${item.name}}} : ${item.title}`}</p>
          );
        } else if (item.type && item.type.includes('Relation')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p
              onClick={() => this.referenceDialog(item.type.split('"')[3], item.name)}
              onKeyDown={this.handleKeyDown}
              style={{ color: '#2196f3', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {dt}
            </p>
          );
        } else if (item.type === 'extra')
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p style={{ color: '#f47536', fontWeight: 'bold' }}>{dt}</p>
          );
        else if (item.type === 'required')
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p style={{ color: '#e3165b', fontWeight: 'bold' }}>{dt}</p>
          );
        else result[index] = dt;
      });
    }
    return result;
  };

  referenceArray(data) {
    const list = data.split('|');
    const items = list[1];
    let listItem = [];
    if (items) {
      listItem = items.split(',');
    }
    this.props.mergeData({ listItem, arrayDialog: true });
  }

  render() {
    console.log('aavav', localMessages);
    const { addEmail, classes, formType, intl, onCloseTab } = this.props;
    const { modules, localMessages, checkShowForm, checkRequired } = this.state;
    const id = this.props.formType ? this.props.id : this.props.match.params.id;
    formType;
    return (
      <div style={{ marginTop: 70 }}>
        <ValidatorForm onSubmit={this.saveTemplate}>
          {/* <AppBar className={this.props.formType !== 'sms' ? 'HeaderAppBarEmail' : 'HeaderAppBarSMS'}>
              <Toolbar>
                <IconButton
                  className={this.props.formType !== 'sms' ? 'BTNEmail' : 'BTNSMS'}
                  color="inherit"
                  variant="contained"
                  onClick={()=> this.props.formType !== 'sms' ? this.props.history.goBack() : this.props.propsAll.history.goBack()}
                  aria-label="Close"
                >
                  <Close />
                </IconButton>
                <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
                  {this.props.formType ?
                    id === 'add'
                    ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật' })}`
                    :  id === 'add'
                    ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật' })}`
                    }
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  type="submit"
                >
                  {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
                </Button>
              </Toolbar>
            </AppBar> */}
          <CustomAppBar
            title={
              this.props.formType
                ? id === 'add'
                  ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới sms' })}`
                  : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật sms' })}`
                : id === 'add'
                  ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới Email' })}`
                  : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật email' })}`
            }
            onGoBack={() => (this.props.formType !== 'sms' ? this.props.history.goBack() : this.props.onCloseTab())}
            onSubmit={this.saveTemplate}
          />
          <RegularCard
            content={
              <div>
                <Dialog
                  maxWidth="xs"
                  dialogAction={false}
                  title="Tham chieu array"
                  open={addEmail.arrayDialog}
                  onClose={() => this.props.mergeData({ arrayDialog: false })}
                >
                  <PrintData column={1} data={addEmail.listItem} />
                </Dialog>
                <Dialog
                  dialogAction={false}
                  title="Bang tham chieu"
                  open={addEmail.dialogRef}
                  onClose={() => this.props.mergeData({ dialogRef: false })}
                >
                  <Grid style={{ display: 'flex', justifyContent: 'space-between' }} item md={12}>
                    <PrintData column={2} data={this.convertData(addEmail.codeRef, false, addEmail.name)} />
                  </Grid>
                </Dialog>
                <Grid container>
                  <Grid item md={12}>
                    <h4 style={{ fontWeight: 'bold', display: 'inline' }}>
                      <Edit />
                      {formType === 'sms' ? 'Danh sách SMS' : 'Danh sách Email'}
                    </h4>{' '}
                    <span style={{ fontWeight: 'normal' }}>(Các trường màu đỏ là cần nhập)</span>
                    <h4>Thông tin các từ thay thế</h4>
                  </Grid>

                  <Grid style={{ display: 'flex', justifyContent: 'space-around' }} item md={12}>
                    <PrintData data={this.convertData(addEmail.moduleCode)} />
                  </Grid>
                  <Grid style={{ padding: 5 }} container>
                    <Grid item md={12}>
                      <Typography style={{ fontWeight: 'bold' }}>Ghi chú</Typography>
                      <Typography>
                        <span style={{ fontStyle: 'italic' }}>Loại thường</span>
                      </Typography>
                      <Typography>
                        <span style={{ color: '#2196f3', fontWeight: 'bold', fontStyle: 'italic' }}>Loại tham chiếu: </span> Click vào để chọn trường
                        tham chiếu
                      </Typography>
                      <Typography>
                        <span style={{ color: '#9c27b0', fontWeight: 'bold', fontStyle: 'italic' }}>Loại mảng: </span> Dùng trong bảng
                      </Typography>
                      <Typography>
                        <span style={{ color: '#28a745', fontWeight: 'bold', fontStyle: 'italic' }}>Loại định nghĩa: </span> Loại tự định nghĩa
                      </Typography>
                      {/* <Typography>
                    <span style={{ color: '#e3165b', fontWeight: 'bold', fontStyle: 'italic' }}>Loại bắt buộc khi dùng bảng: </span> Bắt buộc khi dùng
                    trong danh sách
                  </Typography> */}
                    </Grid>
                  </Grid>

                  <Grid item md={12}>
                    <TextField
                      value={addEmail.title}
                      onChange={e => this.props.mergeData({ title: e.target.value })}

                      className={classes.textField}
                      label="Tiêu đề"
                      fullWidth
                      // validators={['required']}
                      // errorMessages={['Không được bỏ trống']}
                      error={localMessages && localMessages.title || addEmail.title === ''}
                      helperText={localMessages && localMessages.title || addEmail.title === '' ? 'Không được để trống tiêu đề' : null}
                      required={checkRequired.title}
                      checkedShowForm={checkShowForm.title}
                    />
                    <TextField
                      value={addEmail.code}
                      onChange={e => this.props.mergeData({ code: e.target.value })}

                      className={classes.textField}
                      label="Mã"
                      fullWidth
                      // validators={['required']}
                      // errorMessages={['Không được bỏ trống']}
                      error={localMessages && localMessages.code || addEmail.code === ''}
                      helperText={localMessages && localMessages.code || addEmail.code === '' ? 'Không được để trống mã' : null}
                      required={checkRequired.code}
                      checkedShowForm={checkShowForm.code}
                    />
                    <CustomGroupInputField
                      code="Email"
                      // columnPerRow={3}

                      value={addEmail.others}
                      onChange={value => this.props.mergeData({ others: value })}
                    />
                    <TextField

                      className={classes.textField}
                      label="Loại mẫu"
                      value={addEmail.categoryDynamicForm}
                      select
                      onChange={e => this.props.mergeData({ categoryDynamicForm: e.target.value })}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      // validators={['required']}
                      // errorMessages={['Không được bỏ trống']}
                      error={localMessages && localMessages.categoryDynamicForm || addEmail.categoryDynamicForm === ''}
                      helperText={localMessages && localMessages.categoryDynamicForm || addEmail.categoryDynamicForm === '' ? 'Không được để mẫu' : null}
                      required={checkRequired.categoryDynamicForm}
                      checkedShowForm={checkShowForm.categoryDynamicForm}
                    >
                      {addEmail.templateTypes &&
                        addEmail.templateTypes.data &&
                        addEmail.templateTypes.data.map(option => (
                          <MenuItem key={option._id} value={option._id}>
                            {option.title}
                          </MenuItem>
                        ))}
                    </TextField>
                    <TextField

                      className={classes.textField}
                      label="Module"
                      select
                      value={addEmail.moduleCode}
                      fullWidth
                      onChange={e => this.props.mergeData({ moduleCode: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      // validators={['required']}
                      // errorMessages={['Không được bỏ trống']}
                      error={(localMessages && localMessages.moduleCode) || addEmail.moduleCode === null}
                      helperText={localMessages && localMessages.moduleCode || addEmail.moduleCode === null ? 'Không được để trống mô-đun' : null}
                      required={checkRequired.moduleCode}
                      checkedShowForm={checkShowForm.moduleCode}
                    >
                      {modules.map(item => (
                        <MenuItem value={item.code}>{item.title}</MenuItem>
                      ))}
                    </TextField>

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
                      contentElement={addEmail.content}
                      ref={editor => (this.editor = editor)}
                    />
                    {/* <Button type="submit" style={{ float: 'right', padding: '5px', margin: '5px' }} color="primary" variant="contained">
                      Thực hiện
                    </Button> */}
                  </Grid>
                </Grid>
              </div>
            }
          />
        </ValidatorForm>
      </div>
    );
  }

  saveTemplate = () => {
    const view = this.editor.view;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const templateData = this.props.addEmail;

    const data = {
      title: templateData.title,
      categoryDynamicForm: templateData.categoryDynamicForm,
      content: EditorUtils.getHtml(view.state),
      code: templateData.code,
      moduleCode: templateData.moduleCode,
      formType: this.props.formType ? this.props.formType : templateData.formType,
      callback: this.props.callback,
      others: templateData.others,
      clientId: clientId

    };
    const messages = viewConfigCheckForm('Email', dot.dot(data));
    if (Object.keys(messages).length === 0 && templateData.moduleCode !== null) {
      if (id === 'add') this.props.postTemplate(data);
      else this.props.putTemplate(data, id);
    } else {
      this.props.onChangeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' });
    }
  };
}

AddEmail.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addEmail: makeSelectAddEmail(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getTemplate: (id, getTem) => dispatch(getTemplate(id, getTem)),
    postTemplate: data => dispatch(postTemplate(data)),
    putTemplate: (data, id) => dispatch(putTemplate(data, id)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addEmail', reducer });
const withSaga = injectSaga({ key: 'addEmail', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddEmail);
