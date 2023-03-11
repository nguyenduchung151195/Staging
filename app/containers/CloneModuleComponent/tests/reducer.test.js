import { fromJS } from 'immutable';
import cloneModuleComponentReducer from '../reducer';

describe('cloneModuleComponentReducer', () => {
  it('returns the initial state', () => {
    expect(cloneModuleComponentReducer(undefined, {})).toEqual(fromJS({}));
  });
});
