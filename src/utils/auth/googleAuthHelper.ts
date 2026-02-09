import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firebase from '@react-native-firebase/app';

export const configureGoogleSignIn = () => {
    const clientId = firebase.app().options?.clientId;
    if (!clientId) {
        console.error('Client ID not found in GoogleServices-Info.plist');
        throw new Error('Google Sign-In configuration failed: Client ID is missing.');
    }

    GoogleSignin.configure({
        webClientId: clientId,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
    })
}

export const signInWithGoogle = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        return userInfo.data?.idToken;
    } catch (error) {
        console.error('Google Sign-In error:', error);
        throw error;
    }
}

// export const signInWithGoogle = async () => {
//     try {
//         await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

//         // 1. Lấy thông tin từ Google
//         const userInfo = await GoogleSignin.signIn();
//         const { idToken } = userInfo.data || {};

//         if (!idToken) {
//             throw new Error('No ID token found from Google Sign-In');
//         }

//         // 2. Đăng nhập vào Firebase (Side effect: để Firebase biết user đã login)
//         const googleCredential = auth.GoogleAuthProvider.credential(idToken);
//         await auth().signInWithCredential(googleCredential);

//         // 3. QUAN TRỌNG: Trả về idToken (String) thay vì userCredential
//         // Để bên LoginScreen nhận được chuỗi string và gửi lên API Backend của bạn
//         return idToken; 

//     } catch (error) {
//         console.error('Google Sign-In error:', error);
//         throw error;
//     }
// };

export const signOutFromGoogle = async () => {
    try {
        await GoogleSignin.signOut();
    } catch (error) {
        console.error('Google Sign-Out error:', error);
        throw error;
    }
}