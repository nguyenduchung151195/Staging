import { fromJS } from 'immutable';
import addPropertieReducer from '../reducer';

describe('addPropertieReducer', () => {
  it('returns the initial state', () => {
    expect(addPropertieReducer(undefined, {})).toEqual(fromJS({}));
  });
});
