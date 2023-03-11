import { fromJS } from 'immutable';
import salesManagerReducer from '../reducer';

describe('salesManagerReducer', () => {
  it('returns the initial state', () => {
    expect(salesManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
