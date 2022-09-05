# projeto18-valex

A Typescript designed project to manage benefit cards among companies and employees

# Description

Valex simulates an API that manages a benefit card, generally made available by companies to their employees.

</br>

## Features

- Get the card balance and transactions
- Create cards and virtual cards
- Activate / Block / Unlock a card
- Recharge a card
- Make card payments with online payment option

</br>

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

## API Reference

### Get card balance

```http
GET /cards/:cardId/balance
```

#### Request:

| Params   | Type      | Description           |
| :------- | :-------- | :-------------------- |
| `cardId` | `integer` | **Required**. card Id |

#### Response:

```json
{
  "balance": 35000,
  "transactions": [
    {
      "id": 1,
      "cardId": 1,
      "businessId": 1,
      "businessName": "DrivenEats",
      "timestamp": "22/01/2022",
      "amount": 5000
    }
  ],
  "recharges": [
    {
      "id": 1,
      "cardId": 1,
      "timestamp": "21/01/2022",
      "amount": 40000
    }
  ]
}
```

#

### Create a card

```http
POST /cards/create
```

#### Request:

| Body         | Type      | Description                        |
| :----------- | :-------- | :--------------------------------- |
| `employeeId` | `integer` | **Required**. user Id              |
| `type`       | `string`  | **Required**. type of card benefit |

`Valid types: [groceries, restaurant, transport, education, health]`

####

| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

####

#### Response:

```json
{
  "employeeId": 1,
  "number": "1111 1111 1111 1111",
  "cardholderName": "NAME N NAME",
  "securityCode": "111",
  "expirationDate": "01/27",
  "isVirtual": false,
  "isBlocked": false,
  "type": "card type"
}
```

#

### Activate a card

```http
PATCH /cards/:cardId/activate
```

#### Request:

| Params   | Type      | Description           |
| :------- | :-------- | :-------------------- |
| `cardId` | `integer` | **Required**. card Id |

| Body           | Type      | Description                 |
| :------------- | :-------- | :-------------------------- |
| `employeeId`   | `integer` | **Required**. employeeId    |
| `password`     | `string`  | **Required**. card password |
| `securityCode` | `string`  | **Required**. card cvv      |

`Password length: 4`

`Password pattern: only numbers`

`Cvv max length: 3`

#

### Block a card

```http
PATCH /cards/:cardId/block
```

#### Request:

| Params   | Type      | Description           |
| :------- | :-------- | :-------------------- |
| `cardId` | `integer` | **Required**. card Id |

| Body       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `password` | `string` | **Required**. card password |

#

### Unblock a card

```http
PATCH /cards/:cardId/unblock
```

#### Request:

| Params   | Type      | Description           |
| :------- | :-------- | :-------------------- |
| `cardId` | `integer` | **Required**. card Id |

| Body       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `password` | `string` | **Required**. card password |

#

### Recharge a card

```http
POST /cards/:cardId/recharge
```

#### Request:

| Params   | Type      | Description           |
| :------- | :-------- | :-------------------- |
| `cardId` | `integer` | **Required**. card Id |

| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

| Body     | Type      | Description                   |
| :------- | :-------- | :---------------------------- |
| `amount` | `integer` | **Required**. recharge amount |

#

### Card payments

```http
POST /payments
```

#### Request:

| Body         | Type      | Description                        |
| :----------- | :-------- | :--------------------------------- |
| `cardId`     | `integer` | **Required**. card Id              |
| `businessId` | `integer` | **Required**. card expiration date |
| `password`   | `string`  | **Required**. card password        |
| `amount`     | `integer` | **Required**. payment amount       |

#

```http
POST /payments/online
```

#### Request:

| Body             | Type      | Description                        |
| :--------------- | :-------- | :--------------------------------- |
| `cardId`         | `integer` | **Required**. card Id              |
| `cardholderName` | `string`  | **Required**. name in card         |
| `cardNumber`     | `string`  | **Required**. card number          |
| `expirationDate` | `string`  | **Required**. card expiration date |
| `securityCode`   | `string`  | **Required**. card CVV             |
| `businessId`     | `integer` | **Required**. card expiration date |
| `amount`         | `integer` | **Required**. payment amount       |

`Expiration Date Format: "MM/YY"`

#

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL = postgres://<username>:<password>@<hostname>:5432/<databaseName>`

`PORT = number #recommended:5000`

`CRYPTR_SECRET_KEY = any string`

</br>

## Run Locally

Clone the project

```bash
  git clone https://github.com/thalyabbeltrame/valex-back.git
```

Go to the project directory

```bash
  cd valex-back/
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

</br>
