import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import FormInput from '../components/Form/FormInput'
import { useNavigation } from '@react-navigation/native'
import { useToast } from '../../../utils/toasts/useToast'
import { AuthStackNavigationProp } from '../../../types/navigation/navigation'
import { Controller, useForm } from 'react-hook-form'
import { SendOtpFormSchema, SendOtpSchema } from '../schemas/sendOtp.schema'
import { zodResolver } from '@hookform/resolvers/zod'


const ForgotPasswordScreen = () => {
  const logo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02-1.png')
  const mailIcon = require('../../../assets/icons/icons8-email-48.png')
  const chibiAnimationGif = require('../../../assets/animations/1030-vip-unscreen.gif');

  const navigation = useNavigation<AuthStackNavigationProp>();
  const { showSuccess, showError } = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<SendOtpFormSchema>({
    resolver: zodResolver(SendOtpSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = (_data: SendOtpFormSchema) => {
    try {
      console.log("Data email", _data);
      handleSendOtp(_data)
    } catch (err: any) {
      showError(err?.message || 'Gửi OTP thất bại');
    }
  }

  const handleSendOtp = (_data: SendOtpFormSchema) => {
    showSuccess("Gửi OTP thành công!");
    navigation.navigate("OtpVerificationScreen", { email: _data.email, type: "forgotPassword" });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={'padding'}
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
          <Text style={styles.title}>Quên mật khẩu</Text>
          <View style={styles.welcomeContainer}>
            <Text style={styles.subtitle}>Nhập Email của bạn để nhận mã xác nhận</Text>
          </View>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <FormInput
                    placeholder="Email đã đăng ký"
                    keyboardType="email-address"
                    icon={mailIcon}
                    autoCapitalize="none"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                  {errors.email?.message && (
                    <Text style={styles.errorText}>{String(errors.email.message)}</Text>
                  )}
                </>
              )}
            />

            <View style={styles.chibiContainer}>
              <Image source={chibiAnimationGif} style={styles.chibiAnimation} />
            </View>

          </View>

          <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonTitle}>Gửi OTP</Text>
          </TouchableOpacity>


        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default ForgotPasswordScreen

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
    marginBottom: 50,
  },
  chibiAnimation: {
    width: 300,
    height: 250,
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
  buttonContainer: {
    width: 327,
    height: 56,
    backgroundColor: Colors.textWhite,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 30,
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  buttonTitle: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: -12,
    marginLeft: 6,
    fontFamily: 'Sora-Regular',
  },
})