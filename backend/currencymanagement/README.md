# Making a transaction
- Send a POST request to localhost:8080/api/user/transaction
- In the body of the request specify the sender, receiver and the amount of currency to be transferred from sender to receiver.
- Amount will be deducted from sender's account and added to receiver's account.
```
{
    "sender": "senderuser",
    "receiver": "receiveruser",
    "currency": 100
}
```

# Get the currency of a user
- Send a GET request to localhost:8080/api/user/currency/:username