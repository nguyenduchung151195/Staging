import { fromJS } from 'immutable';
import billsPageReducer from '../reducer';

describe('billsPageReducer', () => {
  it('returns the initial state', () => {
    expect(billsPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
