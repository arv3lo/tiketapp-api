import type { TTransaction } from "@payment/adapters/mongodb/payment.schema";
import type { PaymentPort } from "@payment/port/payment.port";

export class PaymentService {
    constructor(private readonly paymentRepository: PaymentPort) { }

    async createTransaction(userId: string, amount: number): Promise<TTransaction> {
        return this.paymentRepository.createTransaction(userId, amount)
    }

    async getWalletBalance(userId: string): Promise<number> {
        return this.paymentRepository.getWalletBalance(userId)
    }

    async deposit(userId: string, amount: number): Promise<TTransaction> {
        return this.paymentRepository.deposit(userId, amount)
    }

    async withdraw(userId: string, amount: number): Promise<TTransaction> {
        return this.paymentRepository.withdraw(userId, amount)
    }
}