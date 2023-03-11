import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { GET_CHARGE_PROPORTION, GET_COMPARE_SALES_PERSON_SALES_OF_YEAR, GET_DETAILED_SALES_BY_STAFF, GET_PROPORTION_OF_COST_BY_DEPARTMENT, GET_PROPORTION_OF_COST_BY_ITEM, GET_SUM_IN_YEAR, GET_SUM_REVENUE_COST_IN_YEAR, GET_SUM_REVENUE_INVENTORY_IN_YEAR } from './constants';
import { getSumInYearSuccess, getSumInYearFailure, getChargeProportionSuccess, getChargeProportionFailure, getSumRevenueCostInYearSuccess, getSumRevenueCostInYearFailure, getSumRevenueInventoryInYearSuccess, getSumRevenueInventoryInYearFailure, getCompareSalesPersonSalesOfYearSuccess, getDetailedSalesByStaffSuccess, getCompareSalesPersonSalesOfYearFailure, getDetailedSalesByStaffFailure, getProportionOfCostByDepartmentSuccess, getProportionOfCostByDepartmentFailure, getProportionOfCostByItemSuccess, getProportionOfCostByItemFailure } from './actions';
import { API_REPORT_SUM_IN_YEAR, API_REPORT_CHARGE_PROPORTION, API_REPORT_SUM_REVENUE_COST_IN_YEAR, API_REPORT_SUM_REVENUE_INVENTORY_IN_YEAR } from 'config/urlConfig';
import { API_REPORT_EXPENSE_REPORT_BY_TYPE, API_REPORT_AGGREGATE_SALES_OF_SALES_STAff } from '../../config/urlConfig';

// tổng hợp chi phí bộ phận và khoản mục
export function* getSumInYearSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_REPORT_SUM_IN_YEAR}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      method: "GET"
    })

    if (res && res.status === 1) {
      yield put(getSumInYearSuccess(res.data))
    } else {
      yield put(getSumInYearFailure(res))
    }
  } catch (error) {
    yield put(getSumInYearFailure(error))
  }
}

export function* getChargeProportionSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_REPORT_CHARGE_PROPORTION}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      method: "GET"
    })

    if (res && res.status === 1) {
      yield put(getChargeProportionSuccess(res.data))
    } else {
      yield put(getChargeProportionFailure(res))
    }
  } catch (error) {
    yield put(getChargeProportionFailure(error))
  }
}

// tổng hợp doanh số theo khách hàng và hàng hóa
export function* getSumRevenueCostInYearSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_REPORT_SUM_REVENUE_COST_IN_YEAR}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      method: "GET"
    })

    // console.log(1, res)
    if (res && res.status === 1) {
      yield put(getSumRevenueCostInYearSuccess(res.data))
    } else {
      yield put(getSumRevenueCostInYearFailure(res))
    }
  } catch (error) {
    yield put(getSumRevenueCostInYearFailure(error))
  }
}

export function* getSumRevenueInventoryInYearSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_REPORT_SUM_REVENUE_INVENTORY_IN_YEAR}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      method: "GET"
    })

    if (res && res.status === 1) {
      yield put(getSumRevenueInventoryInYearSuccess(res.data))
    } else {
      yield put(getSumRevenueInventoryInYearFailure(res))
    }
  } catch (error) {
    yield put(getSumRevenueInventoryInYearFailure(error))
  }
}

