import { call, put, takeLatest } from 'redux-saga/effects';
import { API_TO_LINK_IDS } from '../../../../../../config/urlConfig';
import { changeSnackbar } from '../../../../../Dashboard/actions';
import { postSwitchCandidateFailure, postSwitchCandidateSuccess } from './actions';
import { POST_SWITCH_CANDIDATE } from './constants';
import request from 'utils/request';

// import { take, call, put, select } from 'redux-saga/effects';
export function* postSwitchCandidateSaga(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_TO_LINK_IDS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Chuyển ứng viên thành công', variant: 'success' }));
      yield put(postSwitchCandidateSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Chuyển ứng viên thất bại', variant: 'error' }));
      yield put(postSwitchCandidateFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Chuyển ứng viên thất bại', variant: 'error' }));
    yield put(postSwitchCandidateFailure(err));
  }
}
// Individual exports for testing
export default function* addRecruitmentWave() {
  // console.log('Minhminh');
  // See example in containers/HomePage/saga.js
  yield takeLatest(POST_SWITCH_CANDIDATE, postSwitchCandidateSaga);
}
