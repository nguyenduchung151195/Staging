import { fromJS } from 'immutable';
import deliveryPageReducer from '../reducer';

describe('deliveryPageReducer', () => {
  it('returns the initial state', () => {
    expect(deliveryPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
