/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */

const dot = require('dot-object');
const moment = require('moment');
var FormulaParser = require('hot-formula-parser').Parser;
var parser = new FormulaParser();
// import { convertTemplate } from '../helper';
// const { API_TEMPLATE } = require('../config/urlConfig');
function serialize(obj, prefix) {
  const str = [];
  let p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? `${prefix}[${p}]` : p;

      const v = obj[p];
      str.push(v !== null && typeof v === 'object' ? serialize(v, k) : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }
  }
  return str.join('&');
}
function convertDatetime2Date(datetime) {
  const date = moment(datetime, 'DD/MM/YYYY').format('YYYY-MM-DD');
  if (date === 'Invalid date') {
    return datetime;
  }
  return date;
}

function clearWidthSpace(str) {
  return str.replaceAll(/\s+/g, ' ');
}

function removeVietnameseTones(str) {
  if (!str || typeof str !== 'string') return str;
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
  return str.toLowerCase();
}

function convertDatetimeToDate(datetime) {
  let date = new Date(datetime);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = date.getFullYear();
  date = `${yyyy}-${mm}-${dd}`;
  return date;
}

function convertDatetimeToFullDate(datetime) {
  let date = new Date(datetime);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = date.getFullYear();
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  date = `${yyyy}-${mm}-${dd} ${h}:${m}`;
  return date;
}

function convertDatetimeToDateForTextField(datetime) {
  let date;
  if (datetime === '') {
    date = new Date();
  } else {
    date = new Date(datetime);
  }
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
  const hh = String(date.getHours()).padStart(2, '0');
  const ms = String(date.getMinutes()).padStart(2, '0');
  const yyyy = date.getFullYear();
  date = `${yyyy}-${mm}-${dd}T${hh}:${ms}`;
  return date;
}

const inorgesign = alias => {
  let str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');

  // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  return str;
};

const getLabelName = (name, viewConfigCode) => {
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  const currentViewConfig = viewConfig.find(n => n.code === viewConfigCode);
  const column = currentViewConfig.listDisplay.type.fields.type.columns;
  const currentField = column.find(i => i.name === name);
  if (currentField) return currentField.title;
  return '';
};

function convertTemplate({ content, data, code }) {
  const newData = dot.dot(data);
  const result = [];
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  function getName(codeName, refName) {
    const list = viewConfig.find(item => item.code === codeName);
    if (list) {
      list.listDisplay.type.fields.type.columns.forEach(item => {
        const newItem = { ...item, name: `${refName}.${item.name}` };
        result.push(newItem);
      });
    }
  }

  const codes = viewConfig.find(item => item.code === code).listDisplay.type.fields.type.columns;
  codes.forEach(item => {
    if (item.type.includes('ObjectId')) {
      const ref = item.type.substring(9);
      getName(ref, item.name);
    }
  });

  const newResult = result.concat(codes);
  newResult.forEach(item => {
    const replace = `{${item.name}}`;
    const regex = new RegExp(replace, 'g');
    const rep = newData[item.name] ? newData[item.name] : '';
    content = content.replace(regex, rep);
  });
  return content;
}

function viewConfigName2Title(moduleCode) {
  try {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfig.find(n => n.code === moduleCode);
    const column = currentViewConfig.listDisplay.type.fields.type.columns;
    const result = {};
    column.forEach(element => {
      result[element.name] = element.title;
    });
    return result;
  } catch (error) {
    return {};
  }
}
function viewConfigType(moduleCode) {
  try {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfig.find(n => n.code === moduleCode);
    const column = currentViewConfig.listDisplay.type.fields.type.columns;
    const result = {};
    column.forEach(element => {
      result[element.name] = element.type;
    });
    return result;
  } catch (error) {
    return {};
  }
}
function viewConfigCheckShowForm(moduleCode, name, filterValue, value) {
  try {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfig.find(n => n.code === moduleCode);
    const column = currentViewConfig.listDisplay.type.fields.type.columns;
    const others = currentViewConfig.listDisplay.type.fields.type.others;
    const checks = column.concat(others);

    const foundColumn = checks.find(item => item.name === name);
    // const filterConfig = foundColumn.
    if (!foundColumn) {
      return false;
    }
    if (
      typeof filterValue === 'undefined' ||
      !foundColumn.filterConfig ||
      typeof foundColumn.filterConfig[filterValue] === 'undefined' ||
      typeof foundColumn.filterConfig[filterValue][value] === 'undefined'
    ) {
      return foundColumn[value];
    }
    return foundColumn.filterConfig[filterValue][value];
  } catch (error) {
    console.log(error);
    return false;
  }
}

