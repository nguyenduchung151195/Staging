import {
  CREATE_ROUND,
  CREATE_ROUND_SUCCESS,
  CREATE_ROUND_FAILURE,
  CREATE_SUBJECT,
  CREATE_SUBJECT_FAILURE,
  CREATE_SUBJECT_SUCCESS,
  CREATE_VACATION,
  CREATE_VACATION_FAILURE,
  CREATE_VACATION_SUCCESS,
  CREATE_QUESTION,
  CREATE_QUESTION_SUCCESS,
  CREATE_QUESTION_FAILURE,
  UPDATE_QUESTION,
  UPDATE_QUESTION_SUCCESS,
  UPDATE_QUESTION_FAILURE,
  UPDATE_ROUND,
  UPDATE_ROUND_SUCCESS,
  UPDATE_ROUND_FAILURE,
  UPDATE_VACATION,
  UPDATE_VACATION_SUCCESS,
  UPDATE_VACATION_FAILURE,
  DELETE_VACATION,
  DELETE_VACATION_SUCCESS,
  DELETE_VACATION_FAILURE,
  DELETE_ROUND,
  DELETE_ROUND_SUCCESS,
  DELETE_ROUND_FAILURE,
  UPDATE_SUBJECT,
  UPDATE_SUBJECT_SUCCESS,
  UPDATE_SUBJECT_FAILURE,
  DELETE_SUBJECT,
  DELETE_SUBJECT_SUCCESS,
  DELETE_SUBJECT_FAILURE,
  DELETE_QUESTION,
  DELETE_QUESTION_SUCCESS,
  DELETE_QUESTION_FAILURE,
  GET_QUESTION,
  GET_QUESTION_SUCCESS,
  GET_QUESTION_FAILURE,
  GET_ROUND,
  GET_ROUND_SUCCESS,
  GET_ROUND_FAILURE,
  GET_SUBJECT,
  GET_SUBJECT_SUCCESS,
  GET_SUBJECT_FAILURE,
  GET_VACATION,
  GET_VACATION_SUCCESS,
  GET_VACATION_FAILURE,
  CREATE_RECRUITMENT_AGENCY,
  CREATE_RECRUITMENT_AGENCY_FAILURE,
  CREATE_RECRUITMENT_AGENCY_SUCCESS,
  DELETE_RECRUITMENT_AGENCY,
  DELETE_RECRUITMENT_AGENCY_FAILURE,
  DELETE_RECRUITMENT_AGENCY_SUCCESS,
  GET_RECRUITMENT_AGENCY,
  GET_RECRUITMENT_AGENCY_FAILURE,
  GET_RECRUITMENT_AGENCY_SUCCESS,
  UPDATE_RECRUITMENT_AGENCY,
  UPDATE_RECRUITMENT_AGENCY_FAILURE,
  UPDATE_RECRUITMENT_AGENCY_SUCCESS,
} from './constants';

export const createRound = data => {
  return {
    type: CREATE_ROUND,
    data,
  };
};
export const createRoundSuccess = data => {
  return {
    type: CREATE_ROUND_SUCCESS,
    data,
  };
};
export const createRoundFailure = action => {
  return {
    type: CREATE_ROUND_FAILURE,
    payload: action,
  };
};
export const updateRound = data => {
  return {
    type: UPDATE_ROUND,
    data,
  };
};
export const updateRoundSuccess = data => {
  return {
    type: UPDATE_ROUND_SUCCESS,
    data,
  };
};
export const updateRoundFailure = action => {
  return {
    type: UPDATE_ROUND_FAILURE,
    payload: action,
  };
};
export const deleteRound = _id => {
  return {
    type: DELETE_ROUND,
    _id,
  };
};
export const deleteRoundSuccess = data => {
  return {
    type: DELETE_ROUND_SUCCESS,
    data,
  };
};
export const deleteRoundFailure = action => {
  return {
    type: DELETE_ROUND_FAILURE,
    payload: action,
  };
};

export const createSubject = data => {
  return {
    type: CREATE_SUBJECT,
    data,
  };
};
export const createSubjectSuccess = data => {
  return {
    type: CREATE_SUBJECT_SUCCESS,
    data,
  };
};
export const createSubjectFailure = action => {
  return {
    type: CREATE_SUBJECT_FAILURE,
    payload: action,
  };
};

export const updateSubject = data => {
  return {
    type: UPDATE_SUBJECT,
    data,
  };
};
export const updateSubjectSuccess = action => {
  return {
    type: UPDATE_SUBJECT_SUCCESS,
    action,
  };
};
export const updateSubjectFailure = action => {
  return {
    type: UPDATE_SUBJECT_FAILURE,
    payload: action,
  };
};

export const deleteSubject = _id => {
  return {
    type: DELETE_SUBJECT,
    _id,
  };
};

export const deleteSubjectSuccess = data => {
  return {
    type: DELETE_SUBJECT_SUCCESS,
    data,
  };
};
export const deleteSubjectFailure = action => {
  return {
    type: DELETE_SUBJECT_FAILURE,
    payload: action,
  };
};

