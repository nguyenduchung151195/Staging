import { fromJS } from 'immutable';
import addAdvancePageReducer from '../reducer';

describe('addAdvancePageReducer', () => {
  it('returns the initial state', () => {
    expect(addAdvancePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
