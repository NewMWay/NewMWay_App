import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyles';
import { ifTablet } from '../../../utils/responsives/responsive';

interface CheckBoxProps {
    label?: React.ReactNode;
    onChange: (isChecked: boolean) => void;
    checked?: boolean;
}

const CheckBox: React.FC<CheckBoxProps> = ({ label, onChange, checked = false }) => {
    const toggleCheckbox = () => {
        onChange(!checked);
    };

    return (
        <TouchableOpacity style={styles.container} onPress={toggleCheckbox}>
            <View style={[styles.checkbox, checked && styles.checked]}>
                {checked && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: ifTablet(24, 20),
        height: ifTablet(24, 20),
        borderColor: Colors.textWhite,
        borderWidth: 1,
        borderRadius: ifTablet(6, 3),
        marginRight: ifTablet(12, 10),
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: Colors.textWhite,
    },
    checkMark: {
        color: Colors.primary,
        fontSize: ifTablet(16, 12),
        fontWeight: 'bold',
        fontFamily: 'Sora-Bold',
    },
    labelContainer: {
        flex: 1,
    },
    label: {
        fontSize: ifTablet(14, 12),
        color: Colors.textWhite,
        fontFamily: 'Sora-Regular',
        lineHeight: ifTablet(20, 18),
    },
});

export default CheckBox;