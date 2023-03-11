import { takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { API_STOCK, API_CATEGORY_STOCK_TREE, API_TAG_STOCK, API_SALE_POLICY, API_SOURCE_CRMCONFIG, API_CUSTOMERS } from '../../config/urlConfig';
import request from '../../utils/request';
import { postSalesPolicySuccess, getSalesPolicyCurrentSuccess, putSalesPolicySuccess, mergeData } from './actions';
import { GET_SALES_POLICY, POST_SALES_POLICY, GET_SALES_POLICY_CURRENT, PUT_SALES_POLICY, HANDLE_CLOSE } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
// Individual exports for testing
function* getSalesPolicySaga() {
  try {
    const products = yield call(request, API_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const sources = yield call(request, API_SOURCE_CRMCONFIG, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const categorys = yield call(request, API_CATEGORY_STOCK_TREE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const labels = yield call(request, API_TAG_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const customers = yield call(request, API_CUSTOMERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    yield put(
      mergeData({
        products,
        categorys,
        labels,
        customers: customers.data,
        sources: [
          { name: 'Khách hàng', type: 1, conditionType: 1, value: 'customers', data: [], condition: 1 },
          { name: 'Số tiền bán hàng', type: 3, conditionType: 3, value: 'amount', data: [], condition: 1 },
        ].concat(sources.filter(i => Boolean(i.code)).map(item => ({ ...item, name: item.title, type: 2, value: item.code }))),
      }),
    );
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

function* postSalesPolicy(action) {
  try {
    yield call(request, API_SALE_POLICY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(postSalesPolicySuccess());
    yield put(changeSnackbar({ status: true, message: 'Thêm chính sách bán hàng thành công', variant: 'success' }));
    yield put(push('/crm/SalesPolicy'));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm chính sách bán hàng thất bại', variant: 'error' }));
  }
}
function* getSalesPolicyCurrent(action) {
  try {
    const data = yield call(request, `${API_SALE_POLICY}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(action.data),
    });
    // if (data.conditions.length) data.conditions = [{ type: 1, value: 'customers', conditionType: 0, data: null }];
    yield put(getSalesPolicyCurrentSuccess(data));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

function* putSalesPolicy(action) {
  try {
    const data = yield call(request, `${API_SALE_POLICY}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(putSalesPolicySuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật chính sách bán hàng thành công', variant: 'success' }));
    yield put(push('/crm/SalesPolicy'));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật chính sách bán hàng thất bại', variant: 'error' }));
  }
}
function* closeProject() {
  try {
    yield put(push('/crm/SalesPolicy'));
  } catch (error) {
    yield put(push('/crm/SalesPolicy'));
  }
}

export default function* addSalesPolicySaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_SALES_POLICY, getSalesPolicySaga);
  yield takeLatest(POST_SALES_POLICY, postSalesPolicy);
  yield takeLatest(GET_SALES_POLICY_CURRENT, getSalesPolicyCurrent);
  yield takeLatest(PUT_SALES_POLICY, putSalesPolicy);
  yield takeLatest(HANDLE_CLOSE, closeProject);
}
