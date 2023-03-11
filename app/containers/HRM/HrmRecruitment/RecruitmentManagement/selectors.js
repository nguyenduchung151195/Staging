import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the recruitmentManagement state domain
 */

const selectRecruitmentPageDomain = state => state.get('recruitmentManagement', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecruitmentPage
 */

const makeSelectRecruitmentPage = () => createSelector(selectRecruitmentPageDomain, substate => substate.toJS());

export default makeSelectRecruitmentPage;
export { selectRecruitmentPageDomain };
