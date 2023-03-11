import { takeLatest, call, put } from 'redux-saga/effects';

import request from '../../utils/request';
import { API_TEMPLATE, API_TRADINGS, API_BOS, API_EXPENSES, API_LOG } from '../../config/urlConfig';
import { getCostSuccess, getDataSuccess, updateExpenseSuccess, updateExpenseFailure } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import { GET_COST, GET_DATA, UPDATE_EXPENSE } from './constants';
import { clientId } from '../../variable';

function* getCostSaga() {
  try {
    const forms = yield call(request, `${API_TEMPLATE}?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
    });
    yield put(getCostSuccess(forms));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

function* getDataSaga() {
  try {
    const businessData = yield call(request, API_BOS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const exchangingData = yield call(request, API_TRADINGS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    yield put(getDataSuccess(businessData, exchangingData));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu CHKD thất bại', variant: 'error' }));
  }
}

function* putExpenseSaga(action) {

  const token = `Bearer ${localStorage.getItem('token')}`;

  try {
    const oldData = yield call(request, `${API_EXPENSES}/${action.data._id}`, {
      method: 'GET',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });
    if (oldData) {
      const response = yield call(request, `${API_EXPENSES}/${action.data._id}`, {
        method: 'PUT',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.data),
      });
      if (!response || response.status === 0) {
        yield put(changeSnackbar({ status: true, message: response.message, variant: 'error' }));
        yield put(updateExpenseFailure());
      } else {
        // const currentEmployee = yield select(makeSelectDashboardPage('profile'));

        // const employee = {
        //   employeeId: currentEmployee._id,
        //   name: currentEmployee.name,
        // };
        // const newLog = {
        //   content: getLogString(oldData, updateTradings.data, 'ST03'),
        //   employee,
        //   model: 'CostEstimate',
        //   type: 'update',
        //   objectId: action.doc._id,
        // };
        // try {
        //   const data = yield call(request, `${API_LOG}`, {
        //     method: 'POST',
        //     body: JSON.stringify(newLog),
        //     headers: {
        //       Authorization: `Bearer ${localStorage.getItem('token')}`,
        //       'Content-type': 'application/json',
        //     },
        //   });

        //   // const { objectId } = data;
        //   // yield put(postLogSuccessAct(data));
        //   // yield put(getLogAct({ objectId }));
        // } catch (err) {
        //   // console.log(err);
        //   // yield put(postLogFailedAct(err));
        // }

        yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
        yield put(updateExpenseSuccess());
      }
    }
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateExpenseFailure());
  }
}

export default function* expensesPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_COST, getCostSaga);
  yield takeLatest(GET_DATA, getDataSaga);
  yield takeLatest(UPDATE_EXPENSE, putExpenseSaga);
}
