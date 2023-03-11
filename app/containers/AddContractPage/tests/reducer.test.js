import { fromJS } from 'immutable';
import addContractPageReducer from '../reducer';

describe('addContractPageReducer', () => {
  it('returns the initial state', () => {
    expect(addContractPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
