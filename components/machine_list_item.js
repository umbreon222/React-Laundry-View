import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';

const MachineListItem = ({ machine }) => {
  const simplifiedMachineType = machine.applianceType === 'W'
    ? 'Washer'
    : 'Dryer';
  const icon = simplifiedMachineType === 'Washer'
    ? require('../assets/images/washer_icon.png')
    : require('../assets/images/dryer_icon.png');
  const background = machine.timeLeftLite === 'Available'
    ? { backgroundColor: '#2ECC71' }
    : { backgroundColor: '#C0392B' };
  return (
    <Card style={[styles.cardStyle, background]}>
      <Card.Content style={styles.cardContentStyle}>
        <Image style={styles.cardAvatarStyle} source={icon} />
        <View>
          <Title>{`${simplifiedMachineType} ${machine.applianceDescription}`}</Title>
          <Paragraph>{machine.timeLeftLite}</Paragraph>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  cardAvatarStyle: {
    width: 64,
    height: 64,
    marginRight: 10,
  },
  cardContentStyle: {
    flex: 1,
    flexDirection: 'row',
  },
});

MachineListItem.propTypes = {
  machine: PropTypes.shape({
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
  }).isRequired,
};

export default MachineListItem;
