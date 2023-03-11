import { takeLatest, call, put } from 'redux-saga/effects';
import { GET_ALL_COLLECTION } from './constants';
import { getAllCRMCollectionSuccess, getAllCRMCollectionFalse } from './actions';
import { DYNAMIC_COLLECTION } from '../../config/urlConfig';
import request from '../../utils/request';
export function* fetchAllCRMCollection() {
  try {
    const data = yield call(request, DYNAMIC_COLLECTION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(getAllCRMCollectionSuccess(data));
  } catch (err) {
    yield put(getAllCRMCollectionFalse(err));
  }
}
// Individual exports for testing
export default function* crmCollectionSaga() {
  yield takeLatest(GET_ALL_COLLECTION, fetchAllCRMCollection);
  // See example in containers/HomePage/saga.js
}
