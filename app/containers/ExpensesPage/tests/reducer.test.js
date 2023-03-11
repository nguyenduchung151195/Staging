import { fromJS } from 'immutable';
import expensesPageReducer from '../reducer';

describe('expensesPageReducer', () => {
  it('returns the initial state', () => {
    expect(expensesPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
