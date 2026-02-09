import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyles';
import { ifTablet } from '../../../utils/responsives/responsive';

interface SelectFieldProps {
    label: string;
    value: string | null;
    placeholder: string;
    onPress: () => void;
    required?: boolean;
    disabled?: boolean;
    error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    value,
    placeholder,
    onPress,
    required = false,
    disabled = false,
    error
}) => {
    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>
                {label} {required && <Text style={styles.required}>*</Text>}
            </Text>
            <TouchableOpacity
                style={[
                    styles.selectInput,
                    disabled && styles.disabledInput,
                    error && styles.inputError
                ]}
                onPress={onPress}
                disabled={disabled}
            >
                <Text style={[styles.selectText, !value && styles.placeholderText]}>
                    {value || placeholder}
                </Text>
                <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    fieldContainer: {
        marginBottom: ifTablet(20, 16),
    },
    label: {
        fontSize: ifTablet(15, 14),
        fontWeight: '500',
        color: '#333',
        marginBottom: ifTablet(8, 6),
    },
    required: {
        color: Colors.primary || '#E53935',
    },
    selectInput: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingHorizontal: ifTablet(16, 12),
        paddingVertical: ifTablet(12, 10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    disabledInput: {
        backgroundColor: '#F5F5F5',
        borderColor: '#E5E5E5',
    },
    inputError: {
        borderColor: Colors.primary || '#E53935',
    },
    selectText: {
        fontSize: ifTablet(15, 14),
        color: '#333',
        flex: 1,
    },
    placeholderText: {
        color: '#999',
    },
    arrowIcon: {
        fontSize: ifTablet(24, 22),
        color: '#999',
        fontWeight: '300',
    },
    errorText: {
        fontSize: ifTablet(13, 12),
        color: Colors.primary || '#E53935',
        marginTop: ifTablet(4, 3),
    },
});
