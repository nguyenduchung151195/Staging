import { call, put, takeEvery } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_DELIVERY } from '../../config/urlConfig';
import { getDelivery, getDeliverySuccess,getDeliveryFailed } from './action';
import { GET_DELIVERY, GET_DELIVERY_FAILED, GET_DELIVERY_SUCCESS } from './constants';
export function* getDeliveryForm(action) {
          console.log(9999, action);
          try {
                    const token = localStorage.getItem('token');
                    const data = yield call(request, `${API_DELIVERY}`, {
                              method: 'GET',
                              headers: {
                                        Authorization: `Bearer ${token}`,
                              },
                    });
                    if (data) {
                              yield put(getDeliverySuccess(data.data));
                    } else {
                              yield put(getDeliveryFailed({}));
                    }
          } catch (err) {
                    //   yield put(getTaskFailed(err));
                    console.log(err);
          }
}
export default function* deliveryFormSaga() {
          // See example in containers/HomePage/saga.js
          yield takeEvery(GET_DELIVERY, getDeliveryForm);
          // yield takeEvery(GET_CONTRACT_AC, getContact);
          // yield takeEvery(GET_ITEM_DELIVERY, getDelivery);
          // yield takeEvery(UPDATE_DELIVERY, updateDelivery);
}