import { fromJS } from 'immutable';
import propertiesPageReducer from '../reducer';

describe('propertiesPageReducer', () => {
  it('returns the initial state', () => {
    expect(propertiesPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
