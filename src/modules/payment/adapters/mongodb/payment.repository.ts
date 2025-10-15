import type { PaymentPort } from "@payment/port/payment.interface";
import Payment, { type TTransaction } from "@payment/adapters/mongodb/payment.schema";

export class MongoosePaymentRepo implements PaymentPort {
    private balances = new Map<string, number>();

    constructor(private readonly payment: typeof Payment) { }

    async createTransaction(userId: string, amount: number): Promise<TTransaction> {
        return this.payment.create({ user: userId, amount })
    }

    async getWalletBalance(userId: string): Promise<number> {
        return this.balances.get(userId) ?? 1000;
    }

    async deposit(userId: string, amount: number): Promise<TTransaction> {
        this.balances.set(userId, (this.balances.get(userId) || 0) + amount)
        return this.payment.create({ user: userId, amount })
    }

    async withdraw(userId: string, amount: number): Promise<TTransaction> {
        if ((this.balances.get(userId) || 0) < amount) throw new Error('Insufficient balance')
        // TODO: check the following line
        this.balances.set(userId, (this.balances.get(userId) || 1000) - amount)
        return this.payment.create({ user: userId, amount })
    }
}