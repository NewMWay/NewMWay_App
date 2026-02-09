import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { ifTablet } from '../../../utils/responsives/responsive'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Colors } from '../../../assets/styles/colorStyles'
import { useOrderDetailQuery } from '../../order/hooks/useOrder.hook'
import { CartStackNavigationProp, CartStackParamList } from '../../../types/navigation/navigation'
import LoadingOverlay from '../../auth/components/Loading/LoadingOverlay'
import { useToast } from '../../../utils/toasts/useToast'
import OrderSuccessInfo from '../components/OrderSuccessInfo'
import { OrderStatus } from '../../order/types/order.enum'


const PaymentSuccessScreen = () => {
    const navigation = useNavigation<CartStackNavigationProp>();
    const logo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02.png')
    const orderId = useRoute<RouteProp<CartStackParamList, 'PaymentSuccessScreen'>>().params?.id;
    console.log('Order ID:', orderId);

    const { data: orderDetail, isLoading, isError } = useOrderDetailQuery({ id: orderId })
    console.log('Order Detail:', orderDetail);

    const { showError } = useToast();

    if (isError) {
        showError('Không tìm thấy đơn hàng!');
    }
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

    const handleGoOrderHistory = () => {
        console.log('Navigate to Order History');
        const parentNavigation = navigation.getParent();
        if (parentNavigation) {
            parentNavigation.reset({
                index: 0,
                routes: [{ name: 'Tài Khoản', params: { screen: 'OrderHistoryDetailScreen' } }],
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
                    <Text style={styles.titleStatus}>Thanh toán thành công</Text>
                    <Text style={styles.subTitleStatus}>Cảm ơn bạn đã mua hàng của NEWMWAY Teak Wood, bạn có thể kiểm tra lại đơn hàng trong lịch sử</Text>

                    <View style={styles.line} />

                    {orderDetail && (
                        <OrderSuccessInfo
                            id={orderDetail.id}
                            totalPrice={orderDetail.totalAmount}
                            fullName={orderDetail.fullName}
                            phoneNumber={orderDetail.phoneNumber}
                            province={orderDetail.province}
                            district={orderDetail.district}
                            ward={orderDetail.ward}
                            address={orderDetail.address}
                            status={orderDetail.status as OrderStatus}
                            createdDate={orderDetail.createdDate}
                            items={orderDetail.items}
                        />
                    )}

                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonWrapperHome}>
                            <Button
                                title="Trang Chủ"
                                onPress={handleGoHome}
                                color={Colors.textWhite}
                            />
                        </View>
                        <View style={styles.buttonWrapperHistory}>
                            <Button
                                title="Lịch Sử"
                                onPress={handleGoOrderHistory}
                                color={Colors.textWhite}
                            />
                        </View>
                    </View>
                </View>
                <LoadingOverlay visible={isLoading} />
            </ScrollView>
        </View>
    )
}

export default PaymentSuccessScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
        marginHorizontal: 30,
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
        color: Colors.success,
    },
    subTitleStatus: {
        fontSize: ifTablet(20, 12),
        textAlign: 'center',
        marginTop: ifTablet(16, 12),
        fontFamily: 'Inter-Regular',
        color: Colors.grayDark,
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
    buttonWrapperHistory: {
        flex: 1,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        overflow: 'hidden',
    }
})