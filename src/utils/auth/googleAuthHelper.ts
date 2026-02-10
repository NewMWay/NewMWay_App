import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

export const configureGoogleSignIn = () => {
    const clientId = firebase.app().options?.clientId;
    if (!clientId) {
        console.error('Client ID not found in GoogleServices-Info.plist');
        throw new Error('Google Sign-In configuration failed: Client ID is missing.');
    }

    GoogleSignin.configure({
        webClientId: clientId,
        offlineAccess: true,
        // forceCodeForRefreshToken: true, 
    });
}

export const signInWithGoogle = async () => {
    try {
        // 1. Kiểm tra dịch vụ Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        // 2. Đăng nhập Google & Lấy Google ID Token
        const userInfo = await GoogleSignin.signIn();
        const { idToken: googleIdToken } = userInfo.data || {};

        if (!googleIdToken) {
            throw new Error('No ID token found from Google Sign-In');
        }

        // 3. Tạo Credential của Firebase từ Google Token
        const googleCredential = auth.GoogleAuthProvider.credential(googleIdToken);

        // 4. Đăng nhập vào Firebase bằng Credential đó
        // (Bước này sẽ tạo user trong Authentication của Firebase Console)
        await auth().signInWithCredential(googleCredential);

        // 5. QUAN TRỌNG NHẤT: Lấy Firebase ID Token
        // Đây là token chuẩn có chứa `aud` là project-id (newmwayteakwood-4bd2d)
        // Tham số `true` để ép lấy token mới nhất
        const firebaseToken = await auth().currentUser?.getIdToken(true);

        // 6. Trả về Firebase Token (thay vì Google Token)
        return firebaseToken;

    } catch (error) {
        console.error('Google Sign-In error:', error);
        throw error;
    }
}

export const signOutFromGoogle = async () => {
    try {
        // Nên đăng xuất cả 2 nơi cho sạch session
        await auth().signOut();      // Đăng xuất Firebase
        await GoogleSignin.signOut(); // Đăng xuất Google
    } catch (error) {
        console.error('Google Sign-Out error:', error);
        throw error;
    }
}