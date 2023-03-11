import { fromJS } from 'immutable';
import emailSmsReducer from '../reducer';

describe('emailSmsReducer', () => {
  it('returns the initial state', () => {
    expect(emailSmsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
