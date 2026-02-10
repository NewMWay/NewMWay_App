import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import FormInput from '../components/Form/FormInput'
import { useNavigation } from '@react-navigation/native'
import { useToast } from '../../../utils/toasts/useToast'
import { AuthStackNavigationProp } from '../../../types/navigation/navigation'
import { useForm, Controller } from 'react-hook-form';
import { LoginFormSchema, LoginSchema } from '../schemas/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useLogin.hook'
import LoadingOverlay from '../components/Loading/LoadingOverlay'
import { useSocialGoogleLogin } from '../hooks/useSocialGoogleLogin.hook'
import { configureGoogleSignIn, signInWithGoogle } from '../../../utils/auth/googleAuthHelper'


const LoginScreen = () => {
    const logo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02-1.png')
    const personIcon = require('../../../assets/icons/icons8-person-auth-48.png')
    const lockIcon = require('../../../assets/icons/icons8-lock-48.png')
    const googleIcon = require('../../../assets/icons/icons8-google-48.png')
    // const facebookIcon = require('../../../assets/icons/icons8-facebook-48.png')

    const navigation = useNavigation<AuthStackNavigationProp>();
    const { showSuccess, showError } = useToast();
    const { mutate: loginMutate, isPending: isLoginPending } = useLogin();
    const { mutate: socialGoogleLoginMutate, isPending: isSocialGoogleLoginPending } = useSocialGoogleLogin();

    const [isFormLoading, setIsFormLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormSchema>({
        resolver: zodResolver(LoginSchema),
        mode: 'onBlur',
        defaultValues: {
            usernameOrEmail: '',
            password: '',
        },
    });
    const isLoading = isFormLoading || isLoginPending;

    useEffect(() => {
        configureGoogleSignIn();
    }, [])

    const handleSocialGoogleLogin = async () => {
        try {
            const idToken = await signInWithGoogle();
            if (idToken) {
                socialGoogleLoginMutate({ idToken },
                    {
                        onSuccess: () => {
                            showSuccess("Chào mừng bạn trở lại!", "Đăng nhập thành công!");
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
            showError('Đăng nhập Google thất bại. Vui lòng thử lại.',);
            console.error('Google Login Error:', error);
        }
    }

    const onSubmit = (_data: LoginFormSchema) => {
        try {
            setIsFormLoading(true);
            setTimeout(() => {
                setIsFormLoading(false);
                handleLogin(_data);
            }, 3000);
        } catch (err: any) {
            setIsFormLoading(false);
            showError(err?.message || 'Đăng nhập thất bại');
        }
    };

    const handleLogin = (_data: LoginFormSchema) => {
        loginMutate(_data, {
            onSuccess: () => {
                showSuccess("Chào mừng bạn trở lại!", "Đăng nhập thành công!");
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
                showError(error?.message || 'Đăng nhập thất bại');
            }
        });
    }


    const handleForgotPassword = () => {
        navigation.navigate("ForgotPasswordScreen");
    }

    const handleRegister = () => {
        navigation.navigate("RegisterScreen");
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
                    <Text style={styles.title}>Đăng Nhập</Text>
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.subtitle}>Chào mừng bạn quay lại với</Text>
                        <Text style={styles.brand}>NEWMWAY TEAKWOOD</Text>
                    </View>


                    <View style={styles.inputContainer}>
                        {/* Email & username */}
                        <Controller
                            control={control}
                            name="usernameOrEmail"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <FormInput
                                        placeholder="Email hoặc tên đăng nhập"
                                        keyboardType="email-address"
                                        icon={personIcon}
                                        autoCapitalize="none"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                    />
                                    {errors.usernameOrEmail?.message && (
                                        <Text style={styles.errorText}>{String(errors.usernameOrEmail.message)}</Text>
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
                                        icon={lockIcon}
                                        autoCapitalize="none"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                    />
                                    {errors.password?.message && (
                                        <Text style={styles.errorText}>{String(errors.password.message)}</Text>
                                    )}
                                </>
                            )}
                        />
                    </View>

                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={styles.text}>Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonContainer, isLoading && styles.buttonDisabled]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonTitle}>
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.noAccountContainer}>
                        <Text style={styles.noAccountText}>Chưa có tài khoản?</Text>
                        <TouchableOpacity onPress={handleRegister}>
                            <Text style={styles.link}> Đăng ký ngay</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.drawerContainer}>
                        <View style={styles.drawer} />
                        <Text style={styles.textOr}>Hoặc</Text>
                        <View style={styles.drawer} />
                    </View>

                    {/* Option Login with gg & fb */}
                    <View style={styles.socialLoginContainer}>
                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={handleSocialGoogleLogin}
                            disabled={isSocialGoogleLoginPending}
                        >
                            <Image source={googleIcon} style={styles.socialIcon} />
                            <Text style={styles.socialButtonText}>
                                {isSocialGoogleLoginPending ? 'Đang xử lý...' : 'Google'}
                            </Text>
                        </TouchableOpacity>

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

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.textWhite,
    },
    scrollContent: {
        flexGrow: 1,
        marginTop: 60,
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
        // paddingBottom: 80,
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
    inputContainer: {
        gap: 20,
        marginTop: 20,
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
        marginBottom: 40,
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
