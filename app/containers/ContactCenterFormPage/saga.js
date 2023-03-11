import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { push } from 'connected-react-router';
import { ADD_CONTACT_CENTER, GET_CONTACT_CENTER_BY_ID, GET_EMPLOYEE_IDS, EDIT_CONTACT_CENTER } from './constants';
import { UPLOAD_IMG_SINGLE, CONTACT_CENTER, API_USERS_SEARCH } from '../../config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import {
  addContactCenterSuccessAction,
  addContactCenterErrorAction,
  getContactCenterByIdSuccessAction,
  getEmployeeByIdSuccessAction,
  getEmployeeByIdErrorAction,
} from './actions';
import { serialize } from '../../helper';
function* postContactCenter(action) {
  try {
    if (action.data.background.selectFile) {
      const formData = new FormData();
      formData.append('file', action.data.background.selectFile);
      const background = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      action.data.background = background.url;
    } else {
      action.data.background = '';
    }

    const data = yield call(request, CONTACT_CENTER, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(changeSnackbar({ status: true, message: `Thêm mới biểu mẫu thành công khách hàng ${data.name}`, variant: 'success' }));

    if (action.data.callback) {
      action.data.callback(data);
    } else {
      yield put(addContactCenterSuccessAction());
      yield put(push('/crm/ContactCenter'));
    }
  } catch (error) {
    // log
    yield put(changeSnackbar({ status: true, message: 'Thêm mới biểu mẫu thất bại', variant: 'error' }));
    yield put(addContactCenterErrorAction());
  }
}
function* putContactCenter(action) {
  try {
    if (action.data.background.selectFile) {
      const formData = new FormData();
      formData.append('file', action.data.background.selectFile);
      const background = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      action.data.background = background.url;
    } else {
      action.data.background = '';
    }

    const data = yield call(request, `${CONTACT_CENTER}/${action.data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(changeSnackbar({ status: true, message: `Cập nhập biểu mẫu thành công khách hàng ${data.name}`, variant: 'success' }));
    yield put(push('/crm/ContactCenter'));

    if (action.data.callback) {
      action.data.callback(data);
    } else {
      yield put(addContactCenterSuccessAction());
    }
  } catch (error) {
    // log
    yield put(changeSnackbar({ status: true, message: 'Câp nhập biểu mẫu thất bại', variant: 'error' }));
    yield put(addContactCenterErrorAction());
  }
}
export function* fetchGetContactById(action) {
  try {
    const data = yield call(request, `${CONTACT_CENTER}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(getContactCenterByIdSuccessAction(data));
  } catch (err) {
    yield put(getContactCenterByIdSuccessAction(err));
  }
}
export function* fetchGetUserByIds(action) {
  try {
    const data = yield call(request, `${API_USERS_SEARCH}?${serialize(action.query)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(getEmployeeByIdSuccessAction(data.data));
  } catch (err) {
    yield put(getEmployeeByIdErrorAction(err));
  }
}
// Individual exports for testing
export default function* contactCenterFormPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(ADD_CONTACT_CENTER, postContactCenter);
  yield takeLatest(GET_CONTACT_CENTER_BY_ID, fetchGetContactById);
  yield takeLatest(GET_EMPLOYEE_IDS, fetchGetUserByIds);
  yield takeLatest(EDIT_CONTACT_CENTER, putContactCenter);
}
