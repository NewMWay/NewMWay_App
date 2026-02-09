export interface GetProfileResponse {
    id: string
    username: string
    avatar: string | null
    fullName: string | null
    email: string
    phone: string
    createdDate: string
    lastModifiedDate: string
}

export interface UpdateProfileRequest {
    fullName?: string
    phone?: string
    avatar?: string | null
    password?: string
}


export interface AddUserDeviceTokenRequest {
    deviceToken: string
    deviceType?: string;
}

export interface DeleteUserDeviceTokenRequest {
    deviceToken: string
    deviceType?: string;
}