// Tổng hợp doanh số theo nhân viên kinh doanh
export function* getDetailedSalesByStaffSaga(action) {
  const token = localStorage.getItem('token');
  try {
    // const res = yield call(request, `${API_REPORT_SUM_REVENUE_INVENTORY_IN_YEAR}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   method: "GET"
    // })

    //fake data
    const data = [
      {
        year: 'Tháng 1',
        income: 3322.5,
        expenses: 2918.1,
      },
      {
        year: 'Tháng 2',
        income: 3326.2,
        expenses: 2612.8,
      },
      {
        year: 'Tháng 3',
        income: 3330.1,
        expenses: 2513.9,
      },
      {
        year: 'Tháng 4',
        income: 3229.5,
        expenses: 2625.1,
      },
      {
        year: 'Tháng 5',
        income: 3424.6,
        expenses: 2925,
      },
      {
        year: 'Tháng 6',
        income: 3030.1,
        expenses: 2623.9,
      },
      {
        year: 'Tháng 7',
        income: 3429.5,
        expenses: 2725.1,
      },
      {
        year: 'Tháng 8',
        income: 3129.5,
        expenses: 2525.1,
      },
      {
        year: 'Tháng 9',
        income: 2629.5,
        expenses: 3425.1,
      },
      {
        year: 'Tháng 10',
        income: 3229.5,
        expenses: 3325.1,
      },
      {
        year: 'Tháng 11',
        income: 2829.5,
        expenses: 3525.1,
      },
      {
        year: 'Tháng 12',
        income: 3369.5,
        expenses: 2825.1,
      },
    ]
    yield put(getDetailedSalesByStaffSuccess(data));
    // end fake

    // if (res && res.status === 1) {
    //   yield put(getDetailedSalesByStaffSuccess(res.data))
    // } else {
    //   yield put(getDetailedSalesByStaffFailure(res))
    // }
  } catch (error) {
    yield put(getDetailedSalesByStaffFailure(error))
  }
}
export function* getCompareSalesPersonSalesOfYearSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_REPORT_AGGREGATE_SALES_OF_SALES_STAff}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      method: "GET"
    })

    if (res && res.status === 1) {
      yield put(getCompareSalesPersonSalesOfYearSuccess(res.data))
    } else {
      yield put(getCompareSalesPersonSalesOfYearFailure(res))
    }
  } catch (error) {
    yield put(getCompareSalesPersonSalesOfYearFailure(error))
  }
}

//
export function* getProportionOfCostByItemSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_REPORT_EXPENSE_REPORT_BY_TYPE}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      method: "GET"
    })
    if (res && res.status === 1) {
      yield put(getProportionOfCostByItemSuccess(res.data))
    } else {
      yield put(getProportionOfCostByItemFailure(res))
    }
  } catch (error) {
    yield put(getProportionOfCostByItemFailure(error))
  }
}
export function* getProportionOfCostByDepartmentSaga(action) {
  const token = localStorage.getItem('token');
  try {
    // const res = yield call(request, `${API_REPORT_SUM_REVENUE_INVENTORY_IN_YEAR}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   method: "GET"
    // })

    //fake data
    const data = [
      {
        country: 'Nguyễn Quốc Khánh',

        x2: 1407.8,
        x3: 1250,
      },
      {
        country: 'Nguyễn Xuân Sơn',
        x2: 3471.1,
        x3: 3580,
      },
      {
        country: 'Hoàng Tiến Đạt	 ',
        x2: 282,
        x3: 1222,
      },
      {
        country: 'Dương Quốc Tuấn	',
        x2: 3412.2,
        x3: 1240,
      },
      {
        country: 'Nguyễn Văn Kiên	 ',
        x2: 482.2,
        x3: 1245,
      },
      {
        country: 'Mai Văn Luyện	 ',
        x2: 255.6,
        x3: 1226,
      },
      {
        country: 'Hoàng Minh Hải	 ',
        x2: 2563.3,
        x3: 1250,
      },
      {
        country: 'Nguyễn Hoàng Tùng	 ',
        x2: 270.4,
        x3: 1226,
      },
      {
        country: 'Nguyễn Hải Nam	 ',
        x2: 310.8,
        x3: 1290,
      },
    ]
    yield put(getProportionOfCostByDepartmentSuccess(data));
    // end fake

    // if (res && res.status === 1) {
    //   yield put(getProportionOfCostByDepartmentSuccess(res.data))
    // } else {
    //   yield put(getProportionOfCostByDepartmentFailure(res))
    // }
  } catch (error) {
    yield put(getProportionOfCostByDepartmentFailure(error))
  }
}

// Individual exports for testing
export default function* reportPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_SUM_IN_YEAR, getSumInYearSaga);
  yield takeLatest(GET_CHARGE_PROPORTION, getChargeProportionSaga);
  yield takeLatest(GET_SUM_REVENUE_COST_IN_YEAR, getSumRevenueCostInYearSaga);
  yield takeLatest(GET_SUM_REVENUE_INVENTORY_IN_YEAR, getSumRevenueInventoryInYearSaga);
  yield takeLatest(GET_DETAILED_SALES_BY_STAFF, getDetailedSalesByStaffSaga);
  yield takeLatest(GET_COMPARE_SALES_PERSON_SALES_OF_YEAR, getCompareSalesPersonSalesOfYearSaga);
  yield takeLatest(GET_PROPORTION_OF_COST_BY_ITEM, getProportionOfCostByItemSaga);
  yield takeLatest(GET_PROPORTION_OF_COST_BY_DEPARTMENT, getProportionOfCostByDepartmentSaga);
}
