import { takeEvery, call, put, takeLatest, all } from 'redux-saga/effects';
import request from '../../utils/request';
import { getItemsSuccess, getItemsFailed, getMoreItemsSuccess, getMoreItemsFailed } from './actions';
import { GET_ITEMS, GET_MORE_ITEMS } from './constants';
import { serialize } from '../../utils/common';
export function* getAllItems(action) {
  const token = localStorage.getItem('token');
  try {
    const keys = Object.keys(action.body.paging);
    const responses = yield all(keys.map(kanbanStatus => {
      let newFilter
      // if(action.body.typeof === 'ST250'){
      //   newFilter = {
      //   ...action.body.filter,
      //   filter: {
      //     ...action.body.filter.filter,
      //     kanbanStatusImport : kanbanStatus,
      //   },
      //   ...action.body.paging[kanbanStatus],
      // }}else if (action.body.typeof === 'ST251'){
      //   newFilter = {
      //     ...action.body.filter,
      //     filter: {
      //       ...action.body.filter.filter,
      //       kanbanStatusExport : kanbanStatus,
      //     },
      //     ...action.body.paging[kanbanStatus],
      //   }
      // }else{
      //   newFilter = {
      //     ...action.body.filter,
      //     filter: {
      //       ...action.body.filter.filter,
      //       kanbanStatus,
      //     },
      //     ...action.body.paging[kanbanStatus],
      // }}
      newFilter = {
        ...action.body.filter,
        filter: {
          ...action.body.filter.filter,
          kanbanStatus,
        },
        ...action.body.paging[kanbanStatus],
      }
      return call(request, `${action.body.path}?${serialize(newFilter)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }));
    let count = {};
    let allData = [];
    keys.forEach((kanbanStatus, index) => {
      allData = [...allData, ...responses[index].data];
      count[kanbanStatus] = responses[index].count;
    })
    // const data = yield call(request, `${action.body.path}?${serialize(action.body.filter)}`, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    yield put(getItemsSuccess(allData, count));


  } catch (err) {
    console.log('err', err);
    yield put(getItemsFailed(err));
  }
}

export function* fetchMoreItems(action) {
  const token = localStorage.getItem('token');
  try {
    const newFilter = {
      ...action.body.filter,
      filter: {
        ...action.body.filter.filter,
        kanbanStatus: action.body.kanbanStatus,
      },
      ...action.body.paging,
    }
    const data = yield call(request, `${action.body.path}?${serialize(newFilter)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getMoreItemsSuccess([...action.body.items, ...data.data]));
    } else {
      yield put(getMoreItemsFailed({}));
    }
  } catch (err) {
    yield put(getMoreItemsFailed(err));
  }
}

// Individual exports for testing
export default function* kanbanPluginSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_ITEMS, getAllItems);
  yield takeLatest(GET_MORE_ITEMS, fetchMoreItems);
}
