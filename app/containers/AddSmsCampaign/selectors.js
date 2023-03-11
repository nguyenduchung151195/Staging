import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addSmsCampaign state domain
 */

const selectAddSmsCampaignDomain = state => state.get('addSmsCampaign', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddSmsCampaign
 */

const makeSelectAddSmsCampaign = () => createSelector(selectAddSmsCampaignDomain, substate => substate.toJS());

export default makeSelectAddSmsCampaign;
export { selectAddSmsCampaignDomain };
