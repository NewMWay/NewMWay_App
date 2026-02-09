import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../../../types/navigation/navigation';
import { Colors } from '../../../assets/styles/colorStyles';


const SplashScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const splashLogo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02.png');

  const widthAnim = React.useRef(new Animated.Value(327)).current;
  const heightAnim = React.useRef(new Animated.Value(56)).current;

  React.useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: 360,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.timing(heightAnim, {
      toValue: 70,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [heightAnim, widthAnim]);

  const handleOnPress = () => {
    navigation.navigate('LoginScreen');
  }
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={splashLogo}
      />

      <TouchableOpacity style={styles.buttonContainer} onPress={handleOnPress}>
        <Text style={styles.title}>Bắt Đầu</Text>
      </TouchableOpacity>
      
    </View>

  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.textWhite,
  },
  logo: {
    width: 360,
    height: 360,
    resizeMode: 'contain',
    bottom: 50,
  },
  buttonContainer: {
    width: 327,
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.textWhite,
  }
})