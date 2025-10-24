import type { TTransaction } from "@payment/adapters/mongodb/payment.schema";

export interface PaymentPort {
    createTransaction(userId: string, amount: number): Promise<TTransaction>;
    getWalletBalance(userId: string): Promise<number>;
    deposit(userId: string, amount: number): Promise<TTransaction>;
    withdraw(userId: string, amount: number): Promise<TTransaction>;
}