import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { getDataChartInFavoriteFailure, getDataChartInFavoriteSuccess } from './actions';
import { GET_DATA_CHART_IN_FAVORITE } from './constants';
import { API_REPORT } from '../../config/urlConfig';
import request from '../../utils/request';


// TT: CALL API - LẤY DỮ LIỆU - "ĐỔ VÀO BIỂU ĐỒ"- THEO "PATH + NAME" CỦA MENU
export function* getDataChartInFavoriteSaga(action) {

  const token = localStorage.getItem('token');
  try {
    const { path, name } = action;
    let apiAddress = `${API_REPORT}/${path}`;
    // BIEU DO: Tổng hợp bán hàng theo khu vực : CÓ THAM SỐ NĂM + THÁNG (đang lấy tháng năm hiện tại - TUANTRAN CHUA XONG)
    if (name === 'area') {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      apiAddress = `${API_REPORT}/${path}?year=${year}&month=${month}`; // apiAddress += '?year=2021&month=3';
    } 

    const res = yield call(request, apiAddress, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (res && res.status === 1) {
      const data = { name, data: res.data };
      yield put(getDataChartInFavoriteSuccess(data));
    } else {
      yield put(getDataChartInFavoriteFailure(res));
    }
  } catch (error) {
    console.log(1, error);
    yield put(getDataChartInFavoriteFailure(error));
  }
}

// Individual exports for testing
export default function* addFavoritePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA_CHART_IN_FAVORITE, getDataChartInFavoriteSaga);
}
