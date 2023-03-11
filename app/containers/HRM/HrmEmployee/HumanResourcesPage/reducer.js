import { fromJS } from 'immutable';
import { GET_HUMAN_RESOURCE_SUCCESS, UPDATE_HUMAN_RESOURCE, UPDATE_HUMAN_RESOURCE_FAILURE, UPDATE_HUMAN_RESOURCE_SUCCESS, ADD_HUMAN_RESOURCE, ADD_HUMAN_RESOURCE_FAILURE, ADD_HUMAN_RESOURCE_SUCCESS, GET_HUMAN_RESOURCE_FAILURE, GET_HUMAN_RESOURCE } from './constants';

export const initialState = fromJS({
  reload: false,
  fields: [],
  humanResource: []
});

function HumanResourcesPageReducer(state = initialState, action) {
  switch (action.type) {
    case GET_HUMAN_RESOURCE:
      return state.set('reload', false);
    case GET_HUMAN_RESOURCE_SUCCESS:
      return state.set('fields', action.fields).set('humanResource', action.data).set('reload', true);
    case GET_HUMAN_RESOURCE_FAILURE:
      return state.set('reload', false)
    case ADD_HUMAN_RESOURCE:
      return state.set('reload', false);
    case ADD_HUMAN_RESOURCE_SUCCESS:
      return state.set('reload', true);
    case ADD_HUMAN_RESOURCE_FAILURE:
      return state.set('reload', false);
    case UPDATE_HUMAN_RESOURCE:
      return state.set('reload', false);
    case UPDATE_HUMAN_RESOURCE_SUCCESS:
      return state.set('reload', true);
    case UPDATE_HUMAN_RESOURCE_FAILURE:
      return state.set('reload', false);
    default:
      return state;
  }
}

export default HumanResourcesPageReducer;
