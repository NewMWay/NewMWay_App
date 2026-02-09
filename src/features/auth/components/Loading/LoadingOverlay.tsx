import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Video from 'react-native-video';
// import LottieView from 'lottie-react-native';
// import { Colors } from '../../../../assets/styles/colorStyles';

interface LoadingOverlayProps {
  visible: boolean;
  fullScreen?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
  // const animationLoadingSrc = require('../../../../assets/animations/newmwayloading.json'); 
  const videoLoadingSrc = require('../../../../assets/video/1119(1).mp4');
  const { width, height } = Dimensions.get('window');


  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Video
        source={videoLoadingSrc}
        style={{ width, height }}
        resizeMode="cover"
        repeat
        muted
        paused={!visible}
      />
      {/* <LottieView
        source={animationLoadingSrc}
        autoPlay={visible}
        loop={true}
        style={[styles.lottieAnimation, { width, height }]}
        resizeMode="cover"
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: Colors.primary,
    zIndex: 1000,
  },
  lottieAnimation: {
    position: 'absolute',
  },
});

export default LoadingOverlay;