import request from 'utils/request';
import {} from 'config/urlConfig';
import { DELETE_QUESTION, DELETE_ROUND, DELETE_VACATION, UPDATE_VACATION } from './constants';
import { API_QUESTION, API_EXAM, API_ROUND_EXAM, API_VANCANCIES, API_RECRUITMENT_AGENCY } from '../../../../config/urlConfig';
import { call, put, takeLatest } from 'redux-saga/effects';
import { changeSnackbar } from '../../../Dashboard/actions';
import {
  createVacationSuccess,
  createQuestionSuccess,
  createRoundSuccess,
  createSubjectSuccess,
  updateRoundSuccess,
  updateQuestionSuccess,
  updateVacationSuccess,
  updateSubjectSuccess,
  deleteVacationSuccess,
  deleteQuestionSuccess,
  deleteRoundSuccess,
  deleteSubjectSuccess,
  createVacationFailure,
  createQuestionFailure,
  createRoundFailure,
  deleteQuestionFailure,
  createSubjectFailure,
  updateRoundFailure,
  updateVacationFailure,
  updateSubjectFailure,
  deleteVacationFailure,
  deleteRoundFailure,
  deleteSubjectFailure,
  getRoundSuccess,
  getQuestionSuccess,
  getSubjectSuccess,
  getVacationSuccess,
  updateRecruitmentAgencySuccess,
  updateRecruitmentAgencyFailure,
  createRecruitmentAgencySuccess,
  createRecruitmentAgencyFailure,
  deleteRecruitmentAgencySuccess,
  deleteRecruitmentAgencyFailure,
} from './actions';

import {
  CREATE_ROUND,
  CREATE_QUESTION,
  CREATE_SUBJECT,
  CREATE_VACATION,
  UPDATE_QUESTION,
  UPDATE_ROUND,
  UPDATE_SUBJECT,
  DELETE_SUBJECT,
  GET_QUESTION,
  GET_SUBJECT,
  GET_VACATION,
  GET_ROUND,
  CREATE_RECRUITMENT_AGENCY,
  UPDATE_RECRUITMENT_AGENCY,
  DELETE_RECRUITMENT_AGENCY,
} from './constants';

