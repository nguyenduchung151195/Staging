import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addSocialInsurance state domain
 */

const selectAddSocialInsuranceDomain = state => state.get('addSocialInsurance', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddSocialInsurance
 */

const makeSelectAddSocialInsurance = () => createSelector(selectAddSocialInsuranceDomain, substate => substate.toJS());

export default makeSelectAddSocialInsurance;
export { selectAddSocialInsuranceDomain };
