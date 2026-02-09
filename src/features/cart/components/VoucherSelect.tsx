import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { ifTablet } from '../../../utils/responsives/responsive'
import { Colors } from '../../../assets/styles/colorStyles'
import { PromotionItem } from '../../promotion/types/promotion.type'
import { PromotionType } from '../../promotion/types/promotion.enum'

interface VoucherSelectProps {
    onVoucherPress?: () => void;
    onRemoveVoucher?: (type?: PromotionType) => void;
    selectedOrderPromotion?: PromotionItem | null;
    selectedShippingPromotion?: PromotionItem | null;
    voucherDiscount?: number;
    isLoading?: boolean;
    showVoucherList?: boolean;
    availablePromotions?: PromotionItem[];
    onSelectVoucher?: (promotion: PromotionItem) => void;
    currentOrderTotal?: number;
    shipFeeOnly?: number;
}

const VoucherSelect = ({
    onVoucherPress,
    onRemoveVoucher,
    selectedOrderPromotion = null,
    selectedShippingPromotion = null,
    voucherDiscount = 0,
    isLoading = false,
    showVoucherList = false,
    availablePromotions = [],
    onSelectVoucher,
    currentOrderTotal = 0,
    // shipFeeOnly = 0
}: VoucherSelectProps) => {
    const voucherIcon = require('../../../assets/icons/icons8-voucher-48.png');
    const arrowIcon = require('../../../assets/icons/icons8-forward-48.png');
    const downIcon = require('../../../assets/icons/icons8-down-48.png');
    const collapseIcon = require('../../../assets/icons/icons8-collapse-arrow-48.png');

    return (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={onVoucherPress}
                disabled={isLoading}
                activeOpacity={0.7}
            >
                <View style={styles.leftSection}>
                    <View style={styles.iconContainer}>
                        <Image source={voucherIcon} style={styles.voucherIcon} />
                    </View>

                    <View style={styles.textContainer}>
                        {(selectedOrderPromotion || selectedShippingPromotion) ? (
                            <View style={styles.voucherCodesWrapper}>
                                {selectedOrderPromotion && (
                                    <View style={styles.voucherCodeRow}>
                                        <View style={styles.voucherCodeBadge}>
                                            <Text style={styles.voucherCodeLabel}>Order</Text>
                                        </View>
                                        <Text style={styles.voucherCode}>{selectedOrderPromotion.code}</Text>
                                        <TouchableOpacity
                                            style={styles.miniRemoveButton}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                onRemoveVoucher && onRemoveVoucher(PromotionType.Order);
                                            }}
                                        >
                                            <Text style={styles.miniRemoveText}>✕</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                {selectedShippingPromotion && (
                                    <View style={styles.voucherCodeRow}>
                                        <View style={[styles.voucherCodeBadge, styles.shippingBadge]}>
                                            <Text style={styles.voucherCodeLabel}>Ship</Text>
                                        </View>
                                        <Text style={styles.voucherCode}>{selectedShippingPromotion.code}</Text>
                                        <TouchableOpacity
                                            style={styles.miniRemoveButton}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                onRemoveVoucher && onRemoveVoucher(PromotionType.Shipping);
                                            }}
                                        >
                                            <Text style={styles.miniRemoveText}>✕</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                <Text style={styles.discountText}>-{voucherDiscount.toLocaleString('vi-VN')}₫</Text>
                            </View>
                        ) : (
                            <>
                                <Text style={styles.title}>Mã giảm giá</Text>
                                <Text style={styles.subtitle}>Chọn tối đa 1 Order + 1 Shipping</Text>
                            </>
                        )}
                    </View>
                </View>

                <View style={styles.rightSection}>
                    <Image
                        source={showVoucherList ? collapseIcon : ((selectedOrderPromotion || selectedShippingPromotion) ? arrowIcon : downIcon)}
                        style={styles.arrowIcon}
                    />
                </View>
            </TouchableOpacity>

            {/* Voucher List Dropdown */}
            {showVoucherList && (
                <View style={styles.voucherListContainer}>
                    {availablePromotions.length === 0 ? (
                        <View style={styles.emptyVoucherContainer}>
                            <Text style={styles.emptyVoucherText}>Không có mã giảm giá khả dụng</Text>
                        </View>
                    ) : (
                        availablePromotions.map((promotion, index) => {
                            const isSelected = selectedOrderPromotion?.id === promotion.id || selectedShippingPromotion?.id === promotion.id;
                            const isEligible = currentOrderTotal >= promotion.minOrderValue;

                            return (
                                <TouchableOpacity
                                    key={promotion.id}
                                    style={[
                                        styles.voucherItem,
                                        isSelected && styles.selectedVoucherItem,
                                        !isEligible && styles.disabledVoucherItem,
                                        index === availablePromotions.length - 1 && styles.lastVoucherItem
                                    ]}
                                    onPress={() => {
                                        if (isEligible && onSelectVoucher) {
                                            onSelectVoucher(promotion);
                                        }
                                    }}
                                    disabled={!isEligible}
                                >
                                    <View style={styles.voucherItemLeft}>
                                        <View style={[
                                            styles.voucherItemIconContainer,
                                            !isEligible && styles.disabledIconContainer
                                        ]}>
                                            <Image source={voucherIcon} style={[
                                                styles.voucherItemIcon,
                                                !isEligible && styles.disabledIcon
                                            ]} />
                                        </View>
                                        <View style={styles.voucherItemContent}>
                                            <View style={styles.voucherHeaderRow}>
                                                <Text style={[
                                                    styles.voucherItemCode,
                                                    !isEligible && styles.disabledText
                                                ]}>{promotion.code}</Text>
                                                {promotion.isWarning && (
                                                    <View style={styles.warningBadge}>
                                                        <Text style={styles.warningBadgeText}>Sắp hết</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={[
                                                styles.voucherItemTitle,
                                                !isEligible && styles.disabledText
                                            ]} numberOfLines={2}>{promotion.name}</Text>
                                            <Text style={[
                                                styles.voucherItemDescription,
                                                !isEligible && styles.disabledText
                                            ]} numberOfLines={3}>{promotion.description}</Text>
                                            <View style={styles.voucherConditionRow}>
                                                <Text style={[
                                                    styles.voucherItemCondition,
                                                    !isEligible && styles.disabledText
                                                ]}>
                                                    Đơn tối thiểu {promotion.minOrderValue.toLocaleString('vi-VN')}₫
                                                </Text>
                                                {!isEligible && (
                                                    <Text style={styles.ineligibleText}>
                                                        (Thiếu {(promotion.minOrderValue - currentOrderTotal).toLocaleString('vi-VN')}₫)
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.voucherItemRight}>
                                        <View style={styles.discountBadge}>
                                            <Text style={styles.discountPercent}>-{promotion.discountValue}%</Text>
                                        </View>
                                        <Text style={[
                                            styles.voucherItemDiscount,
                                            !isEligible && styles.disabledText
                                        ]}>Tối đa {promotion.maxDiscountValue.toLocaleString('vi-VN')}₫</Text>
                                        <Text style={[
                                            styles.voucherItemExpiry,
                                            !isEligible && styles.disabledText
                                        ]}>HSD: {new Date(promotion.endDate).toLocaleDateString('vi-VN')}</Text>
                                        {isSelected && (
                                            <View style={styles.selectedCheckmark}>
                                                <Text style={styles.checkmarkText}>✓</Text>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>
            )}
        </>
    )
}

export default VoucherSelect

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        paddingVertical: ifTablet(16, 14),
        paddingHorizontal: ifTablet(16, 14),
        borderRadius: ifTablet(12, 10),
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
        marginBottom: ifTablet(16, 12),
        position: 'relative',
    },
    removeButton: {
        position: 'absolute',
        top: ifTablet(8, 6),
        left: ifTablet(8, 6),
        width: ifTablet(24, 12),
        height: ifTablet(24, 12),
        borderRadius: ifTablet(12, 6),
        backgroundColor: '#fee2e2',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    removeText: {
        fontSize: ifTablet(16, 8),
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
        color: '#dc2626',
        lineHeight: ifTablet(16, 8),
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: ifTablet(48, 42),
        height: ifTablet(48, 42),
        borderRadius: ifTablet(24, 21),
        backgroundColor: '#fef3c7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ifTablet(12, 10),
    },
    voucherIcon: {
        width: ifTablet(26, 24),
        height: ifTablet(26, 24),
        tintColor: '#f59e0b',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.textDark,
        marginBottom: ifTablet(4, 3),
    },
    subtitle: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: '#64748b',
    },
    voucherTitle: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Medium',
        fontWeight: '500',
        color: '#059669',
        marginBottom: ifTablet(6, 5),
    },
    voucherCodesWrapper: {
        gap: ifTablet(8, 6),
    },
    voucherCodeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ifTablet(6, 5),
    },
    voucherCodeBadge: {
        backgroundColor: '#dbeafe',
        paddingHorizontal: ifTablet(8, 6),
        paddingVertical: ifTablet(3, 2),
        borderRadius: ifTablet(4, 3),
    },
    shippingBadge: {
        backgroundColor: '#fef3c7',
    },
    voucherCodeLabel: {
        fontSize: ifTablet(10, 9),
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
        color: '#1e40af',
    },
    voucherCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ifTablet(8, 6),
    },
    voucherCode: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.textDark,
        flex: 1,
    },
    miniRemoveButton: {
        width: ifTablet(18, 16),
        height: ifTablet(18, 16),
        borderRadius: ifTablet(9, 8),
        backgroundColor: '#fee2e2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    miniRemoveText: {
        fontSize: ifTablet(10, 9),
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
        color: '#dc2626',
    },
    discountText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
        color: '#ef4444',
        marginTop: ifTablet(4, 3),
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ifTablet(8, 6),
    },
    arrowIcon: {
        width: ifTablet(20, 18),
        height: ifTablet(20, 18),
        tintColor: '#94a3b8',
    },
    emptyVoucherContainer: {
        padding: ifTablet(32, 24),
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyVoucherText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: '#94a3b8',
    },
    voucherListContainer: {
        marginTop: ifTablet(12, 10),
        backgroundColor: '#f8fafc',
        borderRadius: ifTablet(12, 10),
        borderWidth: 1,
        borderColor: '#e2e8f0',
        overflow: 'hidden',
    },
    voucherItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: ifTablet(16, 14),
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        backgroundColor: 'white',
    },
    lastVoucherItem: {
        borderBottomWidth: 0,
    },
    selectedVoucherItem: {
        backgroundColor: '#f0fdf4',
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    disabledVoucherItem: {
        opacity: 0.5,
        backgroundColor: '#f8fafc',
    },
    voucherItemLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
        marginRight: ifTablet(12, 10),
    },
    voucherItemIconContainer: {
        width: ifTablet(40, 36),
        height: ifTablet(40, 36),
        borderRadius: ifTablet(20, 18),
        backgroundColor: '#fef3c7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ifTablet(12, 10),
    },
    disabledIconContainer: {
        backgroundColor: '#e2e8f0',
    },
    voucherItemIcon: {
        width: ifTablet(22, 20),
        height: ifTablet(22, 20),
        tintColor: '#f59e0b',
    },
    disabledIcon: {
        tintColor: '#94a3b8',
    },
    voucherItemContent: {
        flex: 1,
    },
    voucherHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ifTablet(6, 5),
        gap: ifTablet(8, 6),
    },
    voucherItemCode: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
        color: Colors.primary,
    },
    warningBadge: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: ifTablet(8, 6),
        paddingVertical: ifTablet(2, 2),
        borderRadius: ifTablet(4, 3),
    },
    warningBadgeText: {
        fontSize: ifTablet(10, 9),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: '#dc2626',
    },
    voucherItemTitle: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.textDark,
        marginBottom: ifTablet(4, 3),
    },
    voucherItemDescription: {
        fontSize: ifTablet(12, 8),
        fontFamily: 'Sora-Regular',
        color: '#64748b',
        marginBottom: ifTablet(6, 5),
    },
    voucherConditionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: ifTablet(4, 3),
    },
    voucherItemCondition: {
        fontSize: ifTablet(11, 10),
        fontFamily: 'Sora-Regular',
        color: '#94a3b8',
    },
    ineligibleText: {
        fontSize: ifTablet(11, 10),
        fontFamily: 'Sora-Medium',
        fontWeight: '500',
        color: '#ef4444',
    },
    disabledText: {
        color: '#cbd5e1',
    },
    voucherItemRight: {
        alignItems: 'flex-end',
    },
    discountBadge: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: ifTablet(10, 8),
        paddingVertical: ifTablet(4, 3),
        borderRadius: ifTablet(6, 5),
        marginBottom: ifTablet(6, 5),
    },
    discountPercent: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
        color: '#dc2626',
    },
    voucherItemDiscount: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.textDark,
        marginBottom: ifTablet(4, 3),
    },
    voucherItemExpiry: {
        fontSize: ifTablet(11, 10),
        fontFamily: 'Sora-Regular',
        color: '#94a3b8',
        marginBottom: ifTablet(6, 5),
    },
    selectedCheckmark: {
        width: ifTablet(24, 22),
        height: ifTablet(24, 22),
        borderRadius: ifTablet(12, 11),
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: ifTablet(4, 3),
    },
    checkmarkText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
        color: 'white',
    },
})