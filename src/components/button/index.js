import React from 'react'; // eslint-disable-line no-unused-vars
import {Text, TouchableOpacity, View} from 'react-native'; // eslint-disable-line no-unused-vars
import styles from './styles';

const Button = ({onPress, children, style}) => {
  const {buttonStyle, textStyle, viewStyle} = styles;

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <View style={viewStyle}>
        <Text style={[textStyle, style]}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
};

export {Button};
