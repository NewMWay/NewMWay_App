import { decode as base64Decode } from 'base-64';

/**
 * Decode JWT token và kiểm tra expiration
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    // JWT có format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true; // Invalid token format
    }

    // Decode base64 payload
    const payload = JSON.parse(base64Decode(parts[1]));
    
    if (!payload.exp) {
      // Không có expiration time -> coi như valid
      return false;
    }

    // exp là unix timestamp (seconds), Date.now() là milliseconds
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Thêm buffer 30 giây để tránh edge case
    return payload.exp < (currentTime + 30);
  } catch (error) {
    // Lỗi khi decode -> coi như expired
    console.error('Error decoding token:', error);
    return true;
  }
};

/**
 * Lấy thông tin user từ token
 */
export const decodeToken = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    return JSON.parse(base64Decode(parts[1]));
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
