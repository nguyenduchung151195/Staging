/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 *
 * AddTemplatePage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
// import content from './content';
import CustomInputField from 'components/Input/CustomInputField';
import { Grid, List, ListItem, MenuItem, Button, withStyles, Typography, AppBar, Toolbar, IconButton, Checkbox } from '@material-ui/core';
import { Dialog, TextField, Paper, FileUpload } from 'components/LifetekUi';
import { Edit, Close } from '@material-ui/icons';
// import CKEditor from '@ckeditor/ckeditor5-react';
import CustomAppBar from 'components/CustomAppBar';
import { makeSelectProfile } from '../../containers/Dashboard/selectors';
import { changeSnackbar } from '../../containers/Dashboard/actions';
// import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { injectIntl } from 'react-intl';
import messages from './messages';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { extraFields, clientId } from '../../variable';
import makeSelectAddTemplatePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.css';
import { handleChangeTitle, getTemplate, handleChange, postTemplate, putTemplate, mergeData, getAllTemplate, getDefaultState } from './actions';
import { viewConfigCheckForm, viewConfigCheckRequired } from '../../utils/common';
import dot from 'dot-object';
import CustomGroupInputField from '../../components/Input/CustomGroupInputField';

const newsTypes = [{ title: 'Tin tức', value: 'tin-tuc' }, { title: 'Topic', value: 'topic' }, { title: 'Album', value: 'album' }];
const newsAction = [{ name: 'Đang hoạt động', value: 'active' }, { name: 'Không hoạt động', value: 'none-active' }];
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

