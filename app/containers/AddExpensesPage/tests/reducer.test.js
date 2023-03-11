import { fromJS } from 'immutable';
import addExpensesPageReducer from '../reducer';

describe('addExpensesPageReducer', () => {
  it('returns the initial state', () => {
    expect(addExpensesPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