function viewConfigCheckShowFormNoName(moduleCode, filterValue, value, value1 = "isRequired", value2 = "checkedRequireForm") {
  try {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfig.find(n => n.code === moduleCode);
    const column = currentViewConfig.listDisplay.type.fields.type.columns;
    const others = currentViewConfig.listDisplay.type.fields.type.others;
    const checks = column.concat(others);
    if (Array.isArray(checks) && checks.length > 0) {
      let data = {};
      checks.map(el => {
        data[el.name] = el[value] || el[value1] || el[value2];
      });
      return data;
    }
    return false;
  } catch (error) {
    console.log(error, 'error');
    return false;
  }
}

function viewConfigShowLabel(moduleCode, name, filterValue) {
  try {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfig.find(n => n.code === moduleCode);
    const column = currentViewConfig.listDisplay.type.fields.type.columns;
    const others = currentViewConfig.listDisplay.type.fields.type.others;
    const checks = column.concat(others);

    const foundColumn = checks.find(item => item.name === name);
    // const filterConfig = foundColumn.
    if (!foundColumn) {
      return '';
    }
    if (
      typeof filterValue === 'undefined' ||
      !foundColumn.filterConfig ||
      typeof foundColumn.filterConfig[filterValue] === 'undefined' ||
      typeof foundColumn.filterConfig[filterValue].title === 'undefined'
    ) {
      return foundColumn.title;
    }
    return foundColumn.filterConfig[filterValue].title;
  } catch (error) {
    return '';
  }
}

function viewConfigCheckRequired(moduleCode, type) {
  try {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfig.find(n => n.code === moduleCode);
    const column = currentViewConfig.listDisplay.type.fields.type.columns;
    const others = currentViewConfig.listDisplay.type.fields.type.others;
    const checks = column.concat(others);
    let checkRequired = {};
    if (type === 'required') {
      checks.forEach(item => {
        checkRequired[item.name] = item.checkedRequireForm;
      });
    }
    if (type === 'showForm') {
      checks.forEach(item => {
        checkRequired[item.name] = item.checkedShowForm;
      });
    }
    return checkRequired;
  } catch (error) {
    return {};
  }
}

function formatMessages(obj) {
  const { min, max, maxLength, minLength, checkedRequireForm, phone, email } = obj;
  if (min) {
    return `Yêu cầu nhập lớn hơn hoặc bằng ${min}`;
  }
  if (max) {
    return `Yêu cầu nhập nhỏ hơn hoặc bằng ${max}`;
  }
  if (maxLength) {
    return `Yêu cầu nhập nhỏ hơn hoặc bằng ${maxLength}`;
  }
  if (minLength) {
    return `Yêu cầu nhập lớn hơn hoặc bằng ${minLength}`;
  }
  if (phone) {
    return `Định dạng ${obj.title} không hợp lệ`;
  }
  if (email) {
    return `Định dạng ${obj.title} không hợp lệ`;
  }
  if (checkedRequireForm) {
    return `Không được để trống ${obj.title}`;
  }
}
function validatePhone(phone) {
  // regex = /^(0|\+84)(\s|\.)?((2[2-9])|(3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
  regex = /^(0|\+84)(\s|\.)?((2[2-9])|(3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))?(\d{3})?[\s.-]?\d{3}?[\s.-]?\d{4}$/;
  const data = !regex.test(phone);
  return data;
}
function validateEmail(email) {
  regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
  const data = !regex.test(email);
  return data;
}
function Validate(check, value) {
  const { type, name, title, checkedRequireForm, min, max, maxLength, minLength } = check;
  if (checkedRequireForm) {
    if (value === null) {
      return formatMessages({ title, checkedRequireForm });
    }
    if (type === 'String' && typeof value === 'string' && value.length === 0) {
      return formatMessages({ title, checkedRequireForm });
    }
    if ((type === 'Date' && typeof value === 'string' && value.length === 0) || (Array.isArray(value) && value.length === 0) || value === null) {
      return formatMessages({ title, checkedRequireForm });
    }

    if (type === 'String' && minLength && typeof value === 'string' && value.length < minLength) {
      return formatMessages({ minLength, title });
    }
    if (type === 'String' && maxLength && typeof value === 'string' && value.length > maxLength) {
      return formatMessages({ maxLength, title });
    }
    if (type === 'String' && typeof value === 'string' && (name === 'phoneNumber' || name === 'accountPhone') && validatePhone(value)) {
      const phone = value;
      return formatMessages({ phone, title });
    }
    if (type === 'String' && typeof value === 'string' && (name === 'email' || name === 'accountEmail') && validateEmail(value)) {
      const email = value;
      return formatMessages({ email, title });
    }
    if (type === 'Number' && typeof value === 'number' && min && parseInt(value) < parseInt(min) && (name === 'month' || name === 'year')) {
      return formatMessages({ min, title });
    }
    if (type === 'Number' && typeof value === 'number' && max && parseInt(value) > parseInt(max) && (name === 'month' || name === 'year')) {
      return formatMessages({ max, title });
    }
    // Kiểm tra loại chuỗi và rỗng
    if (typeof value === 'string' && value.length === 0) {
      return formatMessages({ title, checkedRequireForm });
    }
  }
}

