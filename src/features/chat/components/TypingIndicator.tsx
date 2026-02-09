import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'

const TypingIndicator: React.FC = () => {
    const dot1 = useRef(new Animated.Value(0)).current
    const dot2 = useRef(new Animated.Value(0)).current
    const dot3 = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const animateDot = (dot: Animated.Value, delay: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: -8,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            ).start()
        }

        animateDot(dot1, 0)
        animateDot(dot2, 150)
        animateDot(dot3, 300)
    }, [dot1, dot2, dot3])

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.grayLight,
        borderRadius: 12,
        borderTopLeftRadius: 4,
        padding: ifTablet(14, 12),
        gap: ifTablet(6, 5),
    },
    dot: {
        width: ifTablet(8, 7),
        height: ifTablet(8, 7),
        borderRadius: ifTablet(4, 3.5),
        backgroundColor: Colors.gray,
    },
})

export default TypingIndicator
