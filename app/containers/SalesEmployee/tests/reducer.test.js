import { fromJS } from 'immutable';
import salesEmployeeReducer from '../reducer';

describe('salesEmployeeReducer', () => {
  it('returns the initial state', () => {
    expect(salesEmployeeReducer(undefined, {})).toEqual(fromJS({}));
  });
});
