/* eslint-disable no-lonely-if */
import { call, put, takeLatest, select } from 'redux-saga/effects';
// import { toJS } from 'immutable';
import { push } from 'react-router-redux';
import { convertTemplate } from 'helper';
import { initialState } from './reducer';
import { GET_SALE, POST_SALE, PUT_SALE, CLOSE_SALES } from './constants';
import { mergeData } from './actions';
import { makeSelectCurrentStock } from '../Dashboard/selectors';
import request from '../../utils/request';
import { serialize } from '../../utils/common';
import { API_STOCK, API_CUSTOMERS, API_USERS, API_PROFILE, API_SALE, API_SERVICES_STOCK, API_TEMPLATE, API_EXPENSES } from '../../config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';

// Individual exports for testing

function PrintElemD(elem) {
  // eslint-disable-next-line no-restricted-globals
  const mywindow = window.open('', 'newWin', `width=${screen.availWidth},height=${screen.availHeight}`);

  const style = `<style>
    .table, .tr, .tr > td {
      border: 1px solid black;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }
  </style>`;
  mywindow.document.write(`<html><head>${style}</head><body>${elem}</body></html>`);
  // mywindow.document.write(elem);

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  setTimeout(() => {
    mywindow.print();
    mywindow.close();
  }, 3000);

  return true;
}

