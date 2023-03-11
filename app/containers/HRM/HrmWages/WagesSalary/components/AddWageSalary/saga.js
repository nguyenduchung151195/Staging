import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import {API_SALARY_FORMULA } from 'config/urlConfig'
import { getAllSalaryFormulaSuccess, getAllSalaryFormulaFailure } from './actions'
// import { changeSnackbar } from 'Dashboard/actions';
import {GET_ALL_SALARY_FORMULA} from './constants';

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

// Individual exports for testing
export default function* addWagesSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ALL_SALARY_FORMULA, getAllSalaryFormulaSaga);
}
