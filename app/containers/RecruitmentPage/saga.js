import { takeLatest, call, put } from 'redux-saga/effects';
// Individual exports for testing
import { API_RECRUITMENT, API_ORIGANIZATION, UPLOAD_IMG_SINGLE } from '../../config/urlConfig';
// import lodash from 'lodash';
import request from '../../utils/request';
import { postDataSuccess, getDataSuccess, getCurrentSucess, putDataSuccess } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import { POST_DATA, GET_DATA, GET_CUREENT, PUT_DATA } from './constants';

// Individual exports for testing
function* postDataSaga(action) {
  try {
    let urlFile;
    if (action.data.file) {
      const formData = new FormData();
      formData.append('file', action.data.file);
      urlFile = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
    }

    const dataConvert = {
      branch: action.data.branch,
      pending: action.data.pending,
      part: action.data.part,
      amount: action.data.amount,
      needDate: action.data.needDate,
      location: action.data.location,
      startDate: action.data.startDate,
      organizatsionUnit: action.data.organizatsionUnit,
      position: action.data.position,
      note: action.data.note,
      file: urlFile ? urlFile.url : '',
    };
    const data = yield call(request, API_RECRUITMENT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(dataConvert),
    });
    yield put(postDataSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

function* getDataSaga() {
  try {
    const data = yield call(request, API_ORIGANIZATION, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(getDataSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

function* getCurrentSaga(action) {
  try {
    const data = yield call(request, `${API_RECRUITMENT}/${action.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(getCurrentSucess(data));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', message: 'Lấy thông tin tuyển dụng thất bại', status: true }));
  }
}

function* putDataSaga(action) {
  try {
    const data = yield call(request, `${API_RECRUITMENT}/${action.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(action.data),
    });
    yield put(putDataSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

export default function* recruitmentPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(POST_DATA, postDataSaga);
  yield takeLatest(GET_DATA, getDataSaga);
  yield takeLatest(GET_CUREENT, getCurrentSaga);
  yield takeLatest(PUT_DATA, putDataSaga);
}
