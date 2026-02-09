import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FilterStackParamList } from '../../types/navigation/navigation';
import FilterScreen from '../../features/home/screens/FilterScreen';

const Stack = createNativeStackNavigator<FilterStackParamList>();

const FilterStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 300,
            contentStyle: { backgroundColor: 'white' },
        }}>


            <Stack.Screen
                name="FilterScreen"
                component={FilterScreen}
                options={{
                    animation: 'fade_from_bottom',
                    animationDuration: 300
                }}
            />

        </Stack.Navigator>
    )
}

export default FilterStack
