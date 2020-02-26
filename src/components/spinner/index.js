import React from 'react'; // eslint-disable-line no-unused-vars
import {View, ActivityIndicator} from 'react-native'; // eslint-disable-line no-unused-vars
import styles from './styles';

const Spinner = ({size, color}) => {
  return (
    <View style={styles.spinnerStyle}>
      <ActivityIndicator size={size || 'large'} color={color || 'gray'} />
    </View>
  );
};

export {Spinner};
