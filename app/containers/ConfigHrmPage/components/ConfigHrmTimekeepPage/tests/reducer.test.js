import { fromJS } from 'immutable';
import configHrmPageReducer from '../reducer';

describe('configHrmPageReducer', () => {
  it('returns the initial state', () => {
    expect(configHrmPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
