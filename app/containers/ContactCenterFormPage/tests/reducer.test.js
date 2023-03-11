import { fromJS } from 'immutable';
import contactCenterFormPageReducer from '../reducer';

describe('contactCenterFormPageReducer', () => {
  it('returns the initial state', () => {
    expect(contactCenterFormPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
