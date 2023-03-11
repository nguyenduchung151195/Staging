import { call, put, takeLatest, select } from 'redux-saga/effects';
import request from 'utils/request';
import { API_CUSTOMERS, API_VIEW_CONFIG, API_CAMPAIGN } from 'config/urlConfig';
import { fetchFailedAction, fetchSuccessAction, fetchAction, deleteCustomersFailed, putConfigSuccess, putConfigFailed, updateMultipleCustomersFailure, updateMultipleCustomersSuccess } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import { makeSelectProfile } from '../Dashboard/selectors';
import { serialize } from '../../helper';
import { UPDATE_MULTILE_CUSTOMERS } from './constants'

function* fetchCustomer() {
  try {
    const profile = yield select(makeSelectProfile());
    // theo nam
    const dateStart = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0).toISOString();
    const dateEnd = new Date(new Date().getFullYear(), 11, 31, 0, 0, 0).toISOString();

    const filter = serialize({ filter: { createdBy: profile._id, createdAt: { $gte: dateStart, $lte: dateEnd } } });
    // const filter1 = serialize({ filter: { createdBy: profile._id, createdAt: { $gt: m1, $lt: m2 } } });

    const data = yield call(request, `${API_CUSTOMERS}?${filter}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const typeCustomer = yield call(request, `${API_CUSTOMERS}/typeCustomer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const introducedWay = yield call(request, `${API_CUSTOMERS}/introducedWay`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const contractOfCustomer = yield call(request, `${API_CUSTOMERS}/contractOfCustomer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const bestRevenueCustomer = yield call(request, `${API_CUSTOMERS}/bestRevenueCustomer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (data) {
      yield put(fetchSuccessAction(data.data, typeCustomer.data, introducedWay.data, contractOfCustomer.data, bestRevenueCustomer.data));
    } else {
      yield put(fetchFailedAction());
    }
  } catch (error) {
    yield put(fetchFailedAction());
  }
}

function* deleteCustomers(action) {
  try {
    yield call(request, `${API_CUSTOMERS}/remove-more`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ customers: action.list }),
    });
    yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
    yield put(fetchAction());
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
    yield put(deleteCustomersFailed());
  }
}

function* putConfig(action) {
  try {
    const data = yield call(request, `${API_VIEW_CONFIG}/${action.data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(changeSnackbar({ status: true, message: 'Cập nhật viewConfig thành công', variant: 'success' }));
    yield put(putConfigSuccess(data.data));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật viewConfig thất bại', variant: 'error' }));
    yield put(putConfigFailed());
  }
}

function* updateMultipleCustomers(action) {
  try {
    const response = yield call(request, `${API_CUSTOMERS}/multiple`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (response.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Lưu dữ liệu thành công', variant: 'success' }));
      yield put(updateMultipleCustomersSuccess());
    } else {
      yield put(changeSnackbar({ status: true, message: response.message, variant: 'error' }));
      yield put(updateMultipleCustomersFailure());
    }   
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lưu dữ liệu thất bại', variant: 'error' }));
    yield put(updateMultipleCustomersFailure());
  }
}

function* createCampaign(action) {
  try {
    const response = yield call(request, `${API_CAMPAIGN}/sendmail-campaign`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (response.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Tạo chiến dịch thành công', variant: 'success' }));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message, variant: 'error' }));
    }   
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Tạo chiến dịch thất bại', variant: 'error' }));
  }
}



// Individual exports for testing
export default function* customersPageSaga() {
  yield takeLatest('FETCH_CUSTOMER', fetchCustomer);
  yield takeLatest('PUT_CONFIG', putConfig);
  yield takeLatest('DELETE_CUSTOMERS', deleteCustomers);
  yield takeLatest(UPDATE_MULTILE_CUSTOMERS, updateMultipleCustomers);
  yield takeLatest('CREATE_CAMPAIGN', createCampaign);
}
