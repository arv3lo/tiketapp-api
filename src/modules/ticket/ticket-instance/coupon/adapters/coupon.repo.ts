import type { ICouponFilter, ICouponRepository } from "@coupon/ports/coupon.port";
import Coupon, { type TCoupon } from "@coupon/adapters/coupon.schema";

export class MongooseCouponRepo implements ICouponRepository {
    constructor(private readonly coupon: typeof Coupon) { }

    findCoupons(filters?: ICouponFilter): Promise<TCoupon[]> {
        return this.coupon.find(filters ?? {})
    }

    createCoupon(coupon: Partial<TCoupon>): Promise<TCoupon> {
        return this.coupon.create(coupon)
    }
}

// const formatFilters = (filters: ICouponFilter) => {
//     // in case we need paginations, we put these filters here
//     const { limit, page, sort, order, _id, ...rest } = filters
//     return { _id: { $in: _id }, ...rest }
// }