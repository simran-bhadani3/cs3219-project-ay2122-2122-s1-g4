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

# Delete a user
- Send a GET request to localhost:8080/api/user/:username

# Check JWT
- Send a GET request to localhost:8080/api/user/user with JWT in the Authorization header

# Register
- Send a POST request to localhost:8080/api/user/register
```
{
    "username": "user1111",
    "password": "passworD0!",
    "confirmpassword": "passworD0!",
    "email": "e0411068@u.nus.edu",
    "currency": "1000"
}
```
# Log in
- Send a POST request to localhost:8080/api/user/login
```
{
    "username": "user1111",
    "password": "passworD0!"
}
```