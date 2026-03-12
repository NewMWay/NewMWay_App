import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { OtpInput } from "react-native-otp-entry";
import { useNavigation, useRoute } from '@react-navigation/native'
import { useToast } from '../../../utils/toasts/useToast'
import { AuthStackNavigationProp } from '../../../types/navigation/navigation'
import { useTimer } from 'react-timer-hook';
import { Controller, useForm } from 'react-hook-form';
import { OtpVerifyFormSchema, OtpVerifySchema } from '../schemas/otpVerify.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '../hooks/useRegister.hook';
import { useOtp } from '../hooks/useOtp.hook';
import LoadingOverlay from '../components/Loading/LoadingOverlay';
import { useForgotPassword } from '../hooks/useForgotPassword.hook';


const OtpVerificationScreen = () => {
  const route = useRoute();
  const { email, type, dataRegister, dataForgotPassword } = route.params as { email: string, type: 'Register' | 'ForgetPassword', dataRegister?: any, dataForgotPassword?: any };
  const logo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02-1.png')
  const chibiAnimationGif = require('../../../assets/animations/1030-vip-unscreen.gif');

  const navigation = useNavigation<AuthStackNavigationProp>();
  const { showSuccess, showError } = useToast();

  const { mutate: register, isPending: isRegistering } = useRegister();
  const { mutate: resendOtp, isPending: isResendingOtp } = useOtp();
  const { mutate: forgotPassword, isPending: isForgottingPassword } = useForgotPassword();

  const [isLoadingSend, setIsLoadingSend] = useState(false);

  const isLoading = isRegistering || isLoadingSend || isResendingOtp || isForgottingPassword;

  const time = new Date();
  time.setSeconds(time.getSeconds() + 300);

  const {
    seconds, minutes,
    isRunning, // 
    restart,
  } = useTimer({
    expiryTimestamp: time,
    onExpire: () => console.log('Timer expired')
  })

  const { control, handleSubmit, formState: { errors } } = useForm<OtpVerifyFormSchema>({
    defaultValues: {
      otp: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(OtpVerifySchema),
  });

  const onSubmit = (_data: OtpVerifyFormSchema) => {
    try {
      setIsLoadingSend(true);
      setTimeout(() => {
        setIsLoadingSend(false);
        handleConfirmOtp(_data);
      }, 3000);
    } catch (error: any) {
      setIsLoadingSend(false);
      showError(error, "Xác nhận OTP thất bại!");
    }
  };


  const handleConfirmOtp = (_data: OtpVerifyFormSchema) => {
    try {
      if (type === 'Register') {
        const dataRegisterPayload = { ...dataRegister, otp: _data.otp };
        register(dataRegisterPayload, {
          onSuccess: () => {
            showSuccess("Đăng ký thành công!");
            navigation.getParent()?.reset({
              index: 0,
              routes: [{
                name: "TabNavigation",
                params: {
                  screen: "MainTabs"
                }
              }]
            });
          },
          onError: (error: any) => {
            showError(error?.message || "Đăng ký thất bại!");
          }
        });

      }
      else {
        // navigation.navigate("ResetPasswordScreen", { email, otp: _data.otp, type: 'ForgetPassword' });
        const dataForgotPasswordPayload = { ...dataForgotPassword, otp: _data.otp, email: email, type: 'ForgetPassword' };
        forgotPassword(dataForgotPasswordPayload, {
          onSuccess: () => {
            showSuccess("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            navigation.reset({
              index: 0,
              routes: [{ name: "LoginScreen" }]
            });
          },
          onError: (error: any) => {
            showError(error?.message || "Xác nhận OTP thất bại!");
          }
        });
      }

    } catch (error: any) {
      showError(error, "Xác nhận OTP thất bại!");
    }
  }

  const handleResendOtp = () => {
    try {
      setIsLoadingSend(true);
      setTimeout(() => {
        resendOtp({ email, type },
          {
            onSuccess: () => {
              const newTime = new Date();
              newTime.setSeconds(newTime.getSeconds() + 300);
              restart(newTime);
              setIsLoadingSend(false);
              showSuccess("Gửi lại mã OTP thành công!");
            }
          }
        );
      }, 3000);
    } catch (error: any) {
      setIsLoadingSend(false);
      showError(error?.message || "Gửi lại mã OTP thất bại!");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}

    // keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Xác nhận OTP</Text>
          <View style={styles.welcomeContainer}>
            <Text style={styles.subtitle}>Mã xác nhận đã được gửi tới</Text>
            <Text style={styles.brand}>{email}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="otp"
              render={({ field: { onChange } }) => (
                <>
                  <OtpInput
                    numberOfDigits={5}
                    autoFocus={true}
                    blurOnFilled={true}
                    type="numeric"
                    // forward changes to RHF
                    onTextChange={(text) => onChange(text)}
                    onFilled={(text) => onChange(text)}
                    textInputProps={{
                      accessibilityLabel: 'One-Time Password',
                      keyboardType: 'numeric',
                    }}
                    textProps={{
                      accessibilityLabel: 'OTP digit',
                      allowFontScaling: false,
                    }}
                    theme={{
                      containerStyle: styles.containerStyle,
                      pinCodeContainerStyle: styles.pinCodeContainerStyle,
                      pinCodeTextStyle: styles.pinCodeText,
                      focusStickStyle: styles.focusStickStyle,
                      focusedPinCodeContainerStyle: styles.focusedPinCodeContainerStyle,
                      placeholderTextStyle: styles.placeholderTextStyle,
                    }}
                  />

                  {errors.otp?.message && (
                    <Text style={styles.errorText}>{String(errors.otp.message)}</Text>
                  )}
                </>
              )}
            />



            <View style={styles.chibiContainer}>
              <Image source={chibiAnimationGif} style={styles.chibiAnimation} />
            </View>
          </View>

          <View style={styles.actionBottomContainer}>
            <View style={styles.noAccountContainer}>
              <Text style={styles.noAccountText}>Bạn chưa nhận được OTP?</Text>

              {
                isRunning === true && (
                  <Text style={styles.link}> {minutes}:{seconds}</Text>
                )
              }
              {
                isRunning === false && (
                  <TouchableOpacity onPress={handleResendOtp}>
                    <Text style={styles.link}> Gửi lại</Text>
                  </TouchableOpacity>
                )
              }

            </View>

            <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.buttonTitle}>Xác nhận</Text>
            </TouchableOpacity>

          </View>

        </View>
      </ScrollView>
      <LoadingOverlay visible={isLoading} />
    </KeyboardAvoidingView>
  )
}

