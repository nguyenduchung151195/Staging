import { fromJS } from 'immutable';
import addReimbursementRequirePageReducer from '../reducer';

describe('addReimbursementRequirePageReducer', () => {
  it('returns the initial state', () => {
    expect(addReimbursementRequirePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
