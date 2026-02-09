// src/utils/toasts/toastConfig.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { Colors } from '../../assets/styles/colorStyles';

import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { toastStyles } from '../../assets/styles/toastStyle';



// === ICONS ===
const SuccessIcon = () => (
    <View style={[styles.iconContainer, styles.successIconContainer]}>
        <Text style={[styles.icon, styles.iconWhite]}>✓</Text>
    </View>
);

const ErrorIcon = () => (
    <View style={[styles.iconContainer, styles.errorIconContainer]}>
        <Text style={[styles.icon, styles.iconWhite]}>✕</Text>
    </View>
);

const InfoIcon = () => (
    <View style={[styles.iconContainer, styles.infoIconContainer]}>
        <Text style={[styles.icon, styles.iconWhite]}>i</Text>
    </View>
);

const MessIcon = () => (
    <View style={[styles.iconContainer, styles.infoIconContainer]}>
        <MaterialIcons name="message" style={[styles.icon, styles.iconWhite]} />
    </View>
);

interface CustomToastExtraProps {
    icon: React.ReactNode;
    borderColor: string;
    maxLines?: number;
    onPress?: () => void;
}

type CustomToastProps = BaseToastProps & CustomToastExtraProps;

const CustomToast = ({
    icon,
    borderColor,
    maxLines = 2,
    onPress,
    text1,
    text2,
    text1Style,
    text2Style,
    style,
    ...rest
}: CustomToastProps) => {
    const ToastContent = (
        <BaseToast
            {...rest}
            onPress={onPress}
            activeOpacity={rest.activeOpacity ?? 0.9}
            touchableContainerProps={rest.touchableContainerProps}
            style={[
                styles.base,
                style,
                { borderColor },
                { borderLeftColor: borderColor },
            ]}
            contentContainerStyle={styles.contentContainer}
            text1Style={StyleSheet.flatten([styles.text1, text1Style])}
            text2Style={StyleSheet.flatten([styles.text2, text2Style])}
            text1={text1}
            text2={text2}
            text2NumberOfLines={maxLines}
            renderLeadingIcon={() => icon}
        />
    );

    //BlurView để mô phỏng hiệu ứng xuyên thấu của iOS
    /*
    if (Platform.OS === 'ios' && typeof BlurView !== 'undefined') {
        return (
            <BlurView style={styles.blurEffect} intensity={95}>
                {ToastContent}
            </BlurView>
        );
    }
    */

    return ToastContent;
};


export const toastConfig = {
    success: (props: any) => (
        <CustomToast
            {...props}
            icon={<SuccessIcon />}
            borderColor={Colors.success}
            text1={props.text1 ?? toastStyles.successToast.text1}
            text2={props.text2 ?? toastStyles.successToast.text2}
            maxLines={props.props?.maxLines ?? 2}
            onPress={props.onPress}
        />
    ),

    error: (props: any) => (
        <CustomToast
            {...props}
            icon={<ErrorIcon />}
            borderColor={Colors.error}
            text1={props.text1 ?? toastStyles.errorToast.text1}
            text2={props.text2 ?? toastStyles.errorToast.text2}
            maxLines={props.props?.maxLines ?? 2}
            onPress={props.onPress}
        />
    ),

    info: (props: any) => (
        <CustomToast
            {...props}
            icon={<InfoIcon />}
            borderColor={Colors.info}
            text1={props.text1 ?? toastStyles.infoToast.text1}
            text2={props.text2 ?? toastStyles.infoToast.text2}
            maxLines={props.props?.maxLines ?? 2}
            onPress={props.onPress}
        />
    ),
    message: (props: any) => (
        <CustomToast
            {...props}
            icon={<MessIcon />}
            borderColor={Colors.info}
            text1={props.text1 ?? 'TIN NHẮN'}
            text2={props.text2 ?? 'Bạn có một tin nhắn mới.'}
            maxLines={props.props?.maxLines ?? 2}
            onPress={props.onPress}
        />
    ),
};

const styles = StyleSheet.create({
    base: {
        height: 'auto',
        minHeight: 48,
        width: '80%',
        maxWidth: 400,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingVertical: 10,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 10,
        elevation: 4,
        borderWidth: 0.5, 
        borderColor: '#e0e0e0',
    },
    contentContainer: {
        paddingHorizontal: 0,
        paddingLeft: 10,
        flex: 1,
        paddingVertical: 2,
    },
    text1: {
        fontSize: 15, 
        fontWeight: '600',
        color: '#0A2353', 
        marginBottom: 2,
    },
    text2: {
        fontSize: 13,
        color: '#444', 
        flexShrink: 1,
    },
    iconContainer: {
        width: 28, 
        height: 28,
        borderRadius: 14, 
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        marginRight: 2,
        alignSelf: 'center', 
        shadowColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
    },
    successIconContainer: {
        backgroundColor: Colors.success,
    },
    errorIconContainer: {
        backgroundColor: Colors.error,
    },
    infoIconContainer: {
        backgroundColor: Colors.info,
    },
    icon: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    iconWhite: {
        color: '#FFF',
    },
    blurEffect: {
        borderRadius: 12,
        overflow: 'hidden',
    }
});