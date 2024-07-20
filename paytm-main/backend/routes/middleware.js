const zod = require('zod');
const {User,Accounts} = require('../db');
const jwt = require("jsonwebtoken");

const schema = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  username: zod.string().email(),
  password: zod.string()
});

const schema1 = zod.object({
    
    username: zod.string().email(),
    password: zod.string()
  });
  const schema2 = zod.object({
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    
    password: zod.string().optional()
  });  

function validate(req, res, next) {
  const result = schema.safeParse(req.body); // Use a different variable name for the result
  if (!result.success) {
    res.status(400).json({message:"Invalid input"}); // Use a more appropriate status code (400 for bad request)
  } else {
    next();
  }
}

async function exist(req, res, next) { // Pass req, res, and next as arguments
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    // Handle the case when the user already exists
    res.status(409).json({message:"User already exists"}); // Use a more appropriate status code (409 for conflict)
  } else {
    next();
  }
}


function validate1(req, res, next) {
    const result = schema1.safeParse(req.body); // Use a different variable name for the result
    if (!result.success) {
      res.status(400).json({message:"Invalid input"}); // Use a more appropriate status code (400 for bad request)
    } else {
      next();
    }
  }
  
  async function exist1(req, res, next) { // Pass req, res, and next as arguments
    const existingUser = await User.findOne({ username: req.body.username });
    if (!existingUser) {
      // Handle the case when the user already exists
      res.status(409).json({message:"User does not exists"}); // Use a more appropriate status code (409 for conflict)
    } else {
      next();
    }
  }







const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({"message":"could not get the bearer type token"});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token,"namo123");

        req.userId = decoded.userId;

        next();
    } catch (err) {
        console.log(err)
        return res.status(403).json({"message":"invalid password"});
    }
};
function validate2(req, res, next) {
    const result = schema2.safeParse(req.body); // Use a different variable name for the result
    if (!result.success) {
      res.status(400).json({message:"Invalid input"}); // Use a more appropriate status code (400 for bad request)
    } else {
      next();
    }
  }
    
module.exports = { validate, exist ,validate1,exist1,authMiddleware,validate2};