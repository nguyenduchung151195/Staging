import { takeLatest, call, put } from 'redux-saga/effects';
import { API_REPORT } from '../../config/urlConfig';
import request from '../../utils/request';
import { changeSnackbar } from '../Dashboard/actions';
import { getSaleManagerFailure, getSaleManagerSuccess, mergeData } from './actions';
import { GET_DATA, GET_SALE_MANAGER } from './constants';
import { serialize } from '../../helper';

// Individual exports for testing
export function* getDataSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const filter = serialize({ filter: action.filterDetail });
    const data = yield call(request, `${API_REPORT}/detailsaleOfProduct?${filter}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    let circleColumns = [];
    if (data) {
      circleColumns = [
        {
          country: 'Bán hàng, đặt hàng',
          value: data.totalSale,
        },
        {
          country: 'Hợp đồng',
          value: data.totalContract,
        },
      ];
    }

    yield put(mergeData({ circleColumns }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export function* getSaleManagerSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { path } = action;
    const res = yield call(request, `${API_REPORT}/${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (res && res.status === 1) {
      const data = { path, data: res.data };
      yield put(getSaleManagerSuccess(data));
    } else {
      yield put(getSaleManagerFailure(res));
    }
  } catch (error) {
    console.log(1, error)
    yield put(getSaleManagerFailure(error));
  }
}

export default function* addSalesManagerSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, getDataSaga);
  yield takeLatest(GET_SALE_MANAGER, getSaleManagerSaga);
}
