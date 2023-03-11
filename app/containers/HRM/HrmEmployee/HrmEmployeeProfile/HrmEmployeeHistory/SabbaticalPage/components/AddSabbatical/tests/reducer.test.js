import { fromJS } from 'immutable';
import addSalaryReducer from '../reducer';

describe('addSalaryReducer', () => {
  it('returns the initial state', () => {
    expect(addSalaryReducer(undefined, {})).toEqual(fromJS({}));
  });
});