function viewConfigHandleOnChange(moduleCode, messages, fieldName, fieldValue) {
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  const currentViewConfig = viewConfig.find(n => n.code === moduleCode);
  const column = currentViewConfig.listDisplay.type.fields.type.columns;
  const others = currentViewConfig.listDisplay.type.fields.type.others;
  const checks = { ...column, ...others };
  const newMesages = { ...messages };

  if (fieldName) {
    Object.entries(checks).forEach(([configKey, check]) => {
      if (check.name === fieldName) {
        if (Validate(check, fieldValue)) {
          newMesages[check.name] = Validate(check, fieldValue);
        } else {
          delete newMesages[check.name];
        }
      }
    });
  }
  return newMesages;
}

function viewConfigCheckForm(moduleCode, data) {
  try {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfig.find(n => n.code === moduleCode);
    const column = currentViewConfig.listDisplay.type.fields.type.columns;
    const others = currentViewConfig.listDisplay.type.fields.type.others;
    const checks = { ...column, ...others };

    let messages = {};
    if (checks && data) {
      Object.entries(checks).forEach(([configKey, check]) => {
        Object.entries(data).forEach(([dataKey, dataValue]) => {
          if (check.name === dataKey) {
            if (Validate(check, dataValue)) messages[check.name] = Validate(check, dataValue);
          }
        });
      });
    }

    return messages;
  } catch (error) {
    // console.log('error', error)
    return {};
  }
}

function viewConfigCheckFormNoViewConfig(checks, data) {
  try {
    let messages = {};
    if (checks && data) {
      Object.entries(checks).forEach(([configKey, check]) => {
        Object.entries(data).forEach(([dataKey, dataValue]) => {
          if (check.name === dataKey) {
            if (Validate(check, dataValue)) messages[check.name] = Validate(check, dataValue);
          }
        });
      });
    }

    return messages;
  } catch (error) {
    // console.log('error', error)
    return {};
  }
}

