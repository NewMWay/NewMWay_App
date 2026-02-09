import Toast from 'react-native-toast-message';
import { toastStyles } from '../../assets/styles/toastStyle';


export const useToast = () => {
  const showSuccess = (
    message: string,
    title?: string,
    options?: {
      maxLines?: number;
      onPress?: () => void;
    }
  ) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      visibilityTime: toastStyles.successToast.visibilityTime,
      autoHide: toastStyles.successToast.autoHide,
      position: toastStyles.successToast.position,
      topOffset: toastStyles.successToast.topOffset,
      props: {
        maxLines: options?.maxLines ?? 2,
      },
      onPress: options?.onPress,
    });
  };

  const showError = (
    message: string,
    title?: string,
    options?: {
      maxLines?: number;
      onPress?: () => void;
    }
  ) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      visibilityTime: toastStyles.errorToast.visibilityTime,
      autoHide: toastStyles.errorToast.autoHide,
      position: toastStyles.errorToast.position,
      topOffset: toastStyles.errorToast.topOffset,
      props: {
        maxLines: options?.maxLines ?? 2,
      },
      onPress: options?.onPress,
    });
  };

  const showInfo = (
    message: string,
    title?: string,
    options?: {
      maxLines?: number;
      onPress?: () => void;
    }
  ) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      visibilityTime: toastStyles.infoToast.visibilityTime,
      autoHide: toastStyles.infoToast.autoHide,
      position: toastStyles.infoToast.position,
      topOffset: toastStyles.infoToast.topOffset,
      props: {
        maxLines: options?.maxLines ?? 2,
      },
      onPress: options?.onPress,
    });
  };

  const showMessage = (
    message: string,
    title?: string,
    options?: {
        maxLines?: number;
        onPress?: () => void;
        }
    ) => {
    Toast.show({
        type: 'message',
        text1: title,
        text2: message,
        visibilityTime: toastStyles.infoToast.visibilityTime,
        autoHide: toastStyles.infoToast.autoHide,
        position: toastStyles.infoToast.position,
        topOffset: toastStyles.infoToast.topOffset,
        props: {
            maxLines: options?.maxLines ?? 2,
        },
        onPress: options?.onPress,
    });
};

  return { showSuccess, showError, showInfo, showMessage };
};