import { fromJS } from 'immutable';
import contactFormPageReducer from '../reducer';

describe('contactFormPageReducer', () => {
  it('returns the initial state', () => {
    expect(contactFormPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