// Subject
export function* createSubjectSaga(action) {
  const token = localStorage.getItem('token');

  try {
    const res = yield call(request, API_EXAM, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createSubjectSuccess(res));
    } else {
      // yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
      yield put(createSubjectFailure(res));
    }
  } catch (err) {
    yield put(createSubjectFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}
export function* updateSubject(action) {
  const token = localStorage.getItem('token');
  const { data } = action;
  try {
    const res = yield call(request, `${API_EXAM}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateSubjectSuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: res.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateSubjectFailure(res));
    }
  } catch (err) {
    yield put(updateSubjectFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

export function* deleteSubject(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_EXAM}/${action._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thành công', variant: 'success' }));
      yield put(deleteSubjectSuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thất bại', variant: 'error' }));
      yield put(deleteSubjectFailure(res));
    }
  } catch (err) {
    yield put(deleteSubjectFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thất bại', variant: 'error' }));
  }
}

// Question
export function* createQuestionSaga(action) {
  const token = localStorage.getItem('token');

  try {
    const res = yield call(request, API_QUESTION, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (res && res.status === 1) {
      // yield put(addSalaryFormulaSuccess(res.data));
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createQuestionSuccess(res));
    } else {
      // yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
      yield put(createQuestionFailure(res));
    }
  } catch (err) {
    yield put(createQuestionFailure(err));
    // yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

export function* updateQuestion(action) {
  const token = localStorage.getItem('token');
  const { data } = action;
  try {
    const res = yield call(request, `${API_QUESTION}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateQuestionSuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: res.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateQuestionFailure(res));
    }
  } catch (err) {
    yield put(updateQuestionFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

export function* deleteQuestion(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_QUESTION}/${action._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thành công', variant: 'success' }));
      yield put(deleteQuestionSuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thất bại', variant: 'error' }));
      yield put(deleteQuestionFailure(res));
    }
  } catch (err) {
    yield put(deleteQuestionFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thất bại', variant: 'error' }));
  }
}

// Round
export function* createRoundSaga(action) {
  const token = localStorage.getItem('token');

  try {
    const res = yield call(request, API_ROUND_EXAM, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createRoundSuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
      yield put(createRoundFailure(res));
    }
  } catch (err) {
    yield put(createRoundFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

export function* updateRound(action) {
  const token = localStorage.getItem('token');
  const { data } = action;
  try {
    const res = yield call(request, `${API_ROUND_EXAM}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateRoundSuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: res.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateRoundFailure(res));
    }
  } catch (err) {
    yield put(updateRoundFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

export function* deleteRound(action) {
  console.log(action, 'action');
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_ROUND_EXAM}/${action._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thành công', variant: 'success' }));
      yield put(deleteRoundSuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thất bại', variant: 'error' }));
      yield put(deleteRoundFailure(res));
    }
  } catch (err) {
    yield put(deleteRoundFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thất bại', variant: 'error' }));
  }
}

// Vacation

export function* createVacationSaga(action) {
  const token = localStorage.getItem('token');

  try {
    const res = yield call(request, API_VANCANCIES, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createVacationSuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
      yield put(createVacationFailure(res));
    }
  } catch (err) {
    yield put(createVacationFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

export function* updateVacation(action) {
  const token = localStorage.getItem('token');
  const { data } = action;
  try {
    const res = yield call(request, `${API_VANCANCIES}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateVacationSuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: res.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateVacationFailure(res));
    }
  } catch (err) {
    yield put(updateVacationFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

export function* deleteVacation(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_VANCANCIES}/${action._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thành công', variant: 'success' }));
      yield put(deleteVacationSuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thất bại', variant: 'error' }));
      yield put(deleteVacationFailure(res));
    }
  } catch (err) {
    yield put(deleteVacationFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thất bại', variant: 'error' }));
  }
}

function* getRound() {
  try {
    yield put(getRoundSuccess());
  } catch (err) {}
}

function* getVacation() {
  try {
    yield put(getVacationSuccess());
  } catch (err) {}
}

function* getSubject() {
  try {
    yield put(getSubjectSuccess());
  } catch (err) {}
}
// recruitment
export function* updateRecruitmentAgencySaga(action) {
  const token = localStorage.getItem('token');
  const { data } = action;
  try {
    const res = yield call(request, `${API_RECRUITMENT_AGENCY}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateRecruitmentAgencySuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: res.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateRecruitmentAgencyFailure(res));
    }
  } catch (err) {
    yield put(updateRecruitmentAgencyFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

export function* createRecruitmentAgencySaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, API_RECRUITMENT_AGENCY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (res && res.status === 1) {
      // yield put(addSalaryFormulaSuccess(res.data));
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createRecruitmentAgencySuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
      yield put(createRecruitmentAgencyFailure(res));
    }
  } catch (err) {
    yield put(createRecruitmentAgencyFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

export function* deleteRecruitmentAgencySaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_RECRUITMENT_AGENCY}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: [action._id] }),
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thành công', variant: 'success' }));
      yield put(deleteRecruitmentAgencySuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thất bại', variant: 'error' }));
      yield put(deleteRecruitmentAgencyFailure(res));
    }
  } catch (err) {
    yield put(deleteRecruitmentAgencyFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thất bại', variant: 'error' }));
  }
}
export default function* configSalaryPage() {
  yield takeLatest(CREATE_SUBJECT, createSubjectSaga);
  yield takeLatest(UPDATE_SUBJECT, updateSubject);
  yield takeLatest(DELETE_SUBJECT, deleteSubject);
  yield takeLatest(CREATE_QUESTION, createQuestionSaga);
  yield takeLatest(UPDATE_QUESTION, updateQuestion);
  yield takeLatest(DELETE_QUESTION, deleteQuestion);
  yield takeLatest(CREATE_ROUND, createRoundSaga);
  yield takeLatest(UPDATE_ROUND, updateRound);
  yield takeLatest(DELETE_ROUND, deleteRound);
  yield takeLatest(CREATE_VACATION, createVacationSaga);
  yield takeLatest(UPDATE_VACATION, updateVacation);
  yield takeLatest(DELETE_VACATION, deleteVacation);
  yield takeLatest(GET_ROUND, getRound);
  yield takeLatest(GET_VACATION, getVacation);
  yield takeLatest(GET_SUBJECT, getSubject);
  yield takeLatest(UPDATE_RECRUITMENT_AGENCY, updateRecruitmentAgencySaga);
  yield takeLatest(CREATE_RECRUITMENT_AGENCY, createRecruitmentAgencySaga);
  yield takeLatest(DELETE_RECRUITMENT_AGENCY, deleteRecruitmentAgencySaga);
}
