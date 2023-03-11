import { call, takeLatest, put, takeEvery } from 'redux-saga/effects';
import qs from 'qs';
import request, { requestApprove } from '../../utils/request';
import { API_STOCK_EXPORT, API_ADD_NEW_PRODUCT, API_APPROVE } from '../../config/urlConfig';
import {
  getProductBySupplierSuccessAct,
  getProductBySupplierFailed,
  getProductByIdSuccessAct,
  getProductByIdFailed,
  createExportRecordSuccess,
  createExportRecordFailed,
  getOrderByIdSuccess,
  getOrderByIdFailed,
  updateOrderExportSuccess,
  updateOrderExportFailed,
} from './actions';
import { clientId } from '../../variable';
import { GET_PRODUCT_BY_SUPPLIER, GET_PRODUCT_BY_ID, CREATE_NEW_ORDER, GET_ORDER_BY_ID, UPDATE_ORDER } from './constants';
import { changeSnackbar } from '../Dashboard/actions';

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
    const data = yield call(request, `${API_ADD_NEW_PRODUCT}?${action.id}`, {
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

export function* createNewExport(action) {
  try {
    const token = localStorage.getItem('token');
    const dynamicFormsList = action.body.dynamicFormsList;
    action.body.dynamicFormsList = undefined;
    const data = yield call(request, API_STOCK_EXPORT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (data) {
      if (Number(action.body.state) === 4) {
        yield put(createExportRecordSuccess(data));
        yield put(changeSnackbar({ status: true, message: 'Tạo mới xuất kho thành công', variant: 'success' }));
      } else if (Number(action.body.state) === 0) {
        const dynamicFormsObject = dynamicFormsList.find(n => String(n._id) === String(action.body.dynamicForms));
        const content = dynamicFormsObject.content;
        const groupInfo = [];
        action.body.groupSelected.group.forEach(item => {
          groupInfo.push({
            order: item.order,
            person: item.person,
            approve: 0,
            reason: '',
          });
        });
        const bodyApprovedRequest = {
          name: action.body.name,
          subCode: 'Yêu cầu xuất kho',
          collectionCode: dynamicFormsObject.moduleCode,
          content,
          dataInfo: data,
          dynamicForm: action.body.dynamicForms,
          convertMapping: '5d832729c252b2577006c5ab',
          approveGroup: action.body.groupApproved.idGroupApproved,
          clientId,
          groupInfo,
        };
        const forms = yield call(requestApprove, `${API_APPROVE}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json',
          },
          body: JSON.stringify(bodyApprovedRequest),
        });
        if (forms) {
          yield put(createExportRecordSuccess(forms));
          yield put(changeSnackbar({ status: true, message: 'Tạo mới xuất kho thành công', variant: 'success' }));
        }
      } else {
        yield put(createExportRecordSuccess(data));
        yield put(changeSnackbar({ status: true, message: 'Tạo mới xuất kho thành công', variant: 'success' }));
      }
    } else {
      yield put(changeSnackbar({ status: true, message: 'Tạo mới xuất kho thất bại', variant: 'error' }));
      yield put(createExportRecordFailed({}));
    }
  } catch (err) {
    console.log(err, "err")
    yield put(changeSnackbar({ status: true, message: `${err.message}`, variant: 'error' }));
    yield put(createExportRecordFailed(err));
  }
}

export function* updateExport(action) {
  try {
    const token = localStorage.getItem('token');
    delete action.body.dynamicFormsList;
    const data = yield call(request, `${API_STOCK_EXPORT}/${action.body.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(action.body),
    });
    if (data) {
      yield put(updateOrderExportSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật xuất kho thành công', variant: 'success' }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật xuất kho thất bại', variant: 'error' }));
      yield put(updateOrderExportFailed({}));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: `${err.message}`, variant: 'error' }));
    yield put(updateOrderExportFailed(err));
  }
}

export function* getOrderById(action) {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, `${API_STOCK_EXPORT}/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getOrderByIdSuccess(data));
    } else {
      yield put(getOrderByIdFailed({}));
    }
  } catch (err) {
    yield put(getOrderByIdFailed(err));
  }
}

// Individual exports for testing
export default function* addExportStockPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_PRODUCT_BY_SUPPLIER, getProductByStock);
  yield takeEvery(GET_PRODUCT_BY_ID, getProductById);
  yield takeLatest(CREATE_NEW_ORDER, createNewExport);
  yield takeEvery(GET_ORDER_BY_ID, getOrderById);
  yield takeEvery(UPDATE_ORDER, updateExport);
}
