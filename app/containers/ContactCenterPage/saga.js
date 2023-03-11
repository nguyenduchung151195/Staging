import { call, put, takeLatest } from 'redux-saga/effects';
import { GET_CONTACT_CENTER } from './constants';
import { CONTACT_CENTER } from '../../config/urlConfig';
import request from '../../utils/request';
import { getContactCenterSuccessAction, getContactCenterErrorAction } from './actions';
export function* fetchGetContacts(action) {
  try {
    const { query } = action;
    let URL = '';
    if (query) {
      URL = `${CONTACT_CENTER}?${query}`;
    } else {
      URL = CONTACT_CENTER;
    }
    const data = yield call(request, URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(getContactCenterSuccessAction(data.data));
  } catch (err) {
    yield put(getContactCenterErrorAction(err));
  }
}
// Individual exports for testing
export default function* contactCenterPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_CONTACT_CENTER, fetchGetContacts);
}
