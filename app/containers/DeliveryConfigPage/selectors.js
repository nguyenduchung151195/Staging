import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the deliveryConfigPage state domain
 */

const selectDeliveryConfigPageDomain = state => state.get('deliveryConfigPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by DeliveryConfigPage
 */

const makeSelectDeliveryConfigPage = () => createSelector(selectDeliveryConfigPageDomain, substate => substate.toJS());

export default makeSelectDeliveryConfigPage;
export { selectDeliveryConfigPageDomain };
