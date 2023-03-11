import React, { useEffect, memo, useState } from 'react';
import { MenuItem } from '@material-ui/core';
import CustomInputBase from '../CustomInputBase';
import {
  GridList,
  Grid,
  Typography,
  Checkbox,
  TextField,
  FormControlLabel,
  Slider,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  Input,
} from '@material-ui/core';
import { NONE_MENU_ITEM_TYPES, MAPPING_TYPE } from './constants';
import WarrantyPeriodInput from './CustomInput/WarrantyPeriodInput';
import { APP_URL, API_APPROVE_GROUPS, API_TEMPLATE, API_HUMAN_RESOURCE, API_UNIT_STOCK } from '../../../config/urlConfig';
import { AsyncAutocomplete } from 'components/LifetekUi';
import CustomDatePicker from '../../CustomDatePicker';
import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import CustomRangeSlider from '../../Filter/CustomRangeSlider';
import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DateRangePicker } from 'react-date-range';
// import Typography from "@material-ui/core/Typography";
// import Slider from "@material-ui/lab/Slider";
import moment from 'moment';
import './index.css';
const dateFilterTypeLabels = {
  week: 'Tuần',
  month: 'Tháng',
  quarter: 'Quý',
  year: 'Năm',
};
const weeks = 52;
const WEEKS = [];
for (let y = 0; y < weeks; y += 1) {
  WEEKS.push({
    name: `${y + 1}`,
    title: `Tuần  ${y + 1}`,
  });
}
const MONTHS = [
  {
    name: '1',
    title: 'Tháng 1',
  },
  {
    name: '2',
    title: 'Tháng 2',
  },
  {
    name: '3',
    title: 'Tháng 3',
  },
  {
    name: '4',
    title: 'Tháng 4',
  },
  {
    name: '5',
    title: 'Tháng 5',
  },
  {
    name: '6',
    title: 'Tháng 6',
  },
  {
    name: '7',
    title: 'Tháng 7',
  },
  {
    name: '8',
    title: 'Tháng 8',
  },
  {
    name: '9',
    title: 'Tháng 9',
  },
  {
    name: '10',
    title: 'Tháng 10',
  },
  {
    name: '11',
    title: 'Tháng 11',
  },
  {
    name: '12',
    title: 'Tháng 12',
  },
];
const QUARTERS = [
  {
    name: '1',
    title: 'Qúy 1',
  },
  {
    name: '2',
    title: 'Qúy 3',
  },
  {
    name: '3',
    title: 'Qúy 3',
  },
  {
    name: '4',
    title: 'Qúy 4',
  },
];

const currentYear = moment().get('year');
const YEARS = [];
for (let y = 0; y < 5; y += 1) {
  YEARS.push({
    name: `${currentYear - y}`,
    title: `${currentYear - y}`,
  });
}

const obj = {
  week: WEEKS,
  month: MONTHS,
  quarter: QUARTERS,
  year: YEARS,
};
/// cài thêm: npm install @material-ui/lab

// const useStyles = makeStyles({
//   root: {
//     width: 300
//   }
// });
function valuetext(valueNumber) {
  return `${valueNumber}°C`;
}
const blockInvalidChar = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();

