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

class SetLocationScreen extends Component {
  state = {
    searchTerm: '',
  };

  componentWillMount() {
    this.onRefreshLocations();
  }

  onRefreshLocations() {
    const { fetchLocations } = this.props;
    fetchLocations();
  }

  locationSelected(location) {
    const { setSelectedLocation, navigation } = this.props;
    setSelectedLocation(location);
    navigation.push('SetRoomScreen');
  }

  render() {
    const { searchTerm } = this.state;
    const { settingsReducer } = this.props;
    const { locations, isLoadingLocations, fetchLocationsError } = settingsReducer;
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
          data={locations.filter(location => location.schoolName.toLowerCase().includes(
            searchTerm.toLowerCase(),
          ))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <List.Item
              style={styles.listItemStyle}
              title={item.schoolName}
              onPress={() => this.locationSelected(item)}
            />
          )}
          initialNumToRender={21}
          refreshControl={(
            <RefreshControl
              refreshing={isLoadingLocations}
              onRefresh={() => this.onRefreshLocations()}
            />
          )}
        />
        <Snackbar
          visible={fetchLocationsError}
          onDismiss={() => {}}
          action={{
            label: 'RETRY',
            onPress: () => this.onRefreshLocations(),
          }}
        >
          {'Error fetching location data'}
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

SetLocationScreen.propTypes = {
  settingsReducer: PropTypes.shape({
    isLoadingLocations: PropTypes.bool.isRequired,
    locations: PropTypes.arrayOf(PropTypes.shape({
      schoolDescriptionKey: PropTypes.string,
      schoolName: PropTypes.string,
      online: PropTypes.number,
      total: PropTypes.number,
    })).isRequired,
    fetchLocationsError: PropTypes.object,
  }).isRequired,
  fetchLocations: PropTypes.func.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
};

const mapStateToProps = ({ settingsReducer }) => ({ settingsReducer });

export default connect(
  mapStateToProps,
  actions,
)(SetLocationScreen);
