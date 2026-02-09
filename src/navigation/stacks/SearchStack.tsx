import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import { SearchStackParamList } from '../../types/navigation/navigation';
import SearchScreen from '../../features/home/screens/SearchScreen';
import ProductDetailsScreen from '../../features/shop/screens/ProductDetailsScreen';

const Stack = createNativeStackNavigator<SearchStackParamList>();

const SearchStack = () => {
  return (
      <Stack.Navigator screenOptions={{
                headerShown: false,
                animation: 'fade',
                animationDuration: 300,
                contentStyle: { backgroundColor: 'white' },
            }}>
                <Stack.Screen
                    name="SearchScreen"
                    component={SearchScreen}
                    options={{
                        animation: 'fade_from_bottom',
                        animationDuration: 300
                    }}
                />
                
                <Stack.Screen
                    name="ProductDetailsScreen"
                    component={ProductDetailsScreen}
                    options={{
                        animation: 'slide_from_right',
                        animationDuration: 300,
                    }}
                    listeners={({ navigation }) => ({
                        focus: () => {
                            navigation.getParent()?.setOptions({
                                tabBarStyle: {
                                    display: 'none',
                                },
                            });
                        },
                    })}
                />
    
            </Stack.Navigator>
  )
}

export default SearchStack