function convertStrToSlug(str) {
  // Lấy text từ thẻ input title
  let slug;
  // Đổi chữ hoa thành chữ thường
  slug = str.toLowerCase();

  // Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  slug = slug.replace(/đ/gi, 'd');
  // Xóa các ký tự đặt biệt
  slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
  // Đổi khoảng trắng thành ký tự gạch ngang
  slug = slug.replace(/ /gi, ' - ');
  // Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  // Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  slug = slug.replace(/\-\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-/gi, '-');
  slug = slug.replace(/\-\-/gi, '-');
  // Xóa các ký tự gạch ngang ở đầu và cuối
  slug = `@${slug}@`;
  slug = slug.replace(/\@\-|\-\@|\@/gi, '');
  // In slug ra textbox có id “slug”
  return slug;
}
function convertString(str) {
  // Lấy text từ thẻ input title
  let newString;
  // Đổi chữ hoa thành chữ thường
  newString = str.toLowerCase();
  // Đổi ký tự có dấu thành không dấu
  newString = newString.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  newString = newString.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  newString = newString.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  newString = newString.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  newString = newString.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  newString = newString.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  newString = newString.replace(/đ/gi, 'd');
  newString = newString.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  newString = newString.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  newString = newString.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  newString = newString.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  newString = newString.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  newString = newString.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  newString = newString.replace(/Đ/g, 'D');
  // Xóa các ký tự đặt biệt
  newString = newString.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
  // Gộp nhiều dấu space thành 1 space
  newString = newString.replace(/\s+/g, ' ');
  // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của xâu
  newString.trim();
  // In newString ra textbox có id “newString”
  return newString;
}
function convertString1(str) {
  if (typeof str !== 'string' || !str) return '';
  // Lấy text từ thẻ input title
  let newString;
  // Đổi chữ hoa thành chữ thường
  newString = str.toLowerCase();
  // Đổi ký tự có dấu thành không dấu
  newString = newString.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  newString = newString.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  newString = newString.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  newString = newString.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  newString = newString.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  newString = newString.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  newString = newString.replace(/đ/gi, 'd');
  // Gộp nhiều dấu space thành 1 space
  newString = newString.replace(/\s+/g, ' ');
  // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của xâu
  newString.trim();
  // In newString ra textbox có id “newString”
  return newString;
}
function formatNumber(num) {
  if (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  return 0;
}
function getDataI18N(scope, data) {
  const listObjectKey = Object.keys(data);
  const resultDataI18N = {};
  listObjectKey.map(item => (resultDataI18N[item.replace(`${scope}.`, '')] = { id: item, defaultMessage: item }));
  return resultDataI18N;
}
function getLogString(oldData, newData, code, kanban) {
  const contentArr = [];
  if (String(oldData.name) !== String(newData.name)) {
    contentArr.push({ old: oldData.name, new: newData.name });
  }
  if (oldData.customer && newData.customer && String(oldData.customer.customerId) !== String(newData.customer.customerId)) {
    contentArr.push({ old: oldData.customer.name, new: newData.customer.name });
  }
  if (oldData.value && newData.value && Number(oldData.value.amount) !== Number(newData.value.amount)) {
    contentArr.push({
      old: `${formatNumber(oldData.value.amount)} ${oldData.value.currencyUnit}`,
      new: `${formatNumber(newData.value.amount)} ${newData.value.currencyUnit}`,
    });
  }
  if (
    oldData.responsibilityPerson &&
    newData.responsibilityPerson &&
    String(oldData.responsibilityPerson.employeeId) !== String(newData.responsibilityPerson.employeeId)
  ) {
    contentArr.push({ old: oldData.responsibilityPerson.name, new: newData.responsibilityPerson.name });
  }
  if (oldData.supervisor && newData.supervisor && String(oldData.supervisor.employeeId) !== String(newData.supervisor.employeeId)) {
    contentArr.push({ old: oldData.supervisor.name, new: newData.supervisor.name });
  }
  if (String(oldData.kanbanStatus) !== String(newData.kanbanStatus)) {
    // console.log('xxx');
    const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    const currentCrmStatus = listCrmStatus[listCrmStatus.findIndex(d => String(d.code) === String(code))];
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    currentCrmStatus.data.forEach(item => {
      switch (item.code) {
        case 1:
          laneStart.push(item);
          break;
        case 2:
          laneAdd.push(item);
          break;

        case 3:
          laneSucces.push(item);
          break;

        case 4:
          laneFail.push(item);
          break;

        default:
          break;
      }
    });
    const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
    let old = '';
    let newKan = '';
    let oldKanban = '';

    if (kanban) {
      oldKanban = sortedKanbanStatus.find(x => String(x.type) === String(oldData.kanbanStatus));
    } else {
      oldKanban = sortedKanbanStatus.find(x => String(x._id) === String(oldData.kanbanStatus));
    }

    if (oldKanban) {
      old = oldKanban.name;
    } else {
      old = 'Trạng thái kanban đã xóa';
    }
    let newKanban;
    if (kanban) {
      newKanban = sortedKanbanStatus.find(x => String(x.type) === String(newData.kanbanStatus));
    } else {
      newKanban = sortedKanbanStatus.find(x => String(x._id) === String(newData.kanbanStatus));
    }
    if (newKanban) {
      newKan = newKanban.name;
    } else {
      newKan = 'Trạng thái kanban đã xóa';
    }
    contentArr.push({ old, new: newKan });
  }
  const content = `<div><span style="font-size: 14px;">${code === 'ST01' ? 'Cập nhật cơ hội kinh doanh' : code === 'ST03' ? 'Cập nhật trao đổi thỏa thuận' : 'Cập nhật công văn'
    }</span><ul style="margin-top: 8px">${contentArr.map(item => {
      const str = `<li><b>${item.old}</b> thành <b>${item.new}</b></li>`;
      return str;
    })}</ul></div>`;
  return content;
}

function getDescendantProp(obj, desc) {
  if (!desc) {
    return '';
  }
  const arr = desc.split('.');
  // eslint-disable-next-line no-cond-assign
  while (
    arr.length &&
    // eslint-disable-next-line no-param-reassign
    (obj = obj[arr.shift()])
  );
  return obj;
}

function generateTimekeepingData(month, year) {
  const endDate = moment()
    .set('year', year)
    .set('month', month)
    .endOf('month')
    .date();
  const results = [];
  let day = 0;
  while (day < endDate) {
    results.push({
      date: moment()
        .set('year', year)
        .set('month', month)
        .startOf('month')
        .add(day, 'day')
        .startOf('day'),
    });
    day += 1;
  }
  // console.log('result', results);
  return results;
}

function getCurrentUrl() {
  const res = window.location.pathname.split('/');
  return res[res.length - 1];
}

function getHost() {
  const res = window.location.pathname.split('/');
  return res[0];
}

function getUserRole(roles, modules, clientId) {
  return Object.keys(modules).map(item => {
    if (Array.isArray(roles)) {
      const currentRole = roles.find(cuRole => cuRole.codeModleFunction === item);
      if (currentRole) {
        return currentRole;
      }
    }
    return {
      titleFunction: modules[item].title,
      codeModleFunction: item,
      clientId,
      methods: [
        {
          name: 'GET',
          allow: false,
        },
        {
          name: 'POST',
          allow: false,
        },
        {
          name: 'PUT',
          allow: false,
        },
        {
          name: 'DELETE',
          allow: false,
        },
        {
          name: 'EXPORT',
          allow: false,
        },
        {
          name: 'IMPORT',
          allow: false,
        },
        {
          name: 'VIEWCONFIG',
          allow: false,
        },
      ],
    };
  });
}

function spreadObjectLv1(item) {
  const result = { ...item };

  Object.keys(item).forEach(key => {
    if (typeof item[key] === 'object' && item[key] !== null && !Array.isArray(item[key])) {
      Object.keys(item[key]).forEach(childKey => {
        result[`${key}.${childKey}`] = item[key][childKey];
      });
    }
  });
  return result;
}

function getAlternativeSortColumn(oldSort, columnConfigs) {
  if (!oldSort || !Object.keys(oldSort) || !Array.isArray(columnConfigs) || !columnConfigs.length) return oldSort;
  const foundAltColumn = columnConfigs.find(column => oldSort[column.columnName] && column.alternativeSortColumnName);
  if (!foundAltColumn) return oldSort;
  return { [foundAltColumn.alternativeSortColumnName]: oldSort[foundAltColumn.columnName] };
}

function canUpdateTaskPlan(task, user) {
  if (!task || task.planApproval !== 1 || !task.planApprovalUsers || !task.planApprovalUsers.length) return true;
  if (user && user.userId && task.planApprovalUsers.includes(user.userId)) {
    return true;
  }
  return false;
}

function parseTask(addProjects) {
  const data = {
    ...addProjects,
    customer: addProjects.customer ? addProjects.customer._id : null,
    viewable: addProjects.viewable ? addProjects.viewable.map(item => item._id) : [],
    inCharge: addProjects.inCharge ? addProjects.inCharge.map(item => item._id) : [],
    taskManager: addProjects.taskManager ? addProjects.taskManager.map(item => item._id) : [],
    approved: addProjects.approved ? addProjects.approved.map(item => ({ id: item.id ? item.id : item._id, name: item.name })) : [],
    support: addProjects.support ? addProjects.support.map(item => item._id) : [],
    join: addProjects.join ? addProjects.join.map(item => item._id) : [],
  };

  return data;
}

function calAttributes(dataSource, attributes = []) {
  const results = {
    ...dataSource,
  };
  // console.log('results', results)
  const formatCurrency = number => {
    const newNumber = number && Number(number);
    if (typeof newNumber === 'number') {
      return newNumber.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    return number;
  };
  const newData = {};
  attributes.forEach(att => {
    if (!att.formula) {
      newData[att.code] = {
        name: att.name,
        value: results[att.code],
        code: att.code,
      };
    } else {
      let formula = att.formula;
      Object.keys(newData).map(it => {
        formula = formula.replaceAll(`($${it})`, newData[it].value);
      });

      // tim nhung code khong ton tai trong cong thuc tinh = 0
      const rex = /\(\$[\d\w\b]*\)/g;
      const arrFormula = formula.match(rex);
      if (Array.isArray(arrFormula) && arrFormula.length) {
        arrFormula.forEach(item => {
          formula = formula.replaceAll(item, 0);
        });
      }
      // tinh toan
      const result = parser.parse(`${formula}`);

      newData[att.code] = {
        name: att.name,
        value: result.result || 0,
        formula: att.formula,
        code: att.code,
      };
    }
  });
  Object.keys(newData).map(key => {
    newData[key].value = formatCurrency(newData[key].value);
  });

  return newData;
}

function addColumnNameToGroup(list, paths, columnName) {
  if (!paths || !paths.length) return;
  if (paths.length === 1) {
    const foundNode = list.find(l => l.title === paths[0]);
    if (foundNode) {
      if (!foundNode.children) {
        foundNode.children = [];
      }
      foundNode.children.push({ columnName });
    } else {
      list.push({
        title: paths[0],
        children: [
          {
            columnName,
          },
        ],
      });
    }
  }
  if (paths.length === 2) {
    let foundNode = list.find(l => l.title === paths[0]);
    if (foundNode) {
      if (!foundNode.children) {
        foundNode.children = [];
      }
      // foundNode.children.push({ columnName });
    } else {
      list.push({
        title: paths[0],
        children: [],
      });
      foundNode = list[list.length - 1];
    }

    const foundChildNode = foundNode.children.find(l => l.title === paths[1]);
    if (foundChildNode) {
      if (!foundChildNode.children) {
        foundChildNode.children = [];
      }
      foundChildNode.children.push({ columnName });
    } else {
      foundNode.children.push({
        title: paths[1],
        children: [
          {
            columnName,
          },
        ],
      });
    }
  }
}

function buildColumnBands(columns) {
  const results = [];
  columns.forEach(c => {
    if (!c.groupName) return;
    const paths = c.groupName.split('/');
    addColumnNameToGroup(results, paths, c.name);
  });
  return results;
}

function delSpace(object) {
  if (object) {
    Object.keys(object).forEach(key => {
      if (typeof object[key] === 'undefined' || object[key] === null) return;
      if (typeof object[key] === 'string') {
        const a = object[key].trim();
        object[key] = a;
      } else if (typeof object[key] === 'object') {
        delSpace(object[key]);
      }
    });
  }
  return object;
}

module.exports = {
  serialize,
  convertDatetimeToDate,
  convertDatetimeToFullDate,
  inorgesign,
  getLabelName,
  convertTemplate,
  convertStrToSlug,
  formatNumber,
  convertDatetimeToDateForTextField,
  getDataI18N,
  getLogString,
  convertString,
  viewConfigCheckShowForm,
  viewConfigCheckShowFormNoName,
  viewConfigShowLabel,
  getDescendantProp,
  convertString1,
  getCurrentUrl,
  getUserRole,
  spreadObjectLv1,
  viewConfigName2Title,
  viewConfigType,
  convertDatetime2Date,
  viewConfigCheckForm,
  viewConfigCheckFormNoViewConfig,
  viewConfigCheckRequired,
  viewConfigHandleOnChange,
  getAlternativeSortColumn,
  generateTimekeepingData,
  canUpdateTaskPlan,
  parseTask,
  calAttributes,
  buildColumnBands,
  clearWidthSpace,
  delSpace,
  getHost,
  removeVietnameseTones,
};
