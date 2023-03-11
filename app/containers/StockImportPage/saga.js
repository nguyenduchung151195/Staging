import { takeEvery, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_STOCK_IMPORT } from '../../config/urlConfig';
import { GET_ALL_ITEMS } from './constants';
import { getAllItemsSuccess, getAllItemsFailed } from './actions';

export function* getAllItems(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_STOCK_IMPORT}?${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAllItemsSuccess({ data: data.data, count: data.count, skip: data.skip, limit: data.limit }));
    } else {
      yield put(getAllItemsFailed({}));
    }
  } catch (err) {
    yield put(getAllItemsFailed(err));
  }
}

// Individual exports for testing
export default function* stockImportPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_ALL_ITEMS, getAllItems);
}
