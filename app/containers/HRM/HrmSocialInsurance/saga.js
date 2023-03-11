// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../utils/request';
import { API_RECRUITMENT, API_SHARE_INSURANCE } from '../../../config/urlConfig';
import {
  createSocialInsuranceSuccess,
  createSocialInsuranceFailure,
  updateSocialInsuranceSuccess,
  updateSocialInsuranceFailure,
  deleteSocialInsuranceSuccess,
  deleteSocialInsuranceFailure,
  shareInsurance,
  shareInsuranceFailed,
  shareInsuranceSuccess,
} from './actions';
import {
  CREATE_SOCIALINSURANCE,
  UPDATE_SOCIALINSURANCE,
  DELETE_SOCIALINSURANCE,
  SHARE_INSURANCE_REQUEST,
  GET_INSURANCE_DATA_REQUEST,
} from './constants';
import { changeSnackbar } from '../../Dashboard/actions';

export function* createSocialInsurance(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_RECRUITMENT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createSocialInsuranceSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createSocialInsuranceFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createSocialInsuranceFailure(err));
  }
}

export function* updateSocialInsurance(action) {
  try {
    const { hrmEmployeeId: SocialInsuranceId, data } = action;
    const response = yield call(request, `${API_RECRUITMENT}/${SocialInsuranceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateSocialInsuranceSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateSocialInsuranceFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateSocialInsuranceFailure(err));
  }
}

export function* shareSocialInsurance(action) {
  try {
    const { data } = action;
    const response = yield call(request, `${API_SHARE_INSURANCE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Gửi danh sách thành công', variant: 'success' }));
      yield put(shareInsuranceSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Gửi danh sách thất bại', variant: 'error' }));
      yield put(shareInsuranceFailed(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Gửi danh sách thất bại', variant: 'error' }));
    yield put(shareInsuranceFailed(err));
  }
}

export function* getInsuranceData(action) {
  console.log(action);
  // try {
  //   const { data } = action;
  //   const response = yield call(request, `${API_SHARE_INSURANCE}?`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //   if (response.status) {
  //     yield put(getInsuranceDataSuccess(response));
  //   } else {
  //     yield put(changeSnackbar({ status: true, message: response.message || 'Lấy danh sách thất bại', variant: 'error' }));
  //     yield put(getInsuranceDataFailed(response));
  //   }
  // } catch (err) {
  //   yield put(changeSnackbar({ status: true, message: err.message || 'Lấy danh sách thất bại', variant: 'error' }));
  //   yield put(getInsuranceDataFailed(err));
  // }
}

export function* deleteSocialInsurance(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_RECRUITMENT}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteSocialInsuranceSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteSocialInsuranceFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteSocialInsuranceFailure(err));
  }
}

export default function* recruitmentManagementPageSaga() {
  yield takeLatest(CREATE_SOCIALINSURANCE, createSocialInsurance);
  yield takeLatest(UPDATE_SOCIALINSURANCE, updateSocialInsurance);
  yield takeLatest(DELETE_SOCIALINSURANCE, deleteSocialInsurance);
  yield takeLatest(SHARE_INSURANCE_REQUEST, shareSocialInsurance);
  yield takeLatest(GET_INSURANCE_DATA_REQUEST, getInsuranceData);
}
