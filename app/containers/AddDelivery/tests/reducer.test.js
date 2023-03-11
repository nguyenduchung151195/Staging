import { fromJS } from 'immutable';
import addDeliveryReducer from '../reducer';

describe('addDeliveryReducer', () => {
  it('returns the initial state', () => {
    expect(addDeliveryReducer(undefined, {})).toEqual(fromJS({}));
  });
});
