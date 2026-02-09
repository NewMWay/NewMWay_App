import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyles';
import { ifTablet } from '../../../utils/responsives/responsive';

interface InputFieldProps extends TextInputProps {
    label: string;
    required?: boolean;
    error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    required = false,
    error,
    style,
    ...textInputProps
}) => {
    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>
                {label} {required && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
                style={[styles.input, style, error && styles.inputError]}
                placeholderTextColor="#999"
                {...textInputProps}
            />
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
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingHorizontal: ifTablet(16, 12),
        paddingVertical: ifTablet(12, 10),
        fontSize: ifTablet(15, 14),
        color: '#333',
        backgroundColor: 'white',
    },
    inputError: {
        borderColor: Colors.primary || '#E53935',
    },
    errorText: {
        fontSize: ifTablet(13, 12),
        color: Colors.primary || '#E53935',
        marginTop: ifTablet(4, 3),
    },
});
