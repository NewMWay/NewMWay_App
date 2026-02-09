import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { ifTablet } from '../../../utils/responsives/responsive'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Colors } from '../../../assets/styles/colorStyles'
import { Button } from '@react-navigation/elements'
import { CartStackNavigationProp } from '../../../types/navigation/navigation'

const PaymentFailedScreen = () => {
    const navigation = useNavigation<CartStackNavigationProp>();
    const route = useRoute();
    const { status = 'failed' } = route.params as { status?: 'failed' | 'cancelled' } || {};
    const logo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02.png')

    const isCancelled = status === 'cancelled';

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleGoHome = () => {
        console.log('Navigate to Home');
        const parentNavigation = navigation.getParent();
        if (parentNavigation) {
            // parentNavigation.navigate('Trang Chủ');
            parentNavigation.reset({
                index: 0,
                routes: [{ name: 'Trang Chủ' }],
            });
        }
    };

    return (
        <View style={styles.container}>
            <PrimaryHeader
                title='Thanh toán'
                onBackPress={handleGoBack}
            />
            <ScrollView
                contentContainerStyle={[styles.scrollView, { paddingBottom: ifTablet(120, 105) }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo} />
                </View>

                <View style={styles.contentContainer}>
                    <Text style={[styles.titleStatus, isCancelled && styles.titleCancelled]}>
                        {isCancelled ? 'Đã hủy thanh toán' : 'Thanh toán thất bại'}
                    </Text>

                    <Text style={styles.subTitleStatus}>
                        {isCancelled
                            ? 'Bạn đã hủy giao dịch thanh toán. Bạn có thể quay lại giỏ hàng để thanh toán lại hoặc tiếp tục mua sắm.'
                            : 'Rất tiếc, quá trình thanh toán của bạn đã không thành công. Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ để được giúp đỡ.'}
                    </Text>
                    <View style={styles.line} />

                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonWrapperHome}>
                            <Button
                                onPress={handleGoHome}
                                color={Colors.textWhite}
                            >
                                Trang Chủ
                            </Button>
                        </View>

                    </View>
                </View>


            </ScrollView>
        </View>
    )
}

export default PaymentFailedScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'white',
    },
    scrollView: {
        flexGrow: 1,
    },
    contentContainer: {
        marginHorizontal: ifTablet(32, 16),
        paddingVertical: ifTablet(24, 16),
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
    titleStatus: {
        fontSize: ifTablet(32, 24),
        fontWeight: '600',
        textAlign: 'center',
        marginTop: ifTablet(24, 16),
        fontFamily: 'Inter-SemiBold',
        color: Colors.error,
    },
    titleCancelled: {
        color: '#f59e0b',
    },
    subTitleStatus: {
        fontSize: ifTablet(20, 16),
        textAlign: 'center',
        marginTop: ifTablet(16, 12),
        fontFamily: 'Inter-Regular',
        color: Colors.gray,
    },
    line: {
        height: 2,
        backgroundColor: Colors.primary,
        opacity: 0.3,
        marginVertical: ifTablet(24, 16),
        marginHorizontal: ifTablet(50, 40),
        borderRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: ifTablet(16, 12),
        marginTop: ifTablet(32, 24),
        marginBottom: ifTablet(16, 12),
    },
    buttonWrapperHome: {
        flex: 1,
        backgroundColor: Colors.grayDark,
        borderRadius: 10,
        overflow: 'hidden',
    },

})