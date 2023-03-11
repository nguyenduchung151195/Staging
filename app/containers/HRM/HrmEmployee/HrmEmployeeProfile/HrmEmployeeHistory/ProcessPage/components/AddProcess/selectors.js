import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addProcess state domain
 */

const selectAddProcessDomain = state => state.get('addProcess', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddProcess
 */

const makeSelectAddProcess = () => createSelector(selectAddProcessDomain, substate => substate.toJS());

export default makeSelectAddProcess;
export { selectAddProcessDomain };
