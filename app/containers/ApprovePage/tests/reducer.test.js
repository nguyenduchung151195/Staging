import { fromJS } from 'immutable';
import approvePageReducer from '../reducer';

describe('approvePageReducer', () => {
  it('returns the initial state', () => {
    expect(approvePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
