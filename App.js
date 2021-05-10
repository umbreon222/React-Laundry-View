import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Asset } from 'expo-asset';
import AppLoading from 'expo-app-loading';
import {
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  SettingsScreen,
  WashersScreen,
  DryersScreen,
  SetLocationScreen,
  SetRoomScreen,
} from './screens';
import { store, persistor } from './store';
import {
  WHITE_COLOR,
  TEXT_PRIMARY_COLOR,
  PRIMARY_COLOR,
  TEXT_PRIMARY_DARK_COLOR,
  PRIMARY_DARK_COLOR,
} from './constants';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
    };
  }

  render() {
    const { isLoadingComplete } = this.state;
    if (!isLoadingComplete) {
      return (
        <AppLoading
          startAsync={loadResourcesAsync}
          onError={handleLoadingError}
          onFinish={() => { this.setState({ isLoadingComplete: true }); }}
        />
      );
    }
    const SettingsStack = createStackNavigator({
      SettingsScreen: {
        screen: SettingsScreen,
        navigationOptions: {
          header: null,
        },
      },
      SetLocationScreen: {
        screen: SetLocationScreen,
        navigationOptions: {
          header: null,
        },
      },
      SetRoomScreen: {
        screen: SetRoomScreen,
        navigationOptions: {
          header: null,
        },
      },
    });
    const WashersStack = createStackNavigator({
      WashersScreen: {
        screen: WashersScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Washers',
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          headerRight: (
            <TouchableOpacity onPress={() => navigation.push('SettingsStack')} style={styles.touchableIconStyle}>
              <Icon name="settings" color={WHITE_COLOR} size={24} />
            </TouchableOpacity>
          ),
        }),
      },
    });
    const DryersStack = createStackNavigator({
      DryersScreen: {
        screen: DryersScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Dryers',
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          headerRight: (
            <TouchableOpacity onPress={() => navigation.push('SettingsStack')} style={styles.touchableIconStyle}>
              <Icon name="settings" color={WHITE_COLOR} size={24} />
            </TouchableOpacity>
          ),
        }),
      },
    });
    const MaterialBottomTabNavigator = createMaterialBottomTabNavigator({
      WashersStack: {
        screen: WashersStack,
        navigationOptions: {
          title: 'Washers',
          tabBarIcon: ({ tintColor }) => (
            <Image style={styles.imageIconStyle} source={require('./assets/images/washer_icon.png')} tintColor={tintColor} />
          ),
        },
      },
      DryersStack: {
        screen: DryersStack,
        navigationOptions: {
          title: 'Dryers',
          tabBarIcon: ({ tintColor }) => (
            <Image style={styles.imageIconStyle} source={require('./assets/images/dryer_icon.png')} tintColor={tintColor} />
          ),
        },
      },
    }, {
      initialRouteName: 'WashersStack',
      activeColor: TEXT_PRIMARY_DARK_COLOR,
      inactiveColor: PRIMARY_COLOR,
      barStyle: styles.materialTabNavigatorBarStyle,
    });
    const AppStackNavigator = createStackNavigator({
      MaterialBottomTabNavigator: {
        screen: MaterialBottomTabNavigator,
        navigationOptions: {
          header: null,
        },
      },
      SettingsStack: {
        screen: SettingsStack,
        navigationOptions: {
          title: 'Settings',
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
        },
      },
    });
    const AppContainer = createAppContainer(AppStackNavigator);
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
    );
  }
}

// In this case, you might want to report the error to your error
// reporting service, for example Sentry
const handleLoadingError = error => console.warn(error);

const loadResourcesAsync = async () => Promise.all([
  Asset.loadAsync([
    require('./assets/images/washer_icon.png'),
    require('./assets/images/dryer_icon.png'),
  ]),
]);

const styles = StyleSheet.create({
  materialTabNavigatorBarStyle: {
    backgroundColor: PRIMARY_DARK_COLOR,
  },
  headerStyle: {
    backgroundColor: PRIMARY_COLOR,
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    color: TEXT_PRIMARY_COLOR,
  },
  touchableIconStyle: {
    justifyContent: 'center',
    marginRight: 15,
  },
  imageIconStyle: {
    width: 24,
    height: 24,
  },
});

export default App;
