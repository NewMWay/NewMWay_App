import React from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../types/navigation/navigation';
import AuthModal from './components/AuthModal';
import { useAuthStore } from '../../stores/authStore.zustand';


const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    // Tách riêng các selector để tránh tạo object mới mỗi lần render
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const isInitialized = useAuthStore((state) => state.isInitialized);
    
    const navigation = useNavigation<RootStackNavigationProp>();
    const isFocused = useIsFocused();

    const handleCloseModal = () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'TabNavigation' }],
      });
    };

    const handleLogin = () => {
      navigation.replace('AuthStack');
    };

    // Đợi auth store khởi tạo xong để tránh flicker
    if (!isInitialized) {
      return null;
    }

    // Hiển thị modal khi chưa đăng nhập và screen đang focus
    const shouldShowModal = !isLoggedIn && isFocused;
    
    if (shouldShowModal) {
      return <AuthModal visible={true} onClose={handleCloseModal} onLogin={handleLogin} />;
    }
    
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;

