import { fromJS } from 'immutable';
import addReceivableManagerReducer from '../reducer';

describe('addReceivableManagerReducer', () => {
  it('returns the initial state', () => {
    expect(addReceivableManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
