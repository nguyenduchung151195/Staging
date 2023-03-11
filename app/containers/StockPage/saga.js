import { takeLatest, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_ADD_NEW_PRODUCT, API_ORIGANIZATION, API_CATEGORY_STOCK_TREE, API_LOWER_LIMIT_STOCK, API_UPPER_LIMIT_STOCK } from '../../config/urlConfig';
import { GET_ALL_PRODUCT, DELETE_PRODUCT, GET_PRODUCT_BY_STOCK, EDIT_PRODUCT, GET_CATEGORY, GET_ALL_LOWER_LIMIT_PRODUCT, GET_ALL_UPPER_LIMIT_PRODUCT } from './constants';
import {
  getAllProductSuccess,
  getAllProductFailed,
  deleteProductSuccess,
  deleteProductFailed,
  getAllStockSuccess,
  getAllStockFailed,
  getAllProductByStockSuccess,
  getAllProductByStockFailed,
  editProductSuccess,
  editProductFailed,
  getCategorySuccess,
  getCategoryFailed,
  getAllLowerLimitProductSuccess,
  getAllLowerLimitProductFailed,
  getAllUpperLimitProductSuccess,
  getAllUpperLimitProductFailed,
} from './actions';
// import { DEFAULT_ACTION, GET_ALL_PROVIDERS, GET_ALL_PROVIDERS_FAIL, GET_ALL_PROVIDERS_SUCCESS } from './constants';
// Individual exports for testing
// export function* fetchGetAllProviders() {
//   try {
//     const data = yield call(request, API_PROVIDERS, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//     });

//     if (data) {
//       // yield put(fetchAllUserSuccessAction(data.employees));
//     } else {
//       // yield put(fetchAllUserfalseAction({}));
//     }
//   } catch (err) {
//     // yield put(fetchAllUserfalseAction(err));
//   }
// }

export function* getCategory() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_CATEGORY_STOCK_TREE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.success === true) {
      yield put(getCategorySuccess(data.data));
    } else {
      yield put(getCategoryFailed({}));
    }
  } catch (err) {
    yield put(getCategoryFailed(err));
  }
}

export function* getAllProduct() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_ADD_NEW_PRODUCT, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAllProductSuccess(data.data));
    } else {
      yield put(getAllProductFailed({}));
    }
  } catch (err) {
    yield put(getAllProductFailed(err));
  }
}

export function* fetchAllLowerLimitProduct() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_LOWER_LIMIT_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAllLowerLimitProductSuccess(data.data));
    } else {
      yield put(getAllLowerLimitProductSuccess([]));
    }
  } catch (err) {
    yield put(getAllLowerLimitProductFailed(err));
  }
}

export function* fetchAllUpperLimitProduct() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_UPPER_LIMIT_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAllUpperLimitProductSuccess(data.data));
    } else {
      yield put(getAllUpperLimitProductSuccess([]));
    }
  } catch (err) {
    yield put(getAllUpperLimitProductFailed(err));
  }
}

// export function* getCategory() {
//   const token = localStorage.getItem('token');
//   try {
//     const data = yield call(request, API_CATEGORY_STOCK_TREE, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (data.success === true) {
//       yield put(getCategorySuccess(data.data));
//     } else {
//       yield put(getCategoryFailed({}));
//     }
//   } catch (err) {
//     yield put(getCategoryFailed(err));
//   }
// }

export function* getProductByStock(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ADD_NEW_PRODUCT}/organizationUnit/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAllProductByStockSuccess(data.data));
    } else {
      yield put(getAllProductByStockFailed({}));
    }
  } catch (err) {
    yield put(getAllProductByStockFailed(err));
  }
}

export function* deleteProduct(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_ADD_NEW_PRODUCT, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: action.body }),
    });
    if (data.success === true) {
      yield put(deleteProductSuccess(data));
      // try {
      //   const data = yield call(request, API_ADD_NEW_PRODUCT, {
      //     method: 'GET',
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   });
      //   if (data) {
      //     yield put(getAllProductSuccess(data.data));
      //   } else {
      //     yield put(getAllProductFailed({}));
      //   }
      // } catch (err) {
      //   yield put(getAllProductFailed(err));
      // }
    }
  } catch (err) {
    yield put(deleteProductFailed(err));
  }
}

export function* getAllStock() {
  try {
    // const departmentId = action.departmentId;

    const data = yield call(request, API_ORIGANIZATION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(getAllStockSuccess(data));
    } else {
      yield put(getAllStockFailed({}));
    }
  } catch (err) {
    yield put(getAllStockFailed(err));
  }
}

export function* editProduct(action) {
  const token = localStorage.getItem('token');
  const bodySend = {
    logo: action.body.logo,
    name: action.body.name,
    code: action.body.code,
    barcode: action.body.barCode,
    isService: action.body.isService,
    isDescription: action.body.isDescription,
    isDisplaySourcePrice: action.body.isDisplaySourcePrice,
    isSerial: action.body.isSerial,
    tags: action.body.tags,
    origin: action.body.origin,
    size: action.body.size,
    unit: action.body.unit,
    catalog: action.body.catalog,
    serials: action.body.serials,
    description: action.body.description,
    supplier: action.body.supplier,
    attributeSet: action.body.attributeSet,
    pricePolicy: action.body.pricePolicy,
    sellingPoint: action.body.sellingPoint,
    otherInfo: action.body.otherInfo,
  };
  try {
    const data = yield call(request, `${API_ADD_NEW_PRODUCT}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodySend),
    });
    if (data) {
      yield put(editProductSuccess(data));
      try {
        `${API_ADD_NEW_PRODUCT}/organizationUnit/${action.body}`;
        const data = yield call(request, `${API_ADD_NEW_PRODUCT}${action.id !== 0 ? `/organizationUnit/${action.id}` : ''}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data) {
          yield put(getAllProductSuccess(data.data));
        } else {
          yield put(getAllProductFailed({}));
        }
      } catch (err) {
        yield put(getAllProductFailed(err));
      }
    } else {
      yield put(editProductFailed({}));
    }
  } catch (err) {
    yield put(editProductFailed(err));
  }
}

export default function* stockPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ALL_PRODUCT, getAllProduct);
  yield takeLatest(GET_ALL_LOWER_LIMIT_PRODUCT, fetchAllLowerLimitProduct);
  yield takeLatest(GET_ALL_UPPER_LIMIT_PRODUCT, fetchAllUpperLimitProduct);
  yield takeLatest(GET_PRODUCT_BY_STOCK, getProductByStock);
  yield takeLatest(GET_ALL_PRODUCT, getAllStock);
  yield takeLatest(EDIT_PRODUCT, editProduct);
  yield takeLatest(DELETE_PRODUCT, deleteProduct);
  yield takeLatest(GET_CATEGORY, getCategory);
  // yield takeLatest(GET_ALL_PROVIDERS, fetchGetAllProviders);
  // yield takeLatest(GET_ALL_USER, fetchAllDepartment);
  // yield takeLatest(GET_CONFIG, fetchGetConfig);
  // yield takeLatest(UPDATE_GET_CONFIG, fetchUpdateConfig);
  // yield takeEvery(DELETE_USERS, fetchDeleteUsers);
}