function CustomInputField(props) {
  // const classes = useStyles();
  const {
    min = 0,
    max = 100,
    type,
    name,
    value,
    label,
    onChange,
    configType,
    configCode,
    isChecked,
    isCheckedNo,
    onChangeCheck,
    options,
    ...restProps
  } = props;

  const [menuItemData, setMenuItemData] = useState([]);
  const [valueNumber, setValueNumber] = useState([20, 37]);
  const [localState, setLocalState] = useState([min, max]);
  useEffect(
    () => {
      if (Array.isArray(options)) {
        setMenuItemData(options);
      } else if (configType && !NONE_MENU_ITEM_TYPES.includes(type) && (type || configCode)) {
        try {
          const listConfig = JSON.parse(localStorage.getItem(configType));

          if (Array.isArray(listConfig)) {
            const currentConfig = listConfig.find(config => config._id === type || config.code === configCode);
            if (currentConfig && Array.isArray(currentConfig.data)) setMenuItemData(currentConfig.data);
          }
        } catch (error) {
          // ignore
          console.log('error', error);
        }
      }
    },
    [configCode, options],
  );
  useEffect(
    () => {
      if (props.name === 'vacancy.roleName') {
        fetch(API_HUMAN_RESOURCE, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setMenuItemData(data.humanResourceSource);
          });
      }
    },
    [props.name],
  );

  useEffect(
    () => {
      setLocalState(value);
    },
    [value],
  );

  const handleChange = (event, newValue) => {
    setValueNumber(newValue);
  };

  const mapItem = array =>
    array.map((item, index) => (
      <MenuItem key={`${index}`} value={item}>
        {item.title ? item.title : item.name}
      </MenuItem>
    ));
  const changeApi = models => {
    if (models === 'Stock') {
      return 'inventory';
    } else {
      return `inventory/${models.toLowerCase()}`;
    }
  };
  const employeeOptionLabel = option => {
    const code = option.code ? option.code : '';
    const customerName = option.name ? option.name : '';
    if (customerName || code) {
      return `${code} - ${customerName}`;
    }
    return '';
  };
  const employeeOptionLabel1 = option => {
    const code = option.code ? option.code : '';
    const customerName = option.name ? option.name : '';
    if (customerName || code) {
      return `${customerName}`;
    }
    return '';
  };
  const templateOptionLabel = option => {
    const customerName = option.title ? option.title : '';
    if (customerName) {
      return `${customerName}`;
    }
    return '';
  };

  const getSelectedValue = val => {
    
    if (!val) return null;
    if (props.name === 'age') {
      return menuItemData.find(i => i.title === val.title);
    }
    
    return menuItemData.find(i => (i.value ? i.value === val.value : i.type ? i.type === val.type : i.name === val.name));
  };

  if (NONE_MENU_ITEM_TYPES.includes(type)) {
    if (type === "date") {
      return <CustomDatePicker InputLabelProps={{ shrink: true }} label={label} onChange={(e) => {

        const value = {
          target: {
            name: props.name,
            value: e
          }
        }
        onChange(value)
      }} value={props.value ? value : null} />
    }
    else return <CustomInputBase label={label} type={MAPPING_TYPE[type] || type} value={value} onChange={onChange} name={name} {...restProps} />;
  }
  if (type === 'WARRANTY_PERIOD_UNITS') {
    return <WarrantyPeriodInput {...props} />;
  }
  if (type) {

    const [firstEle, model, thirdEle] = type.split('|');
    const isMulti = thirdEle === 'Array' ? true : false;
    if (firstEle === 'ObjectId' && model) {
      let models;
      if (model === 'ExchangingAgreement') {
        models = 'exchanging-agreement';
      } else if (model === 'BusinessOpportunities') {
        models = 'business-opportunitie';
      } else if (model === 'businessOpportunities') {
        models = 'business-opportunitie';
      } else if (model === 'TemplateTask') {
        models = 'template';
      } else if (model === 'SalesQuotation') {
        models = 'sales-quotation';
      } else if (model === 'OrganizationUnit') {
        models = 'organization-unit';
      } else if (model === 'dynamicForm') {
        models = 'dynamic-form';
      } else if (model === 'CostEstimate') {
        models = 'cost-estimate';
      } else {
        models = model;
      }

      return (
        <>
          {model === 'hrm' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/hrmEmployee`}
              value={value}
            />
          ) : models === 'OrderPo' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/orders-po`}
              value={value}
            />
          ) : models === 'ContactCenter' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/contact-center`}
              value={value}
            />
          ) : models === 'sales-quotation' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              noLimit
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/${models.toLowerCase()}s`}
              value={value}
            />
          ) : models === 'Contract' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/contract`}
              value={value}
            />
          ) : models === 'Tag' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel1}
              isMulti={isMulti}
              url={`${APP_URL}/api/${changeApi(models)}`}
              value={value}
            />
          ) : models === 'Stock' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/${changeApi(models)}`}
              value={value}
            />
          ) : models === 'Catalog' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/${changeApi(models)}`}
              value={value}
            />
          ) : models === 'Origin' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/inventory/origin/list`}
              value={value}
            />
          ) : models.includes('Documentary') ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/${models.toLowerCase()}`}
              value={value}
            />
          ) : models.includes('MettingRoom') ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/metting-schedule/room`}
              value={value}
            />
          ) : models.includes('approve-group') ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${API_APPROVE_GROUPS}`}
              value={value}
            />
          ) : models.includes('dynamic-form') ? (
            <AsyncAutocomplete
              label={label}
              filters={['title']}
              onChange={onChange}
              customOptionLabel={templateOptionLabel}
              isMulti={isMulti}
              url={`${API_TEMPLATE}/list`}
              value={value}
            />
          ) : models.includes('asset') ? (
            <AsyncAutocomplete
              label={label}
              onChange={e => {
                onChange({
                  target: {
                    value: e,
                  },
                });
              }}
              customOptionLabel={employeeOptionLabel}
              loadOptions="code"
              isMulti={isMulti}
              url={`${APP_URL}/api/asset`}
              value={value}
              filters={[`${props.name}`]}
            />
          ) : model === 'Unit' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel1}
              isMulti={isMulti}
              url={`${API_UNIT_STOCK}`}
              value={value}
            />
          ) : (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/${models.toLowerCase()}s`}
              value={value}
            />
          )}
        </>
      );
    }
  }
  if ((type === 'Date' && props.filterType) || (type === 'Datetime' && props.filterType)) {
    return (
      <>
        {/* <DateRangePickerComponent placeholder={label} onChange={onChange} value={value} /> */}
        <DateRangePickerComponent placeholder={label} onChange={onChange} value={value} />;
      </>
    );
  } else if (type === 'Date' || type === 'Datetime') {
    if (props.dateFilterType) {
      return (
        <>
          <CustomInputBase
            id="select-month"
            select
            onChange={onChange}
            value={value || ''}
            label={`${props.label} theo ${dateFilterTypeLabels[props.dateFilterType]}`}
            name={props.name}
            style={{ width: '100%' }}
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{
              style: {
                padding: 0,
              },
            }}
            SelectProps={{
              MenuProps: {},
            }}
          >
            <MenuItem key="-999" value="">
              --- Chọn ---
            </MenuItem>
            {obj[props.dateFilterType].map(field => (
              <MenuItem key={field.name} value={field.name}>
                {field.title}
              </MenuItem>
            ))}
          </CustomInputBase>
        </>
      );
    }
    return <CustomDatePicker InputLabelProps={{ shrink: true }} label={label} onChange={onChange} value={props.value ? value : null} />;
  }
  if (type === 'Number') {
    return (
      <>
        <CustomInputBase onKeyDown={blockInvalidChar} label={label} value={value} onChange={onChange} type="number" />
      </>
    );
  }
  if (type === 'Boolean') {
    return (
      <div>
        <FormControl component="fieldset">
          <RadioGroup aria-label="isCheckedNo" name="isCheckedNo" value={isCheckedNo} onChange={onChange}>
            <div>
              <div>{label}:</div>
              <FormControlLabel value="true" control={<Radio />} label="Có" />
              <FormControlLabel value="false" control={<Radio />} label="Không" />
            </div>
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
  // if()
  return (
    <CustomInputBase
      value={getSelectedValue(value)}
      onChange={e => {
        if (typeof e.target.value === 'object' && e.target.value) {
          e.target.value.label = label;
        }
        onChange(e);
      }}
      label={label}
      name={name}
      select
      {...restProps}
    >
      <MenuItem key="-9999" value={null}>
        -- CHỌN {label} --
      </MenuItem>
      {mapItem(menuItemData)}
    </CustomInputBase>
  );
}
export default memo(CustomInputField);
// export default compose(
//   memo,
//   injectIntl,
// )(CustomInputField);
