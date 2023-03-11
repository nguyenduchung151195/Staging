import { fromJS } from 'immutable';
import addPropertiesSetReducer from '../reducer';

describe('addPropertiesSetReducer', () => {
  it('returns the initial state', () => {
    expect(addPropertiesSetReducer(undefined, {})).toEqual(fromJS({}));
  });
});
