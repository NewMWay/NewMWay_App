import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { useSignalR } from '../../../services/signalr/SignalRProvider'

const ConnectionStatusBadge: React.FC = () => {
    const { status, connect } = useSignalR()

    const handleReconnect = async () => {
        if (status === 'disconnected' || status === 'error') {
            try {
                await connect()
            } catch (error) {
                console.error('Reconnection failed:', error)
            }
        }
    }

    if (status === 'connected') {
        return (
            <View style={[styles.badge, styles.connected]}>
                <View style={styles.dot} />
                <Text style={styles.text}>Đã kết nối</Text>
            </View>
        )
    }

    if (status === 'connecting') {
        return (
            <View style={[styles.badge, styles.connecting]}>
                <ActivityIndicator size="small" color={Colors.warning} />
                <Text style={styles.text}>Đang kết nối...</Text>
            </View>
        )
    }

    if (status === 'error') {
        return (
            <TouchableOpacity
                style={[styles.badge, styles.error, styles.touchable]}
                onPress={handleReconnect}
                activeOpacity={0.7}
            >
                <Text style={styles.errorText}>⚠️ Lỗi kết nối</Text>
                <Text style={styles.retryHint}>Nhấn để thử lại</Text>
            </TouchableOpacity>
        )
    }

    // disconnected
    return (
        <TouchableOpacity
            style={[styles.badge, styles.disconnected, styles.touchable]}
            onPress={handleReconnect}
            activeOpacity={0.7}
        >
            <Text style={styles.disconText}>● Chưa kết nối</Text>
            <Text style={styles.retryHint}>Nhấn để kết nối</Text>
        </TouchableOpacity>
    )
}

export default ConnectionStatusBadge

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ifTablet(12, 10),
        paddingVertical: ifTablet(6, 5),
        borderRadius: 20,
        gap: ifTablet(6, 5),
    },
    touchable: {
        flexDirection: 'column',
        gap: ifTablet(2, 2),
    },
    connected: {
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
    },
    connecting: {
        backgroundColor: 'rgba(255, 152, 0, 0.15)',
    },
    error: {
        backgroundColor: 'rgba(244, 67, 54, 0.15)',
    },
    disconnected: {
        backgroundColor: 'rgba(158, 158, 158, 0.15)',
    },
    dot: {
        width: ifTablet(8, 7),
        height: ifTablet(8, 7),
        borderRadius: ifTablet(4, 3.5),
        backgroundColor: Colors.success,
    },
    text: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Medium',
        color: Colors.success,
    },
    errorText: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Medium',
        color: Colors.error,
    },
    disconText: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Medium',
        color: Colors.gray,
    },
    retryHint: {
        fontSize: ifTablet(9, 8),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
        fontStyle: 'italic',
    },
})