export function* getSaleSaga(action) {
  try {
    const token = localStorage.getItem('token');
    const headGet = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const salePoint = '5fb34bd9d5f7ad3cee5b60dd';
    const customers = yield call(request, API_CUSTOMERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const services = yield call(request, API_SERVICES_STOCK, headGet);
    const expensess = yield call(request, API_EXPENSES, headGet);
    const listProduct = yield call(request, API_STOCK, headGet);
    const templateQuery = serialize({
      filter: {
        moduleCode: 'SalesQuotation',
      },
    });

    const templates = yield call(request, `${API_TEMPLATE}?${templateQuery}`, headGet);

    const employees = yield call(request, API_USERS, headGet);

    const crmSource = JSON.parse(localStorage.getItem('crmSource'));

    const profile = yield call(request, API_PROFILE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newCrmSource = crmSource.find(item => item.code === 'pckh').data;
    const newEmployees = employees.data.map(item => ({ name: item.name, employeeId: item._id }));
    const newCustomers = customers.data.map(item => ({
      ...item,
      name: item.name,
      customerId: item._id,
      customDebitAccount: item.detailInfo && item.detailInfo.options && item.detailInfo.options.customDebitAccount,
      debitAccount: item.detailInfo && item.detailInfo.options && item.detailInfo.options.debitAccount,
      customerLevel: item.detailInfo && item.detailInfo.typeCustomer && item.detailInfo.typeCustomer.branches,
      avatar: item.avatar,
      representName: item.detailInfo && item.detailInfo.represent && item.detailInfo.represent.name,
      representPosition: item.detailInfo && item.detailInfo.represent && item.detailInfo.represent.position,
      representPhoneNumber: item.detailInfo && item.detailInfo.represent && item.detailInfo.represent.phoneNumber,
      contactWays: item.detailInfo && item.detailInfo.typeCustomer && item.detailInfo.typeCustomer.contactWays,
      group: item.detailInfo && item.detailInfo.typeCustomer && item.detailInfo.typeCustomer.group,
      code: item.code,
    }));
    const newProfile = profile ? { name: profile.name, employeeId: profile._id, code: profile.code } : null;

    const newList = listProduct.data.map(item => {
      const tt = item.sellingPoint.find(it => it.organizationUnitId === salePoint);
      const total = tt ? tt.amount : 0;

      return {
        productId: item._id,
        name: item.name,
        costPrice: item.pricePolicy.costPrice,
        sourcePrice: item.pricePolicy.sourcePrice,
        total,
        unit: item.unit ? item.unit.unitId : 'Không xác định',
        discount: 0,
        nameUnit: item.unit ? item.unit.name : 'Không xác định',
        description: item.description,
        code: item.code,
        isDisplaySourcePrice: item.isDisplaySourcePrice,
        warrantyPeriod: item.warrantyPeriod,
        barcode: item.barcode,
      };
    });

    if (action.id !== 'add') {
      const salesQuotation = yield call(request, `${API_SALE}/${action.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      yield put(
        mergeData({
          ...salesQuotation,
          listProduct: newList,
          customers: newCustomers,
          employees: newEmployees,
          crmSource: newCrmSource,
          profile: newProfile,
          templates,
          services,
          errorCode: false,
          expensess: expensess.data,
        }),
      );
    } else {
      // TEST DOT
      if (action.addCustomer) {
        if (action.customerBoDialog.customerId) {
          const customer = yield call(request, `${API_CUSTOMERS}/${action.customerBoDialog.customerId}`, headGet);
          const customerNew = {
            name: customer.name,
            customerId: customer._id,
            customDebitAccount: customer.detailInfo.options.customDebitAccount,
            debitAccount: customer.detailInfo.options.debitAccount,
            customerLevel: customer.detailInfo.typeCustomer.branches,
            avatar: customer.avatar,
            representName: customer.detailInfo.represent.name,
            representPosition: customer.detailInfo.represent.position,
            representPhoneNumber: customer.detailInfo.represent.phoneNumber,
            contactWays: customer.detailInfo.typeCustomer.contactWays,
            group: customer.detailInfo.typeCustomer.group,
            code: customer.code,
          };
          yield put(
            mergeData({
              ...initialState.toJS(),
              listProduct: newList,
              employees: newEmployees,
              crmSource: newCrmSource,
              salesman: newProfile,
              customers: newCustomers,
              templates,
              services,
              salePoint,
              errorCode: true,
              expensess: expensess.data,
              customer: customerNew,
            }),
          );
        } else {
          yield put(
            mergeData({
              ...initialState.toJS(),
              listProduct: newList,
              employees: newEmployees,
              crmSource: newCrmSource,
              salesman: newProfile,
              customers: newCustomers,
              templates,
              services,
              salePoint,
              errorCode: true,
              expensess: expensess.data,
            }),
          );
        }
      } else {
        yield put(
          mergeData({
            ...initialState.toJS(),
            listProduct: newList,
            customers: newCustomers,
            employees: newEmployees,
            crmSource: newCrmSource,
            salesman: newProfile,
            templates,
            services,
            salePoint,
            errorCode: true,
            expensess: expensess.data,
          }),
        );
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-consol
    console.log('REEEE', error);

    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất  bại', variant: 'error' }));
  }
}

function* putSaleSaga(action) {
  const token = localStorage.getItem('token');
  const headGet = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    yield call(request, `${API_SALE}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    const data = yield call(request, `${API_SALE}/for-template/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    if (action.print) {
      const template = yield call(request, `${API_TEMPLATE}/${action.data.template}`, headGet);
      const temp = yield call(convertTemplate, { code: 'SalesQuotation', content: template.content, data });
      PrintElemD(temp);
    }

    yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
    const callback = action.data.callback;
    if (callback) callback();
    // goi lai BoDialog
    else yield put(push('/crm/SalesQuotation'));
  } catch (error) {
    // console.log(error);
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

function* postSaleSaga(action) {
  // if (action.data.kanbanStatus === '5fb8ccb2ee748c1c609d624b') {
  //   action.data.kanbanStatus = '616f9e64262b8b3655aa3d91';
  // }
  const token = localStorage.getItem('token');
  const headGet = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const dataGet = yield call(request, API_SALE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    const data = yield call(request, `${API_SALE}/for-template/${dataGet.data._id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (action.print) {
      const template = yield call(request, `${API_TEMPLATE}/${action.data.template}`, headGet);
      const temp = yield call(convertTemplate, { code: 'SalesQuotation', content: template.content, data });
      PrintElemD(temp);
    }
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
    const callback = action.data.callback;
    if (callback) callback();
    // goi lai BoDialog
    else yield put(push('/crm/SalesQuotation'));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

// đóng dự án
function* closeSalesSaga(action) {
  try {
    const callback = action.callback;
    if (callback) callback();
    else yield put(push('/crm/SalesQuotation'));
  } catch (error) {
    yield put(push('/crm/SalesQuotation'));
  }
}
export default function* addSalesQuotationSaga() {
  yield takeLatest(GET_SALE, getSaleSaga);
  yield takeLatest(POST_SALE, postSaleSaga);
  yield takeLatest(PUT_SALE, putSaleSaga);
  yield takeLatest(CLOSE_SALES, closeSalesSaga);
}