/* eslint-disable react/prefer-stateless-function */
export class AddTemplatePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      checkRequired: viewConfigCheckRequired('NewsFeed', 'required'),
      checkShowForm: viewConfigCheckRequired('NewsFeed', 'showForm'),
      localMessages: {},
      others: {},
      fieldAdded: [],
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.getTemplate(id, this.setHtml);
    this.props.getAllTemplate();
    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = listViewConfig.find(item => item.code === 'NewsFeed');
    if (currentViewConfig && this.state.fieldAdded.length === 0) {
      const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const addVaue = fieldAdded.map(item => ({
        ...item,
        value: '',
      }));
      this.setState({ fieldAdded: addVaue });
    }
  }
  getMessages() {
    // const props = this.props.addSupplierPage;
    //console.log(this.props.addSupplierPage);
    // const attributes = {};
    // if (props.listAtt.length !== 0) {
    //   Object.keys(props.listAtt).forEach(item => {
    //     attributes[item] = this.props.addTtPage[item];
    //   });
    // }
    const { content, fieldAdded } = this.state;
    const data = {
      title,
      type,
      isActive,
      others,
    };
    const others = {};
    if (fieldAdded.length > 0) {
      fieldAdded.forEach(item => {
        others[item.name.replace('others.', '')] = item.value;
      });
    }
    const messages = viewConfigCheckForm('NewsFeed', dot.dot(data));
    this.state.localMessages = messages;
  }
  componentWillReceiveProps(props) {
    if (props.addNewsFeed) {
      const localMessages = viewConfigCheckForm('NewsFeed', props.addNewsFeed);

      this.setState({
        localMessages: localMessages,
      });
    }
  }
  saveTemplate = () => {
    const view = this.editor.view;
    const id = this.props.match.params.id;
    const templateData = this.props.addTemplatePage;
    const { content, fieldAdded } = this.state;
   
    const others = {};
    if (fieldAdded.length > 0) {
      fieldAdded.forEach(item => {
        others[item.name.replace('others.', '')] = item.value;
      });
    }
   
    // if (templateData && templateData.others) {
    //   data = {
    //     ...data,
    //     others: templateData.others,
    //   };
    // }
    let data = {
      title: templateData.title,
      content: EditorUtils.getHtml(view.state),
      type: templateData.type,
      isActive: templateData.isActive,
      others:{...others},
    };
    const messages = viewConfigCheckForm('NewsFeed', dot.dot(data));
    if (Object.keys(messages).length === 0) {
      if (id === 'add') {
        // this.props.postTemplate(data);
        console.log(this.props.postTemplate(data), 232);
      }
      //  else this.props.putTemplate(id, data);
    } else {
      // alert('dgfdgdfghi')
      // console.log(this.props,'this.propsthis.props');
      this.props.onChangeSnackbar({ status: true, message: 'Thêm dữ liệu thất bại', variant: 'error' });
    }
  };

  setHtml = () => {
    const id = this.props.match.params.id;
    const view = this.editor.view;
    if (id !== 'add') EditorUtils.setHtml(view, this.props.addTemplatePage.content);
    this.setState({ filterField: this.props.addTemplatePage.filterField, filterFieldValue: this.props.addTemplatePage.filterFieldValue });
  };

  referenceDialog = (code = 'Customer', name) => {
    this.props.mergeData({ codeRef: code, dialogRef: true, name });
  };

  referenceArray(data) {
    const list = data.split('|');
    const items = list[1];
    let listItem = [];
    if (items) {
      listItem = items.split(',').map(i => `{${i}}`);
    }
    this.props.mergeData({ listItem, arrayDialog: true });
  }

  handleChangeTemplate = e => {
    const {
      target: { value, name },
    } = e;
    this.setState(prevState => ({ ...prevState, [name]: value }));
    if (value) {
      const { content } = value;
      const view = this.editor.view;
      EditorUtils.setHtml(view, content);
    }
  };
  handleOtherDataChange = params => {
    console.log(1235);
    this.setState({ others: params });
  };
  handleChangeAddedField = (index, e) => {
    const { fieldAdded } = this.state;
    const fields = [...fieldAdded];
    fieldAdded[index].value = e.target.value;
    this.setState({ fieldAdded: fields });
  };
  // onGoBack () {
  //   this.props && this.props.history && this.props.history.goBack();
  // };
  componentDidUpdate(preProp, preState) {
    const { classes, addTemplatePage, intl } = this.props;
    const { postTemplateSuccess } = addTemplatePage;
  }

  render() {
    const { classes, addTemplatePage, intl } = this.props;
    const { localMessages, checkRequired, checkShowForm } = this.state;
    const id = this.props.match.params.id;
    return (
      <Paper style={{ color: 'black' }}>
        <div>
          <CustomAppBar
            title={
              id === 'add'
                ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới Newsfeed' })}`
                : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật Newsfeed' })}`
            }
            onGoBack={() => {
              this.props.getDefault();
              this.props.history.goBack();
            }}
            onSubmit={this.saveTemplate}
          />
          <Grid container>
            <Grid item md={12}>
              <TextField
                error={(localMessages && localMessages.title) || addTemplatePage.title === ''}
                helperText={(localMessages && localMessages.title) || addTemplatePage.title === '' ? 'Không được để trống Tiêu đề' : null}
                required={checkRequired.title}
                checkedShowForm={checkShowForm.title}
                value={addTemplatePage.title}
                onChange={this.props.handleChange('title')}
                className={classes.textField}
                label="Tiêu đề"
                fullWidth
              />
              <TextField
                error={(localMessages && localMessages.type) || !addTemplatePage.type}
                helperText={(localMessages && localMessages.type) || !addTemplatePage.type ? 'Không được để trống Loại tin' : null}
                required={checkRequired.type}
                // error={!addTemplatePage.type}
                checkedShowForm={checkShowForm.type}
                className={classes.textField}
                label="Loại tin"
                value={addTemplatePage.type}
                select
                onChange={this.props.handleChange('type')}
                fullWidth
                InputLabelProps={{ shrink: true }}
              >
                {newsTypes.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.title}
                  </MenuItem>
                ))}
              </TextField>
              <div>
                <Checkbox
                  checked={addTemplatePage.isActive}
                  onChange={this.props.handleCheck('isActive')}
                  value="target"
                  color="primary"
                  inputProps={{
                    'aria-label': 'secondary checkbox',
                  }}
                />
                Hoạt động
              </div>
              {/* <CustomGroupInputField
                code={'NewsFeed'}
                columnPerRow={3}
                // value={this.state.others}
                value={this.state.others}
                onChange={(params) => this.handleOtherDataChange(params)}
                
              /> */}
              {this.state.fieldAdded.length > 0
                ? this.state.fieldAdded.map((item, index) => {
                    if (item.checked) {
                      return (
                        <Grid item md={6} key={item.name}>
                          <TextField
                            label={item.title}
                            variant="outlined"
                            type={item.type === 'string' ? 'text' : item.type}
                            value={item.value}
                            InputLabelProps={{ shrink: true }}
                            onChange={event => this.handleChangeAddedField(index, event)}
                            style={{ width: '100%' }}
                            margin="normal"
                          />
                        </Grid>
                      );
                    }
                  })
                : ''}
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
                contentElement={addTemplatePage.content}
                ref={editor => (this.editor = editor)}
              />
              {addTemplatePage._id ? (
                <FileUpload name={addTemplatePage.title} id={addTemplatePage._id} code="NewsFeed" profile={this.props.profile} />
              ) : null}
              {/* <Button onClick={this.saveTemplate} style={{ float: 'right', padding: '5px', margin: '5px' }} color="primary" variant="contained">
                Lưu lại
              </Button> */}
            </Grid>
          </Grid>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  addTemplatePage: makeSelectAddTemplatePage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    handleChangeTitle: e => dispatch(handleChangeTitle(e.target.value)),
    getTemplate: (id, getTem) => dispatch(getTemplate(id, getTem)),
    handleChange: name => e => dispatch(handleChange({ name, value: e.target.value })),
    handleCheck: name => e => dispatch(handleChange({ name, value: e.target.checked })),
    postTemplate: data => dispatch(postTemplate(data)),
    putTemplate: (id, data) => dispatch(putTemplate(id, data)),
    mergeData: data => dispatch(mergeData(data)),
    getAllTemplate: () => dispatch(getAllTemplate()),
    getDefault: () => dispatch(getDefaultState()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addNewsFeed', reducer });
const withSaga = injectSaga({ key: 'addNewsFeed', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddTemplatePage);
