const checkValidation = (field, value) => { };

const checkValidNumber = e => {
  if (['e', '+', '-', '.'].includes(e.key)) e.preventDefault();
};

export const checkValidEmail = value => {
  const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regEmail.test(value) === false) {
    return 'Sai định dạng Email';
  } else {
    return '';
  }
};

export const checkValidWebsite = value => {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  if (value != '') {
    if (pattern.test(value) === false) {
      return 'Website không hợp lệ';
    } else {
      return '';
    }
  } else {
    return '';
  }
};

export const checkPhoneNumber = value => {
  const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  const mobile = value;
  if (mobile !== '') {
    if (vnf_regex.test(mobile) == false) {
      return 'Số điện thoại của bạn không đúng định dạng!';
    } else {
      return '';
    }
  } else {
    return '';
  }
};

const checkValidStringSpecial = (field, value) => {
  const partent = /[~!@#$%^&*()?><\\|":',.]/g;
  if (Array.isArray(value.match(partent)) && value.match(partent) > 0) {
    return false;
  }
  return true;
};
