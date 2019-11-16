import {
  FETCH_MACHINES_BEGIN,
  FETCH_MACHINES_SUCCESS,
  FETCH_MACHINES_ERROR,
  SET_CURRENTLY_DISPLAYED_ROOM,
} from '../actions/types';

const INITIAL_STATE = {
  isLoadingMachines: false,
  machines: [],
  fetchMachinesError: null,
  currentlyDisplayedRoom: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_MACHINES_BEGIN:
      return {
        ...state,
        isLoadingMachines: true,
        fetchMachinesError: null,
      };
    case FETCH_MACHINES_SUCCESS:
      return {
        ...state,
        isLoadingMachines: false,
        machines: action.payload.machines,
      };
    case FETCH_MACHINES_ERROR:
      return {
        ...state,
        isLoadingMachines: false,
        fetchMachinesError: action.payload.error,
        machines: [],
      };
    case SET_CURRENTLY_DISPLAYED_ROOM:
      return {
        ...state,
        currentlyDisplayedRoom: action.payload.room,
      };
    default:
      return state;
  }
};