export const createVacation = data => {
  return {
    type: CREATE_VACATION,
    data,
  };
};
export const createVacationSuccess = data => {
  return {
    type: CREATE_VACATION_SUCCESS,
    data,
  };
};
export const createVacationFailure = action => {
  return {
    type: CREATE_VACATION_FAILURE,
    payload: action,
  };
};

export const updateVacation = data => {
  return {
    type: UPDATE_VACATION,
    data,
  };
};
export const updateVacationSuccess = data => {
  return {
    type: UPDATE_VACATION_SUCCESS,
    data,
  };
};
export const updateVacationFailure = action => {
  return {
    type: UPDATE_VACATION_FAILURE,
    payload: action,
  };
};

export const deleteVacation = _id => {
  return {
    type: DELETE_VACATION,
    _id,
  };
};

export const deleteVacationSuccess = data => {
  return {
    type: DELETE_VACATION_SUCCESS,
    data,
  };
};
export const deleteVacationFailure = action => {
  return {
    type: DELETE_VACATION_FAILURE,
    payload: action,
  };
};

export const getRound = () => {
  return {
    type: GET_ROUND,
  };
};

export const getRoundSuccess = () => {
  return {
    type: GET_ROUND_SUCCESS,
  };
};

export const getRoundFailure = () => {
  return {
    type: GET_ROUND_FAILURE,
  };
};

export const getVacation = () => {
  return {
    type: GET_VACATION,
  };
};

export const getVacationSuccess = () => {
  return {
    type: GET_VACATION_SUCCESS,
  };
};

export const getVacationFailure = () => {
  return {
    type: GET_VACATION_FAILURE,
  };
};

export const getSubject = () => {
  return {
    type: GET_SUBJECT,
  };
};

export const getSubjectSuccess = () => {
  return {
    type: GET_SUBJECT_SUCCESS,
  };
};

export const getSubjectFailure = () => {
  return {
    type: GET_SUBJECT_FAILURE,
  };
};

export const createQuestion = data => {
  return {
    type: CREATE_QUESTION,
    data,
  };
};
export const createQuestionSuccess = data => {
  return {
    type: CREATE_QUESTION_SUCCESS,
    data,
  };
};
export const createQuestionFailure = action => {
  return {
    type: CREATE_QUESTION_FAILURE,
    payload: action,
  };
};

export const updateQuestion = data => {
  return {
    type: UPDATE_QUESTION,
    data,
  };
};
export const updateQuestionSuccess = data => {
  return {
    type: UPDATE_QUESTION_SUCCESS,
    data,
  };
};
export const updateQuestionFailure = action => {
  return {
    type: UPDATE_QUESTION_FAILURE,
    payload: action,
  };
};
export const deleteQuestion = _id => {
  return {
    type: DELETE_QUESTION,
    _id,
  };
};

export const deleteQuestionSuccess = data => {
  return {
    type: DELETE_QUESTION_SUCCESS,
    data,
  };
};
export const deleteQuestionFailure = action => {
  return {
    type: DELETE_QUESTION_FAILURE,
    payload: action,
  };
};
export const getQuestion = () => {
  return {
    type: GET_QUESTION,
  };
};

export const getQuestionSuccess = () => {
  return {
    type: GET_QUESTION_SUCCESS,
  };
};

export const getQuestionFailure = () => {
  return {
    type: GET_QUESTION_FAILURE,
  };
};
// ĐƠN VỊ TUYỂN DỤNG

export const createRecruitmentAgency = data => {
  return {
    type: CREATE_RECRUITMENT_AGENCY,
    data,
  };
};
export const createRecruitmentAgencySuccess = data => {
  return {
    type: CREATE_RECRUITMENT_AGENCY_SUCCESS,
    data,
  };
};
export const createRecruitmentAgencyFailure = action => {
  return {
    type: CREATE_RECRUITMENT_AGENCY_FAILURE,
    payload: action,
  };
};

export const updateRecruitmentAgency = data => {
  return {
    type: UPDATE_RECRUITMENT_AGENCY,
    data,
  };
};
export const updateRecruitmentAgencySuccess = data => {
  return {
    type: UPDATE_RECRUITMENT_AGENCY_SUCCESS,
    data,
  };
};
export const updateRecruitmentAgencyFailure = action => {
  return {
    type: UPDATE_RECRUITMENT_AGENCY_FAILURE,
    payload: action,
  };
};
export const deleteRecruitmentAgency = _id => {
  return {
    type: DELETE_RECRUITMENT_AGENCY,
    _id,
  };
};

export const deleteRecruitmentAgencySuccess = data => {
  return {
    type: DELETE_RECRUITMENT_AGENCY_SUCCESS,
    data,
  };
};
export const deleteRecruitmentAgencyFailure = action => {
  return {
    type: DELETE_RECRUITMENT_AGENCY_FAILURE,
    payload: action,
  };
};
export const getRecruitmentAgency = () => {
  return {
    type: GET_RECRUITMENT_AGENCY,
  };
};

export const getRecruitmentAgencySuccess = () => {
  return {
    type: GET_RECRUITMENT_AGENCY_SUCCESS,
  };
};

export const getRecruitmentAgencyFailure = () => {
  return {
    type: GET_RECRUITMENT_AGENCY_FAILURE,
  };
};
