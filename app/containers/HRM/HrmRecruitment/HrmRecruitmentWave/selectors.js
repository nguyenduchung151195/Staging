import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the RecruitmentWavePage state domain
 */

const selectRecruitmentWavePageDomain = state => state.get('recruitmentWavePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecruitmentWavePage
 */

const makeSelectRecruitmentWavePage = () => createSelector(selectRecruitmentWavePageDomain, substate => substate.toJS());

export default makeSelectRecruitmentWavePage;
export { selectRecruitmentWavePageDomain };
