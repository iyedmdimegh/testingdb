// import express from "express";
// import ServerlessHttp from "serverless-http";

// const app = express();


// app.get('/.netlify/functions/api', (req, res) => {
//     return res.json({
//         messages: "hello world!"
//     })
// })
// await mongoose.connect("mongodb+srv://iyed:ohmygahh@drama.zzi1idx.mongodb.net/?retryWrites=true&w=majority&appName=drama");


// const handler = ServerlessHttp(app);

// module.exports.handler = async(event, context) => {
//     const result = await handler(event, context);
//     return result;
// }









import express from "express";
import bodyParser from "body-parser";
import { User } from "../models/user.js";
import { data } from "../roaming.js";
import mongoose from "mongoose";
import ServerlessHttp from "serverless-http";



mongoose.connect("mongodb+srv://iyed:ohmygahh@drama.zzi1idx.mongodb.net/?retryWrites=true&w=majority&appName=drama");
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.post("/.netlify/functions/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/.netlify/functions/api', async (req, res) => {
    return res.json({
        messages: "hello world!"
    })
})

app.post("/.netlify/functions/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    res.json({ message: "Login successful", userId: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users' levels
app.get("/.netlify/functions/api/users/levels", async (req, res) => {
  try {
    const users = await User.find({}, 'username level');
    const levels = users.map(user => ({
      username: user.username,
      level: user.level
    }));
    res.json(levels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check answer and update level
app.post("/.netlify/functions/api/check-answer", async (req, res) => {
  try {
    const { userId, questionNumber, answer } = req.body;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the answer is correct
    const correctAnswer = data[`q${questionNumber}`];
    if (!correctAnswer) {
      return res.status(400).json({ error: "Invalid question number" });
    }

    if (answer === correctAnswer) {
      // Only update level if the question number is higher than current level
      if (questionNumber > user.level) {
        user.level = questionNumber;
        await user.save();
      }
      res.json({ 
        correct: true, 
        message: "Correct answer!",
        newLevel: user.level
      });
    } else {
      res.json({ 
        correct: false, 
        message: "Wrong answer",
        currentLevel: user.level
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test route
app.get("/.netlify/functions/api/hi", (req, res) => {
  res.json({ message: "API is working!" });
});

// export default app;

const handler = ServerlessHttp(app);

module.exports.handler = async(event, context) => {
    const result = await handler(event, context);
    return result;
}