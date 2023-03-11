import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the deliveryPage state domain
 */

const selectDeliveryPageDomain = state => state.get('deliveryPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by DeliveryPage
 */

const makeSelectDeliveryPage = () => createSelector(selectDeliveryPageDomain, substate => substate.toJS());

export default makeSelectDeliveryPage;
export { selectDeliveryPageDomain };
