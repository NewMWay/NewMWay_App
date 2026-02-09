import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import FormInput from '../components/Form/FormInput'
import { useNavigation } from '@react-navigation/native'
import { useToast } from '../../../utils/toasts/useToast'
import { AuthStackNavigationProp } from '../../../types/navigation/navigation'
import { Controller, useForm } from 'react-hook-form'
import { ResetPasswordFormSchema, ResetPasswordSchema } from '../schemas/resetPassword.schema'
import { zodResolver } from '@hookform/resolvers/zod'

const ResetPasswordScreen = () => {
  const logo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02-1.png')
  const lockIcon = require('../../../assets/icons/icons8-lock-48.png')
  const unlockIcon = require('../../../assets/icons/icons8-padlock-48.png')
  const chibiAnimationGif = require('../../../assets/animations/1030-vip-unscreen.gif');

  const navigation = useNavigation<AuthStackNavigationProp>();
  const { showSuccess, showError } = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (_data: ResetPasswordFormSchema) => {
    try {
      console.log("Data reset password", _data);
      handleResetPassword();
    } catch (err: any) {
      showError(err, "Cập nhật mật khẩu thất bại!");
    }
  };

  const handleResetPassword = () => {
    showSuccess("Hãy đăng nhập lại", "Cập nhật mật khẩu thành công!");
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }]
    });
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
          <Text style={styles.title}>Đặt lại mật khẩu</Text>
          <View style={styles.welcomeContainer}>
            <Text style={styles.subtitle}>Đặt lại mật khẩu mới của bạn</Text>
          </View>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <FormInput
                    placeholder="Mật khẩu mới"
                    keyboardType="default"
                    icon={unlockIcon}
                    secureTextEntry
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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <FormInput
                    placeholder="Xác nhận mật khẩu mới"
                    keyboardType="default"
                    icon={lockIcon}
                    secureTextEntry
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

            <View style={styles.chibiContainer}>
              <Image source={chibiAnimationGif} style={styles.chibiAnimation} />
            </View>

          </View>

          <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonTitle}>Xác nhận</Text>
          </TouchableOpacity>


        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default ResetPasswordScreen

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
  buttonContainer: {
    width: 327,
    height: 56,
    backgroundColor: Colors.textWhite,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 30,
    // position: 'absolute',
    // bottom: 50,
    top: 20,
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