// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { API_TIMEKEEPING_TABLE, API_SALARY_FORMULA, API_TITLE_WAGES_SALARY, API_HRM_WAGES, } from 'config/urlConfig';
import {
  createWageSalarySuccess,
  createWageSalaryFailure,
  updateWageSalarySuccess,
  updateWageSalaryFailure,
  deleteWageSalarySuccess,
  deleteWageSalaryFailure,
  getAllSalaryFormulaSuccess,
  getAllSalaryFormulaFailure,
  getSalaryFormulaAttributesFailure,
  getSalaryFormulaAttributesSuccess
} from './actions';
import { CREATE_WAGE_SALARY, UPDATE_WAGE_SALARY, DELETE_WAGE_SALARY, GET_ALL_SALARY_FORMULA, GET_SALARY_FORMULA_ATTRIBUTES } from './constants';
import { changeSnackbar } from 'containers/Dashboard/actions';

export function* createWageSalary(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_WAGES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response && response.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createWageSalarySuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createWageSalaryFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createWageSalaryFailure(err));
  }
}

export function* getAllSalaryFormulaSaga() {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_SALARY_FORMULA}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (res && res.status === 1) {
      yield put(getAllSalaryFormulaSuccess(res.data));
    } else {
      // yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
      yield put(getAllSalaryFormulaFailure(res));
    }
  } catch (err) {
    yield put(getAllSalaryFormulaFailure(err));
    // yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}



export function* updateWageSalary(action) {
  try {
    const { hrmEmployeeId: wagesId, data } = action;
    const response = yield call(request, `${API_TIMEKEEPING_TABLE}/${wagesId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response && response.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateWageSalarySuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateWageSalaryFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateWageSalaryFailure(err));
  }
}

export function* deleteWageSalary(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_WAGES}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response && response.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteWageSalarySuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteWageSalaryFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteWageSalaryFailure(err));
  }
}

export function* getSalaryFormulaAttributes(action) {
  const { formulaId } = action;
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_TITLE_WAGES_SALARY}?formulaId=${formulaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    if (res && res.status === 1) {
      yield put(getSalaryFormulaAttributesSuccess(res.data));
    } else {
      yield put(changeSnackbar({ status: true, message: res.message, variant: 'error' }));
      yield put(getSalaryFormulaAttributesFailure(res));
    }
  } catch (err) {
    yield put(getSalaryFormulaAttributesFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export default function* wagesPageSaga() {
  yield takeLatest(CREATE_WAGE_SALARY, createWageSalary);
  yield takeLatest(UPDATE_WAGE_SALARY, updateWageSalary);
  yield takeLatest(DELETE_WAGE_SALARY, deleteWageSalary);
  yield takeLatest(GET_ALL_SALARY_FORMULA, getAllSalaryFormulaSaga);
  yield takeLatest(GET_SALARY_FORMULA_ATTRIBUTES, getSalaryFormulaAttributes);
}
