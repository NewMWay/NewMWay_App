import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React, { FC, useState } from 'react'
import { Colors } from '../../../../assets/styles/colorStyles';

interface FormInputProps {
  icon?: any;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onBlur?: () => void;
}

const FormInput: FC<FormInputProps> = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  onBlur,
}) => {

  const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry || false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const visibleIcon = require('../../../../assets/icons/icons8-visible-48.png');
  const invisibleIcon = require('../../../../assets/icons/icons8-invisible-48.png');

  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPasswordVisible}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'none'}
        onBlur={onBlur}
      />
      {secureTextEntry && (
       <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
          <Image
            source={isPasswordVisible ? invisibleIcon : visibleIcon}
            style={[styles.toggleIcon]}
          />
       </TouchableOpacity>
      )}
    </View>
  )
}

export default FormInput

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    height: 52,
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.primaryDark,
    fontFamily: 'Sora-Regular',
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 15,
    resizeMode: 'contain',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 15,
  },
})