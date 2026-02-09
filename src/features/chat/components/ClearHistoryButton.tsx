import React from 'react'
import { TouchableOpacity, StyleSheet, Image } from 'react-native'
import { ifTablet } from '../../../utils/responsives/responsive'

interface ClearHistoryButtonProps {
    onPress: () => void
}

const ClearHistoryButton: React.FC<ClearHistoryButtonProps> = ({ onPress }) => {
    const trashIcon = require('../../../assets/icons/icons8-full-trash-48.png')
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Image source={trashIcon} style={styles.icon} />
        </TouchableOpacity>
    )
}

export default ClearHistoryButton

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: ifTablet(12, 6),
        paddingVertical: ifTablet(6, 4),
        borderRadius: 8,
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
    },
    text: {
        fontSize: ifTablet(18, 16),
    },
    icon: {
        width: ifTablet(24, 24),
        height: ifTablet(24, 24),
    }
})
