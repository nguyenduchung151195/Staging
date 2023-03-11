import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from 'utils/request';
import { API_CUSTOMERS, UPLOAD_IMG_SINGLE, GET_PROP_SET, API_USERS, API_SOURCE_CRMCONFIG } from 'config/urlConfig';
import { getInfoSuccess, getInfoFailed, postCustomerFailed, postCustomerSuccess, putCustomerFailed, getAttributeSuccess } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
// Individual exports for testing
function* getCustomer(action) {
  try {
    const data = yield call(request, `${API_CUSTOMERS}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const attributesData = yield call(request, GET_PROP_SET, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const resource = yield call(request, API_SOURCE_CRMCONFIG, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const users = yield call(request, API_USERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const attributes = attributesData.data.filter(item => item.objects.customer === true);
    const listAtt = {};
    attributes.forEach(att =>
      att.attributeGroups.forEach(item =>
        item.attributes.forEach(element => {
          if (data.detailInfo.typeCustomer.setAttribute && data.detailInfo.typeCustomer.setAttribute[element.attributeId])
            listAtt[element.attributeId] = data.detailInfo.typeCustomer.setAttribute[element.attributeId];
          else listAtt[element.attributeId] = [];
        }),
      ),
    );
    if (data && attributes) {
      yield put(getInfoSuccess(data, attributes, listAtt, users.data, resource));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Không thể lấy dữ liệu khách hàng hoặc bộ thuộc tính', variant: 'error' }));
      yield put(getInfoFailed());
    }
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Không thể lấy dữ liệu khách hàng hoặc bộ thuộc tính', variant: 'error' }));
    yield put(getInfoFailed());
  }
}

function* getAttribute() {
  try {
    const attributesData = yield call(request, GET_PROP_SET, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const users = yield call(request, API_USERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const resource = yield call(request, API_SOURCE_CRMCONFIG, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const attributes = attributesData.data.filter(item => item.objects.customer === true);
    const listAtt = {};
    attributes.forEach(att =>
      att.attributeGroups.forEach(item =>
        item.attributes.forEach(element => {
          listAtt[element.attributeId] = [];
        }),
      ),
    );
    yield put(getAttributeSuccess(attributes, listAtt, users.data, resource));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Không thể lấy dữ liệu CRMConfig hoặc bộ thuộc tính', variant: 'error' }));
  }
}

// Thêm mới khách hàng

function* postCustomer(action) {
  try {
    if (action.data.avatar !== '') {
      const formData = new FormData();
      formData.append('file', action.data.avatar);
      const avatarURL = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      action.data.avatar = avatarURL.url;
    }

    const data = yield call(request, API_CUSTOMERS, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(changeSnackbar({ status: true, message: 'Thêm mới khách hàng thành công', variant: 'success' }));

    if (action.data.callback) {
      action.data.callback(data);
    } else {
      yield put(postCustomerSuccess());
      yield put(push('/crm/Customer'));
    }
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: error.message, variant: 'error' }));
    yield put(postCustomerFailed());
  }
}

function* putCustomer(action) {
  try {
    if (action.data.avatarURL) {
      const formData = new FormData();
      formData.append('file', action.data.avatar);
      const avatarURL = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      action.data.avatar = avatarURL.url;
    }

    const data = yield call(request, `${API_CUSTOMERS}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (data.callback) {
      data.callback();
    }
    yield put(changeSnackbar({ status: true, message: 'Cập nhật khách hàng thành công ', variant: 'success' }));
    yield put(push('/crm/Customer'));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: error.message, variant: 'error' }));
    yield put(putCustomerFailed());
  }
}
export default function* addCustomerPageSaga() {
  yield takeLatest('GET_INFO', getCustomer);
  yield takeLatest('POST_CUSTOMER', postCustomer);
  yield takeLatest('PUT_CUSTOMER', putCustomer);
  yield takeLatest('GET_ATTRIBUTE', getAttribute);
}
