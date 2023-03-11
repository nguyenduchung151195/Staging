import { takeLatest, call, put, select } from 'redux-saga/effects';
import request from 'utils/request';
import {
  createAccountRequestSuccess,
  createcreateAccountRequestFailed,
  updateAccountRequestFailure,
  updateAccountRequestSuccess,
  updatePasswordRequestSuccess,
  updatePasswordRequestFailure,
} from './actions';
import { CREATE_ACCOUNT_REQUESTED, UPDATE_ACCOUNT_REQUESTED, UPDATE_PASSWORD_REQUESTED } from './constants';
import { API_BANK_ACCOUNT } from '../../config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';

const requestURL = API_BANK_ACCOUNT;

function* createAccountRequest(data) {
  try {
    const token = localStorage.getItem('token');
    const response = yield call(request, requestURL, {
      method: 'POST',
      headers: {
        Authorazation: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createAccountRequestSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
      yield put(createcreateAccountRequestFailed(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
    yield put(createcreateAccountRequestFailed(err));
  }
}

function* updateAccountRequest(data) {
  try {
    const token = localStorage.getItem('token');
    const response = yield call(request, `${requestURL}/${data.data._id}`, {
      method: 'PUT',
      headers: {
        Authorazation: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateAccountRequestSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateAccountRequestFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateAccountRequestFailure(err));
  }
}

//   function* updatePasswordRequest(data) {
//     try {
//       console.log(data,'oo')
//       const token = localStorage.getItem('token');
//       const response = yield call(request, `${requestURL}/${data.data.id}`, {
//         method: 'PUT',
//         headers: {
//           Authorazation: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data.data),
//       });
//       if (response.status) {
//         yield put(changeSnackbar({ status: true, message: 'Đổi mật khẩu thành công', variant: 'success' }));
//         yield put(updatePasswordRequestSuccess(response));
//       } else {
//         yield put(changeSnackbar({ status: true, message: response.message || 'Đổi mật khẩu thất bại', variant: 'error' }));
//         yield put(updatePasswordRequestFailure(response));
//       }
//     } catch (err) {
//       yield put(changeSnackbar({ status: true, message: err.message || 'Đổi mật khẩu thất bại', variant: 'error' }));
//       yield put(updatePasswordRequestFailure(err));
//     }
//   }

export default function* rootSaga() {
  yield takeLatest(CREATE_ACCOUNT_REQUESTED, createAccountRequest);
  yield takeLatest(UPDATE_ACCOUNT_REQUESTED, updateAccountRequest);
  //   yield takeLatest(UPDATE_PASSWORD_REQUESTED, updatePasswordRequest);
}
