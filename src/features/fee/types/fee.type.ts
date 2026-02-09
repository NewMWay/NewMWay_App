export interface CalculateFeeRequest {
    province: string;
    district: string;
    weight: number;
    value: number;
}

export interface CalculateFeeResponse {
    fee: number;
    insurance_fee: number;
    delivery: boolean;
    ship_fee_only: number;
}
