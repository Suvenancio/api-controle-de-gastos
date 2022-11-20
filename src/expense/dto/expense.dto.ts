export type ExpenseDto = {
  description: string
  date: Date
  value: number
  installmentsQty?: number
  paymentMethodId: number
}
