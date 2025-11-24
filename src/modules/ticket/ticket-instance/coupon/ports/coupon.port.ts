import type { TCoupon } from "@coupon/adapters/coupon.schema";

export interface ICouponFilter {
    code?: string;
    event?: string;
    discountType?: string;
}

export interface ICouponRepository{
    findCoupons(filters?: ICouponFilter): Promise<TCoupon[]>
    createCoupon(coupon: TCoupon): Promise<TCoupon>
}