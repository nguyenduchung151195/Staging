import { call, takeLatest, put } from 'redux-saga/effects';
import request from 'utils/request';
import { API_EXPENSES, API_STOCK, API_BOS, API_PROFILE, API_CUSTOMERS, API_SALE_POLICY } from 'config/urlConfig';
import { push } from 'react-router-redux';
import { mergeData } from './actions';
import { initialState } from './reducer';
import { GET_EXPENSE } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import { serialize } from '../../helper';

// Individual exports for testing

function* getExpenseSaga(action) {
  const token = `Bearer ${localStorage.getItem('token')}`;
  try {
    const getBusinessOpportunitiess = yield call(request, `${API_BOS}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const customers = yield call(request, API_CUSTOMERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    const businessOpportunitiess = getBusinessOpportunitiess.data;
    const inventory = yield call(request, API_STOCK, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    const filter = { filter: { active: true } };
    const qr = serialize(filter);
    const commisionSale = yield call(request, `${API_SALE_POLICY}/?${qr}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    if (action.id !== 'add') {
      const data = yield call(request, `${API_EXPENSES}/${action.id}`, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });

      data.products = data.products.map(item => ({
        ...item,
        name: item.productId.name,
        code: item.productId.code,
        unit: item.productId.unit.name,
        productId: item.productId._id,
      }));

      // eslint-disable-next-line no-console
      // const relityProducts = yield call(request, `${API_EXPENSES}/products/${action.id}`, {
      //   method: 'GET',
      //   headers: {
      //     Authorization: token,
      //   },
      // });

      // let newRelityProducts = [];

      // console.log(commisionSale);

      // if (relityProducts.data.length) {
      //   newRelityProducts = relityProducts.data[0].products.map(item => ({
      //     ...item,
      //     code: item.productId.code,
      //     sourcePrice: item.productId.pricePolicy.sourcePrice,
      //     unit: item.productId.unit.name,
      //   }));
      // }

      yield put(
        mergeData({
          ...data,
          businessOpportunitiess,
          inventory: inventory.data,
          customers: customers.data,
          errorCustomer: false,
          errorCode: false,
          // relityProducts: newRelityProducts,
          commisionSales: commisionSale.data,
        }),
      );
    } else {
      const profile = yield call(request, `${API_PROFILE}`, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });
      if (action.addCustomer === true) {
        if (action && action.customerBoDialog && action.customerBoDialog.customerId) {
          const customerItem = action.customerBoDialog
            ? yield call(request, `${API_CUSTOMERS}/${action.customerBoDialog.customerId}`, {
              method: 'GET',
              headers: {
                Authorization: token,
              },
            })
            : null;
          yield put(
            mergeData({
              ...initialState.toJS(),
              profile,
              businessOpportunitiess,
              inventory: inventory.data,
              customers: customers.data,
              commisionSales: commisionSale.data,
              customer: customerItem,
              ...action.data,
            }),
          );
        } else
          yield put(
            mergeData({
              ...initialState.toJS(),
              profile,
              businessOpportunitiess,
              inventory: inventory.data,
              customers: customers.data,
              commisionSales: commisionSale.data,
              ...action.data,
            }),
          );
      } else {
        yield put(
          mergeData({
            ...initialState.toJS(),
            profile,
            businessOpportunitiess,
            inventory: inventory.data,
            customers: customers.data,
            commisionSales: commisionSale.data,
            ...action.data,
          }),
        );
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('EXPEN', error);

    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

function* putExpenseSaga(action) {
  const token = `Bearer ${localStorage.getItem('token')}`;
  try {
    const data = yield call(request, `${API_EXPENSES}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (data.status === 0) {
      yield put(changeSnackbar({ status: true, message: data.message, variant: 'error' }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      const callback = action.data.callback;
      if (callback) callback();
      else yield put(push('/crm/CostEstimate'));
    }
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

function* getExpenseDefaultSaga() {
  const token = `Bearer ${localStorage.getItem('token')}`;
  try {
    const inventory = yield call(request, API_STOCK, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const getBusinessOpportunitiess = yield call(request, `${API_BOS}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const businessOpportunitiess = getBusinessOpportunitiess.data;
    const profile = yield call(request, `${API_PROFILE}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    yield put(mergeData({ ...initialState.toJS(), profile, businessOpportunitiess, inventory: inventory.data, others: {} }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

function* postExpenseSaga(action) {
  const token = `Bearer ${localStorage.getItem('token')}`;
  try {
    yield call(request, API_EXPENSES, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
    const callback = action.data.callback;
    if (callback) callback();
    else yield put(push('/crm/CostEstimate'));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

export default function* addExpensesPageSaga() {
  yield takeLatest(GET_EXPENSE, getExpenseSaga);
  yield takeLatest('PUT_EXPENSE', putExpenseSaga);
  yield takeLatest('POST_EXPENSE', postExpenseSaga);
  yield takeLatest('GET_EXPENSE_DEFAULT', getExpenseDefaultSaga);
}
