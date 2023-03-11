import { call, put, takeEvery } from 'redux-saga/effects';
import qs from 'qs';
import request from '../../utils/request';
import { CRM_SOURCE, API_ORDER_PO, API_ADD_NEW_PRODUCT } from '../../config/urlConfig';
import {
  getCRMSourceSuccessAct,
  getCRMSourceFailedAct,
  createOrderSuccessAct,
  createOrderFailedAct,
  getOrderUpdateSuccessAct,
  getProductBySupplierSuccessAct,
  getProductBySupplierFailed,
  getProductByIdSuccessAct,
  getProductByIdFailed,
  updateOrderSuccess,
  updateOrderFailed,
} from './actions';
import { GET_CRM_SOURCE, CREATE_NEW_ORDER, UPDATE_ORDER, GET_ORDER_UPDATE, GET_PRODUCT_BY_SUPPLIER, GET_PRODUCT_BY_ID } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import { getOrderFailed } from '../AddSupplierContract/actions';
export function* getCrmSource() {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, `${CRM_SOURCE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getCRMSourceSuccessAct(data));
    } else {
      yield put(getCRMSourceFailedAct({}));
    }
  } catch (err) {
    yield put(getCRMSourceFailedAct(err));
  }
}
export function* getOrder(action) {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, `${API_ORDER_PO}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getOrderUpdateSuccessAct(data));
    } else {
      yield put(getOrderFailed({}));
    }
  } catch (err) {
    yield put(getOrderFailed(err));
  }
}
export function* createNewOder(action) {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, API_ORDER_PO, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(action.body),
    });
    if (data) {
      yield put(createOrderSuccessAct(data));
      yield put(changeSnackbar({ status: true, message: 'Tạo mới nhập hàng thành công', variant: 'success' }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Tạo mới nhập hàng thất bại', variant: 'error' }));
      yield put(createOrderFailedAct({}));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Tạo mới nhập hàng thất bại', variant: 'error' }));
    yield put(createOrderFailedAct(err));
  }
}
export function* updateOrder(action) {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, `${API_ORDER_PO}/${action.body.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(action.body),
    });
    if (data) {
      yield put(updateOrderSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật nhập hàng thành công', variant: 'success' }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật nhập hàng thất bại', variant: 'error' }));
      yield put(updateOrderFailed({}));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật nhập hàng thất bại', variant: 'error' }));
    yield put(updateOrderFailed(err));
  }
}

export function* getProductByStock(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ADD_NEW_PRODUCT}/organizationUnit/${action.body}?${action.params}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getProductBySupplierSuccessAct(data.data));
    } else {
      yield put(getProductBySupplierFailed({}));
    }
  } catch (err) {
    yield put(getProductBySupplierFailed(err));
  }
}

export function* getProductById(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ADD_NEW_PRODUCT}/?${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getProductByIdSuccessAct(data.data));
    } else {
      yield put(getProductByIdFailed({}));
    }
  } catch (err) {
    yield put(getProductByIdFailed(err));
  }
}

// Individual exports for testing
export default function* addImportProductSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_CRM_SOURCE, getCrmSource);
  yield takeEvery(CREATE_NEW_ORDER, createNewOder);
  yield takeEvery(UPDATE_ORDER, updateOrder);
  yield takeEvery(GET_ORDER_UPDATE, getOrder);
  yield takeEvery(GET_PRODUCT_BY_SUPPLIER, getProductByStock);
  yield takeEvery(GET_PRODUCT_BY_ID, getProductById);
}
