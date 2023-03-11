// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { API_HRM_SALARY_CATEGORY } from 'config/urlConfig';
import { changeSnackbar } from '../../../Dashboard/actions';
import { getAllSalaryCategorySuccess, getAllSalaryCategoryFailure, addSalaryCategorySuccess, addSalaryCategoryFailure, updateSalaryCategorySuccess, updateSalaryCategoryFailure, deleteSalaryCategorySuccess, deleteSalaryCategoryFailure, getAllSalaryCategory, resetSalaryCategoryFailure } from './actions';
import { GET_ALL_SALARY_CATEGORY, ADD_SALARY_CATEGORY, UPDATE_SALARY_CATEGORY, DELETE_SALARY_CATEGORY, RESET_SALARY_CATEGORY } from './contants';

export function* getAllSalaryCategorySaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, API_HRM_SALARY_CATEGORY, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res && res.status === 1) {
      yield put(getAllSalaryCategorySuccess(res.data));
    } else {
      yield put(getAllSalaryCategoryFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.messages || 'Thêm mới thất bại', status: true }));
    }

  } catch (error) {
    yield put(getAllSalaryCategoryFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: error || 'Thêm mới thất bại', status: true }));
  }
}
export function* addSalaryCategorySaga(action) {
  const token = localStorage.getItem('token');
  const { data } = action;
  try {
    const res = yield call(request, API_HRM_SALARY_CATEGORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (res && res.status === 1) {
      yield put(getAllSalaryCategory());
      yield put(addSalaryCategorySuccess(res));
      yield put(changeSnackbar({ variant: 'success', message: 'Thêm mới thành công', status: true }));
    } else {
      yield put(addSalaryCategoryFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.messages || 'Thêm mới thất bại', status: true }));
    }

  } catch (error) {
    yield put(addSalaryCategoryFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: error || 'Thêm mới thất bại', status: true }));
  }
}
export function* updateSalaryCategorySaga(action) {
  const token = localStorage.getItem('token');
  const { data, typeChild: type } = action;
  const METHOD_TYPE_CHILD = {
    add: 'Thêm mới',
    update: 'Cập nhật',
    delete: 'Xóa'
  }
  try {
    const res = yield call(request, `${API_HRM_SALARY_CATEGORY}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (res && res.status === 1) {
      yield put(getAllSalaryCategory());
      yield put(updateSalaryCategorySuccess(res));
      yield put(changeSnackbar({ variant: 'success', message: `${METHOD_TYPE_CHILD[`${type}`]} thành công`, status: true }));
    } else {
      yield put(updateSalaryCategoryFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.messages || `${METHOD_TYPE_CHILD[`${type} thất bại`]}`, status: true }));
    }

  } catch (error) {
    yield put(updateSalaryCategoryFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: error || `${METHOD_TYPE_CHILD[`${type} thất bại`]}`, status: true }));
  }
}

export function* deleteSalaryCategorySaga(action) {
  const token = localStorage.getItem('token');
  const { data } = action;
  try {
    const res = yield call(request, `${API_HRM_SALARY_CATEGORY}/${data._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res && res.status === 1) {
      yield put(getAllSalaryCategory());
      yield put(deleteSalaryCategorySuccess(res));
      yield put(changeSnackbar({ variant: 'success', message: 'Xóa thành công', status: true }));
    } else {
      yield put(deleteSalaryCategoryFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.messages || 'Xóa thất bại', status: true }));
    }

  } catch (error) {
    yield put(deleteSalaryCategoryFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: error || 'Xóa thất bại', status: true }));
  }
}

export function* resetSalaryCategorySaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_SALARY_CATEGORY}/reset`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res && res.status === 1) {
      yield put(getAllSalaryCategory());
      yield put(changeSnackbar({ variant: 'success', message: 'Hoàn tác thành công', status: true }));
    } else {
      yield put(resetSalaryCategoryFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.messages || 'Hoàn tác thất bại', status: true }));
    }

  } catch (error) {
    yield put(resetSalaryCategoryFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: error || 'Hoàn tác thất bại', status: true }));
  }
}

export default function* configHrmSalaryCategorySaga() {
  yield takeLatest(GET_ALL_SALARY_CATEGORY, getAllSalaryCategorySaga);
  yield takeLatest(ADD_SALARY_CATEGORY, addSalaryCategorySaga);
  yield takeLatest(UPDATE_SALARY_CATEGORY, updateSalaryCategorySaga);
  yield takeLatest(DELETE_SALARY_CATEGORY, deleteSalaryCategorySaga);
  yield takeLatest(RESET_SALARY_CATEGORY, resetSalaryCategorySaga);
}
