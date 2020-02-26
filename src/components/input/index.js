import React from 'react'; // eslint-disable-line no-unused-vars
import {TextInput, View, Text} from 'react-native'; // eslint-disable-line no-unused-vars
import styles from './styles';

const Input = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  instyle,
  autoCapitalize,
  keyboardType,
  error,
  maxLength,
  multiline,
  editable,
}) => {
  const {inputStyle, containerStyle} = styles;

  return (
    <View style={containerStyle}>
      <TextInput
        editable={editable}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}
        style={[
          inputStyle,
          instyle,
          error ? {borderWidth: 1} : {borderWidth: 0},
        ]}
        value={value}
        onChangeText={onChangeText}
        underlineColorAndroid="transparent"
        placeholderTextColor="#83889E"
        multiline={multiline}
        blurOnSubmit={true}
        autoCapitalize={'sentences' && autoCapitalize}
        keyboardType={'default' && keyboardType}
        maxLength={maxLength}
      />
    </View>
  );
};

export {Input};
