import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addRecruitmentManagement state domain
 */

const selectAddRecruitmentManagementDomain = state => state.get('addRecruitmentManagement', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddRecruitmentManagement
 */

const makeSelectAddRecruitmentManagement = () => createSelector(selectAddRecruitmentManagementDomain, substate => substate.toJS());

export default makeSelectAddRecruitmentManagement;
export { selectAddRecruitmentManagementDomain };
