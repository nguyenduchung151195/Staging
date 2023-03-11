import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectAccountManage = state => state.get('BankAccount', initialState);

const makeSelectLtAccount = () => createSelector(selectAccountManage, substate => substate.toJS());

export default makeSelectLtAccount;
export { selectAccountManage };