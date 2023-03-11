import React from 'react';
import { Grid, MenuItem } from '@material-ui/core';
import { TextValidator } from 'react-material-ui-form-validator';
import { AsyncAutocomplete } from '../LifetekUi';
import { API_USERS, API_FIELD, API_TEMPLATE, API_TEMPLATE_LIST } from '../../config/urlConfig';
import CircleSelect from '../Filter/CircleSelect';
import Bus from './module/createAction';
import Bus1 from './module/updateAction';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { array } from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
export const renderActionContent = (
  action,
  listDynamicForms,
  listApproveGroup,
  listMappingConvert,
  actionIndex,
  callBack,
  setState,
  error,
  hasCondition,
) => {
  let fieldCode;
  let arr = [];
  const renderSendTo = () => {
    const Amodule = JSON.parse(localStorage.getItem('Amodule'));
    const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfigLocalStorage.find(d => d.code === Amodule);
    const viewConfig = currentViewConfig && currentViewConfig.listDisplay && currentViewConfig.listDisplay.type.fields.type.columns;
    viewConfig.map(item => {
      if (item.type.includes('ObjectId')) {
        const itemArr = item.type.split('|');
        const itemModel = itemArr[1];
        const refViewconfig = viewConfigLocalStorage && viewConfigLocalStorage.find(v => v.code === itemModel);
        (refViewconfig && refViewconfig.listDisplay.type.fields.type.columns.filter(c => c.type.includes('ObjectId')).length === 0) ||
          refViewconfig === undefined ||
          itemModel === Amodule
          ? arr.push({ ...item, isParent: false })
          : arr.push({ ...item, isParent: true, nameClass: item.name.replace('.', '-') });
        refViewconfig &&
          refViewconfig.listDisplay.type.fields.type.columns.filter(c => c.type.includes('ObjectId')).map(r => {
            arr.push({ ...r, parentName: item.name.replace('.', '-') });
          });
      }
    });
    // console.log(2222, arr);
  };
  renderSendTo();

  let newAddtionData = Object.assign({}, action.mappingData);
  // let sendField = Object.assign({}, action.sendField);
  const listModule = [
    {
      value: 'Task',
      title: 'Công việc dự án',
      path: '/Task',
    },
    {
      value: 'BusinessOpportunities',
      title: 'Cơ hội kinh doanh',
      path: '/crm/BusinessOpportunities',
    },
    {
      value: 'Bill',
      title: 'Đơn hàng',
      path: '/crm/Bill',
    },
    {
      value: 'Employee',
      title: 'Nhân viên',
      path: '/crm/Employee',
    },
    {
      value: 'Customer',
      title: 'Khách hàng',
      path: '/crm/Customer',
    },
  ];
  const Amodule = JSON.parse(localStorage.getItem('Amodule'));
  const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
  const currentViewConfig = viewConfigLocalStorage.find(d => d.code === Amodule);
  const viewConfig = currentViewConfig && currentViewConfig.listDisplay && currentViewConfig.listDisplay.type.fields.type.columns;
  let a = [];
  switch (action.actionType) {
    case 'send':
      newAddtionData = Object.assign({}, action.additionData);
      action.methodType = 'mail';
      fieldCode = (
        <Grid container>
          <Grid item sm={12}>
            <TextValidator
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              onChange={event => {
                let sendField = event.target.value;
                callBack('send-addition-data-change-sendField', { sendField, actionIndex });
              }}
              InputLabelProps={{
                shrink: true,
              }}
              select
              value={action && action.sendField}
              label="Trường gửi *"
              variant="outlined"
              fullWidth
              margin="dense"
            >
              {arr.map(
                option =>
                  option.parentName === undefined ? (
                    <MenuItem key={option.name} value={option.name}>
                      <span style={{ width: '11vw' }}>{option.title}</span>{' '}
                      {option.isParent ? (
                        <span
                          style={{ width: '3rem' }}
                          className="sp1"
                          onClick={element => {
                            element.stopPropagation();
                            element.preventDefault();
                            const mItem = document.querySelectorAll(`.${option.nameClass}`);
                            const more = document.querySelectorAll(`.${option.nameClass}-more`);
                            const leff = document.querySelectorAll(`.${option.nameClass}-leff`);
                            if (!a.includes(option.nameClass)) {
                              a.push(option.nameClass);
                              for (let i = 0; i < mItem.length; i++) {
                                mItem[i].style.display = 'inherit';
                              }
                              more[more.length - 1].style.display = 'none';
                              leff[leff.length - 1].style.display = 'inherit';
                            } else {
                              a = a.filter(v => v !== option.nameClass);
                              for (let i = 0; i < mItem.length; i++) {
                                mItem[i].style.display = 'none';
                              }
                              more[more.length - 1].style.display = 'inherit';
                              leff[leff.length - 1].style.display = 'none';
                            }
                          }}
                        >
                          <ExpandMoreIcon className={`${option.nameClass}-more more`} />{' '}
                          <ExpandLessIcon className={`${option.nameClass}-leff leff`} style={{ display: 'none' }} />{' '}
                        </span>
                      ) : null}
                    </MenuItem>
                  ) : (
                    <MenuItem className={option.parentName} style={{ display: 'none' }} key={option.name} value={option.name}>
                      &ensp;
                      {option.title}
                    </MenuItem>
                  ),
              )}
            </TextValidator>
          </Grid>
          {/* <Grid item sm={12}>
            <TextValidator
              validators={['required', 'isEmail']}
              errorMessages={['Trường bắt buộc', 'Dữ liệu không đúng định dạng Email']}
              onChange={event => {
                newAddtionData.from = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.from}
              label="From *"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </Grid> */}
          {/* <Grid item sm={12}>
            <TextValidator
              onChange={event => {
                newAddtionData.fields = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.fields}
              label="Các trường trong Module, Cách nhau bởi dấu ,"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </Grid> */}
          {/* <Grid item sm={12}>
            <TextValidator
              validators={['required', 'whiteSpace']}
              errorMessages={['Trường bắt buộc', 'Subject không hợp lệ']}
              onChange={event => {
                newAddtionData.subject = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.subject}
              label="Subject *"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </Grid> */}
          <Grid item sm={12}>
            <AsyncAutocomplete
              label="Biểu mẫu *"
              // isMulti
              onChange={value => {
                newAddtionData.dynamicForm = { _id: value._id, title: value.title };
                callBack('send-addition-data-change', { newAddtionData, actionIndex });
              }}
              url={API_TEMPLATE_LIST}
              template={true}
              value={action && action.additionData && action.additionData.dynamicForm}
            />
            {/* <TextValidator
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              onChange={event => {
                newAddtionData.dynamicForm = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              select
              value={action.mappingData.dynamicForm}
              label="Biểu mẫu *"
              variant="outlined"
              fullWidth
              margin="dense"
            >
              {Array.isArray(listDynamicForms) &&
                listDynamicForms.map(form => (
                  <MenuItem key={form._id} value={form._id}>
                    {form.title}
                  </MenuItem>
                ))}
            </TextValidator> */}
          </Grid>
          {/* <Grid item sm={12}>
            <CircleSelect
              value={action.mappingData.timeCircle}
              onChange={value => {
                newAddtionData.timeCircle = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
            />
          </Grid> */}
        </Grid>
      );
      break;

    case 'approve': {
      fieldCode = (
        <Grid container>
          <Grid item sm={12}>
            <TextValidator
              validators={['required', 'whiteSpace']}
              errorMessages={['Trường bắt buộc', 'Không được nhập dấu space']}
              onChange={event => {
                newAddtionData.approveName = event.target.value;

                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action && action.mappingData && action.mappingData.approveName}
              label="Tên yêu cầu phê duyệt *"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item sm={12}>
            <TextValidator
              validators={['required', 'whiteSpace']}
              errorMessages={['Trường bắt buộc', 'Không được nhập dấu space']}
              onChange={event => {
                newAddtionData.subCode = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action && action.mappingData && action.mappingData.subCode}
              label="Quy trình *"
              variant="outlined"
              fullWidth
              margin="dense"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item sm={12}>
            <TextValidator
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              onChange={event => {
                newAddtionData.approveGroup = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              select
              value={action && action.mappingData && action.mappingData.approveGroup}
              label="Nhóm phê duyệt *"
              variant="outlined"
              fullWidth
              margin="dense"
              InputLabelProps={{
                shrink: true,
              }}
            >
              {listApproveGroup
                ? listApproveGroup.map(form => (
                  <MenuItem key={form._id} value={form._id}>
                    {form.name}
                  </MenuItem>
                ))
                : ''}
            </TextValidator>
          </Grid>
          <Grid item sm={12}>
            {/* <TextValidator
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              onChange={event => {
                newAddtionData.dynamicForm = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              select
              value={action.mappingData.dynamicForm}
              label="Biểu mẫu *"
              variant="outlined"
              fullWidth
              margin="dense"
            >
              {Array.isArray(listDynamicForms) &&
                listDynamicForms.map(form => (
                  <MenuItem key={form._id} value={form._id}>
                    {form.title}
                  </MenuItem>
                ))}
            </TextValidator> */}
            <AsyncAutocomplete
              label="Biểu mẫu *"
              // isMulti
              onChange={value => {
                newAddtionData.dynamicForm = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              url={API_TEMPLATE_LIST}
              template={true}
              value={action && action.mappingData && action.mappingData.dynamicForm}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item sm={12}>
            {/* <TextValidator
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              onChange={event => {
                newAddtionData.convertMapping = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              select
              value={action.mappingData.convertMapping}
              label="Kiểu chuyển đổi dữ liệu *"
              variant="outlined"
              fullWidth
              margin="dense"
            >
              {listMappingConvert
                ? listMappingConvert.map(form => (
                    <MenuItem key={form._id} value={form._id}>
                      {form.name}
                    </MenuItem>
                  ))
                : ''}
            </TextValidator> */}
          </Grid>
          <Grid item sm={12}>
            <CircleSelect
              value={action && action.mappingData && action.mappingData.timeCircle}
              onChange={value => {
                newAddtionData.timeCircle = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
            />
          </Grid>
        </Grid>
      );
      break;
    }
    case 'notice': {
      newAddtionData = Object.assign({}, action.additionData);
      action.methodType = 'notice';
      fieldCode = (
        <Grid container>
          <Grid item sm={12}>
            <TextValidator
              validators={['required', 'whiteSpace']}
              errorMessages={['Trường bắt buộc', 'Subject không hợp lệ']}
              onChange={event => {
                newAddtionData.noticeTitle = event.target.value;

                callBack('notice-addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action && action.additionData && action.additionData.noticeTitle}
              label="Nội dung thông báo *"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item sm={12}>
            <AsyncAutocomplete
              isMulti
              onChange={value => {
                newAddtionData.toNotice = value;
                callBack('notice-addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action && action.additionData && action.additionData.toNotice}
              url={API_USERS}
            />
            <TextValidator
              onChange={event => {
                newAddtionData.fieldItem = event.target.value;
                callBack('notice-addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action && action.additionData && action.additionData.fieldItem}
              label="Các trường trong module"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item sm={12}>
            <CircleSelect
              value={action && action.additionData && action.additionData.timeCircle}
              onChange={value => {
                newAddtionData.timeCircle = value;
                callBack('notice-addition-data-change', { newAddtionData, actionIndex });
              }}
            />
          </Grid>
        </Grid>
      );
      break;
    }
    case 'task': {
      fieldCode = (
        <Grid style={{ paddingBottom: 20 }} container>
          <Grid item sm={12}>
            <TextValidator
              validators={['whiteSpace', 'minStringLength:5']}
              errorMessages={['Tên công việc dự án không hợp lệ', 'Tên công việc dự án ít nhất 5 ký tự']}
              onChange={event => {
                newAddtionData.taskName = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.taskName}
              label="Tên công việc án *"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item sm={12}>
            <AsyncAutocomplete
              isMulti
              label="Người tham gia"
              onChange={value => {
                newAddtionData.join = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.join}
              url={`${API_USERS}`}
            />
            <TextValidator
              onChange={event => {
                newAddtionData.startDate = event.target.value;

                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.startDate || new Date()}
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              label="Ngày bắt đầu"
              variant="outlined"
              fullWidth
              type="date"
              margin="dense"
            />
            <TextValidator
              onChange={event => {
                newAddtionData.endDate = event.target.value;

                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.endDate || new Date()}
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              label="Ngày kết thúc"
              variant="outlined"
              type="date"
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item sm={12}>
            <CircleSelect
              disabled={hasCondition}
              value={action.mappingData.timeCircle}
              onChange={value => {
                newAddtionData.timeCircle = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
            />
          </Grid>
        </Grid>
      );
      break;
    }
    case 'field': {
      fieldCode = (
        <Grid container>
          <Grid item sm={12}>
            <AsyncAutocomplete
              label="loại field"
              onChange={value => {
                newAddtionData.fieldId = value;
                setState({
                  error: {},
                });
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.fieldId}
              url={API_FIELD}
              {...error.field && { error: true, helperText: error.field }}
            />
          </Grid>
          <Grid item sm={12} style={{ paddingBottom: 20 }}>
            <CircleSelect
              value={action.mappingData.timeCircle}
              onChange={value => {
                newAddtionData.timeCircle = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
            />
          </Grid>
        </Grid>
      );
      break;
    }
    case 'create': {
      // console.log(11111, newAddtionData);
      fieldCode = (
        <Grid style={{ paddingBottom: 20 }} container>
          <Grid item sm={12}>
            {/* <TextValidator
              validators={['whiteSpace', 'minStringLength:5']}
              errorMessages={['Tên công việc dự án không hợp lệ', 'Tên công việc dự án ít nhất 5 ký tự']}
              onChange={event => {
                newAddtionData.name = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.name}
              label="Tên công việc dự án*"
              variant="outlined"
              fullWidth
              margin="dense"
            /> */}
          </Grid>
          <Grid item sm={12}>
            <TextValidator
              style={{ margin: '10px 0', width: '100%' }}
              id="outlined-select-currency"
              fullWidth
              select
              label="Module"
              value={newAddtionData.module}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event => {
                newAddtionData.module = event.target.value;

                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              variant="outlined"
            >
              {listModule.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.title}
                </MenuItem>
              ))}
            </TextValidator>
          </Grid>
          <Grid item sm={12}>
            {newAddtionData.module ? (
              <Bus path={newAddtionData.module} callBack={callBack} newAddtionData={newAddtionData} actionIndex={actionIndex} />
            ) : null}

            {/* <AsyncAutocomplete
              isMulti
              label="Người tham gia"
              onChange={value => {
                newAddtionData.taskManager = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.taskManager}
              url={API_USERS}
            />
            <TextValidator
              onChange={event => {
                newAddtionData.startDate = event.target.value;

                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.startDate || new Date()}
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              label="Ngày bắt đầu"
              variant="outlined"
              fullWidth
              type="date"
              margin="dense"
            /> */}
            {/* <TextValidator
              onChange={event => {
                newAddtionData.endDate = event.target.value;

                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.endDate || new Date()}
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              label="Ngày kết thúc"
              variant="outlined"
              type="date"
              fullWidth
              margin="dense"
            /> */}
          </Grid>
          <Grid item sm={12}>
            {/* <CircleSelect
              disabled={hasCondition}
              value={action.mappingData.timeCircle}
              onChange={value => {
                newAddtionData.timeCircle = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
            /> */}
          </Grid>
        </Grid>
      );
      break;
    }

    case 'update': {
      // console.log(11111, newAddtionData);
      fieldCode = (
        <Grid style={{ paddingBottom: 20 }} container>
          <Grid item sm={12}>
            {/* <TextValidator
              validators={['whiteSpace', 'minStringLength:5']}
              errorMessages={['Tên công việc dự án không hợp lệ', 'Tên công việc dự án ít nhất 5 ký tự']}
              onChange={event => {
                newAddtionData.name = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.name}
              label="Tên công việc dự án*"
              variant="outlined"
              fullWidth
              margin="dense"
            /> */}
          </Grid>
          <Grid item sm={12}>
            <TextValidator
              style={{ margin: '10px 0', width: '100%' }}
              id="outlined-select-currency"
              fullWidth
              select
              label="Module"
              value={newAddtionData.module}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event => {
                newAddtionData.module = event.target.value;

                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              variant="outlined"
            >
              {listModule.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.title}
                </MenuItem>
              ))}
            </TextValidator>
          </Grid>
          <Grid item sm={12}>
            {newAddtionData.module === 'BusinessOpportunities' || newAddtionData.module === 'Task' || newAddtionData.module === 'Bill' ? (
              <Bus1 path={newAddtionData.module} callBack={callBack} newAddtionData={newAddtionData} actionIndex={actionIndex} />
            ) : null}

            {/* <AsyncAutocomplete
              isMulti
              label="Người tham gia"
              onChange={value => {
                newAddtionData.taskManager = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.taskManager}
              url={API_USERS}
            />
            <TextValidator
              onChange={event => {
                newAddtionData.startDate = event.target.value;

                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.startDate || new Date()}
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              label="Ngày bắt đầu"
              variant="outlined"
              fullWidth
              type="date"
              margin="dense"
            /> */}
            {/* <TextValidator
              onChange={event => {
                newAddtionData.endDate = event.target.value;

                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.mappingData.endDate || new Date()}
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              label="Ngày kết thúc"
              variant="outlined"
              type="date"
              fullWidth
              margin="dense"
            /> */}
          </Grid>
          <Grid item sm={12}>
            {/* <CircleSelect
              disabled={hasCondition}
              value={action.mappingData.timeCircle}
              onChange={value => {
                newAddtionData.timeCircle = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
            /> */}
          </Grid>
        </Grid>
      );
      break;
    }

    default:
      break;
  }
  return fieldCode;
};
