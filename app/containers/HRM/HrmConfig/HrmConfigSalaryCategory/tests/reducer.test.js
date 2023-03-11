import { fromJS } from 'immutable';
import salaryPageReducer from '../reducer';

describe('salaryPageReducer', () => {
  it('returns the initial state', () => {
    expect(salaryPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
