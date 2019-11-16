import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';
import { List } from 'react-native-paper';

import { BACKGROUND_COLOR } from '../constants';

const SettingsScreen = ({ settingsReducer, navigation }) => {
  const { selectedRoom } = settingsReducer;
  const { laundryRoomName } = selectedRoom || {};
  return (
    <View style={styles.mainView}>
      <List.Section>
        <List.Item
          style={styles.flatListStyle}
          title={`Location: ${laundryRoomName || 'NONE'}`}
          left={() => <List.Icon icon="location-on" />}
          onPress={() => navigation.push('SetLocationScreen')}
        />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  listScrollView: {
    backgroundColor: BACKGROUND_COLOR,
  },
  flatListStyle: {
    backgroundColor: 'white',
    borderBottomColor: BACKGROUND_COLOR,
    borderBottomWidth: 2,
  },
});

SettingsScreen.propTypes = {
  settingsReducer: PropTypes.shape({
    selectedRoom: PropTypes.shape({
      schoolName: PropTypes.string,
      campusName: PropTypes.string,
      laundryRoomLocation: PropTypes.string,
      laundryRoomName: PropTypes.string,
      online: PropTypes.number,
      total: PropTypes.number,
    }),
  }).isRequired,
};

const mapStateToProps = ({ settingsReducer }) => ({ settingsReducer });

export default connect(
  mapStateToProps,
)(SettingsScreen);
