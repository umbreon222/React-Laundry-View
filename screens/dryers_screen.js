import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Snackbar } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';

import { BACKGROUND_COLOR } from '../constants';
import * as actions from '../actions';
import MachineListItem from '../components';

class DryersScreen extends Component {
  componentWillMount() {
    this.onRefreshMachines();
  }

  onWillFocus() {
    const { settingsReducer, machinesReducer } = this.props;
    const { selectedRoom } = settingsReducer;
    const { currentlyDisplayedRoom } = machinesReducer;
    if (selectedRoom && selectedRoom !== currentlyDisplayedRoom) {
      this.onRefreshMachines();
    }
  }

  onRefreshMachines() {
    const { settingsReducer, fetchMachines, setCurrentlyDisplayedRoom } = this.props;
    const {
      selectedLocation,
      selectedRoom,
    } = settingsReducer;
    const schoolDescriptionKey = selectedLocation?.schoolDescriptionKey;
    const laundryRoomLocation = selectedRoom?.laundryRoomLocation;
    if (!schoolDescriptionKey || !laundryRoomLocation) {
      return;
    }
    fetchMachines(laundryRoomLocation, schoolDescriptionKey);
    setCurrentlyDisplayedRoom(selectedRoom);
  }

  render() {
    const {
      machinesReducer,
      settingsReducer,
      navigation,
    } = this.props;
    const {
      isLoadingMachines,
      fetchMachinesError,
      machines,
    } = machinesReducer;
    const { selectedRoom } = settingsReducer;
    return (
      <View style={styles.mainView}>
        <NavigationEvents
          onWillFocus={() => this.onWillFocus()}
        />
        <FlatList
          style={[styles.flatListScrollView]}
          data={
            machines.filter(machine => machine.applianceType === 'D')
              .sort((a, b) => Number(a.applianceDescription) - Number(b.applianceDescription))
          }
          renderItem={({ item }) => <MachineListItem machine={item} />}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={(
            <RefreshControl
              refreshing={isLoadingMachines}
              onRefresh={() => this.onRefreshMachines()}
            />
          )}
        />
        <Snackbar
          visible={!selectedRoom}
          onDismiss={() => {}}
          action={{
            label: 'SETTINGS',
            onPress: () => navigation.push('SettingsStack'),
          }}
        >
          {'Please select a laundry room'}
        </Snackbar>
        <Snackbar
          visible={fetchMachinesError}
          onDismiss={() => {}}
          action={{
            label: 'RETRY',
            onPress: () => this.onRefreshMachines(),
          }}
        >
          {'Error fetching machine data'}
        </Snackbar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
  },
  flatListScrollView: {
    backgroundColor: BACKGROUND_COLOR,
  },
});

DryersScreen.propTypes = {
  settingsReducer: PropTypes.shape({
    selectedRoom: PropTypes.shape({
      school_name: PropTypes.string,
      campus_name: PropTypes.string,
      laundry_room_location: PropTypes.string,
      laundry_room_name: PropTypes.string,
      online: PropTypes.number,
      total: PropTypes.number,
    }),
  }).isRequired,
  machinesReducer: PropTypes.shape({
    isLoadingMachines: PropTypes.bool.isRequired,
    machines: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string,
      applianceType: PropTypes.string,
      modelNumber: PropTypes.string,
      x: PropTypes.number,
      y: PropTypes.number,
      orientation: PropTypes.string,
      applianceDescriptionKey: PropTypes.string,
      applianceDescription: PropTypes.string,
      combo: PropTypes.bool,
      stacked: PropTypes.bool,
      opacity: PropTypes.number,
      statusToggle: PropTypes.number,
      averageRunTime: PropTypes.number,
      timeRemaining: PropTypes.number,
      timeLeftLite: PropTypes.string,
      percentage: PropTypes.number,
    })),
    fetchMachinesError: PropTypes.object,
    currentlyDisplayedRoom: PropTypes.object,
  }).isRequired,
  fetchMachines: PropTypes.func.isRequired,
  setCurrentlyDisplayedRoom: PropTypes.func.isRequired,
};

const mapStateToProps = ({ machinesReducer, settingsReducer }) => ({
  machinesReducer,
  settingsReducer,
});

export default connect(
  mapStateToProps,
  actions,
)(DryersScreen);
