import { fromJS } from 'immutable';
import addDeliveryPageReducer from '../reducer';

describe('addDeliveryPageReducer', () => {
  it('returns the initial state', () => {
    expect(addDeliveryPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
