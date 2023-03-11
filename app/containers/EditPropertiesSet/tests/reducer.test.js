import { fromJS } from 'immutable';
import editPropertiesSetReducer from '../reducer';

describe('editPropertiesSetReducer', () => {
  it('returns the initial state', () => {
    expect(editPropertiesSetReducer(undefined, {})).toEqual(fromJS({}));
  });
});
