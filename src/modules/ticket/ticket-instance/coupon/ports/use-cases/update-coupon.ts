import { MongooseCouponRepo } from "@coupon/adapters/coupon.repo"
import Coupon from "@coupon/adapters/coupon.schema"
import { CouponService } from "@coupon/ports/coupon.service"
import { type TCouponInput } from "@coupon/ports/coupon.port"
import { ERROR_MESSAGE } from "@common/enums"

const couponService = new CouponService(new MongooseCouponRepo(Coupon))

export const updateCoupon = async (id: string, coupon: TCouponInput) => {
    const updatedCoupon = await couponService.updateCoupon(id, coupon)
    if (!updatedCoupon) throw new Error(ERROR_MESSAGE.NOT_UPDATED)

    return updatedCoupon
}