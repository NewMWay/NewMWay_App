export interface GetProvincesResponse {
    provinces: {
        cityId: string;
        name: string;
    }[];
}

export interface GetDistrictsRequest {
    id: string;
}

export interface GetDistrictsResponse {
    districts: {
        districtId: string;
        cityId: string;
        name: string;
    }[];
}

export interface GetWardsRequest {
    id: string;
}

export interface GetWardsResponse {
    wards: {
        wardId: string;
        districtId: string;
        name: string;
    }[];
}

export interface GetUserAddressResponse {
    id: string;
    receiverName: string;
    receiverPhone: string;
    cityId: string;
    province: string;
    districtId: string;
    district: string;
    wardId: string;
    ward: string;
    address: string;
    isDefault: boolean;
}

export interface CreateUserAddressRequest {
    receiverName: string;
    receiverPhone: string;
    cityId: string;
    province: string;
    districtId: string;
    district: string;
    wardId: string;
    ward: string;
    address: string;
    isDefault: boolean;
}

export interface UpdateUserAddressRequest {
    id: string;
    receiverName: string;
    receiverPhone: string;
    cityId: string;
    province: string;
    districtId: string;
    district: string;
    wardId: string;
    ward: string;
    address: string;
    isDefault: boolean;
}