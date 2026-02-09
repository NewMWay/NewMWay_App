// assets/styles/toastStyle.ts
export const toastStyles = {
  successToast: {
    type: 'success',
    text1: 'THÀNH CÔNG',
    text2: 'Thao tác thành công.',
    visibilityTime: 4000,
    autoHide: true,
    position: 'top' as const,
    topOffset: 70,
  },
  errorToast: {
    type: 'error',
    text1: 'ĐÃ CÓ LỖI',
    text2: 'Đã có lỗi xảy ra.',
    visibilityTime: 4000,
    autoHide: true,
    position: 'top' as const,
    topOffset: 70,
  },
  infoToast: {
    type: 'info',
    text1: 'THÔNG TIN',
    text2: 'Thông báo thông tin.',
    visibilityTime: 4000,
    autoHide: true,
    position: 'top' as const,
    topOffset: 70,
  },
} as const;