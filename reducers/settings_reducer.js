import {
  FETCH_LOCATIONS_BEGIN,
  FETCH_LOCATIONS_SUCCESS,
  FETCH_LOCATIONS_ERROR,
  FETCH_ROOMS_BEGIN,
  FETCH_ROOMS_SUCCESS,
  FETCH_ROOMS_ERROR,
  SET_SELECTED_LOCATION,
  SET_SELECTED_ROOM,
} from '../actions/types';


const INITIAL_STATE = {
  selectedLocation: null,
  isLoadingLocations: false,
  locations: [],
  fetchLocationsError: null,
  selectedRoom: null,
  isLoadingRooms: false,
  rooms: [],
  fetchRoomsError: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_LOCATIONS_BEGIN:
      return {
        ...state,
        isLoadingLocations: true,
        fetchLocationsError: null,
      };
    case FETCH_LOCATIONS_SUCCESS:
      return {
        ...state,
        isLoadingLocations: false,
        locations: action.payload.locations,
      };
    case FETCH_LOCATIONS_ERROR:
      return {
        ...state,
        isLoadingLocations: false,
        fetchLocationsError: action.payload.error,
        locations: [],
      };
    case FETCH_ROOMS_BEGIN:
      return {
        ...state,
        isLoadingRooms: true,
        fetchRoomsError: null,
      };
    case FETCH_ROOMS_SUCCESS:
      return {
        ...state,
        isLoadingRooms: false,
        rooms: action.payload.rooms,
      };
    case FETCH_ROOMS_ERROR:
      return {
        ...state,
        isLoadingRooms: false,
        fetchRoomsError: action.payload.error,
        rooms: [],
      };
    case SET_SELECTED_LOCATION:
      return {
        ...state,
        selectedLocation: action.payload.location,
      };
    case SET_SELECTED_ROOM:
      return {
        ...state,
        selectedRoom: action.payload.room,
      };
    default:
      return state;
  }
};
