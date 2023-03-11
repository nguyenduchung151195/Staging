import { fromJS } from 'immutable';
import salesPolicyPageReducer from '../reducer';

describe('salesPolicyPageReducer', () => {
  it('returns the initial state', () => {
    expect(salesPolicyPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
