import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../../assets/styles/colorStyles';
import ModalViewMore from '../Modal/ModalViewMore';

interface PrimaryHeaderProps {
    title?: string;
    disableBack?: boolean;
    onBackPress?: () => void;
    searchButton?: boolean;
    onSearchButtonPress?: () => void;
    filterButton?: boolean;
    onFilterButtonPress?: () => void;
    moreButton?: boolean;
    modalTitle?: string;
    modalButtons?: { text: string; onPress: () => void }[];
    onModalClose?: () => void;
    rightComponent?: React.ReactNode;
    deleteButton?: boolean;
    deleteButtonText?: string;
    onDeleteButtonPress?: () => void;
    heartButton?: boolean;
    onHeartButtonPress?: () => void;
    cartButton?: boolean;
    cartItemCount?: number;
    onCartButtonPress?: () => void;
}

const PrimaryHeader: React.FC<PrimaryHeaderProps> = ({
    title = '',
    disableBack = false,
    onBackPress,
    // searchButton = false,
    // onSearchButtonPress,
    // filterButton = false,
    // onFilterButtonPress,
    moreButton = false,
    modalTitle,
    modalButtons,
    onModalClose,
    rightComponent,
    deleteButton = false,
    deleteButtonText = 'Xóa tất cả',
    onDeleteButtonPress,
    // heartButton = false,
    // onHeartButtonPress,
    cartButton = false,
    cartItemCount = 0,
    onCartButtonPress,
}) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const backIcon = require('../../../assets/icons/icons8-back-48.png');
    const cartIcon = require('../../../assets/icons/icons8-cart-48-3.png');
    const moreIcon = require('../../../assets/icons/icons8-settings-48.png');

    // const heartIcon = require('../../../assets/icons/icons8-heart-48.png')
    // const heartSelectedIcon = require('../../../assets/icons/icons8-heart-selected-48.png')

    const handleMorePress = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        if (onModalClose) {
            onModalClose();
        }
    };
    const hitSlop = { top: 20, left: 20, bottom: 20, right: 20 };  // Mở rộng 20px mỗi bên

    return (
        <View style={styles.container}>
            {/* Left: Back button */}
            <View style={styles.leftContainer}>
                {!disableBack && (
                    <TouchableOpacity onPress={onBackPress} style={styles.iconButton} hitSlop={hitSlop}>
                        <Image source={backIcon} style={styles.backIcon} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Center: Title */}
            <View style={styles.titleContainer}>
                <Text numberOfLines={1} style={styles.title}>{title}</Text>
            </View>

            {/* Right: Action buttons */}
            <View style={styles.rightContainer}>
                {deleteButton && (
                    <TouchableOpacity onPress={onDeleteButtonPress} style={styles.deleteButton} hitSlop={hitSlop}>
                        <Text style={styles.deleteText}>{deleteButtonText}</Text>
                    </TouchableOpacity>
                )}
                {/* {searchButton && (
                    <TouchableOpacity onPress={onSearchButtonPress} style={styles.iconButton} hitSlop={hitSlop}>
                        <Icon name="search" size={24} color={Colors.textDark} />
                    </TouchableOpacity>
                )}
                {filterButton && (
                    <TouchableOpacity onPress={onFilterButtonPress} style={styles.iconButton} hitSlop={hitSlop}>
                        <Icon name="filter-list" size={24} color={Colors.textDark} />
                    </TouchableOpacity>
                )} */}
                {moreButton && (
                    <TouchableOpacity onPress={handleMorePress} style={styles.iconButton} hitSlop={hitSlop}>
                        <Image source={moreIcon} style={styles.moreIcon} />
                    </TouchableOpacity>
                )}

                {/* {heartButton && (
                    <TouchableOpacity style={styles.iconButton} hitSlop={hitSlop}>
                        <Image source={heartIcon} style={styles.heartIcon} />
                    </TouchableOpacity>
                )} */}
                {cartButton && (
                    <TouchableOpacity onPress={onCartButtonPress} style={styles.iconButton} hitSlop={hitSlop}>
                        <Image source={cartIcon} style={styles.heartIcon} />
                        {cartItemCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {cartItemCount > 99 ? '99+' : cartItemCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}



                {rightComponent}
            </View>

            {/* Modal for More */}
            {moreButton && modalTitle && modalButtons && (
                <ModalViewMore
                    visible={isModalVisible}
                    title={modalTitle}
                    onClose={handleModalClose}
                    buttons={modalButtons}
                />
            )}
        </View>
    );
};

export default PrimaryHeader;

const styles = StyleSheet.create({
    container: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        zIndex: 1, // Ensure the header is above other components
        backgroundColor: Colors.textWhite,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 40,
    },
    backIcon: {
        width: 20,
        height: 20,
        tintColor: 'rgba(42,42,42,1)',
    },
    heartIcon: {
        width: 20,
        height: 20,
        tintColor: 'rgba(0, 0, 0, 1)',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: 'rgba(36, 36, 36, 1)',
        fontFamily: 'Sora-SemiBold',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 40,
    },
    deleteButton: {
        marginRight: 8,
    },
    deleteText: {
        color: Colors.primary,
        fontSize: 16,
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
    },
    iconButton: {
        marginLeft: 8,
        padding: 4
    },
    moreIcon: {
        width: 20,
        height: 20,
        tintColor: 'rgba(0, 0, 0, 1)',
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: Colors.textWhite,
    },
    badgeText: {
        color: Colors.textWhite,
        fontSize: 10,
        fontWeight: '700',
        fontFamily: 'Sora-Bold',
    },
});
