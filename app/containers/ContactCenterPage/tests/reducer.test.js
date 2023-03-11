import { fromJS } from 'immutable';
import contactCenterPageReducer from '../reducer';

describe('contactCenterPageReducer', () => {
  it('returns the initial state', () => {
    expect(contactCenterPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
