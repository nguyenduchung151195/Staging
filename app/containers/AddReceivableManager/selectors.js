import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addReceivableManager state domain
 */

const selectAddReceivableManagerDomain = state => state.get('addReceivableManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddReceivableManager
 */

const makeSelectAddReceivableManager = () => createSelector(selectAddReceivableManagerDomain, substate => substate.toJS());

export default makeSelectAddReceivableManager;
export { selectAddReceivableManagerDomain };
