const express = require('express');
const userRouter = express.Router();
const JWT_SECRET = require('../config');
const { validate, exist,validate1,exist1,authMiddleware,validate2 } = require('./middleware');
const jwt = require('jsonwebtoken');
const {User,Accounts} = require('../db'); // Corrected import

userRouter.post('/signup', validate, exist, async (req, res) => {
  try{
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName, // Corrected property name
      username: req.body.username,
      password: req.body.password
    });

    const userId = user._id;
    const Acc=await Accounts.create({
      userId,
      Balance: 1 + Math.random() * 10000
  })
    const token = jwt.sign({ userId }, "namo123");
    
    res.json({ message: "User created successfully", token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while creating the user" });
  }


});

userRouter.post('/signin', validate1, exist1, async (req, res) => {
    try{
    const user = await User.findOne({ username: req.body.username });
    const userId = user._id;
    const token = jwt.sign({ userId }, "namo123");
    
    res.json({ message: "User logged in successfully", token: token });
    }
   catch (error) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while logging the user" });
  }


});

userRouter.put("/", authMiddleware, async (req, res) => {
    
    await User.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })
})
userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
      $or: [{
          firstName: {
              "$regex": filter
          }
      }, {
          lastName: {
              "$regex": filter
          }
      }]
  })

  res.json({
      user: users.map(user => ({

          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          _id: user._id
      }))
  })
})

userRouter.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findOne({ _id: req.userId }, {});
  if (user) {
    res.json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        _id: user._id
      }
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
module.exports = userRouter;