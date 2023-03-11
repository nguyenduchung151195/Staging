/* eslint-disable no-lonely-if */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  Checkbox,
  InputLabel,
  Radio,
  ListItem,
  // ListItemAvatar,
  ListItemText,
  Avatar,
  OutlinedInput,
  FormControl,
  Typography,
} from '@material-ui/core';
// import { Link } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { Add } from '@material-ui/icons';
import dot from 'dot-object';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { components } from 'react-select';
import { serialize, getLabelName } from '../../utils/common';
import TextFieldCode from '../TextFieldCode';
import { API_USERS, API_SUPPLIERS, API_CUSTOMERS } from '../../config/urlConfig';
import CustomInputBase from '../Input/CustomInputBase';
import CustomDatePicker from 'components/CustomDatePicker';
import moment from 'moment';
import './styles.css';

let people = null;

const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
  {
    value: 'VNĐ',
    label: 'VNĐ',
  },
];
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
export const renderNewFieldContent = (state, callBack) => {
  let fieldCode;
  const { newFieldConfig, generalData } = state;
  switch (newFieldConfig.type) {
    case 'String':
      fieldCode = (
        <div>
          <TextField
            variant="outlined"
            margin="normal"
            id="name"
            label="Nội dung"
            value={generalData[`others.${newFieldConfig.name}`]}
            onChange={event => {
              const { generalData } = state;
              generalData[`others.${newFieldConfig.name}`] = event.target.value;
              callBack('custom-field-input-change', generalData);
            }}
            fullWidth
          />
        </div>
      );
      break;
    case 'Money':
      {
        let amount = 0;
        let currencyUnit = '';
        if (generalData[`others.${newFieldConfig.name}`]) {
          amount = generalData[`others.${newFieldConfig.name}`].replace(/[^\d.-]/g, '');
          currencyUnit =
            currencies &&
            currencies[currencies.findIndex(d => d.label === generalData[`others.${newFieldConfig.name}`].replace(amount, ''))] &&
            currencies[currencies.findIndex(d => d.label === generalData[`others.${newFieldConfig.name}`].replace(amount, ''))].value;
        }

        fieldCode = (
          <Grid container justify="center" alignItems="center" className="my-2">
            <Grid item sm={8}>
              <TextField
                variant="outlined"
                label="Số tiền"
                value={amount}
                onChange={event => {
                  const labelOfCurrency =
                    currencies &&
                    currencies[currencies.findIndex(d => d.value === currencyUnit)] &&
                    currencies[currencies.findIndex(d => d.value === currencyUnit)].label;
                  generalData[`others.${newFieldConfig.name}`] = event.target.value + labelOfCurrency;
                  callBack('custom-field-input-change', generalData);
                }}
                id="formatted-numberformat-input"
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
            </Grid>
            <Grid item sm={1} />
            <Grid item sm={3}>
              <TextField
                variant="outlined"
                fullWidth
                id="standard-select-currency"
                select
                label="Đơn vị"
                value={currencyUnit}
                onChange={event => {
                  const newCurrency = event.target.value;
                  generalData[`others.${newFieldConfig.name}`] = amount + currencies[currencies.findIndex(d => d.value === newCurrency)].label;
                  callBack('custom-field-input-change', generalData);
                }}
              >
                {currencies.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );
      }

      break;
    case 'Source': {
      const listSources = JSON.parse(localStorage.getItem('crmSource'));
      const currentSource = listSources[listSources.findIndex(d => d._id === newFieldConfig.fromSource)];

      if (newFieldConfig.fromSource !== '') {
        let convertedSelected = [];
        if (generalData[`others.${newFieldConfig.name}`]) {
          convertedSelected = generalData[`others.${newFieldConfig.name}`].split(', ');
        }
        fieldCode = (
          <div>
            <InputLabel htmlFor="select-multiple-checkbox">List</InputLabel>
            <Select
              variant="outlined"
              fullWidth
              multiple
              value={convertedSelected}
              input={<OutlinedInput id="select-multiple-checkbox" />}
              renderValue={selected => selected.join(', ')}
            >
              {currentSource.data.map(element => (
                <MenuItem key={element.value} value={element.value}>
                  <Checkbox
                    onChange={event => {
                      if (event.target.checked) {
                        convertedSelected.push(element.title);
                      } else {
                        convertedSelected.splice(convertedSelected.indexOf(element.title), 1);
                      }
                      generalData[`others.${newFieldConfig.name}`] = convertedSelected.join(', ');

                      callBack('custom-field-input-change', generalData);
                    }}
                    checked={
                      generalData[`others.${newFieldConfig.name}`] ? generalData[`others.${newFieldConfig.name}`].indexOf(element.title) > -1 : false
                    }
                  />
                  <ListItemText primary={element.title} />
                </MenuItem>
              ))}
            </Select>
          </div>
        );
      }

      break;
    }

    case 'Date':
      fieldCode = (
        <div className="picker mt-3 text-center">
          <TextField
            type="Date"
            keyboard
            clearable
            variant="outlined"
            label="Chọn ngày"
            InputLabelProps={{ shrink: true }}
            value={generalData[`others.${newFieldConfig.name}`]}
            onChange={event => {
              generalData[`others.${newFieldConfig.name}`] = event.target.value;
              callBack('custom-field-input-change', generalData);
            }}
          />
        </div>
      );
      break;
    case 'Number':
      fieldCode = (
        <TextField
          variant="outlined"
          id="standard-number"
          label="Number"
          value={generalData[`others.${newFieldConfig.name}`]}
          onChange={event => {
            generalData[`others.${newFieldConfig.name}`] = event.target.value;
            callBack('custom-field-input-change', generalData);
          }}
          fullWidth
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
      );
      break;
    case 'Link':
      fieldCode = (
        <TextField
          variant="outlined"
          margin="normal"
          id="name"
          label="Đường dẫn"
          value={generalData[`others.${newFieldConfig.name}`]}
          onChange={event => {
            generalData[`others.${newFieldConfig.name}`] = event.target.value;
            callBack('custom-field-input-change', generalData);
          }}
          fullWidth
        />
      );
      break;
    // case 6:
    //   fieldCode = <DropzoneArea filesLimit={12} showFileNamesInPreview showAlerts={false} onChange={files => {}} />;
    //   break;
    case 7:
      fieldCode = (
        <Grid container justify="center" alignItems="center">
          <Grid item sm={6}>
            <Radio
              checked={this.newFieldData.radio ? this.newFieldData.radio === 'yes' : true}
              onChange={event => {
                this.newFieldData.radio = event.target.value;
              }}
              value="yes"
              name="radio-button-demo"
              aria-label="A"
            />
            <span>Có</span>
          </Grid>
          <Grid item sm={6}>
            <Radio
              checked={this.newFieldData.radio ? this.newFieldData.radio !== 'yes' : false}
              onChange={event => {
                this.newFieldData.radio = event.target.value;
              }}
              value="no"
              name="radio-button-demo"
              aria-label="A"
            />
            <span>Không</span>
          </Grid>
        </Grid>
      );
      break;

    default:
      break;
  }
  return fieldCode;
};

export const renderFieldByType = (row, generalData, callBack, currency, classes, isTrading, localMessages) => {
  let fieldCode;
  // const { generalData } = state;
  switch (row.type) {
    case 'String':
      if (row.name === 'kanbanStatus' || row.name === 'state') {
        fieldCode = '';
      } else if (row.name === 'crmStatus') {
        fieldCode = '';
      } else {
        let code = 1;
        if (window.location.pathname === '/crm/BusinessOpportunities') {
          code = 1;
        }
        if (window.location.pathname === '/crm/ExchangingAgreement') {
          code = 2;
        }
        // if (row.name === 'code' && !generalData[row.name]) {
        //   generalData[row.name] = firstCode;
        //   callBack('custom-field-input-change', generalData);
        // }
        fieldCode = (
          <div className="my-2">
            {/* <p style={{ display: row.checked ? 'intiial' : 'none' }} className="font-weight-bold mb-1">
              {row.title}
            </p> */}
            {row.name === 'code' ? (
              <TextFieldCode
                code={code}
                value={generalData[row.name]}
                // value={row.name == 'code' ? generalData[row.name] || firstCode : generalData[row.name]}
                // defaultValue = {row.name=='code'?firstCode:''}
                onChange={event => {
                  generalData[row.name] = event.target.value;
                  callBack('custom-field-input-change', generalData);
                }}
                style={{ display: row.checked ? 'intiial' : 'none' }}
                disabled={row.name === 'code'}
                className="my-0"
                fullWidth
                label={row.title}
                checkedShowForm={row.checkedShowForm}
                required={row.checkedRequireForm}
                error={localMessages[`${row.name}`]}
                helperText={localMessages[`${row.name}`]}
              />
            ) : (
              <CustomInputBase
                value={generalData[row.name]}
                // value={row.name=='code'?generalData[row.name]||firstCode:generalData[row.name]}
                // defaultValue = {row.name=='code'?firstCode:''}
                onChange={event => {
                  generalData[row.name] = event.target.value;
                  callBack('custom-field-input-change', generalData);
                }}
                disabled={row.name === 'code'}
                className="my-0"
                fullWidth
                label={row.title}
                checkedShowForm={row.checkedShowForm}
                required={row.checkedRequireForm}
                error={localMessages[`${row.name}`]}
                helperText={localMessages[`${row.name}`]}
              />
            )}
          </div>
        );
      }

      break;

    case 'Money': {
      let amount = 0;
      let currencyUnit = currency ? (currency.length > 0 ? currency[0].name : '') : '';
      // let title = '';
      if (!row.name.includes('others')) {
        amount = generalData[`${row.name}.amount`];
        currencyUnit = generalData[`${row.name}.currencyUnit`]
          ? generalData[`${row.name}.currencyUnit`]
          : currency
            ? currency.length > 0
              ? 0
              : ''
            : '';

        // title = 'Giá trị';
      } else {
        if (generalData[row.name]) {
          amount = generalData[row.name].replace(/[^\d.-]/g, '');
          currencyUnit =
            currency &&
            currency[currency.findIndex(d => d.name === generalData[row.name].replace(amount, ''))] &&
            currency[currency.findIndex(d => d.name === generalData[row.name].replace(amount, ''))].value;
        }

        // title = row.title;
      }
      fieldCode = (
        <Grid container justify="center" alignItems="center" spacing={8}>
          {/* <Grid item sm={12}>
            <p className="font-weight-bold mb-1">{title}</p>
          </Grid> */}
          <Grid item sm={8}>
            <CustomInputBase
              fullWidth
              // label={getLabelName('value.amount', `${isTrading ? 'ExchangingAgreement' : 'BusinessOpportunities'}`)}
              value={amount}
              onChange={event => {
                if (!row.name.includes('others')) {
                  generalData[`${row.name}.amount`] = event.target.value;
                } else {
                  const newAmount = event.target.value;
                  generalData[row.name] =
                    newAmount + currency[currency.findIndex(d => d.name === currencyUnit)] &&
                    currency[currency.findIndex(d => d.name === currencyUnit)].name;
                }
                callBack('custom-field-input-change', generalData);
              }}
              id="formatted-numberformat-input"
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
              label={row.title}
              checkedShowForm={row.checkedShowForm}
              required={row.checkedRequireForm}
              error={localMessages['value.amount']}
            // helperText={localMessages["value.amount"]}
            />
          </Grid>
          <Grid item sm={4}>
            <CustomInputBase
              id="standard-select-currency"
              select
              // label={getLabelName('value.currencyUnit', `${isTrading ? 'ExchangingAgreement' : 'BusinessOpportunities'}`)}
              label={row.label || row.title}
              checkedShowForm={row.checkedShowForm}
              required={row.checkedRequireForm}
              error={localMessages['value.currencyUnit']}
              // helperText={localMessages["value.amount"]}
              value={currencyUnit}
              onChange={event => {
                if (!row.name.includes('others')) {
                  generalData[`${row.name}.currencyUnit`] = event.target.value;
                } else {
                  const newCurrency = event.target.value;
                  generalData[row.name] = amount + newCurrency;
                }
                callBack('custom-field-input-change', generalData);
              }}
            >
              <MenuItem disabled value={0}>
                ---- Chọn ----
              </MenuItem>
              {currency && currency.length > 0
                ? currency.map(option => (
                  <MenuItem key={option._id} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))
                : ''}
            </CustomInputBase>
          </Grid>
          <Grid item xs={12}>
            {localMessages['value.amount'] ? (
              <Typography color="error">{localMessages['value.amount']}</Typography>
            ) : localMessages['value.currencyUnit'] ? (
              <Typography color="error">{localMessages['value.currencyUnit']}</Typography>
            ) : (
              ''
            )}
          </Grid>
        </Grid>
      );
      break;
    }
    case 'People': {
      console.log('vao');
      let title = '';
      // eslint-disable-next-line no-unused-vars
      let route = '';
      if (row.name === 'customer') {
        title = 'Khách hàng';

        route = `/crm/customer/${generalData[`${row.name}.customerId`]}`;
      }
      if (row.name === 'responsibilityPerson') {
        title = 'Người chịu trách nhiệm';
        route = `/employee/${generalData[`${row.name}.employeeId`]}`;
      }
      if (row.name === 'supervisor') {
        title = 'Người giám sát';
        route = `/employee/${generalData[`${row.name}.employeeId`]}`;
      }
      fieldCode =
        row.name !== 'contactCenter' && row.name !== 'businessOpportunities' ? (
          <div className="my-2">
            <Typography color={localMessages['customer.name'] ? 'secondary' : ''}>
              {row.checkedShowForm ? getLabelName(`${row.name}.name`, `${isTrading ? 'ExchangingAgreement' : 'BusinessOpportunities'}`) : ''}{' '}
              {row.checkedRequireForm ? '*' : ''}
            </Typography>
            {row.checkedShowForm ? (
              generalData[`${row.name}.name`] ? (
                <ListItem
                  button
                  color="primary"
                  onClick={() => {
                    console.log('vao1');
                    callBack('view-people-detail', row.name);
                  }}
                >
                  {/* <ListItemAvatar>
                  <Avatar alt="Remy Sharp">
                    <i className="far fa-user" />
                  </Avatar>
                </ListItemAvatar> */}
                  {/* {console.log(row)} */}
                  {/* <Link to={route}> */}
                  <ListItemText primary={generalData[`${row.name}.name`]} />
                  {/* </Link> */}
                </ListItem>
              ) : (
                <React.Fragment>
                  <Button
                    variant="outlined"
                    color={!row.checkedRequireForm ? 'primary' : 'secondary'}
                    onClick={() => {
                      callBack('open-find-people', row.name);
                    console.log('vao2');

                      // this.setState({ openHOCFindPeopleDialog: true, peopleType: 'customer' });
                    }}
                  >
                    <Add /> {`Thêm ${title}`}
                  </Button>
                  {localMessages['customer.name'] ? (
                    <Typography color="error">{localMessages['customer.name'] ? localMessages['customer.name'] : ''}</Typography>
                  ) : (
                    ''
                  )}
                </React.Fragment>
              )
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        );
      break;
    }
    case 'People Array': {

      let classCustom = 3;
      const convertData = dot.object(Object.assign({}, generalData));
      // let title = '';
      // eslint-disable-next-line no-unused-vars
      let route = '';
      if (row.name === 'responsibilityPerson') {
        // title = 'Người chịu trách nhiệm';
        classCustom = 0;
        route = `/employee/${generalData[`${row.name}.employeeId`]}`;
      }
      if (row.name === 'supervisor') {
        // title = 'Người giám sát';
        classCustom = 1;
        route = `/employee/${generalData[`${row.name}.employeeId`]}`;
      }
      const dataWithLabel =
        convertData[row.name].length > 0 ? convertData[row.name].map(item => ({ ...item, label: item.name, value: item.employeeId })) : [];
      // console.log(generalData[row.name]);
      const style = {
        control: base => ({
          ...base,
          '&:hover': { borderColor: 'red' },
          '&:focus': { borderColor: 'red' },
          borderColor: 'red',
          boxShadow: 'none',
        }),
      };
      fieldCode =
        row.name !== 'contactCenter' ? (
          row.checkedShowForm ? (
            <div className="my-2">
              <p
                // className="font-weight-bold mb-1"
                style={{ color: localMessages[`${row.name}`] ? 'red' : '' }}
              >
                {getLabelName(`${row.name}`, `${isTrading ? 'ExchangingAgreement' : 'BusinessOpportunities'}`)}
              </p>
              <AsyncSelect
                className={`AsyncSelect${classCustom}`}
                //  style={{ zIndex: 999 }}
                onChange={selectedOption => {
                  callBack('select-people', selectedOption, row.name);
                }}
                placeholder="Tìm kiếm ..."
                components={{
                  Option: ({ children, ...props }) => (
                    <components.Option {...props}>
                      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Avatar src={`${props.data.avatar}?allowDefault=true`} />
                        <div style={{ marginTop: 10, marginLeft: 20 }}>{props.data.name}</div>
                      </div>
                    </components.Option>
                  ),
                  MultiValueLabel: props => (
                    <components.MultiValueLabel
                      {...props}
                      onClick={() => {
                        callBack('view-people-detail', props.data._id || props.data.employeeId);
                      }}
                    >
                      <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          callBack('view-people-detail', props.data.employeeId || props.data._id);
                        }}
                      >
                        {props.data.name}
                      </div>
                    </components.MultiValueLabel>
                  ),
                }}
                value={dataWithLabel}
                isMulti
                defaultOptions
                loadOptions={(inputValue, callback) => {
                  // clearTimeout(people);
                  // people = setTimeout(() => {
                  promiseOptions(inputValue, callback);
                  // }, 500);
                }}
                styles={localMessages[`${row.name}`] ? style : ''}
                theme={theme => ({
                  ...theme,
                  spacing: {
                    ...theme.spacing,
                    controlHeight: '50px',
                    zIndex: 999,
                  },
                })}
              />
            </div>
          ) : (
            ''
          )
        ) : (
          ''
        );
      break;
    }
    case 'Source': {
      const localStorageSource = JSON.parse(localStorage.getItem('crmSource'));
      let generalSource;
      if (!row.name.includes('others.')) {
        generalSource = localStorageSource[localStorageSource.findIndex(d => d.code === 'S06')];
      } else {
        // generalSource = localStorageSource[localStorageSource.findIndex(d => d.code === 'S06')];
        generalSource = localStorageSource[localStorageSource.findIndex(d => d._id === row.fromSource)];
      }

      let convertedSelected = [];

      if (generalData[row.name]) {
        convertedSelected = generalData[row.name].split(', ');
      }
      fieldCode = (
        <div>
          {/* <p className="font-weight-bold mb-1">{row.title}</p> */}
          <FormControl fullWidth variant="outlined">
            {/* <InputLabel id="demo-simple-select-label">{row.title}</InputLabel> */}
            <CustomInputBase
              label="NGUỒN"
              SelectProps={{
                multiple: true,
                // onChange: this.handleChangeInput,
                value: convertedSelected,
                // name: 'source',
                renderValue: selected => selected.join(', '),
              }}
              select
              required={row.checkedRequireForm}
              checkedShowForm={row.checkedShowForm}
              error={localMessages && localMessages.source}
              helperText={localMessages && localMessages.source}
            >
              {generalSource &&
                Array.isArray(generalSource.data) &&
                generalSource.data.map(element => (
                  <MenuItem key={element.index} value={element.value}>
                    <Checkbox
                      onChange={event => {
                        if (event.target.checked) {
                          convertedSelected.push(element.title);
                        } else {
                          convertedSelected.splice(convertedSelected.indexOf(element.title), 1);
                        }
                        generalData[row.name] = convertedSelected.join(', ');
                        // this.setState({ generalData });
                        callBack('custom-field-input-change', generalData);
                      }}
                      checked={generalData[row.name] ? generalData[row.name].indexOf(element.title) > -1 : false}
                    />
                    <ListItemText primary={element.title} />
                  </MenuItem>
                ))}
            </CustomInputBase>
            {/* <Select
              varian="outlined"
              fullWidth
              multiple
              value={convertedSelected}
              input={<OutlinedInput id="select-multiple-checkbox" />}
              renderValue={value => value.join(', ')}
            >
              {generalSource && Array.isArray(generalSource.data) && generalSource.data.map(element => (
                <MenuItem key={element.index} value={element.value}>
                  <Checkbox
                    onChange={event => {
                      if (event.target.checked) {
                        convertedSelected.push(element.title);
                      } else {
                        convertedSelected.splice(convertedSelected.indexOf(element.title), 1);
                      }
                      generalData[row.name] = convertedSelected.join(', ');
                      // this.setState({ generalData });
                      callBack('custom-field-input-change', generalData);
                    }}
                    checked={generalData[row.name] ? generalData[row.name].indexOf(element.title) > -1 : false}
                  />
                  <ListItemText primary={element.title} />
                </MenuItem>
              ))}
            </Select> */}
          </FormControl>
        </div>
      );
      break;
    }
    case 'Number':
      fieldCode = (
        <div className="">
          <p className="font-weight-bold mb-1">{row.title}</p>

          <TextField
            type="number"
            variant="outlined"
            margin="normal"
            value={generalData[row.name]}
            onChange={event => {
              generalData[row.name] = event.target.value;
              // this.setState({ generalData });
              callBack('custom-field-input-change', generalData);
            }}
            className="my-0"
            fullWidth
          />
        </div>
      );
      break;
    case 'Date':
      fieldCode = (
        <CustomDatePicker
          label={'Chọn ngày'}
          value={generalData[row.name] === null ? moment().format('YYYY-MM-DD') : generalData[row.name]}
          onChange={event => {
            generalData[row.name] = moment(event).format('YYYY-MM-DD');
            callBack('custom-field-input-change', generalData, null, true);
          }}
        />
      );
      break;
    case 'Link':
      fieldCode = (
        <div className="my-2">
          <p className="font-weight-bold mb-1">{row.title}</p>

          <TextField
            variant="outlined"
            margin="normal"
            value={generalData[row.name]}
            onChange={event => {
              generalData[row.name] = event.target.value;
              callBack('custom-field-input-change', generalData);
            }}
            className="my-0"
            fullWidth
          />
        </div>
      );
      break;
    case 'Avatar':
      // fieldCode = (
      //   <CustomInputBase type="file" label={row.name}
      //     value={generalData[row.name]}
      //     onChange={event => {
      //       generalData[row.name] = event.target.file[0];
      //       // callBack('custom-field-input-change', generalData);
      //     }}
      //   />
      // )
      break;
    default:
      break;
  }
  if (row.type.includes('Relation')) {
    const typeArr = row.type.split('|');
    const ref = JSON.parse(typeArr[1]);
    let api = '';
    if (String(ref.ref) === 'Employee') {
      api = API_USERS;
    }
    if (String(ref.ref) === 'Customer') {
      api = API_CUSTOMERS;
    }
    if (String(ref.ref) === 'Supplier') {
      api = API_SUPPLIERS;
    }
    const rowArr = row.name.split('.');
    const newRowName = `${rowArr[0]}.${rowArr[1]}`;
    const obj = dot.object(Object.assign({}, generalData));
    fieldCode = (
      <div className="my-2">
        <p className="font-weight-bold mb-1">{row.title}</p>
        <AsyncSelect
          // style={{ zIndex: 999 }}
          className={classes.reactSelect}
          placeholder="Tìm kiếm ..."
          loadOptions={(newValue, callback) => loadOptions(newValue, callback, api)}
          loadingMessage={() => 'Đang tải ...'}
          components={{
            Option: ({ children, ...props }) => (
              <components.Option {...props}>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ marginTop: 5 }}>
                    {props.data[ref.select] ? props.data[ref.select] : ''} ({props.data.name})
                  </div>
                </div>
              </components.Option>
            ),
            SingleValue: ({ children, ...props }) => (
              <components.SingleValue {...props}>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ marginTop: 5 }}>{props.data[ref.select] ? props.data[ref.select] : ''}</div>
                </div>
              </components.SingleValue>
            ),
          }}
          defaultOptions
          onChange={selected => {
            generalData[newRowName] = {
              [ref.select]: selected[ref.select] || '',
              objectId: selected._id,
            };
            // generalData[row.name] = selected[ref.select] || '';
            // generalData[`${newRowName}.objectId`] = selected._id;
            callBack('custom-field-input-change', generalData);
          }}
          value={obj.others[`${rowArr[1]}`]}
          theme={theme => ({
            ...theme,
            spacing: {
              ...theme.spacing,
              controlHeight: '55px',
              zIndex: 999,
            },
          })}
        />
      </div>
    );
  }

  return fieldCode;
};

const loadOptions = (newValue, callback, api) => {
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
          // avatar: item.avatar || item.logo,
        })),
      );
    });
};

const promiseOptions = (searchString, putBack) => {
  const param = {
    // limit: '10',
    skip: '0',
  };
  if (searchString !== '') {
    param.filter = {
      name: {
        $regex: searchString,
      },
    };
  }
  const token = localStorage.getItem('token');
  axios
    .get(`${API_USERS}?${serialize(param)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(myJson => {
      const { data } = myJson;
      putBack(
        data.data.map(item => ({
          ...item,
          value: item._id,
          label: item.name,
          avatar: item.avatar || item.logo,
        })),
      );
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
};
