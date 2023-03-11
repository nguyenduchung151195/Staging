/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 *
 * AddTemplatePage
 *
 */

import React, { createRef } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeSnackbar } from '../Dashboard/actions';
import CustomGroupInputField from '../../components/Input/CustomGroupInputField';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import CustomInputField from 'components/Input/CustomInputField';
import { Grid, List, ListItem, MenuItem, Button, withStyles, Typography, AppBar, Toolbar } from '@material-ui/core';
import { Dialog, TextField, Paper, Autocomplete, AsyncAutocomplete } from '../../components/LifetekUi';
import { Edit, Close } from '@material-ui/icons';
import { injectIntl } from 'react-intl';
import './style.scss';
// import './style.css'
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { extraFields, clientId } from '../../variable';
import makeSelectAddTemplatePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { handleChangeTitle, getTemplate, handleChange, postTemplate, putTemplate, mergeData, getAllTemplate, getAllModuleCode } from './actions';
import messages from './messages';
import CustomAppBar from 'components/CustomAppBar';
import { te } from 'date-fns/locale';
import CustomInputBase from '../../components/Input/CustomInputBase';

import { PureComponent } from 'react';
import ReactCrop from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';

import { Select } from '@material-ui/core';
import { add } from 'lodash';

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
  state = {
    modules: JSON.parse(localStorage.getItem('viewConfig')),
    copyTemplate: {},
    autocompletedata: '',
    autoCompleteType: '',
    autoCompleteTemplates: '',
    selection: 0,
    coefficient: null,
    src: null,
    crop: {
      unit: '%',
      width: 30,
    },
    width: 0,
    height: 0,
    cropElements: [],
    fieldKey: '',
    tableWidth: window.innerWidth,
    ImageUrls: [],
    listImg: [],
    reload: new Date() * 1,
    others: {},
  };

  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.moduleCode = React.createRef();
    this.editor = createRef();
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    console.log(id, 'id');
    this.props.getTemplate(id, this.setHtml);
    this.props.getAllTemplate();
    this.props.getAllModuleCode();

    setTimeout(() => {
      this.props.addTemplatePage.templateTypes.forEach(element => {
        if (element._id === this.props.addTemplatePage.categoryDynamicForm) {
          this.setState({ autoCompleteType: element.title, idTypeTemplate: element._id });
        }
      });
      this.props.addTemplatePage.templates.forEach(element => {
        if (element._id === this.props.addTemplatePage._id) {
          this.setState({ autoCompleteTemplates: element.title, idTemplate: element.title });
        }
      });
      this.state.modules.forEach(element => {
        if (element.code === this.props.addTemplatePage.moduleCode) {
          this.setState({
            autocompletedata:
              this.props.addTemplatePage && this.props.addTemplatePage.modules && this.props.addTemplatePage.modules[element.code]
                ? this.props.addTemplatePage.modules[element.code].title
                : element.code,
            codeModules: element.code,
          });
        }
      });
    }, 1000);
  }
  componentWillReceiveProps(props) {
    if (props.addTemplatePage !== undefined) {
      // const convertedData = convertChildToItems(props.data);
      this.setState({
        treeData: props.data,
        selection: props.addTemplatePage.selection ? props.addTemplatePage.selection : 0,
        src: props.addTemplatePage.imageSrc ? props.addTemplatePage.imageSrc : '',
      });
    }
  }
  // componentDidUpdate(preProp, preState) {
  //   const { classes, addTemplatePage, intl } = this.props;
  //   if(this.state.codeModules !== preState.codeModules){
  //   this.props.mergeData({ codeModule :this.state.codeModules });

  //   }
  // }

  saveTemplate = () => {
    const { cropElements, fieldKey, src, listImg, coefficient } = this.state;
    const dataElements = [];
    for (var i = 0; i < cropElements.length; i++) {
      if (cropElements[i].value) {
        dataElements.push({
          x: cropElements[i].x,
          y: cropElements[i].y,
          w: cropElements[i].widthCrop,
          h: cropElements[i].heightCrop,
          fieldKey: cropElements[i].value,
          coefficient: coefficient,
        });
      }
    }
    this.setState({ data: dataElements });
    const view = (this.editor && this.editor.view) || {};
    const id = (this.props.match && this.props.match.params && this.props.match.params.id) || 'add';
    const templateData = this.props.addTemplatePage;
    console.log(templateData, 'te');
    const data = {
      title: templateData.title,
      categoryDynamicForm: this.state.idTypeTemplate,
      categoryStatus: this.state.statusOfTypeTemplate,
      // content: EditorUtils.getHtml(view.state),
      content: this.state.selection === 0 ? EditorUtils.getHtml(view && view.state) : null,
      code: templateData.code,
      moduleCode:templateData.moduleCode,
      clientId,
      filterField: this.state.filterField,
      filterFieldValue: this.state.filterFieldValue,
      selection: this.state.selection,
      config: dataElements,
      imageSrc: src,
      others: this.state.others,
    };
    if (id === 'add') this.props.postTemplate(data);
    else {
      if (this.props.putTemplate(id, data)) {
      }
    }
  };

  setHtml = () => {
    console.log(this.editor, 'this.editor');
    const view = this.editor && this.editor.view;
    EditorUtils.setHtml(view, (this.props.addTemplatePage && this.props.addTemplatePage.content) || '');
    this.setState({
      filterField: (this.props.addTemplatePage && this.props.addTemplatePage.filterField) || '',
      filterFieldValue: (this.props.addTemplatePage && this.props.addTemplatePage.filterFieldValue) || '',
    });
  };

  referenceDialog = (code = 'Customer', name) => {
    this.props.mergeData({ codeRef: code, dialogRef: true, name });
  };

  convertData = (code, ref = true, prefix = false) => {
    const result = [];
    if (code) {
      const data = this.state.modules.find(item => item.code === code);
      let dataExtra = extraFields.find(i => i.code === code);
      if (dataExtra) dataExtra = dataExtra.data;
      else dataExtra = [];
      if (!data) return [];
      const viewArr = data.listDisplay.type.fields.type;
      const { filterField, filterFieldValue } = this.state;

      const newData = [
        ...viewArr.columns.filter(item => {
          if (!item.checked) return false;
          if (
            filterField &&
            filterFieldValue &&
            item.filterConfig &&
            (!item.filterConfig[filterFieldValue.value] || !item.filterConfig[filterFieldValue.value].checkedShowForm)
          ) {
            return false;
          }
          return true;
        }),
        ...viewArr.others.filter(item => {
          if (!item.checked) return false;
          if (
            filterField &&
            filterFieldValue &&
            item.filterConfig &&
            (!item.filterConfig[filterFieldValue.value] || !item.filterConfig[filterFieldValue.value].checkedShowForm)
          ) {
            return false;
          }
          return true;
        }),
        ...dataExtra,
      ];
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
            <p>
              {`{${item.name}} :`}
              <span
                style={{ cursor: 'pointer', color: '#9c27b0', fontWeight: 'bold' }}
                onClick={() => this.referenceArray(item.type)}
                onKeyDown={this.handleKeyDown}
              >{`${item.title}`}</span>
            </p>
          );
        } else if (item.type && item.type.includes('Relation')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p
              onClick={() => this.referenceDialog(item.type.split("'")[3], item.name)}
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
      listItem = items.split(',').map(i => `{${i}}`);
    }
    this.props.mergeData({ listItem, arrayDialog: true });
  }

  handleChangeTemplate = e => {
    if (e) {
      if (e.content) {
        const { content } = e.content;
        const view = this.editor.view;
        EditorUtils.setHtml(view, content);
      }
      this.setState({ autoCompleteTemplates: e.title, idTemplate: e.title, content: e.content });
    } else {
      const view = this.editor.view;
      EditorUtils.setHtml(view, '');
      this.setState({ autoCompleteTemplates: null, idTemplate: '', content: '' });
    }
  };
  onGoBack = () => {
    this.props.history.goBack();
    // window.location.reload();
  };

  handleChangeAutocomplete = e => {
    this.setState({ autocompletedata: e && e.title, codeModules: e && e.code });
    this.props.mergeData({ moduleCode: e && e.code });
  };
  handleChangeType = e => {
    this.setState({ autoCompleteType: e && e.title, idTypeTemplate: e && e.idTypeTemplate });
  };
  handleChangeTemplates = e => {
    this.setState({ autoCompleteTemplates: e && e.title, idTemplate: e && e.title });
  };

  handleChangeMenu = e => {
    this.setState({ selection: e });
    this.props.mergeData({ selection: e });
  };

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.setState({ src: reader.result });
        this.props.mergeData({ imageSrc: reader.result });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onImageLoaded = image => {
    let k = parseInt(image.naturalHeight) / parseInt(image.height);
    this.imageRef = image;
    this.setState({ width: image.width, height: image.height, coefficient: k });
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
    const currentCroppedElements = [...this.state.cropElements];
    if (crop.x !== 0 && crop.y !== 0 && crop.height !== 0) {
      currentCroppedElements.push({
        x: crop.x,
        y: crop.y,
        widthCrop: crop.width,
        heightCrop: crop.height,
        id: new Date() * 1,
      });
    }
    this.setState({ cropElements: currentCroppedElements });
  };

  onCropChange = (crop, percentCrop) => {
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const UrlElements = [...this.state.ImageUrls];
      const croppedImageUrl = await this.getCroppedImg(this.imageRef, crop, 'newFile.jpeg');
      UrlElements.push({
        croppedImageUrl,
      });
      this.setState({ ImageUrls: UrlElements });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (!blob) {
            console.error('Canvas is empty');
            return;
          }
          blob.name = fileName;
          window.URL.revokeObjectURL(this.fileUrl);
          this.fileUrl = window.URL.createObjectURL(blob);
          resolve(this.fileUrl);
        },
        'image/jpeg',
        1,
      );
    });
  }

  handleChange = (item, value) => {
    let list = [...this.state.cropElements];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === item.id) {
        list[i].value = value;
      }
    }
    this.setState({
      listImg: list,
      cropElements: list,
      reload: new Date() * 1,
    });
  };
  handleOtherDataChange = params => {
    this.setState({ others: params });
  };
  render() {
    // const { modules, filterField, autocompletedata, autoCompleteType, autoCompleteTemplates, selection } = this.state;
    const {
      modules,
      filterField,
      autocompletedata,
      autoCompleteType,
      autoCompleteTemplates,
      selection,
      crop,
      croppedImageUrl,
      src,
      cropElements,
      width,
      height,
      fieldKey,
      ImageUrls,
      listImg,
      reload,
    } = this.state;
    const { classes, addTemplatePage, intl } = this.props;
    const { templates } = addTemplatePage;
    const id = this.props.match.params.id;
    let viewConfig = [];
    if (this.state.modules) {
      const data = this.state.modules.find(item => item.code === addTemplatePage.moduleCode);
      if (data) {
        viewConfig = data.listDisplay.type.fields.type.columns;
      }
    }
    // if (addTemplatePage.imageSrc) {
    //   this.setState({ selection: addTemplatePage.imageSrc });
    // }
    let filterFieldConfig = {};
    if (filterField) {
      filterFieldConfig = viewConfig.find(i => i.name === filterField) || {};
    }
    const handleModules = () => {
      let arr = [];
      modules.filter(m => addTemplatePage && addTemplatePage.modules && addTemplatePage.modules[m.code]).map(item => {
        arr.push({
          title:
            addTemplatePage && addTemplatePage.modules && addTemplatePage.modules[item.code] ? addTemplatePage.modules[item.code].title : item.code,
          code: item.code,
        });
      });
      return arr;
    };
    const handleTypes = () => {
      let array = [];
      // console.log(addTemplatePage.templateTypes, 'addTemplatePage.templateTypes')
      // const templateTypes = addTemplatePage &&
      //   addTemplatePage.templateTypes.filter((it) => {
      //     if (it.clientId === clientId || it.clientId === "ALL") return true
      //   })
      if (addTemplatePage && Array.isArray(addTemplatePage)) {
        addTemplatePage &&
          Array.isArray(addTemplatePage) &&
          addTemplatePage.length &&
          addTemplatePage.filter(it => it.clientId === clientId).templateTypes.map(option => {
            if (option.alwaysUsed === true) {
              array.push({ title: option.title, idTypeTemplate: option._id, statusOfTypeTemplate: option.alwaysUsed });
            } else {
              return array;
            }
          });
        return array;
      } else if (addTemplatePage) {
        // console.log( "addTemplatePage", clientId, addTemplatePage)
        const template = [addTemplatePage].find(it => it.clientId === clientId);
        const templateTypes = (template && template.templateTypes) || [];

        // ([addTemplatePage].filter(it => it.clientId === clientId).templateTypes || []).map(option => {
        templateTypes.map(option => {
          if (option.alwaysUsed === true) {
            array.push({ title: option.title, idTypeTemplate: option._id, statusOfTypeTemplate: option.alwaysUsed });
          } else {
            return array;
          }
        });

        return array;
      }
      return array;

      // addTemplatePage &&
      //   addTemplatePage.templateTypes.map(option => {
      //     if (option.alwaysUsed === true) {
      //       array.push({ title: option.title, idTypeTemplate: option._id, statusOfTypeTemplate: option.alwaysUsed });
      //     } else {
      //       return array;
      //     }
      //   });
    };
    const handleTemplates = () => {
      let arrayTemplate = [];
      templates &&
        templates.map(template => {
          arrayTemplate.push({ title: template.title, idTemplate: template.title, content: template });
        });
      return arrayTemplate;
    };
    return (
      <Paper style={{ color: 'black' }}>
        <div>
          <Dialog
            maxWidth="xs"
            dialogAction={false}
            title="Tham chieu array"
            open={addTemplatePage.arrayDialog}
            onClose={() => this.props.mergeData({ arrayDialog: false })}
          >
            <PrintData column={1} data={addTemplatePage.listItem} />
          </Dialog>
          <Dialog
            dialogAction={false}
            title="Bang tham chieu"
            open={addTemplatePage.dialogRef}
            onClose={() => this.props.mergeData({ dialogRef: false })}
          >
            <Grid style={{ display: 'flex', justifyContent: 'space-between' }} item md={12}>
              <PrintData column={2} data={this.convertData(addTemplatePage.codeRef, false, addTemplatePage.name)} />
            </Grid>
          </Dialog>
          <Grid container>
            <Grid item md={12}>
              <CustomAppBar
                className
                title={
                  id === 'add'
                    ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới biểu mẫu' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật biểu mẫu' })}`
                }
                onGoBack={this.onGoBack}
                onSubmit={this.saveTemplate}
              />
              <h4 style={{ fontWeight: 'bold', display: 'inline' }}>
                <Edit /> Danh sách mẫu báo giá, hợp đồng
              </h4>{' '}
              <span style={{ fontWeight: 'normal' }}>(Các trường màu đỏ là cần nhập)</span>
              <h4>Thông tin các từ thay thế</h4>
            </Grid>

            <Grid style={{ display: 'flex', justifyContent: 'space-around' }} item md={12}>
              <PrintData data={this.convertData(addTemplatePage.moduleCode)} />
            </Grid>
            <Grid style={{ padding: 5 }} container>
              <Grid item md={12}>
                <Typography style={{ fontWeight: 'bold' }}>Ghi chú</Typography>
                <Typography>
                  <span style={{ fontStyle: 'italic' }}>Loại thường</span>
                </Typography>
                <Typography>
                  <span style={{ color: '#2196f3', fontWeight: 'bold', fontStyle: 'italic' }}>Loại tham chiếu: </span> Click vào để chọn trường tham
                  chiếu
                </Typography>
                <Typography>
                  <span style={{ color: '#9c27b0', fontWeight: 'bold', fontStyle: 'italic' }}>Loại mảng: </span> Dùng trong bảng
                </Typography>
              </Grid>
            </Grid>

            <Grid item md={12} container spacing={8}>
              <Autocomplete
                className={classes.textField}
                name="Chọn... "
                label="Chọn biểu mẫu động mẫu"
                optionLabel="title"
                optionValue="value"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={autoCompleteTemplates ? { title: autoCompleteTemplates } : ''}
                onChange={this.handleChangeTemplate}
                suggestions={handleTemplates()}
              />
              <TextField
                value={addTemplatePage.title}
                onChange={this.props.handleChange('title')}
                required
                className={classes.textField}
                label="Tiêu đề"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={addTemplatePage.title ? '' : 'Không được để trống tiêu đề'}
                helperText={addTemplatePage.title ? '' : 'Không được để trống tiêu đề'}
              />
              <TextField
                value={addTemplatePage.code}
                onChange={this.props.handleChange('code')}
                required
                className={classes.textField}
                label="Mã"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={addTemplatePage.code ? '' : 'Không được để trống mã'}
                helperText={addTemplatePage.code ? '' : 'Không được để trống mã'}
              />
              <Grid item md={6} xs={6}>
                <Autocomplete
                  className={classes.textField}
                  name="Chọn... "
                  label="Loại Mẫu"
                  required
                  optionLabel="title"
                  optionValue="value"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={{ title: autoCompleteType }}
                  onChange={this.handleChangeType}
                  suggestions={handleTypes()}
                  error={autoCompleteType ? false : true}
                  helperText={autoCompleteType ? '' : 'Không được để trống loại mẫu'}
                />
              </Grid>
              {/* <Grid item md={6} xs={6}>
                <Autocomplete
                  className={classes.textField}
                  name="Chọn... "
                  label="Tính năng"
                  required
                  optionLabel="title"
                  optionValue="value"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={{ title: autocompletedata }}
                  onChange={this.handleChangeAutocomplete}
                  suggestions={handleModules()}
                  error={autocompletedata ? false : true}
                  helperText={autocompletedata ? '' : 'Không được để trống Module'}
                />
              </Grid> */}

              <Grid item xs={6}>
                <CustomInputBase
                  required
                  className={'CustomRequiredLetter'}
                  // className={classes.textField}
                  label="Tính năng"
                  select
                  value={addTemplatePage.moduleCode}
                  fullWidth
                  onChange={this.props.handleChange('moduleCode')}
                  InputLabelProps={{ shrink: true }}
                >
                  {modules.filter(item => addTemplatePage && addTemplatePage.modules && addTemplatePage.modules[item.code]).map(item => (
                    <MenuItem value={item.code}>
                      {addTemplatePage && addTemplatePage.modules && addTemplatePage.modules[item.code]
                        ? addTemplatePage.modules[item.code].title
                        : item.code}
                    </MenuItem>
                  ))}
                </CustomInputBase>
              </Grid>

              <Grid container spacing={8}>
                <Grid item xs={6}>
                  <TextField
                    id="select-filter-field"
                    select
                    onChange={e => {
                      this.setState({ filterField: e.target.value });
                    }}
                    value={this.state.filterField}
                    label="Trường dữ liệu phân loại"
                    name="filterField"
                    style={{ width: '100%' }}
                    variant="outlined"
                    // margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    SelectProps={{
                      MenuProps: {},
                    }}
                  >
                    {viewConfig.map((item, index) => (
                      <MenuItem value={item.name} key={`${item.name}_${index}`}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <CustomInputField
                    value={this.state.filterFieldValue}
                    type={filterFieldConfig.type}
                    label={filterFieldConfig.title}
                    // margin="normal"
                    configType="crmSource"
                    configCode={filterFieldConfig.code}
                    configId={filterFieldConfig.id}
                    onChange={e => this.setState({ filterFieldValue: e })}
                  />
                </Grid>
              </Grid>
              {/* <Grid item xs={6}>
                <CustomInputBase
                  required
                  className={'CustomRequiredLetter'}
                  // className={classes.textField}
                  label="Tính năng"
                  select
                  value={addTemplatePage.moduleCode}
                  fullWidth
                  onChange={this.props.handleChange('moduleCode')}
                  InputLabelProps={{ shrink: true }}
                >
                  {modules.filter(item => addTemplatePage && addTemplatePage.modules && addTemplatePage.modules[item.code]).map(item => (
                    <MenuItem value={item.code}>
                      {addTemplatePage && addTemplatePage.modules && addTemplatePage.modules[item.code]
                        ? addTemplatePage.modules[item.code].title
                        : item.code}
                    </MenuItem>
                  ))}
                </CustomInputBase>
              </Grid> */}
              <Grid item xs={4}>
                <TextField
                  value={addTemplatePage.selection}
                  fullWidth
                  select
                  name="menu"
                  onChange={e => this.handleChangeMenu(e.target.value)}
                  label="Lựa chọn"
                  // required={checkRequired.provincial}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value={0}>Biểu mẫu</MenuItem>
                  <MenuItem value={1}>Smart Form</MenuItem>
                </TextField>
              </Grid>

              <CustomGroupInputField
                code={'DynamicForm'}
                columnPerRow={3}
                value={this.state.others}
                onChange={params => this.handleOtherDataChange(params)}
              />
              {selection === 0 ? (
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
                  ref={editor => {
                    this.editor = editor;
                  }}
                />
              ) : (
                // <ReactCrops />
                <Grid container>
                  <Grid item sm={12}>
                    <div>
                      <input type="file" accept=".jpg, .png, .jpeg" multiple onChange={this.onSelectFile} />
                    </div>
                  </Grid>
                  <Grid
                    item
                    sm={12}
                    style={{
                      display: 'flex',
                    }}
                  >
                    <Grid item sm={6} style={{ margin: 5 }}>
                      {addTemplatePage.imageSrc && (
                        <ReactCrop
                          src={addTemplatePage.imageSrc}
                          crop={crop}
                          ruleOfThirds
                          onImageLoaded={this.onImageLoaded}
                          onComplete={this.onCropComplete}
                          onChange={this.onCropChange}
                        />
                      )}
                    </Grid>
                    <Grid item sm={6}>
                      <div
                        style={{
                          position: 'relative',
                          width: width,
                          height: height,
                          margin: 5,
                        }}
                      >
                        {reload && Array.isArray(cropElements) && cropElements.length > 0
                          ? cropElements.map((item, idx) => {
                              return (
                                <Select
                                  className="customSelect"
                                  key={item.id}
                                  value={(listImg.find(i => i.id === item.id) && listImg.find(i => i.item === id.id).value) || 0}
                                  onChange={e => this.handleChange(item, e.target.value)}
                                  style={{
                                    top: item.y,
                                    left: item.x,
                                    position: 'absolute',
                                    backgroundImage: `url(${ImageUrls[idx] && ImageUrls[idx].croppedImageUrl})`,
                                    backgroundRepeat: 'no repeat',
                                    backgroundSize: 'cover',
                                    width: item.widthCrop,
                                    height: item.heightCrop,
                                  }}
                                >
                                  {viewConfig.map(item => {
                                    // if (item.type === 'String') {
                                    return <MenuItem value={item.name}>{item.title}</MenuItem>;
                                    // }
                                  })}
                                </Select>
                              );
                            })
                          : null}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  addTemplatePage: makeSelectAddTemplatePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleChangeTitle: e => dispatch(handleChangeTitle(e.target.value)),
    getTemplate: (id, getTem) => dispatch(getTemplate(id, getTem)),
    handleChange: name => e => dispatch(handleChange({ name, value: e.target.value })),
    handleChangeNoTarget: name => e => dispatch(handleChange({ name, value: e })),
    postTemplate: data => dispatch(postTemplate(data)),
    putTemplate: (id, data) => dispatch(putTemplate(id, data)),
    mergeData: data => dispatch(mergeData(data)),
    getAllTemplate: () => dispatch(getAllTemplate()),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    getAllModuleCode: () => dispatch(getAllModuleCode()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addTemplatePage', reducer });
const withSaga = injectSaga({ key: 'addTemplatePage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddTemplatePage);
