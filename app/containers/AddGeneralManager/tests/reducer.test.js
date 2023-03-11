import { fromJS } from 'immutable';
import addGeneralManagerReducer from '../reducer';

describe('addGeneralManagerReducer', () => {
  it('returns the initial state', () => {
    expect(addGeneralManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
