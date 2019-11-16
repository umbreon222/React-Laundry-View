import {
  FETCH_LOCATIONS_BEGIN,
  FETCH_LOCATIONS_SUCCESS,
  FETCH_LOCATIONS_ERROR,
  FETCH_ROOMS_BEGIN,
  FETCH_ROOMS_SUCCESS,
  FETCH_ROOMS_ERROR,
  SET_SELECTED_LOCATION,
  SET_SELECTED_ROOM,
} from './types';

export const fetchLocations = () => async (dispatch) => {
  dispatch(fetchLocationsBegin());
  try {
    const locations = await requestLocations();
    dispatch(fetchLocationsSuccess(locations));
    return locations;
  } catch (error) {
    dispatch(fetchLocationsFailure(error));
    return [];
  }
};

const fetchLocationsBegin = () => ({
  type: FETCH_LOCATIONS_BEGIN,
});

const fetchLocationsFailure = error => ({
  type: FETCH_LOCATIONS_ERROR,
  payload: {
    error,
  },
});

const fetchLocationsSuccess = locations => ({
  type: FETCH_LOCATIONS_SUCCESS,
  payload: {
    locations,
  },
});

export const requestLocations = async () => {
  const endPoint = 'https://www.laundryview.com/api/c_locations';
  try {
    const response = await fetch(endPoint);
    const res = await handleErrors(response);
    const data = await res.json();
    const formattedData = data.reduce((list, location) => {
      list.push({
        schoolDescriptionKey: location.school_desc_key,
        schoolName: location.school_name,
        online: location.online,
        total: location.total,
      });
      return list;
    }, []);
    return formattedData;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchRooms = schoolDescKey => async (dispatch) => {
  dispatch(fetchRoomsBegin());
  try {
    if (!schoolDescKey) {
      throw Error("School description key can't be null");
    }
    const rooms = await requestRooms(schoolDescKey);
    dispatch(fetchRoomsSuccess(rooms));
    return rooms;
  } catch (error) {
    dispatch(fetchRoomsFailure(error));
    return [];
  }
};

const fetchRoomsBegin = () => ({
  type: FETCH_ROOMS_BEGIN,
});

const fetchRoomsFailure = error => ({
  type: FETCH_ROOMS_ERROR,
  payload: {
    error,
  },
});

const fetchRoomsSuccess = rooms => ({
  type: FETCH_ROOMS_SUCCESS,
  payload: {
    rooms,
  },
});

export const setSelectedLocation = location => ({
  type: SET_SELECTED_LOCATION,
  payload: {
    location,
  },
});

export const setSelectedRoom = room => ({
  type: SET_SELECTED_ROOM,
  payload: {
    room,
  },
});

export const requestRooms = async (schoolDescKey) => {
  const endPoint = `https://www.laundryview.com/api/c_room?loc=${schoolDescKey}`;
  try {
    const response = await fetch(endPoint);
    const res = await handleErrors(response);
    const data = await res.json();
    const formattedData = data.room_data.reduce((list, room) => {
      list.push({
        schoolName: room.school_name,
        campusName: room.campus_name,
        laundryRoomLocation: room.laundry_room_location,
        laundryRoomName: room.laundry_room_name,
        online: room.online,
        total: room.total,
      });
      return list;
    }, []);
    return formattedData;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Handle HTTP errors since fetch won't.
const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};
