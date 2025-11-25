import { MongooseCouponRepo } from "@coupon/adapters/coupon.repo"
import Coupon from "@coupon/adapters/coupon.schema"
import { CouponService } from "@coupon/ports/coupon.service"
import { type TCouponInput } from "@coupon/ports/coupon.port"
import { ERROR_MESSAGE } from "@common/enums"

const couponService = new CouponService(new MongooseCouponRepo(Coupon))

export const createCoupon = async (payload: TCouponInput) => {
    const newCoupon = await couponService.createCoupon(payload)
    if (!newCoupon) throw new Error(ERROR_MESSAGE.NOT_CREATED)

    return newCoupon
}
