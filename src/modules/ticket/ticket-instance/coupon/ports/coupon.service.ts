import type { ICouponFilter, ICouponRepository, TCouponInput } from "@coupon/ports/coupon.port";
import type { TCoupon } from "@coupon/adapters/coupon.schema";
import { DISCOUNT_TYPE } from "@/common/enums";

export class CouponService {
    constructor(private readonly couponRepository: ICouponRepository) { }

    async findCoupons(filters?: ICouponFilter): Promise<TCoupon[]> {
        return this.couponRepository.findCoupons(filters)
    }

    async createCoupon(coupon: TCouponInput): Promise<TCoupon> {
        return this.couponRepository.createCoupon(coupon)
    }

    async updateCoupon(id: string, coupon: TCouponInput): Promise<TCoupon | null> {
        return this.couponRepository.updateCoupon(id, coupon)
    }

    async getDiscount(
        discountType: DISCOUNT_TYPE.FIXED | DISCOUNT_TYPE.PERCENTAGE,
        subtotal: number,
        discount_value: number
    ): Promise<number> {
        if (discountType === DISCOUNT_TYPE.PERCENTAGE) {
            return subtotal * (discount_value / 100)
        }
        return subtotal - discount_value < 0 ? 0 : subtotal - discount_value
    }
}