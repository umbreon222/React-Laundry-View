import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  RefreshControl,
  FlatList,
} from 'react-native';
import {
  List,
  Snackbar,
  TextInput,
} from 'react-native-paper';

import { BACKGROUND_COLOR, PRIMARY_LIGHT_COLOR, PRIMARY_COLOR } from '../constants';
import * as actions from '../actions';

class SetRoomScreen extends Component {
  state = {
    searchTerm: '',
  };

  componentWillMount() {
    this.onRefreshRooms();
  }

  onRefreshRooms() {
    const { settingsReducer, fetchRooms } = this.props;
    const { selectedLocation } = settingsReducer;
    fetchRooms(selectedLocation.schoolDescriptionKey);
  }

  roomSelected(room) {
    const { navigation, setSelectedRoom } = this.props;
    setSelectedRoom(room);
    navigation.popToTop();
  }

  render() {
    const { searchTerm } = this.state;
    const { settingsReducer } = this.props;
    const { rooms, isLoadingRooms, fetchRoomsError } = settingsReducer;
    return (
      <View style={styles.mainView}>
        <TextInput
          label="Search"
          theme={{
            colors: {
              primary: PRIMARY_COLOR,
              accent: PRIMARY_LIGHT_COLOR,
            },
          }}
          underlineColor={PRIMARY_COLOR}
          value={searchTerm}
          onChangeText={text => this.setState({ searchTerm: text })}
        />
        <FlatList
          data={rooms.filter(room => room.laundryRoomName.toLowerCase().includes(
            searchTerm.toLowerCase(),
          ))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <List.Item
              style={styles.listItemStyle}
              title={item.laundryRoomName}
              onPress={() => this.roomSelected(item)}
            />
          )}
          initialNumToRender={21}
          refreshControl={(
            <RefreshControl
              refreshing={isLoadingRooms}
              onRefresh={() => this.onRefreshRooms()}
            />
          )}
        />
        <Snackbar
          visible={fetchRoomsError}
          onDismiss={() => {}}
          action={{
            label: 'RETRY',
            onPress: () => this.onRefreshRooms(),
          }}
        >
          {'Error fetching room data'}
        </Snackbar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  listItemStyle: {
    backgroundColor: 'white',
    borderBottomColor: BACKGROUND_COLOR,
    borderBottomWidth: 2,
  },
});

SetRoomScreen.propTypes = {
  settingsReducer: PropTypes.shape({
    selectedLocation: PropTypes.shape({
      schoolDescriptionKey: PropTypes.string,
      schoolName: PropTypes.string,
      online: PropTypes.number,
      total: PropTypes.number,
    }),
    isLoadingRooms: PropTypes.bool,
    rooms: PropTypes.arrayOf(PropTypes.shape({
      schoolName: PropTypes.string,
      campusName: PropTypes.string,
      laundryRoomLocation: PropTypes.string,
      laundryRoomName: PropTypes.string,
      online: PropTypes.number,
      total: PropTypes.number,
    })),
    fetchRoomsError: PropTypes.object,
  }).isRequired,
  fetchRooms: PropTypes.func.isRequired,
  setSelectedRoom: PropTypes.func.isRequired,
};

const mapStateToProps = ({ settingsReducer }) => ({ settingsReducer });

export default connect(
  mapStateToProps,
  actions,
)(SetRoomScreen);
