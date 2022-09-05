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

### [Cards](#cards)

- [Create a card](#---create-a-card)
- [Activate a card](#---activate-a-card)
- [Block a card](#---block-a-card)
- [Unblock a card](#---unblock-a-card)
- [View balance and transactions](#---view-balance)

### [Payments](#payments)

- [POS payment](#---pos-payment)
- [Online payment](#---online-payment)

### [Recharges](#recharges)

- [New recharge](#---new-recharge)

### [Virtual Cards](#virtual-cards)

- [Create a virtual card](#---create-a-virtual-card)
- [Delete a virtual card](#---delete-a-virtual-card)

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
  "password": "1234",
  "securityCode": "192"
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
    "securityCode": "192"
  },
  "businessId": "5",
  "amount": 1000
}
```

## Recharges

### New recharge

###### POST _`/cards/:cardId/recharge`_

###### Body

```json
{
  "amount": 1000
}
```

###### Headers

```json
{
  "x-api-key": "this-is-a-x-api-key"
}
```

## Virtual Cards

### Create a virtual card

###### POST _`/virtual-cards/:cardId/create`_

###### Body

```json
{
  "password": "1234"
}
```

### Delete a virtual card

###### DELETE _`/virtual-cards/:cardId/delete`_

###### Body

```json
{
  "password": "1234"
}
```
