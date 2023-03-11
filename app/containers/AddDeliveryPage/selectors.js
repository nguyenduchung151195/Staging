import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addDeliveryPage state domain
 */

const selectAddDeliveryPageDomain = state => state.get('addDeliveryPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddDeliveryPage
 */

const makeSelectAddDeliveryPage = () => createSelector(selectAddDeliveryPageDomain, substate => substate.toJS());

export default makeSelectAddDeliveryPage;
export { selectAddDeliveryPageDomain };
