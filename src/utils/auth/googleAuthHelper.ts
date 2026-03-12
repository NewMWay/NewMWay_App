import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export const configureGoogleSignIn = () => {
    // 1. XÓA BỎ đoạn kiểm tra này (Nguyên nhân gây lỗi trên Android)
    /*
    const clientId = firebase.app().options?.clientId;
    if (!clientId) {
        ...
    }
    */

    // 2. Cấu hình trực tiếp bằng Web Client ID
    // (Lấy từ ảnh cấu hình Firebase bạn gửi trước đó, đuôi ...ejdj)
    GoogleSignin.configure({
        webClientId: '433558499342-mfq3767h49r521hks7gseav68315ejdj.apps.googleusercontent.com',
        offlineAccess: true,
    });
}

export const signInWithGoogle = async () => {
    try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        // Lấy ID Token từ Google
        const userInfo = await GoogleSignin.signIn();
        const { idToken: googleIdToken } = userInfo.data || {};

        if (!googleIdToken) {
            throw new Error('No ID token found from Google Sign-In');
        }

        // Tạo Credential và Login vào Firebase
        const googleCredential = auth.GoogleAuthProvider.credential(googleIdToken);
        await auth().signInWithCredential(googleCredential);

        // Lấy Firebase Token chuẩn để gửi lên Server
        const firebaseToken = await auth().currentUser?.getIdToken(true);

        return firebaseToken;

    } catch (error) {
        console.error('Google Sign-In error:', error);
        throw error;
    }
}

export const signOutFromGoogle = async () => {
    try {
        await auth().signOut();
        await GoogleSignin.signOut();
    } catch (error) {
        console.error('Google Sign-Out error:', error);
        throw error;
    }
}