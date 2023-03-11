import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_CUSTOMERS, API_USERS } from '../../config/urlConfig';
import { GET_ALL_PEOPLE } from './constants';
import { getAllPeopleSuccessAction, getAllPeopleFailAction } from './actions';
import { serialize } from '../../helper';
// Individual exports for testing
export function* getAllPeople(action) {
  let peopleType = '';
  const query = serialize(action.query.filter);
  action.query.type === 'customer' ? (peopleType = API_CUSTOMERS) : (peopleType = API_USERS);
  console.log(action);
  try {
    const data = yield call(request, `${peopleType}?${query}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(getAllPeopleSuccessAction(data.data));
    }
  } catch (err) {
    yield put(getAllPeopleFailAction(err));
  }
}
export default function* hocFindPeopleDialogSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ALL_PEOPLE, getAllPeople);
}
