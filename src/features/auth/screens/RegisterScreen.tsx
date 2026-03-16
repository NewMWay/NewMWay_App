/* eslint-disable @typescript-eslint/no-unused-vars */
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import FormInput from '../components/Form/FormInput'
import { useNavigation } from '@react-navigation/native'
import { useToast } from '../../../utils/toasts/useToast'
import { AuthStackNavigationProp } from '../../../types/navigation/navigation'
import { Controller, useForm } from 'react-hook-form'
import { RegisterFormSchema, RegisterSchema } from '../schemas/register.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOtp } from '../hooks/useOtp.hook'
import LoadingOverlay from '../components/Loading/LoadingOverlay'
import TermsModal from '../../../components/common/Modal/TermsModal'
import CheckBox from '../../../components/common/CheckBox/CheckBox'
import { useSocialGoogleLogin } from '../hooks/useSocialGoogleLogin.hook'
import { configureGoogleSignIn, signInWithGoogle } from '../../../utils/auth/googleAuthHelper'
import { useGoogleSetting } from '../hooks/useSetting.hook'

const RegisterScreen = () => {
  const logo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02-1.png')
  const personIcon = require('../../../assets/icons/icons8-person-auth-48.png')
  const mailIcon = require('../../../assets/icons/icons8-email-48.png')
  const phoneIcon = require('../../../assets/icons/icons8-phone-3-48.png')
  const lockIcon = require('../../../assets/icons/icons8-lock-48.png')
  const unlockIcon = require('../../../assets/icons/icons8-padlock-48.png')
  const googleIcon = require('../../../assets/icons/icons8-google-48.png')
  // const facebookIcon = require('../../../assets/icons/icons8-facebook-48.png')


  const navigation = useNavigation<AuthStackNavigationProp>();

  const { showSuccess, showError } = useToast();

  const { mutate: sendOtp, isPending: isSendingOtp } = useOtp();
  const { mutate: socialGoogleLoginMutate, isPending: isSocialGoogleLoginPending } = useSocialGoogleLogin();
  const { data: googleSettingData, isLoading: isGoogleSettingLoading, isError: isGoogleSettingError } = useGoogleSetting();

  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [isTermsModalVisible, setTermsModalVisible] = useState(false);
  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormSchema>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      // otp: '',
    },
  });

  const isLoading = isSendingOtp || isLoadingSend || isSocialGoogleLoginPending;

  useEffect(() => {
    configureGoogleSignIn();
  }, []);


  const onSubmit = (_data: RegisterFormSchema) => {
    if (!isChecked) {
      showError('Vui lòng chấp nhận điều khoản dịch vụ và chính sách bảo mật');
      return;
    }

    try {
      setIsLoadingSend(true);
      setTimeout(() => {
        setIsLoadingSend(false);
        handleRegister(_data);
      }, 3000);
    } catch (err: any) {
      setIsLoadingSend(false);
      showError(err?.message || 'Đăng ký thất bại');
    }
  };


  const handleRegister = (_data: RegisterFormSchema) => {
    sendOtp({ email: _data.email, type: 'Register' },
      {
        onSuccess: () => {
          // OTP sent successfully
          navigation.navigate("OtpVerificationScreen", { email: _data.email, type: "Register", dataRegister: _data });
        },
        onError: (error: Error) => {
          showError(error.message || 'Gửi mã OTP thất bại!');
        }
      }
    );
  }

  const handleBackLogin = () => {
    navigation.goBack();
  }

  const handleSocialGoogleLogin = async () => {
    try {
      const idToken = await signInWithGoogle();
      if (idToken) {
        socialGoogleLoginMutate({ idToken },
          {
            onSuccess: () => {
              showSuccess("Chào mừng bạn!", "Đăng nhập thành công!");
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
          }
        );
      }
    } catch (error) {
      showError('Đăng nhập Google thất bại. Vui lòng thử lại.');
      console.error('Google Login Error:', error);
    }
  }



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
    >

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Đăng Ký</Text>
          <View style={styles.welcomeContainer}>
            <Text style={styles.subtitle}>Chào mừng bạn đến với</Text>
            <Text style={styles.brand}>NEWMWAY TEAKWOOD</Text>
          </View>


          <View style={styles.inputContainer}>
            {/* Username */}
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <FormInput
                    placeholder="Tên đăng nhập"
                    keyboardType="default"
                    icon={personIcon}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}

                  />
                  {errors.username?.message && (
                    <Text style={styles.errorText}>{String(errors.username.message)}</Text>
                  )}
                </>
              )}
            />


            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <FormInput
                    placeholder="Email"
                    keyboardType="email-address"
                    icon={mailIcon}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.email?.message && (
                    <Text style={styles.errorText}>{String(errors.email.message)}</Text>
                  )}
                </>
              )}
            />

            {/* Phone number */}
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <FormInput
                    placeholder="Số điện thoại"
                    keyboardType="phone-pad"
                    icon={phoneIcon}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.phone?.message && (
                    <Text style={styles.errorText}>{String(errors.phone.message)}</Text>
                  )}
                </>
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <FormInput
                    placeholder="Mật khẩu"
                    secureTextEntry={true}
                    icon={unlockIcon}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.password?.message && (
                    <Text style={styles.errorText}>{String(errors.password.message)}</Text>
                  )}
                </>
              )}
            />

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <FormInput
                    placeholder="Xác nhận mật khẩu"
                    secureTextEntry={true}
                    icon={lockIcon}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.confirmPassword?.message && (
                    <Text style={styles.errorText}>{String(errors.confirmPassword.message)}</Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.policyContainer}>
            <CheckBox
              label={
                <Text>
                  Bạn chấp nhận với các
                  <Text style={styles.link} onPress={() => setTermsModalVisible(true)}> điều khoản dịch vụ </Text>
                  và
                  <Text style={styles.link} onPress={() => setPrivacyModalVisible(true)}> chính sách bảo mật </Text>
                  của <Text style={styles.brandPolicy}>NewMWay</Text>
                </Text>
              }
              onChange={setIsChecked}
              checked={isChecked}
            />
            <TermsModal
              visible={isTermsModalVisible}
              onClose={() => setTermsModalVisible(false)}
              title="Điều khoản dịch vụ"
            />
            <TermsModal
              visible={isPrivacyModalVisible}
              onClose={() => setPrivacyModalVisible(false)}
              title="Chính sách bảo mật"
            />
          </View>

          <TouchableOpacity
            style={[styles.buttonContainer, (isLoading || !isChecked) && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSendingOtp || !isChecked}
          >
            <Text style={styles.buttonTitle}>
              {isLoading ? 'Đang gửi mã OTP...' : 'Đăng Ký'}
            </Text>
          </TouchableOpacity>

          <View style={styles.noAccountContainer}>
            <Text style={styles.noAccountText}>Đã có tài khoản?</Text>
            <TouchableOpacity onPress={handleBackLogin}>
              <Text style={styles.link}> Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>

          {
            googleSettingData?.value === true && (
              <View style={styles.drawerContainer}>
                <View style={styles.drawer} />
                <Text style={styles.textOr}>Hoặc</Text>
                <View style={styles.drawer} />
              </View>
            )
          }



          {/* Option Login with gg & fb */}
          <View style={styles.socialLoginContainer}>
            {
              googleSettingData?.value === true && (
                <TouchableOpacity style={styles.socialButton}
                  onPress={handleSocialGoogleLogin}
                  disabled={isSocialGoogleLoginPending}
                >
                  <Image source={googleIcon} style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
              )
            }
            {/* <TouchableOpacity
              style={styles.socialButton}
              onPress={handleSocialGoogleLogin}
              disabled={isLoading}
            >
              <Image source={googleIcon} style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity> */}

            {/* <TouchableOpacity style={styles.socialButton}>
              <Image source={facebookIcon} style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity> */}
          </View>

        </View>
      </ScrollView>
      <LoadingOverlay visible={isLoading} />
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.textWhite,
  },
  scrollContent: {
    flexGrow: 1,
    marginTop: 60
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
    paddingBottom: 60,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Sora-Regular',
    color: Colors.textWhite,
    textAlign: 'center',
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
  link: {
    color: Colors.textWhite,
    textDecorationLine: 'underline',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Sora-SemiBold',
  },
  brandPolicy: {
    fontWeight: '600',
    fontFamily: 'Sora-SemiBold',
  },
  inputContainer: {
    gap: 20,
    marginTop: 20,
  },
  policyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonContainer: {
    // width: 320,
    height: 56,
    backgroundColor: Colors.textWhite,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  buttonTitle: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
  },
  drawerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  textOr: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Sora-Bold',
    color: Colors.textWhite,
  },
  drawer: {
    flex: 1,
    height: 2,
    backgroundColor: '#e2cdbdff',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 15,
  },
  socialButton: {
    gap: 8,
    flexDirection: 'row',
    height: 50,
    backgroundColor: Colors.textWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  socialButtonText: {
    fontSize: 14,
    fontFamily: 'Sora-SemiBold',
    color: Colors.primaryDark,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: -12,
    marginLeft: 6,
    fontFamily: 'Sora-Regular',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
})