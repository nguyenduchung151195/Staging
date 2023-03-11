import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the receivableManager state domain
 */

const selectReceivableManagerDomain = state => state.get('receivableManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ReceivableManager
 */

const makeSelectReceivableManager = () => createSelector(selectReceivableManagerDomain, substate => substate.toJS());

export default makeSelectReceivableManager;
export { selectReceivableManagerDomain };
