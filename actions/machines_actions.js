import {
  FETCH_MACHINES_BEGIN,
  FETCH_MACHINES_SUCCESS,
  FETCH_MACHINES_ERROR,
  SET_CURRENTLY_DISPLAYED_ROOM,
} from './types';
import { PHONE_NUMBER } from '../constants';

export const fetchMachines = (locationID, schoolDescKey) => async (dispatch) => {
  dispatch(fetchMachinesBegin());
  try {
    if (!locationID) {
      throw Error("Location ID can't be null");
    }
    if (!schoolDescKey) {
      throw Error("School description key can't be null");
    }
    const allMachines = await requestMachines(locationID, PHONE_NUMBER, schoolDescKey);
    const machines = allMachines.filter(x => x.modelNumber !== undefined);
    dispatch(fetchMachinesSuccess(machines));
    return machines;
  } catch (error) {
    dispatch(fetchMachinesFailure(error));
    return [];
  }
};

const fetchMachinesBegin = () => ({
  type: FETCH_MACHINES_BEGIN,
});

const fetchMachinesFailure = error => ({
  type: FETCH_MACHINES_ERROR,
  payload: {
    error,
  },
});

const fetchMachinesSuccess = machines => ({
  type: FETCH_MACHINES_SUCCESS,
  payload: {
    machines,
  },
});

const requestMachines = async (locationID, phoneNumber, schoolDescKey) => {
  const endPoint = `https://www.laundryview.com/api/currentRoomData?school_desc_key=${schoolDescKey}&location=${locationID}&userContact=${phoneNumber}`;
  try {
    const response = await fetch(endPoint);
    const res = await handleErrors(response);
    const data = await res.json();
    const formattedData = data.objects.reduce((list, machine) => {
      list.push({
        type: machine.type,
        applianceType: machine.appliance_type,
        modelNumber: machine.model_number,
        x: machine.x,
        y: machine.y,
        orientation: machine.orientation,
        applianceDescriptionKey: machine.appliance_desc_key,
        applianceDescription: machine.appliance_desc,
        combo: machine.combo,
        stacked: machine.stacked,
        opacity: machine.opacity,
        statusToggle: machine.status_toggle,
        averageRunTime: machine.average_run_time,
        timeRemaining: machine.time_remaining,
        timeLeftLite: machine.time_left_lite,
        percentage: machine.percentage,
      });
      if (machine.stacked) {
        list.push({
          type: machine.type,
          applianceType: machine.appliance_type,
          modelNumber: machine.model_number,
          x: machine.x,
          y: machine.y,
          orientation: machine.orientation,
          applianceDescriptionKey: machine.appliance_desc_key2,
          applianceDescription: machine.appliance_desc2,
          combo: machine.combo,
          stacked: machine.stacked,
          opacity: machine.opacity,
          statusToggle: machine.status_toggle2,
          averageRunTime: machine.average_run_time2,
          timeRemaining: machine.time_remaining2,
          timeLeftLite: machine.time_left_lite2,
          percentage: machine.percentage2,
        });
      }
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

export const setCurrentlyDisplayedRoom = room => (
  {
    type: SET_CURRENTLY_DISPLAYED_ROOM,
    payload: {
      room,
    },
  }
);
