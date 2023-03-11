import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addRecruitmentWave state domain
 */

const selectAddRecruitmentWaveDomain = state => state.get('addRecruitmentWave', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddRecruitmentWave
 */

const makeSelectAddRecruitmentWave = () => createSelector(selectAddRecruitmentWaveDomain, substate => substate.toJS());

export default makeSelectAddRecruitmentWave;
export { selectAddRecruitmentWaveDomain };
