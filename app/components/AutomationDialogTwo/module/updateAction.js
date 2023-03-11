import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  Button,
  IconButton,
  Grid,
  MenuItem,
  Card,
  CardContent,
  FormHelperText,
  TextField,
} from '@material-ui/core';
import TodayIcon from '@material-ui/icons/Today';
import { AsyncAutocomplete } from '../../LifetekUi';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { API_USERS, API_SUPPLIERS, API_CUSTOMERS, API_CRM_CAMPAIGN, API_TASK_CONTRACT_PROJECT } from '../../../config/urlConfig';
import CustomInputBase from '../../Input/CustomInputBase';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import { set } from 'dot-object';
import moment from 'moment';
import Tag from './tag';
function Bus(props) {
  const [name2Title, setName2Title] = useState([]);
  const [displayRows, setDisplayRows] = useState([]);
  // const [load]
  const [path, setPath] = useState(props.path)
  const [generalData, setGeneralData] = useState({ ...props.newAddtionData })
  const [params, setParams] = useState('');
  // console.log(11111, props.callBack);
  // console.log(99999, props.newAddtionData)
  // console.log(5555, props.actionIndex);
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
  if (path !== props.path) {
    setPath(props.path)
  }
  // const callback = (name, value) => {
  //           console.log('object');
  // }
  const addItem = code => {
    const dataRenderLocal = JSON.parse(localStorage.getItem('crmSource')) || null;
    const dataRender = dataRenderLocal ? dataRenderLocal.find(item => item.code === code) : null;
    if (dataRender) return dataRender.data.map(element => <MenuItem value={element.title}>{element.title}</MenuItem>);
    return null;
  };
  const handleChange = (params) => {
    setParams(params)
  }
  const handleGeneralData = (value) => {
    let data = {};
    if (params.type === 'Number') {
      if (value.type === 'Number') {
        data[`${params.name}`] = generalData[`${params.name}`] ? generalData[`${params.name}`] + '${dataUpdate.' + value.name + '}' : '${dataUpdate.' + value.name + '}';
        props.newAddtionData[`${params.name}`] = data[`${params.name}`];
        setGeneralData({ ...generalData, ...data });
        props.callBack('addition-data-change', { newAddtionData: props.newAddtionData, actionIndex: 0 });
      }
      else {
        alert('Chọn trường kiểu Số!')
      }
    }
    else if (params.type === 'Date') {
      if (value.type === 'Date') {
        data[`${params.name}`] = generalData[`${params.name}`] ? generalData[`${params.name}`] + '${dataUpdate.' + value.name + '}' : '${dataUpdate.' + value.name + '}';
        props.newAddtionData[`${params.name}`] = data[`${params.name}`];
        setGeneralData({ ...generalData, ...data });
        props.callBack('addition-data-change', { newAddtionData: props.newAddtionData, actionIndex: 0 });
      }
      else {
        alert('Chọn trường kiểu Ngày!')
      }
    }
    else {
      data[`${params.name}`] = generalData[`${params.name}`] ? generalData[`${params.name}`] + '${dataUpdate.' + value.name + '}' : '${dataUpdate.' + value.name + '}';
      props.newAddtionData[`${params.name}`] = data[`${params.name}`];
      setGeneralData({ ...generalData, ...data });
      props.callBack('addition-data-change', { newAddtionData: props.newAddtionData, actionIndex: 0 });
    }
  }
  useEffect(() => {
    setPath(props.path);
    const localStorageViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = localStorageViewConfig[localStorageViewConfig.findIndex(d => d.code === path)];
    const viewConfig = currentViewConfig.listDisplay.type.fields.type.columns;
    let displayRows = [];
    viewConfig.sort((a, b) => a.order - b.order).forEach(element => {
      if (element.checkedShowForm || element.name === 'code') {
        if (element.name.includes('.') && !element.name.includes('others')) {
          const groupName = element.name.substring(0, element.name.indexOf('.'));
          if (displayRows.findIndex(d => d.name === groupName) === -1) {
            if (element.name.includes('value')) {
              displayRows.push({ ...element, ...{ name: groupName, type: 'Money' } });
            } else if (element.name === 'customer.name') {
              displayRows.push({ ...element, ...{ name: groupName, type: 'People' } });
            }
          }
        } else {
          displayRows.push(element);
        }
      }
    });
    // console.log(11111, displayRows);
    setDisplayRows(displayRows);
  }, [path])

  return (
    <Grid container>
      <Grid xs item={6}>
        <Tag params={params} handleGeneralData={(params) => handleGeneralData(params)} />
      </Grid>
      <Grid xs item={6}>
        <div>
          <AsyncAutocomplete
            // isDisabled={!roleListEdit}
            // isMulti
            name='documentId'
            label="BẢN GHI MUỐN THAY ĐỔI"
            // error={localMessages && localMessages.owner}
            // helperText={localMessages && localMessages.owner}
            url={API_TASK_CONTRACT_PROJECT}
            onChange={e => {
              console.log(6666, e);
              let data = {};
              data[`documentId`] = e;
              props.newAddtionData[`documentId`] = e;
              setGeneralData({ ...generalData, ...data });
              props.callBack('addition-data-change', { newAddtionData: props.newAddtionData, actionIndex: 0 });
            }}
            value={generalData[`documentId`]}
          // filter={filter}
          />
          {/* <CustomInputBase
            label="BẢN GHI MUỐN THAY ĐỔI"
            type='String'
            onChange={e => {
              let data = {};
              data[`documentId`] = e.target.value;
              props.newAddtionData[`documentId`] = e.target.value;
              setGeneralData({ ...generalData, ...data });
              props.callBack('addition-data-change', { newAddtionData: props.newAddtionData, actionIndex: 0 });
            }}
            name='documentId'
            value={generalData[`documentId`]}
            onClick={() =>
              handleChange('documentId')
            }
          /> */}
          {displayRows.filter(item => item.name !== 'typeOfCustomer').map((row, index) => {
            if (row.type === 'String' && row.name !== 'code') {
              return (
                <CustomInputBase
                  // error={(localMessages && localMessages.name) || this.state.name === ''}
                  required={row && row.checkedRequireForm}
                  checkedShowForm={row && row.checkedShowForm}
                  label={row && row.title}
                  type={row && row.type}
                  // onChange={this.handleChangeName('name')}
                  onChange={e => {
                    let data = {};
                    data[`${row.name}`] = e.target.value;
                    props.newAddtionData[`${row.name}`] = e.target.value;

                    setGeneralData({ ...generalData, ...data });
                    props.callBack('addition-data-change', { newAddtionData: props.newAddtionData, actionIndex: 0 });
                  }}
                  name={row && row.name}
                  value={generalData[`${row.name}`]}
                  onClick={() =>
                    handleChange(row)
                  }

                />)
            }
            if (row.type === 'Number') {
              return (
                <>
                  <CustomInputBase
                    // error={(localMessages && localMessages.name) || this.state.name === ''}
                    required={row && row.checkedRequireForm}
                    checkedShowForm={row && row.checkedShowForm}
                    label={row && row.title}
                    type="String"
                    // onChange={this.handleChangeName('name')}
                    onChange={e => {
                      // console.log(123);
                      let data = {};
                      data[`${row.name}`] = e.target.value;
                      props.newAddtionData[`${row.name}`] = e.target.value;
                      setGeneralData({ ...generalData, ...data });
                      props.callBack('addition-data-change', { newAddtionData: props.newAddtionData, actionIndex: 0 });
                    }}
                    name={row && row.name}
                    value={generalData[`${row.name}`]}
                    onClick={() =>
                      handleChange(row)
                    }

                  />
                </>)
            }
            if (row.type === 'Date') {
              return (
                <Grid container>

                  <Grid item xs='10'>
                    <CustomInputBase
                      // error={(localMessages && localMessages.name) || this.state.name === ''}
                      required={row && row.checkedRequireForm}
                      checkedShowForm={row && row.checkedShowForm}
                      label={row && row.title}
                      type='String'
                      onChange={e => {
                        let data = {};
                        data[`${row.name}`] = e.target.value;
                        props.newAddtionData[`${row.name}`] = e.target.value;
                        setGeneralData({ ...generalData, ...data });
                        props.callBack('addition-data-change', { newAddtionData: props.newAddtionData, actionIndex: 0 });
                      }}
                      name={row && row.name}
                      value={generalData[`${row.name}`]}
                      onClick={() => {
                        handleChange(row)
                      }
                      }
                    />
                  </Grid>
                  <Grid item xs='1'>
                    <DatePicker
                      invalidLabel="DD/MM/YYYY"
                      format="DD/MM/YYYY"
                      checkedShowForm={row && row.checkedShowForm}
                      required={row && row.checkedRequireForm}
                      // value={generalData[`${row.name}`]}
                      margin="dense"
                      InputLabelProps={{ shrink: true }}
                      onChange={e => {
                        let data = {};
                        data[`${row.name}`] = moment(e).format('DD-MM-YYYY');
                        setGeneralData({ ...generalData, ...data })
                        props.newAddtionData[`${row.name}`] = e;
                        props.callBack('addition-data-change', { newAddtionData: props.newAddtionData, actionIndex: 0 });
                      }}
                      style={{
                        width: 0,
                        marginTop: '18px'
                      }}
                      keyboard
                      fullWidth
                      disableOpenOnEnter
                      keyboardIcon={<TodayIcon style={{ width: '100%' }} />}
                    />
                  </Grid>
                </Grid>)
            }
            if (row.type.indexOf('Source') !== -1 && row.name !== 'kanbanStatus') {
              return (
                <CustomInputBase

                  label={row.title}
                  // error={localMessages && localMessages.channel}
                  // helperText={localMessages && localMessages.channel}
                  type={row.type}
                  value={generalData[`${row.name}`]}
                  displayEmpty
                  name={row.name}
                  select
                  onChange={e => {
                    let data = {};
                    data[`${row.name}`] = e.target.value;
                    setGeneralData({ ...generalData, ...data })
                    props.newAddtionData[`${row.name}`] = e.target.value;
                    props.callBack('addition-data-change', { newAddtionData: props.newAddtionData, actionIndex: 0 });
                  }}
                >
                  {addItem(row.configCode)}
                </CustomInputBase>
              )
            }
            if (row.type === 'Boolean') {

              return (
                <div style={{ margin: '10px 0' }}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="standard-select-currency"
                    select
                    label={row.title}
                    value={generalData[`${row.name}`] ? true : false}
                    onChange={e => {
                      let data = {};
                      data[`${row.name}`] = e.target.value;
                      setGeneralData({ ...generalData, ...data })
                      props.newAddtionData[`${row.name}`] = e.target.value;
                      props.callBack('addition-data-change', { newAddtionData: props.newAddtionData, actionIndex: 0 });
                    }}
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem key="true" value={true}>
                      True
                    </MenuItem>
                    <MenuItem key="false" value={false}>
                      False
                    </MenuItem>
                  </TextField>
                </div>
              )
            }
            if (row.type === 'Money') {
              return (<Grid container justify="center" alignItems="center" spacing={8}>

                <Grid item sm={8}>
                  <CustomInputBase
                    fullWidth
                    // ty

                    value={generalData[`${row.name}`]}
                    //     onChange={event => {
                    //       if (!row.name.includes('others')) {
                    //         generalData[`${row.name}.amount`] = event.target.value;
                    //       } else {
                    //         const newAmount = event.target.value;
                    //         // generalData[row.name] = newAmount + currency[currency.findIndex(d => d.name === currencyUnit)].name;
                    //         generalData[row.name] = newAmount + currency[currency.findIndex(d => d.name === currencyUnit)];
                    //       }
                    //       callBack('custom-field-input-change', generalData);
                    //     }}
                    id="formatted-numberformat-input"
                    //     InputProps={{
                    //       inputComponent: NumberFormatCustom,
                    //     }}
                    onChange={(e) => {
                      let data = {};
                      data[`${row.name}`] = e.target.value;
                      setGeneralData({ ...generalData, ...data })
                      props.newAddtionData[`${row.name}`] = e.target.value;
                      props.callBack('addition-data-change', { newAddtionData: props.newAddtionData, actionIndex: 0 });
                    }}
                    type="Number"
                    label={row.title}
                    checkedShowForm={row.checkedShowForm}
                    required={row.checkedRequireForm}
                  //     error={localMessages['value.amount']}
                  //     onKeyDown={blockStringSpecial}
                  // helperText={localMessages["value.amount"]}
                  />
                </Grid>
                <Grid item sm={4}>
                  <CustomInputBase
                    id="standard-select-currency"
                    select
                    // label={getLabelName('value.currencyUnit', `${isTrading ? 'ExchangingAgreement' : 'BusinessOpportunities'}`)}
                    label={row.title}
                    checkedShowForm={row.checkedShowForm}
                    required={row.checkedRequireForm}
                    value={generalData[`currencies`]}
                    onChange={e => {
                      let data = {};
                      data[`currencies`] = e.target.value;
                      setGeneralData({ ...generalData, ...data })
                      props.newAddtionData[`currencies`] = e.target.value;
                      props.callBack('addition-data-change', { newAddtionData: props.newAddtionData, actionIndex: 0 });


                    }}
                  >
                    <MenuItem disabled value={0}>
                      ---- Chọn ----
                    </MenuItem>
                    {
                      currencies.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))
                    }
                  </CustomInputBase>
                </Grid>
              </Grid>)
            }

            if (row.type.includes('ObjectId') && row.name !== 'updatedBy' && row.name !== 'createdBy') {
              let url = '';
              let filter = {};
              switch (row.name) {
                case 'customer':
                  url = API_CUSTOMERS
                  break;
                case 'presenter':
                  url = API_CUSTOMERS
                  filter = { customerType: 3 }
                  break;
                case 'responsibilityPerson':
                  url = API_USERS
                  break;
                case 'taskManager' || 'join' || 'approved' || 'support' || 'approvedProgress' || 'viewable':
                  url = API_USERS
                  filter = { customerType: 3 }
                  break;
                case 'campaign':
                  url = API_CRM_CAMPAIGN
                  break;
                default:
                  break;
              }
              return (
                <Grid container>
                  <Grid item xs={12}>
                    <AsyncAutocomplete
                      // isDisabled={!roleListEdit}
                      // isMulti
                      name={row.name}
                      label={row.title}
                      // error={localMessages && localMessages.owner}
                      // helperText={localMessages && localMessages.owner}
                      url={url}
                      onChange={value => {
                        generalData[`${row.name}`] = value;
                        props.newAddtionData[`${row.name}`] = value;
                        props.callBack('addition-data-change', { newAddtionData: props.newAddtionData, actionIndex: 0 });
                      }}
                      value={generalData[`${row.name}`]}
                      filter={filter}
                    />
                  </Grid>
                  {/* <Grid item xs={6}>
                    <CustomInputBase
                      // error={(localMessages && localMessages.name) || this.state.name === ''}
                      required={row && row.checkedRequireForm}
                      checkedShowForm={row && row.checkedShowForm}
                      label={row && row.title}
                      type='String'
                      onChange={e => {
                        let data = {};
                        data[`${row.name}`] = e.target.value;
                        props.newAddtionData[`${row.name}`] = e.target.value;
                        setGeneralData({ ...generalData, ...data });
                        props.callBack('addition-data-change', { newAddtionData: props.newAddtionData, actionIndex: 0 });
                      }}
                      name={row && row.name}
                      value={generalData[`${row.name}`]}
                      onClick={() => {
                        handleChange(row)
                      }
                      }
                    />
                  </Grid> */}
                </Grid>
              )
            }
          })}
        </div>
      </Grid>
    </Grid>
  );
}

export default Bus;