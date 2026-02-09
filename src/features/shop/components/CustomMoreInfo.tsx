import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useMemo } from 'react'
import { Colors } from '../../../assets/styles/colorStyles';
import RenderHTML from 'react-native-render-html';

interface CustomMoreInfoProps {
    logo: number | { uri: string };
    infoText: string;
    onPress?: () => void;
}

const CustomMoreInfo: React.FC<CustomMoreInfoProps> = React.memo(({ logo, infoText, onPress }) => {
    const forwardicon = require('../../../assets/icons/icons8-forward-48.png')

    const htmlSource = useMemo(() => ({ html: infoText }), [infoText]);
    const baseStyle = useMemo(() => styles.infoText, []);

    return (
        <TouchableOpacity
         style={styles.container}
         onPress={onPress}
         >
            <View style={styles.contentContainer}>
                <Image
                    source={typeof logo === 'string' ? { uri: logo } : logo}
                    style={styles.icon}
                />
                <RenderHTML
                    contentWidth={300}
                    source={htmlSource}
                    baseStyle={baseStyle}
                />
                <Image
                    source={forwardicon}
                    style={styles.forwardIcon}
                />

            </View>

        </TouchableOpacity>
    )
})

export default CustomMoreInfo

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderTopColor: '#ededed',
        borderBottomColor: '#ededed',
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        tintColor: Colors.primary,
    },
    infoText: {
        fontSize: 14,
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        marginLeft: 5,
    },
    forwardIcon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        tintColor: 'black',
        justifyContent: 'flex-end',
        position: 'absolute',
        right: 0,
    }
})