import type { TCoupon } from "@coupon/adapters/coupon.schema";

export interface ICouponFilter {
    code?: string;
    event?: string;
    discountType?: string;
}

export type TCouponInput = Omit<TCoupon, "_id" | "createdAt" | "updatedAt">

export interface ICouponRepository{
    findCoupons(filters?: ICouponFilter): Promise<TCoupon[]>
    createCoupon(coupon: TCouponInput): Promise<TCoupon>
    updateCoupon(id: string, coupon: TCouponInput): Promise<TCoupon | null>
}