export default OtpVerificationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.textWhite,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 50,
  },
  logo: {
    width: 210,
    height: 210,
    resizeMode: 'contain'
  },
  welcomeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 5,
    gap: 2,
  },
  formContainer: {
    // marginHorizontal: 50,
    paddingHorizontal: 30,
    paddingTop: 30,
    backgroundColor: Colors.primary,
    flex: 1,
    paddingBottom: 80,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  chibiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textWhite,
    borderRadius: 16,
  },
  chibiAnimation: {
    width: 280,
    height: 200,
    alignSelf: 'center',
    marginTop: 20,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    fontFamily: 'Sora-Bold',
    color: Colors.textWhite,
    marginBottom: 8,
    textAlign: 'center',
  },
  brand: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Sora-Bold',
    color: Colors.textWhite,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Sora-Regular',
    color: Colors.textWhite,
    textAlign: 'center',
  },
  inputContainer: {
    gap: 20,
    marginTop: 20,
  },
  actionBottomContainer: {
    // position: 'absolute',
    // bottom: 50,
    top: 5,
    alignSelf: 'center',
  },
  buttonContainer: {
    width: 327,
    height: 56,
    backgroundColor: Colors.textWhite,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,

  },
  buttonTitle: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
  },
  noAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noAccountText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Sora-SemiBold',
    color: Colors.textWhite,
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Sora-Regular',
    color: Colors.textWhite,
    textAlign: 'right',
    marginTop: 12,
  },
  link: {
    color: Colors.textWhite,
    textDecorationLine: 'underline',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Sora-SemiBold',
  },
  containerStyle: {
    // marginTop: 50,
    // marginBottom: 40,
    justifyContent: 'space-evenly',
  },
  pinCodeContainerStyle: {
    width: 50,
    height: 60,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  focusedPinCodeContainerStyle: {
    borderColor: Colors.textWhite, // Viền trắng đậm khi focus
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Nền sáng hơn khi focus
  },
  pinCodeText: {
    fontSize: 24,
    fontFamily: 'Sora-Bold',
    color: Colors.textWhite,
  },
  placeholderTextStyle: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  focusStickStyle: {
    backgroundColor: Colors.textWhite,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: -12,
    marginLeft: 12,
    fontFamily: 'Sora-Regular',
  },
})