import { fromJS } from 'immutable';
import editContractPageReducer from '../reducer';

describe('editContractPageReducer', () => {
  it('returns the initial state', () => {
    expect(editContractPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
