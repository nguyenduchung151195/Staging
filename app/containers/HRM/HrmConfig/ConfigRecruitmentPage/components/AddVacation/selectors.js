import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the RecruitmentManagementPage state domain
 */

const selectRecruitmentManagementPageDomain = state => state.get('recruitmentManagementPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecruitmentManagementPage
 */

const makeSelectRecruitmentManagementPage = () => createSelector(selectRecruitmentManagementPageDomain, substate => substate.toJS());

export default makeSelectRecruitmentManagementPage;
export { selectRecruitmentManagementPageDomain };
