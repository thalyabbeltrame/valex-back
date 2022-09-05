# Table of Contents

- [Getting Started](#getting-started)
- [API Reference](#api-reference)
  - [Routes](#routes)
  - [Cards](#cards)
  - [Payments](#payments)
  - [Recharges](#recharges)
  - [Virtual Cards](#virtual-cards)

# Getting Started

To clone the project, run the following command:

```git
git clone https://github.com/thalyabbeltrame/valex-back.git
```

Then, navigate to the project folder and run the following command:

```git
npm install
```

Finally, start the server:

```git
npm start
```

# API Reference

## Routes

### [Cards](#cards) _`/cards`_

- [Create a card](#---create-a-card)
- [Activate a card](#---activate-a-card)
- [Block a card](#---block-a-card)
- [Unblock a card](#---unblock-a-card)
- [View balance and transactions](#---view-balance)

### [Payments](#payments) _`/payments`_

- [New payment](#---new-payment)

### [Recharges](#recharges) _`/recharges`_

- [New recharge](#---new-recharge)

### [Virtual Cards](#virtual-cards) _`/virtual-cards`_

## Cards

#### Create a card

###### POST _`/cards/create`_

###### Body

```json
{
  "employeeId": "1",
  "type": "health"
}
```

###### Headers

```json
{
  "x-api-key": "this-is-a-x-api-key"
}
```

#### Activate a card

###### PATCH _`/cards/:cardId/activate`_

###### Body

```json
{
  "employeeId": "1",
  "password": "192",
  "securityCode": "1234"
}
```

#### Block a card

###### PATCH _`/cards/:cardId/block`_

###### Body

```json
{
  "password": "1234"
}
```

#### Unblock a card

###### PATCH _`/cards/:cardId/unblock`_

###### Body

```json
{
  "password": "1234"
}
```

#### View balance and transactions

###### GET _`/cards/:cardId/balance`_

## Payments

### POS payment

###### POST _`/cards/:cardId/payment/pos`_

###### Body

```json
{
  "password": "1234",
  "businessId": "5",
  "amount": 1000
}
```

### Online payment

###### POST _`/cards/payment/online`_

###### Body

```json
{
  "cardData": {
    "number": "1234 5678 9101 1121",
    "cardholderName": "Ana Catarina da Silva",
    "expirationDate": "09/22",
    "securityCode": "123"
  },
  "businessId": "1",
  "amount": 1000
}
```

## Recharges

### &nbsp; ‣ &nbsp; New recharge

###### &nbsp; &nbsp; POST _`/recharges/new`_

### &nbsp; ☰ &nbsp; Request

###### Body

```json
{
  "cardId": 3,
  "amount": 1000
}
```

###### Headers

```json
{
  "Content-Type": "application/json",
  "x-api-key": "this-is-a-needlessly-long-placeholder-api-key"
}
```

### &nbsp; ☰ &nbsp; Responses

| Status Code |      Description      |          Properties           |
| :---------: | :-------------------: | :---------------------------: |
|   **201**   |        Created        |          `data: {}`           |
|   **400**   |    Missing Headers    | `error: { message, details }` |
|   **401**   |    Unauthenticated    | `error: { message, details }` |
|   **403**   |       Forbidden       | `error: { message, details }` |
|   **404**   |       Not Found       | `error: { message, details }` |
|   **422**   |     Invalid Input     | `error: { message, details }` |
|   **500**   | Internal Server Error | `error: { message, details }` |
