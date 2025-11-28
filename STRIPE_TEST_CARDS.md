# Stripe Test Card Details

## Successful Payment Cards

### Standard Success Card
- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)
- **Result:** Payment succeeds immediately

### Visa Success
- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **Result:** Payment succeeds

### Mastercard Success
- **Card Number:** `5555 5555 5555 4444`
- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **Result:** Payment succeeds

### American Express Success
- **Card Number:** `3782 822463 10005`
- **Expiry:** Any future date
- **CVC:** Any 4 digits (Amex uses 4-digit CVC)
- **Result:** Payment succeeds

## Declined Payment Cards

### Generic Decline
- **Card Number:** `4000 0000 0000 0002`
- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **Result:** Card is declined

### Insufficient Funds
- **Card Number:** `4000 0000 0000 9995`
- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **Result:** Insufficient funds error

### Lost Card
- **Card Number:** `4000 0000 0000 9987`
- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **Result:** Card declined (lost card)

### Stolen Card
- **Card Number:** `4000 0000 0000 9979`
- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **Result:** Card declined (stolen card)

##  3D Secure Authentication Cards

### 3D Secure Required (Authentication Required)
- **Card Number:** `4000 0025 0000 3155`
- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **Result:** Requires 3D Secure authentication
- **Note:** In test mode, use any authentication code (e.g., `123456`)

### 3D Secure Authentication Failed
- **Card Number:** `4000 0027 6000 3184`
- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **Result:** 3D Secure authentication fails

##  International Cards

### UK Card
- **Card Number:** `4000 0082 6000 0000`
- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **Result:** Payment succeeds

### Brazil Card
- **Card Number:** `4000 0076 0000 0002`
- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **Result:** Payment succeeds

##  Other Test Scenarios

### Processing Error
- **Card Number:** `4000 0000 0000 0119`
- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **Result:** Processing error occurs

### Incorrect CVC
- **Card Number:** `4000 0000 0000 0127`
- **Expiry:** Any future date
- **CVC:** Any incorrect CVC
- **Result:** Incorrect CVC error

### Expired Card
- **Card Number:** `4000 0000 0000 0069`
- **Expiry:** Any past date
- **CVC:** Any 3 digits
- **Result:** Expired card error

## Important Notes

1. **Test Mode Only:** These cards only work with Stripe test API keys (`sk_test_` and `pk_test_`)

2. **Expiry Date:** Use any future date (e.g., `12/34`, `01/25`, etc.)

3. **CVC/CVV:** 
   - For most cards: Any 3 digits (e.g., `123`, `456`)
   - For American Express: Any 4 digits (e.g., `1234`)

4. **ZIP/Postal Code:** Any valid postal code (e.g., `12345` for US, `SW1A 1AA` for UK)

5. **3D Secure:** When testing 3D Secure, use any authentication code in test mode

6. **Currency:** These cards work with any currency (ZAR, USD, EUR, etc.)

##  Quick Reference

**Most Common Test Card:**
```
Card: 4242 4242 4242 4242
Expiry: 12/34
CVC: 123
ZIP: 12345
```

**For Testing Declines:**
```
Card: 4000 0000 0000 0002
Expiry: 12/34
CVC: 123
```

##  Resources

- [Stripe Testing Documentation](https://stripe.com/docs/testing)
- [Stripe Test Cards Reference](https://stripe.com/docs/testing#cards)

