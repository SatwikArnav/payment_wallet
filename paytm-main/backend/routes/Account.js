const express = require('express');
const { authMiddleware } = require('./middleware');
const { Accounts } = require('../db');
const acccountrouter = express.Router();
const mongoose=require('mongoose')
acccountrouter.get('/balance', authMiddleware, async (req, res) => {
    try {
      const acc = await Accounts.findOne({userId:req.userId});
      if (!acc) {
        return res.status(404).json({ message: 'Account not found' });
      }
      res.json({ Balance: acc.Balance });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
})
acccountrouter.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { amount, to } = req.body;
  
    // Fetch the accounts within the transaction
    const account = await Accounts.findOne({ userId: req.userId }).session(session);
    if (!account || account.Balance < amount || amount < 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }
    
    const toAccount = await Accounts.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid account" });
    }
  
    // Perform the transfer
    await Accounts.updateOne({ userId: req.userId }, { $inc: { Balance: -amount } }).session(session);
    await Accounts.updateOne({ userId: to }, { $inc: { Balance: amount } }).session(session);
  
    // Commit the transaction
    await session.commitTransaction();
    res.json({ message: "Transfer successful" });
  });

module.exports=acccountrouter;