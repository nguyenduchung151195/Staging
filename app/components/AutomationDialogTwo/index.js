/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */
/**
 *
 * AutomationDialog
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  DialogActions,
  Button,
  IconButton,
  Grid,
  MenuItem,
  Card,
  CardContent,
  FormHelperText,
  TextField,
} from '@material-ui/core';
import { Add, Delete } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { renderActionContent } from './CustomAction';
import { Autocomplete } from 'components/LifetekUi';
import loadash from 'lodash';
import CustomInputField from '../Input/CustomInputField';
import { UpdateStatusFailed } from '../../containers/BoDialog/actions';
import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
// import { Grid, withStyles, IconButton, Card, CardContent, CardActions, Typography } from '@material-ui/core';
// import { Add, Edit, Delete } from '@material-ui/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { withSnackbar } from 'notistack';
import axios from 'axios';
import makeSelectPluginAutomation from './selectors';
import { API_WORKFLOW } from '../../config/urlConfig';
// import AutomationDialog from '../../components/AutomationDialogTwo';
// import { changeSnackbar } from '../../containers/Dashboard/actions';
import reducer from './reducer';
import saga from './saga';
// import makeSelectDashboardPage, { makeSelectProfile } from '../../containers/Dashboard/selectors';
import {
  getAllDynamicFormAction,
  getAllApproveGroupAction,
  resetNotis,
  addAutomationAction,
  getAllAutomationAction,
  updateAutomationAction,
  deleteAutomationAction,
} from './actions';

/* eslint-disable react/prefer-stateless-function */

const listAction = [
  {
    title: 'Gửi mail',
    actionType: 'send',
    actionCommand: 1,
  },
  {
    title: 'Yêu cầu phê duyệt',
    actionType: 'approve',
    actionCommand: 1,
  },
  {
    title: 'SMS',
    actionType: 'sms',
    actionCommand: 1,
  },
  {
    title: 'Thông báo',
    actionType: 'notice',
    actionCommand: 1,
  },
  {
    title: 'Tạo dữ liệu',
    actionType: 'create',
    actionCommand: 1,
  },
  {
    title: 'Cập nhật dữ liệu',
    actionType: 'update',
    actionCommand: 1,
  },
];

const OPERATORS = [
  {
    value: 'Greater',
    title: 'Lớn hơn',
  },
  {
    value: 'Less',
    title: 'Nhỏ hơn',
  },
  {
    value: 'Equal',
    title: 'Bằng',
  },
  {
    value: 'GreaterOrEqual',
    title: 'Lớn hơn bằng',
  },
  {
    value: 'LessOrEqual',
    title: 'Nhỏ hơn bằng',
  },
  {
    value: 'NotEqual',
    title: 'Khác',
  },
  {
    value: 'ChangeValue',
    title: 'Thay đổi',
  },
];

const OPTION = [
  {
    value: 'ValueIncrease',
    title: 'Tăng',
  },
  {
    value: 'ReduceValue',
    title: 'Giảm',
  },
];

// const listModule = [
//   {
//     value: 'Task',
//     title: 'Công việc dự án',
//     path: '/Task',
//   },
//   {
//     value: 'BusinessOpportunities',
//     title: 'Cơ hội kinh doanh',
//     path: '/crm/BusinessOpportunities',
//   },
//   {
//     value: 'Bill',
//     title: 'Đơn hàng',
//     path: '/crm/Bill',
//   },
// ];

class AutomationDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // dialogData: {
      //   name: '',
      //   code: '',
      //   isAuto: true,
      //   conditions: [],
      //   actions: [],
      //   timeCondition: {
      //     value: 0,
      //     field: undefined,
      //   },
      //   path: '',
      // },
      dialogData: {
        name: '',
        code: '',
        type: '',
        moduleCode: '',
        isAuto: true,
        conditions: [],
        actions: [],
        timeCondition: {
          value: 0,
          field: undefined,
        },
        path: '',
      },
      listField: [],
      fields: [],
      timerUnit: 'second',
      timerValue: 0,
      error: {},
      sendTo: [],
      status: false,
      openNoti: false,
      name: '',
      id: '',
      logical: 'or',
      module: {
        value: '',
        path: '',
        title: '',
      },
      confirm: '',
      name1: '',
    };

    this.submitBtn = React.createRef();
  }

  componentDidMount() {
    // console.log('propsdata', this.props.data);
    const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
    const Amodule = JSON.parse(localStorage.getItem('Amodule'));
    const currentViewConfig = viewConfigLocalStorage.find(d => d.code === Amodule);

    const { data, serviceTask, exclusiveGateway, pluginAutomation, onGetApproveGroups } = this.props;
    onGetApproveGroups();

    const viewConfig = currentViewConfig;
    const { dialogData } = this.state;
    if (this.props.hidden && this.props.data.data !== null && !serviceTask && !exclusiveGateway) {
      dialogData.logical = data.data.logical;
      dialogData.conditions = [...data.data.conditions];
      dialogData.name = data.data.name;
    }
    if (!this.props.hidden && this.props.data.data !== null && !serviceTask && !exclusiveGateway) {
      dialogData.actions = [...data.data.actions];
      dialogData.name = data.data.name;
    }

    if (serviceTask && this.props.data.data !== null) {
      this.state.module.title = data.data.moduleCode;
      this.setState({ module: this.state.module });
    }
    if (exclusiveGateway && this.props.data.data !== null) {
      this.state.confirm = data.data.confirm;
      this.setState({ confirm: this.state.confirm });
    }
    if (dialogData.actions.length === 0) {
      switch (data.type) {
        case 'bpmn:SendTask':
          this.defaultAction('send');
          break;
        case 'bpmn:ScriptTask':
          this.defaultAction('create');
          break;
        case 'bpmn:ManualTask':
          this.defaultAction('update');
          break;
        default:
          break;
      }
    }

    // dialogData && dialogData.actions[0] && dialogData.actions[0].actionType = 'send'
    this.setState(dialogData);

    this.setState({ name: data.name, id: data.id });
    let localViewConfig = [];
    localViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    this.setState({ localViewConfig });
    this.setState(state => {
      let columns = [];
      let others = [];
      state.localViewConfig &&
        state.localViewConfig.filter(x => x.code === this.props.viewConfig.code).map(item => {
          columns = item && item && item.listDisplay && item.listDisplay && item && item.listDisplay && item.listDisplay.type.fields.type.columns;
          others = item && item.listDisplay && item.listDisplay.type.fields.type.others;
        });
      state.fields = columns.concat(others);
      return state;
    });

    dialogData.path = this.props.viewConfig.path;
    this.setState({ dialogData });
    const { columns, others } = viewConfig.listDisplay.type.fields.type;
    this.setState({ listField: [...columns, ...others] });
    if (this.props.isEditting) {
      // const { editData } = this.props;
      // let timerUnitConvert;
      // let timerValueConvert;
      // if (editData.timeCondition.value / 86400 > 1) {
      //   timerValueConvert = editData.timeCondition.value / 86400;
      //   timerUnitConvert = 'day';
      // } else if (editData.timeCondition.value / 3600 > 1) {
      //   timerValueConvert = editData.timeCondition.value / 3600;
      //   timerUnitConvert = 'hour';
      // } else if (editData.timeCondition.value / 60 > 1) {
      //   timerValueConvert = editData.timeCondition.value / 60;
      //   timerUnitConvert = 'min';
      // } else {
      //   timerValueConvert = editData.timeCondition.value;
      //   timerUnitConvert = 'second';
      // }
      // this.setState({ dialogData: this.props.editData, timerUnit: timerUnitConvert, timerValue: timerValueConvert });
    }

    ValidatorForm.addValidationRule('whiteSpace', value => {
      const len = value.split('').length;
      const finalIndex = value.split('')[len - 1];
      if (value.split('')[0] === ' ' || finalIndex === ' ') {
        return false;
      }
      return true;
    });
    ValidatorForm.addValidationRule('multiSpace', value => {
      const arrValue = value.split('');
      for (let i = 0; i < arrValue.length; i++) {
        if (arrValue[i] === ' ' && arrValue[i + 1] === ' ') {
          return false;
        }
      }
      return true;
    });
    ValidatorForm.addValidationRule('vnUnicode', value => {
      const vnUnicode =
        'àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ';
      const arrCode = value.split('');
      const findArr = arrCode.find(value => vnUnicode.includes(value));
      if (value.includes(' ') || findArr !== undefined) {
        return false;
      }
      return true;
    });
    ValidatorForm.addValidationRule('isEmail', value => {
      const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      const temp = re.test(value);
      if (!temp) {
        return false;
      }
      return true;
    });
  }

  defaultAction = params => {
    const { dialogData } = this.state;
    dialogData.actions.push({
      actionType: params,
      actionCommand: '',
      // mappingData: {},
    });
  };
  componentWillUnmount() {
    ValidatorForm.removeValidationRule('whiteSpace');
    ValidatorForm.removeValidationRule('multiSpace');
    ValidatorForm.removeValidationRule('vnUnicode');
    ValidatorForm.removeValidationRule('isEmail');
  }
  validate = state => {
    const { actions = [], conditions = [] } = state;
    const temp = {};
    temp.actions = actions.length === 0 ? '* Hành động không được để trống' : '';
    temp.trigger = conditions.length === 0 ? '* Điều kiện không được để trống' : '';

    function isRepeatCreateTaskAction(action = {}) {
      // debugger;
      const { actionType, mappingData = {} } = action;
      const { timeCircle = {} } = mappingData;
      const { active } = timeCircle;
      if (actionType === 'task') {
        if (active) {
          return true;
        }
      }
      return false;
    }

    if (conditions.length === 0) {
      if (actions.length && actions.filter(isRepeatCreateTaskAction).length === actions.length) {
        temp.trigger = '';
      }
    }

    state.actions.filter(action => action.actionType === 'field').forEach(z => {
      if (!z.mappingData.fieldId) {
        temp.field = 'Không được bỏ trống';
      }
    });
    this.setState({
      error: temp,
    });
    return Object.values(temp).every(x => x === '');
  };

  callBack = (cmd, data, name) => {
    switch (cmd) {
      case 'addition-data-change': {
        const { dialogData } = this.state;
        dialogData.actions[data.actionIndex].mappingData = data.newAddtionData;
        this.setState({ dialogData });
        break;
      }
      case 'send-addition-data-change': {
        const { dialogData } = this.state;
        dialogData.actions[data.actionIndex].additionData = data.newAddtionData;
        this.setState({ dialogData });
        break;
      }
      case 'send-addition-data-change-sendField': {
        const { dialogData } = this.state;
        dialogData.actions[data.actionIndex].sendField = data.sendField;
        this.setState({ dialogData });
        break;
      }
      case 'notice-addition-data-change': {
        const { dialogData } = this.state;
        dialogData.actions[data.actionIndex].additionData = data.newAddtionData;
        this.setState({ dialogData });
        break;
      }
      default:
        break;
    }
  };
  genMessageForRelationiField(type) {
    if (type) {
      const arr = type.split('|');
      if (arr[0] === 'ObjectId') {
        return arr[1];
      }
    }
    return '';
  }

  myGreeting(data) {
    this.setState({ dialogData: data })
  }

  handleSubmit = () => {
    const { data, hidden, isEditting, arrayData, serviceTask, exclusiveGateway } = this.props;
    let moduleCode = JSON.parse(localStorage.getItem('Amodule'));
    const { logical, dialogData } = this.state;
    let array = {};
    let itemModule = {};
    if (hidden && !serviceTask && !exclusiveGateway) {
      array = {
        id: data.id,
        data: {
          moduleCode: moduleCode,
          name: dialogData.name,
          id: data.id,
          type: data.type,
          conditions: [...dialogData.conditions],
          logical: logical,
          source: data.source,
          target: data.target,
        },
      };
    } else if (hidden === false && !serviceTask && !exclusiveGateway) {
      let incoming_f = [];
      let outgoing_f = [];
      data.incoming.map(item => {
        incoming_f.push(item.id);
      });
      data.outgoing.map(item => {
        outgoing_f.push(item.id);
      });
      // console.log(666666, dialogData);
      // if (dialogData.actions) {
      //   dialogData.actions.map((item) => {
      //     if (item.actionType === 'send') {
      //       let newItem = item.mappingData && item.mappingData.dynamicForm && item.mappingData.dynamicForm._id;
      //       delete item.mappingData.dynamicForm
      //       item.mappingData.dynamicForm = newItem
      //     }
      //   })
      // }
      array = {
        id: data.id,
        data: {
          moduleCode: moduleCode,
          name: dialogData.name,
          id: data.id,
          type: data.type,
          actions: [...dialogData.actions],
          incoming: [...incoming_f],
          outgoing: [...outgoing_f],
        },
      };
    }

    if (serviceTask) {
      itemModule = {
        id: data.id,
        module: this.state.module.title,
      };
      let incoming_f = [];
      let outgoing_f = [];
      data.incoming.map(item => {
        incoming_f.push(item.id);
      });
      data.outgoing.map(item => {
        outgoing_f.push(item.id);
      });
      array = {
        id: data.id,
        data: {
          moduleCode: this.state.module.title,
          id: data.id,
          type: data.type,
          incoming: [...incoming_f],
          outgoing: [...outgoing_f],
        },
      };
    }

    if (exclusiveGateway) {
      let incoming_f = [];
      let outgoing_f = [];
      data.incoming.map(item => {
        incoming_f.push(item.id);
      });
      data.outgoing.map(item => {
        outgoing_f.push(item.id);
      });
      array = {
        id: data.id,
        data: {
          confirm: this.state.confirm,
          id: data.id,
          type: data.type,
          incoming: [...incoming_f],
          outgoing: [...outgoing_f],
        },
      };
    }
    if (!isEditting) {
      let newArrayModule = JSON.parse(localStorage.getItem('moduleWF'));
      let newArray = JSON.parse(localStorage.getItem('automation'));
      newArray.push(array);
      newArrayModule.push(itemModule);
      localStorage.setItem('automation', JSON.stringify(newArray));
      localStorage.setItem('moduleWF', JSON.stringify(newArrayModule));
      // console.log(localStorage.getItem('automation'));
      this.props.handleCloseDialog();
      alert('Thêm thành công!');
    } else {
      let newArrayModule = JSON.parse(localStorage.getItem('moduleWF'));
      let newArray = JSON.parse(localStorage.getItem('automation'));
      let newA = [];
      let newAM = [];
      newArray.map(item => {
        if (item.id === array.id) {
          item = array;
        }
        newA.push(item);
      });
      newArrayModule.map(item => {
        if (item.id === itemModule.id) {
          item = itemModule;
        }
        newAM.push(item);
      });
      localStorage.setItem('automation', JSON.stringify(newA));
      localStorage.setItem('moduleWF', JSON.stringify(newAM));
      this.props.handleCloseDialog();
      alert('Cập nhật thành công!');
    }
    // const { logical, dialogData } = this.state;
    // let data = {
    //   type: 'data',
    //   moduleCode: moduleCode,
    //   next: [
    //     {
    //       logical: logical,
    //       action: [...dialogData.actions],
    //       next: [],
    //       conditions: [...dialogData.conditions],
    //     },
    //   ],
    //   name: dialogData.name,
    //   code: dialogData.code,
    // };
    // console.log('hihidialog', data);
    // console.log('hihidialog123', this.state.dialogData);
    // this.props.onAddAutomation(array);
  };
  changeField(value, index) {
    const valueAsync = value || [];
    this.setState(state => {
      valueAsync.map(x => {
        console.log(x);
      });
      state.dialogData.actions[index].sendTo = valueAsync.map(item => ({
        ref: (item.type && this.genMessageForRelationiField(item.type)) || null,
        field: item.field,
        name: item.name,
        _id: item._id,
      }));
      return state;
    });
  }
  render() {
    const { dialogData, listField, timerUnit, timerValue, error, name, id, logical } = this.state;
    const {
      open,
      isEditting,
      listDynamicForms,
      listApproveGroup,
      listMappingConvert,
      handleCloseDialog,
      pluginAutomation,
      hidden,
      data,
      serviceTask,
      exclusiveGateway,
    } = this.props;
    const firstList = [
      {
        title: this.props.nameViewConfig,
        name: '_id',
        type: this.props.viewConfig && this.props.viewConfig.code,
      },
    ];
    let relations = [];
    let newListFields =
      this.props.nameViewConfig === false
        ? this.state.fields.filter(x => x.type.includes('ObjectId')).map((item, index) => {
          try {
            const fieldRelationCols =
              JSON.parse(localStorage.getItem('viewConfig')) &&
              JSON.parse(localStorage.getItem('viewConfig')).find(j => j.code === item.type.split('|')[1]) &&
              JSON.parse(localStorage.getItem('viewConfig')).find(j => j.code === item.type.split('|')[1]).listDisplay &&
              JSON.parse(localStorage.getItem('viewConfig')).find(j => j.code === item.type.split('|')[1]).listDisplay.type.fields.type.columns;
            relations =
              fieldRelationCols &&
              Array.isArray(fieldRelationCols) &&
              fieldRelationCols.filter(j => j.type.includes('ObjectId')).map((jItem, jIndex) => {
                return {
                  ...jItem,
                  _id: `${item.name}-${index}-${jItem.name}-${jIndex}`,
                  name: `${item.title} - ${jItem.title}`,
                  field: `${item.name}|${jItem.name},${jItem && jItem.type.split('|')[1]}`,
                };
              });
          } catch (error) {
            console.log('error', error);
          }
          return {
            ...item,
            _id: `${item.name}-${index}`,
            name: item.title,
            field: item.name,
          };
        })
        : firstList.concat(this.state.fields.filter(x => x.type.includes('ObjectId'))).map((item, index) => {
          try {
            const fieldRelationCols =
              JSON.parse(localStorage.getItem('viewConfig')) &&
              JSON.parse(localStorage.getItem('viewConfig')).find(j => j.code === item.type.split('|')[1]) &&
              JSON.parse(localStorage.getItem('viewConfig')).find(j => j.code === item.type.split('|')[1]).listDisplay &&
              JSON.parse(localStorage.getItem('viewConfig')).find(j => j.code === item.type.split('|')[1]).listDisplay.type.fields.type.columns;
            relations = fieldRelationCols.filter(j => j.type.includes('ObjectId')).map((jItem, jIndex) => {
              return {
                ...jItem,
                _id: `${item.name}-${index}-${jItem.name}-${jIndex}`,
                name: `${item.title} - ${jItem.title}`,
                field: `${item.name}|${jItem.name},${jItem.type.split('|')[1]}`,
              };
            });
          } catch (error) {
            console.log('error', error);
          }
          return {
            ...item,
            _id: `${item.name}-${index}`,
            name: item.title,
            field: item.name,
          };
        });
    this.state.fields.forEach(i => {
      if (i.typeImport) {
        try {
          i.typeImport.filter(x => x.type.includes('ObjectId')).map((item, index) => {
            const fieldRelationCols = JSON.parse(localStorage.getItem('viewConfig')).find(j => j.code === item.type.split('|')[1]).listDisplay.type
              .fields.type.columns;
            const importList =
              fieldRelationCols &&
              Array.isArray(fieldRelationCols) &&
              fieldRelationCols.filter(j => j.type.includes('ObjectId')).map((jItem, jIndex) => {
                return {
                  ...jItem,
                  _id: `${i.name}-${item.name}-${index}-${jItem.name}-${jIndex}`,
                  name: `${i.title} - ${item.title} - ${jItem.title}`,
                  field: `Array|${i.name}|${item.name},${item.type.split('|')[1]}|${jItem.name}`,
                };
              });
            newListFields = newListFields.concat(importList);
          });
        } catch (error) {
          console.log('err', err);
        }
      }
    });
    function unique(arr) {
      return Array.from(new Set(arr));
    }

    newListFields = newListFields.concat(relations);
    const calendarViewConfig = JSON.parse(localStorage.getItem('viewConfig')).find(x => x.path === this.props.path);
    const columnListFieldApplys =
      calendarViewConfig && loadash.has(calendarViewConfig, 'listDisplay.type.fields.type')
        ? calendarViewConfig.listDisplay.type.fields.type.columns
        : [];
    const othersListFieldApplys =
      calendarViewConfig && loadash.has(calendarViewConfig, 'listDisplay.type.fields.type')
        ? calendarViewConfig.listDisplay.type.fields.type.columns
        : [];
    const listFieldApplys = unique(columnListFieldApplys.concat(othersListFieldApplys).filter(x => x.type.includes('Date')));

    return (
      <div>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={() => {
            // this.props.callBack('cancel-dialog', null);
            handleCloseDialog();
          }}
          aria-labelledby="max-width-dialog-title"
        >
          {serviceTask ? <DialogTitle id="max-width-dialog-title">{isEditting ? 'SỬA CẤU HÌNH  ' : 'CẤU HÌNH MODULE '}</DialogTitle> : null}
          {exclusiveGateway ? (
            <DialogTitle id="max-width-dialog-title">{isEditting ? 'XÁC NHẬN ĐIỀU KIỆN  ' : 'XÁC NHẬN ĐIỀU KIỆN'}</DialogTitle>
          ) : null}
          {!hidden && !serviceTask && !exclusiveGateway ? (
            <DialogTitle id="max-width-dialog-title">{isEditting ? 'SỬA HÀNH ĐỘNG ' : 'TẠO HÀNH ĐỘNG'}</DialogTitle>
          ) : null}
          {hidden && !serviceTask && !exclusiveGateway ? (
            <DialogTitle id="max-width-dialog-title">{isEditting ? 'SỬA ĐIỀU KIỆN ' : 'THÊM ĐIỀU KIỆN'}</DialogTitle>
          ) : null}
          <DialogContent>
            <ValidatorForm
              onSubmit={() => {
                const { dialogData, timerUnit, timerValue } = this.state;
                y;
                switch (timerUnit) {
                  case 'second':
                    dialogData.timeCondition.value = timerValue;
                    break;
                  case 'min':
                    dialogData.timeCondition.value = timerValue * 60;
                    break;
                  case 'hour':
                    dialogData.timeCondition.value = timerValue * 60 * 60;
                    break;
                  case 'day':
                    dialogData.timeCondition.value = timerValue * 60 * 60 * 24;
                    break;
                  default:
                    break;
                }
                if (this.validate(this.state.dialogData)) {
                  const x = Object.assign({}, dialogData);
                  x.conditions = x.conditions.filter(item => item.field.trim() !== '');
                  isEditting ? this.props.callBack('update', x) : this.props.callBack('create-new', x);
                }
              }}
            >
              <Grid container>
                {/* {!hidden ? ( */}
                <>
                  {/* {console.log(111111)} */}
                  {!serviceTask && !exclusiveGateway ? (
                    <Grid item sm={11}>
                      <TextValidator
                        // validators={['required']}
                        // errorMessages={['Trường bắt buộc']}
                        onChange={event => {
                          let { dialogData } = this.state;
                          dialogData.name = event.target.value;
                          this.setState({ dialogData });
                        }}
                        value={dialogData.name}
                        label="Tên *"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        validators={['required', 'whiteSpace', 'multiSpace']}
                        errorMessages={['Trường bắt buộc', 'Tên automation không hợp lệ', '2 Dấu cách không được liền kề']}
                      />
                    </Grid>
                  ) : null}

                  {serviceTask ? (
                    <Grid item sm={12}>
                      <TextField
                        style={{ margin: '10px 0', width: '100%' }}
                        id="outlined-select-currency"
                        fullWidth
                        select
                        label="Module"
                        value={this.state.module.title}
                        onChange={event => {
                          let { module } = this.state;
                          module.title = event.target.value;
                          this.setState({ module: module });
                        }}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      >
                        {this.props.listModule &&
                          this.props.listModule.map(option => {
                            if (option.name !== undefined) {
                              return (
                                <MenuItem key={option.name} value={option.name}>
                                  {option.title}
                                </MenuItem>
                              );
                            }
                          })}
                      </TextField>
                    </Grid>
                  ) : null}
                  {exclusiveGateway ? (
                    <Grid item sm={12}>
                      <TextValidator
                        onChange={event => {
                          let { confirm } = this.state;
                          confirm = event.target.value;
                          this.setState({ confirm });
                        }}
                        value={this.state.confirm}
                        label="confirm"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      // validators={['required', 'whiteSpace', 'multiSpace']}
                      // errorMessages={['Trường bắt buộc', 'Tên automation không hợp lệ', '2 Dấu cách không được liền kề']}
                      />
                    </Grid>
                  ) : null}
                  {/* <Grid item sm={11}>
                      <TextValidator
                        onChange={event => {
                          const { dialogData } = this.state;
                          dialogData.code = event.target.value;
                          this.setState({ dialogData });
                        }}
                        value={dialogData.code}
                        label="Code *"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        disabled={!!this.props.isEditting}
                        validators={['required', 'vnUnicode']}
                        errorMessages={['Trường bắt buộc', 'Code không hợp lệ']}
                      />
                    </Grid> */}
                </>
                {/* ) : null} */}

                {/* <Grid item sm={4} className="pr-2">
                  <TextValidator
                    onChange={event => {
                      let { timerValue } = this.state;
                      timerValue = event.target.value;
                      this.setState({ timerValue });
                    }}
                    type="number"
                    value={timerValue}
                    label="Giá trị "
                    variant="outlined"
                    fullWidth
                    margin="dense"
                  />
                </Grid> */}
                {/* <Grid item sm={3} className="pl-2">
                  <TextValidator
                    onChange={event => {
                      let { timerUnit } = this.state;
                      timerUnit = event.target.value;
                      this.setState({ timerUnit });
                    }}
                    select
                    value={timerUnit}
                    label="Đơn vị thời gian"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                  >
                    <MenuItem value="second">Giây</MenuItem>
                    <MenuItem value="min">Phút</MenuItem>
                    <MenuItem value="hour">Giờ</MenuItem>
                    <MenuItem value="day">Ngày</MenuItem>
                  </TextValidator>
                </Grid> */}
                {/* <Grid item sm={4} className="pl-2">
                  <TextValidator
                    onChange={event => {
                      const { dialogData } = this.state;
                      // console.log('dialogData: ', dialogData);
                      dialogData.timeCondition.field = event.target.value;
                      this.setState({
                        dialogData,
                      });
                    }}
                    select
                    value={this.state.dialogData.timeCondition.field === undefined ? '' : this.state.dialogData.timeCondition.field}
                    label="Áp dụng cho"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                  >
                    {listFieldApplys.map(x => (
                      <MenuItem key={x.name} value={x.name}>
                        {x.title}
                      </MenuItem>
                    ))}
                  </TextValidator>
                </Grid> */}
                {hidden && !serviceTask && !exclusiveGateway ? (
                  <>
                    <Grid item sm={12}>
                      <TextValidator
                        style={{ width: '12rem' }}
                        onChange={event => {
                          let { logical } = this.state;
                          logical = event.target.value;
                          this.setState({ logical });
                        }}
                        select
                        value={logical}
                        label="Loại điều kiện"
                        variant="outlined"
                        // fullWidth
                        margin="dense"
                      >
                        <MenuItem value="or">Hoặc</MenuItem>
                        <MenuItem value="and">Và</MenuItem>
                      </TextValidator>
                    </Grid>

                    <Grid item sm={6}>
                      <h5>Điều kiện</h5>
                    </Grid>
                    {this.state.status === false ? (
                      <Grid className="text-right" item sm={6} alignItems="flex-end">
                        <IconButton
                          onClick={() => {
                            const { dialogData } = this.state;
                            //  let status = true;
                            //  this.setState({ status: false });
                            dialogData.conditions.push({
                              field: '',
                              operator: '',
                              value: '',
                              valueType: '',
                              // valueInfor: '',
                              // configType: '',
                              // configCode: '',
                              // options: '',
                            });
                            this.setState({ dialogData });
                            this.setState(prevState => ({
                              error: {
                                ...prevState.error,
                                trigger: '',
                              },
                            }));
                          }}
                          disabled={this.state.status}
                        >
                          <Add color="primary" />
                        </IconButton>
                      </Grid>
                    ) : null}
                  </>
                ) : null}

                <Grid item sm={12}>
                  {dialogData.conditions.map((item, index) => {
                    // if (index !== dialogData.conditions.length - 1) {
                    const itemViewconfig = listField.find(i => i.name === item.field && i.type === 'Array');
                    const childs = itemViewconfig ? itemViewconfig.typeImport : [];
                    return (
                      <>
                        <Grid container key={item.field}>
                          <Grid item sm={4}>
                            <TextValidator
                              validators={['required']}
                              errorMessages={['Trường bắt buộc']}
                              onChange={event => {
                                event.preventDefault();
                                const { dialogData } = this.state;
                                let status = false;
                                this.setState({ status: status });
                                dialogData.conditions[index].field = event.target.value;
                                const itemConfig = listField.find(d => d.name === event.target.value);
                                dialogData.conditions[index].valueType = itemConfig.type;
                                // dialogData.conditions[index].configType = itemConfig.configType ? itemConfig.configType : null;
                                // dialogData.conditions[index].configCode = itemConfig.configCode ? itemConfig.configCode : null;
                                // dialogData.conditions[index].options = itemConfig.menuItem ? itemConfig.menuItem : null;
                                if (itemConfig.type === 'Array') {
                                  dialogData.conditions[index].conditions = (itemConfig.typeImport || []).map(i => {
                                    return {
                                      title: i.title,
                                      operator: '',
                                      field: i.name,
                                      valueType: i.type,
                                      // configType: i.configType,
                                      // configCode: i.configCode,
                                      // options: i.menuItem || null,
                                    };
                                  });
                                }
                                this.setState({ dialogData });
                              }}
                              select
                              value={dialogData.conditions[index].field}
                              label="Tên trường *"
                              variant="outlined"
                              fullWidth
                              margin="dense"
                            //  disabled={index === dialogData.conditions.length - 1 && dialogData.conditions.length > 1}
                            >
                              {listField.map(field => (
                                <MenuItem key={field.name} value={field.name}>
                                  {field.title}
                                </MenuItem>
                              ))}
                            </TextValidator>
                          </Grid>
                          {item.valueType !== 'Array' ? (
                            <>
                              <Grid item sm={3} className="px-2">
                                <TextValidator
                                  validators={['required']}
                                  errorMessages={['Trường bắt buộc']}
                                  onChange={event => {
                                    const { dialogData } = this.state;
                                    dialogData.conditions[index].operator = event.target.value;
                                    this.setState({ dialogData });
                                  }}
                                  select
                                  value={dialogData.conditions[index].operator}
                                  label="Toán tử *"
                                  variant="outlined"
                                  fullWidth
                                  margin="dense"
                                //  disabled={index === dialogData.conditions.length - 1 && dialogData.conditions.length > 1}
                                >
                                  <MenuItem key="-83" value="">
                                    -- Chọn --
                                  </MenuItem>
                                  {OPERATORS.map(field => (
                                    <MenuItem key={field.value} value={field.value}>
                                      {field.title}
                                    </MenuItem>
                                  ))}
                                </TextValidator>
                              </Grid>
                              <Grid item sm={4}>
                                {dialogData.conditions[index].valueType === '' || dialogData.conditions[index].valueType === 'String' ? (
                                  <TextValidator
                                    validators={['required']}
                                    errorMessages={['Trường bắt buộc']}
                                    onChange={event => {
                                      const { dialogData } = this.state;
                                      dialogData.conditions[index].value = event.target.value;
                                      this.setState({ dialogData });
                                    }}
                                    value={dialogData.conditions[index].value}
                                    label="Giá trị *"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                  //  disabled={index === dialogData.conditions.length - 1 && dialogData.conditions.length > 1}
                                  />
                                ) : dialogData.conditions[index].valueType === 'Date' && dialogData.conditions[index].operator !== 'change' ? (
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <p> So sánh với ngày hiện tại</p>
                                    <Checkbox
                                      onChange={event => {
                                        const { dialogData } = this.state;
                                        dialogData.conditions[index].currentDay = event.target.checked;
                                        this.setState({ dialogData });
                                      }}
                                      checked={dialogData.conditions[index].currentDay}
                                    />
                                    <TextValidator
                                      validators={['required']}
                                      errorMessages={['Trường bắt buộc']}
                                      onChange={event => {
                                        const { dialogData } = this.state;
                                        dialogData.conditions[index].value = event.target.value;
                                        this.setState({ dialogData });
                                      }}
                                      value={dialogData.conditions[index].value}
                                      label="Giá trị *"
                                      variant="outlined"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      type={dialogData.conditions[index].currentDay ? 'number' : 'date'}
                                      margin="dense"
                                      disabled={index === dialogData.conditions.length - 1 && dialogData.conditions.length > 1}
                                    />
                                    {dialogData.conditions[index].currentDay ? 's' : null}
                                  </div>
                                ) : (dialogData.conditions[index].valueType === 'Date' || dialogData.conditions[index].valueType === 'Number') &&
                                  dialogData.conditions[index].operator === 'change' ? (
                                  <TextValidator
                                    validators={['required']}
                                    errorMessages={['Trường bắt buộc']}
                                    onChange={event => {
                                      const { dialogData } = this.state;
                                      dialogData.conditions[index].value = event.target.value;
                                      this.setState({ dialogData });
                                    }}
                                    select
                                    value={dialogData.conditions[index].value}
                                    label="Giá trị *"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                  //  disabled={index === dialogData.conditions.length - 1 && dialogData.conditions.length > 1}
                                  >
                                    <MenuItem key="-83" value="">
                                      -- Chọn --
                                    </MenuItem>
                                    {OPTION.map(field => (
                                      <MenuItem key={field.value} value={field.value}>
                                        {field.title}
                                      </MenuItem>
                                    ))}
                                  </TextValidator>
                                ) : (
                                  <CustomInputField
                                    validators={['required']}
                                    errorMessages={['Trường bắt buộc']}
                                    onChange={event => {
                                      const { dialogData } = this.state;
                                      dialogData.conditions[index].valueInfor =
                                        dialogData.conditions[index].valueType.includes('Source') ||
                                          dialogData.conditions[index].valueType.includes('MenuItem') ||
                                          dialogData.conditions[index].valueType === 'Number'
                                          ? event.target.value
                                          : event;
                                      dialogData.conditions[index].value =
                                        dialogData.conditions[index].valueType.includes('Source') ||
                                          dialogData.conditions[index].valueType.includes('MenuItem')
                                          ? event.target.value.type
                                          : event._id;
                                      this.setState({ dialogData });
                                    }}
                                    name={dialogData.conditions[index].field}
                                    value={dialogData.conditions[index].valueInfor}
                                    type={dialogData.conditions[index].valueType}
                                    label="Giá trị *"
                                  // configType={dialogData.conditions[index].configType ? dialogData.conditions[index].configType : null}
                                  // configCode={dialogData.conditions[index].configCode ? dialogData.conditions[index].configCode : null}
                                  // options={dialogData.conditions[index].options ? dialogData.conditions[index].options : null}
                                  />
                                )}
                              </Grid>
                              <Grid item sm={1} className="text-center">
                                <IconButton
                                  style={{
                                    position: 'relative',
                                    left: '1rem',
                                    top: '0.5rem',
                                  }}
                                  onClick={() => {
                                    // eslint-disable-next-line no-alert
                                    const r = confirm('Bạn có muốn xóa hành động này?');
                                    if (r) {
                                      const { dialogData } = this.state;
                                      let status;
                                      if (dialogData.conditions[index + 1] && dialogData.conditions[index + 1].valueType === '') {
                                        status = true;
                                      } else {
                                        status = false;
                                      }
                                      dialogData.conditions.splice(index, 1);
                                      this.setState({
                                        dialogData,
                                        //  , status: status
                                      });
                                      // if (r === true) alert('Xóa thành công');
                                    }
                                  }}
                                //  disabled={index === dialogData.conditions.length - 1 && dialogData.conditions.length > 1}
                                >
                                  <Delete />
                                </IconButton>
                              </Grid>
                            </>
                          ) : null}
                        </Grid>
                        {item.conditions &&
                          item.conditions.map((childItem, childIndex) => (
                            <Grid container key={childItem.field}>
                              <Grid item sm={4}>
                                <TextValidator
                                  errorMessages={['Trường bắt buộc']}
                                  value={childItem.title}
                                  label="Tên trường *"
                                  variant="outlined"
                                  fullWidth
                                  margin="dense"
                                />
                              </Grid>
                              <Grid item sm={3} className="px-2">
                                <TextValidator
                                  errorMessages={['Trường bắt buộc']}
                                  onChange={event => {
                                    const { dialogData } = this.state;
                                    dialogData.conditions[index].conditions[childIndex].operator = event.target.value;
                                    this.setState({ dialogData });
                                  }}
                                  select
                                  value={dialogData.conditions[index].conditions[childIndex].operator}
                                  label="Điều kiện so sánh *"
                                  variant="outlined"
                                  fullWidth
                                  margin="dense"
                                >
                                  {OPERATORS.map(field => (
                                    <MenuItem key={field.value} value={field.value}>
                                      {field.title}
                                    </MenuItem>
                                  ))}
                                </TextValidator>
                              </Grid>
                              <Grid item sm={4}>
                                {dialogData.conditions[index].conditions[childIndex].valueType === '' ||
                                  dialogData.conditions[index].conditions[childIndex].valueType === 'String' ? (
                                  <TextValidator
                                    errorMessages={['Trường bắt buộc']}
                                    onChange={event => {
                                      const { dialogData } = this.state;
                                      dialogData.conditions[index].conditions[childIndex].value = event.target.value;
                                      this.setState({ dialogData });
                                    }}
                                    value={dialogData.conditions[index].conditions[childIndex].value}
                                    label="Giá trị *"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                  />
                                ) : dialogData.conditions[index].conditions[childIndex].valueType === 'Date' ? (
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <p> So sánh với ngày hiện tại</p>
                                    <Checkbox
                                      onChange={event => {
                                        const { dialogData } = this.state;
                                        dialogData.conditions[index].conditions[childIndex].currentDay = event.target.checked;
                                        this.setState({ dialogData });
                                      }}
                                      checked={dialogData.conditions[index].conditions[childIndex].currentDay}
                                    />
                                    <TextValidator
                                      errorMessages={['Trường bắt buộc']}
                                      onChange={event => {
                                        const { dialogData } = this.state;
                                        dialogData.conditions[index].conditions[childIndex].value = event.target.value;
                                        this.setState({ dialogData });
                                      }}
                                      value={dialogData.conditions[index].conditions[childIndex].value}
                                      label="Giá trị *"
                                      variant="outlined"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      type={dialogData.conditions[index].conditions[childIndex].currentDay ? 'number' : 'date'}
                                      margin="dense"
                                    />
                                    {dialogData.conditions[index].conditions[childIndex].currentDay ? 's' : null}
                                  </div>
                                ) : (
                                  <CustomInputField
                                    errorMessages={['Trường bắt buộc']}
                                    onChange={event => {
                                      // console.log(event, 'dđ');
                                      const { dialogData } = this.state;
                                      dialogData.conditions[index].conditions[childIndex].valueInfor =
                                        dialogData.conditions[index].conditions[childIndex].valueType.includes('Source') ||
                                          dialogData.conditions[index].conditions[childIndex].valueType.includes('MenuItem') ||
                                          dialogData.conditions[index].conditions[childIndex].valueType === 'Number'
                                          ? event.target.value
                                          : event;
                                      dialogData.conditions[index].conditions[childIndex].value =
                                        dialogData.conditions[index].conditions[childIndex].valueType.includes('Source') ||
                                          dialogData.conditions[index].conditions[childIndex].valueType.includes('MenuItem')
                                          ? event.target.value.type
                                          : event._id;
                                      this.setState({ dialogData });
                                    }}
                                    name={dialogData.conditions[index].conditions[childIndex].field}
                                    value={dialogData.conditions[index].conditions[childIndex].valueInfor}
                                    type={dialogData.conditions[index].conditions[childIndex].valueType}
                                    label="Giá trị *"
                                  // configType={
                                  //   dialogData.conditions[index].conditions[childIndex].configType
                                  //     ? dialogData.conditions[index].conditions[childIndex].configType
                                  //     : null
                                  // }
                                  // configCode={
                                  //   dialogData.conditions[index].conditions[childIndex].configCode
                                  //     ? dialogData.conditions[index].conditions[childIndex].configCode
                                  //     : null
                                  // }
                                  // options={
                                  //   dialogData.conditions[index].conditions[childIndex].options
                                  //     ? dialogData.conditions[index].conditions[childIndex].options
                                  //     : null
                                  // }
                                  />
                                )}
                              </Grid>
                            </Grid>
                          ))}
                      </>
                    );
                    // }
                  })}
                  {error.trigger ? <FormHelperText style={{ color: 'red' }}>{error.trigger}</FormHelperText> : null}
                </Grid>
                {!hidden && !serviceTask && !exclusiveGateway ? (
                  <>
                    <Grid item sm={6}>
                      <h5>Hành động</h5>
                    </Grid>
                    <Grid className="text-right" item sm={6} alignItems="flex-end">
                      <IconButton
                        onClick={() => {
                          const { dialogData } = this.state;
                          dialogData.actions.push({
                            actionType: '',
                            actionCommand: '',
                            mappingData: {
                              // dynamicForm: '',
                              // convertMapping: '',
                              // approveName: '',
                              // approveGroup: '',
                            },
                            // sendTo: [],
                          });
                          this.setState({ dialogData });
                          this.setState(prevState => ({
                            error: {
                              ...prevState.error,
                              actions: '',
                            },
                          }));
                        }}
                      >
                        <Add color="primary" />
                      </IconButton>
                    </Grid>
                  </>
                ) : null}

                {dialogData.actions.map((item, index) => (
                  <Grid sm={12} className="my-2">
                    <Grid container alignItems="center">
                      <Grid item sm={11}>
                        <TextValidator
                          validators={['required']}
                          errorMessages={['Trường bắt buộc']}
                          onChange={event => {
                            if (String(event.target.value) === 'call' || String(event.target.value) === 'sms') {
                              // this.props.onChangeSnackbar({ status: true, message: 'Bạn không có quyền truy cập!', variant: 'error' });
                              alert('Bạn không có quyền truy cập!');
                              return;
                            }
                            const { dialogData } = this.state;
                            dialogData.actions[index].actionType = event.target.value;
                            dialogData.actions[index].actionCommand =
                              listAction[listAction.findIndex(d => d.actionType === event.target.value)].actionCommand;
                            this.setState({ dialogData });
                          }}
                          select
                          value={dialogData.actions[index].actionType}
                          label="Hành động *"
                          variant="outlined"
                          fullWidth
                          margin="dense"
                        >
                          {listAction.map(action => (
                            <MenuItem key={action.actionType} value={action.actionType}>
                              {action.title}
                            </MenuItem>
                          ))}
                        </TextValidator>
                      </Grid>
                      <Grid item sm={1} className="text-center">
                        <IconButton
                          style={{
                            position: 'relative',
                            left: '1rem',
                            top: '0.5rem',
                          }}
                          onClick={() => {
                            // eslint-disable-next-line no-alert
                            const r = confirm('Bạn có muốn xóa hành động này ?');
                            if (r) {
                              // this.props.onChangeSnackbar({ status: true, message: 'Đã xóa hành động', variant: 'success' });
                              const { dialogData } = this.state;
                              dialogData.actions.splice(index, 1);
                              this.setState({ dialogData });
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Grid>
                      <Grid item sm={11}>
                        {renderActionContent(
                          dialogData.actions[index],
                          listDynamicForms,
                          pluginAutomation.approveGroup,
                          listMappingConvert,
                          index,
                          this.callBack,
                          this.setState.bind(this),
                          error,
                          dialogData.conditions && dialogData.conditions.length,
                        )}
                      </Grid>
                      {/* <Grid item sm={6}>
                        <h5>Nơi nhận</h5>
                      </Grid>
                      <Grid item sm={11}>
                        <Grid>
                          <Autocomplete
                            onChange={value => this.changeField(value, index)}
                            suggestions={newListFields}
                            value={dialogData.actions[index].sendTo}
                            label="Nơi nhận"
                            isMulti
                            checkedShowForm={true}
                          />
                        </Grid>
                      </Grid> */}
                    </Grid>
                  </Grid>
                ))}
                {error.actions ? <FormHelperText style={{ color: 'red', width: '100%' }}>{error.actions}</FormHelperText> : null}
                {/* <Grid>
                  Tự động:
                  <Checkbox
                    onChange={event => {
                      const { dialogData } = this.state;
                      dialogData.isAuto = event.target.checked;
                      this.setState({ dialogData });
                    }}
                    checked={dialogData.isAuto}
                  />
                </Grid> */}

                {/* <Grid item sm={12}>
                   <CircleSelect
                     value={dialogData.timeCircle}
                     onChange={value => {
                       const newDialogData = {
                         ...dialogData,
                         timeCircle: value,
                       };
 
                       this.setState({ dialogData: newDialogData });
                     }}
                   />
                 </Grid> */}
              </Grid>
              <button type="submit" ref={this.submitBtn} hidden />
            </ValidatorForm>
          </DialogContent>
          <DialogActions>
            {isEditting &&
              dialogData.originData && (
                <Button
                  onClick={() => {
                    this.setState({
                      dialogData: {
                        originData: JSON.parse(JSON.stringify(dialogData.originData)),
                        isAuto: dialogData.originData.isAuto,
                        actions: dialogData.originData.actions,
                        conditions: dialogData.originData.conditions,
                        name: dialogData.originData.name,
                      },
                    });
                  }}
                  color="primary"
                  variant="outlined"
                >
                  KHÔI PHỤC MẶC ĐỊNH
                </Button>
              )}
            <Button
              onClick={() => {
                this.handleSubmit();
              }}
              color="primary"
              variant="outlined"
            >
              {isEditting ? 'LƯU' : 'LƯU'}
            </Button>

            <Button
              onClick={() => {
                handleCloseDialog();
              }}
              color="secondary"
              variant="outlined"
            >
              HỦY
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  pluginAutomation: makeSelectPluginAutomation(),
  // dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetDynamicForms: () => {
      dispatch(getAllDynamicFormAction());
    },
    onGetApproveGroups: () => {
      dispatch(getAllApproveGroupAction());
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    onAddAutomation: newAutomation => {
      dispatch(addAutomationAction(newAutomation));
    },
    onUpdateAutomation: (automationCode, newAutomation) => {
      dispatch(updateAutomationAction(automationCode, newAutomation));
    },
    onDeleteAutomation: automationCode => {
      dispatch(deleteAutomationAction(automationCode));
    },
    onGetAutomation: collectionCode => {
      dispatch(getAllAutomationAction(collectionCode));
    },
    onResetNotis: () => {
      dispatch(resetNotis());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'pluginAutomation', reducer });
const withSaga = injectSaga({ key: 'pluginAutomation', saga });

AutomationDialog.propTypes = {};

// export default AutomationDialog;
export default memo(compose(
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  // withStyles(style),
)(AutomationDialog));
