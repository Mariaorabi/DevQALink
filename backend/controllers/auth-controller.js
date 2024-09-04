
const bcrypt = require('bcrypt');
const getNextSequenceValue = require('../Utility/nextId.js');
const jwt = require('jsonwebtoken');
const User = require('../models/auth-models.js');
const Counter = require('../models/counter-models.js');
const LoginUser = require('../models/login-models.js');
const saltRounds = 10;

const postUser = async (req, res) => {
  try {
    const { fullName, username, password, email, phone, role } = req.body;

    // Check if all required fields are provided
    if (!username || !password || !email || !phone || !role) {
      return res.status(400).json({ data: 'All required fields must be provided', code: 400 });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ data: 'Username or Email already exists', code: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Get the next user ID
    const userId = await getNextSequenceValue('userId');

    // Create a new User instance with the provided data
    const newUser = new User({
      userId,
      fullName,
      username,
      password: hashedPassword,
      email,
      phone,
      role,
    });

    // Save the user to the database
    await newUser.save();

    // Send success response
    res.status(201).json({ data: 'User has been saved successfully', code: 201 });
  } catch (error) {
    console.error('Error saving user:', error);
    if (error.code === 11000) {
      // Handle duplicate key error (e.g., unique constraint on username or email)
      res.status(400).json({ data: 'Username or Email already exists', code: 400 });
    } else {
      // Handle other errors
      res.status(500).json({ data: 'An error occurred while saving the user', code: 500 });
    }
  }
};


const getAllUsers = async (req, res) => {
  try {
    console.log('Received request to get all users');

    // Fetch all users from the database
    const users = await User.find();

    console.log(`Number of users found: ${users.length}`);

    // Send success response with the list of users
    res.status(200).json(users);
  }
  catch (error) {
    // Log the detailed error message
    console.error('Error in getAllUsers function:', error.message);

    // Send error response
    res.status(500).json({ message: 'An error occurred while retrieving users' });
  }
};


const getUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Invalid Username or Password" });
    }

    let loginUser = await LoginUser.findOne({ username });

    if (!loginUser) {
      // Create a new login attempt record if it doesn't exist
      loginUser = new LoginUser({ username });
    }

    // Check if 24 hours have passed and reset the values if needed
    await checkIf24HoursPassed(loginUser);

    // Check if the account is locked
    const lockCheck = await checkIfLocked(loginUser);
    if (lockCheck.isLocked) {
      return res.status(403).json({ message: lockCheck.message });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment the 'tries' field on a failed login attempt
      loginUser.tries += 1;

      // Check if the number of tries has reached the limit
      if (loginUser.tries >= 5) {
        loginUser.isLocked = true;
        loginUser.lockTime = new Date();
        await loginUser.save();
        return res.status(403).json({
          message: `Account locked due to too many failed login attempts. Locked at: ${loginUser.lockTime}`,
        });
      }

      await loginUser.save();
      return res.status(401).json({ message: "Invalid Username or Password" });
    }

    // Reset the 'tries' field and unlock the account on a successful login
    loginUser.tries = 0;
    loginUser.isLocked = false;
    loginUser.lockTime = null;
    await loginUser.save();

    // var token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    // Create a JWT token
    // const token = jwt.sign(
    //   { userId: user._id, username: user.username, role: user.role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '1h' }
    // );
    
    // // Save the token to localStorage
    // localStorage.setItem('token', token);
    
    // console.log('Token saved successfully to localStorage');

    // Return the token and user info
    res.status(200).json({ user: { username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Function to check if 24 hours have passed since the document was created
const checkIf24HoursPassed = async (loginUser) => {
  const now = new Date();
  const resetDuration = 5* 60 * 1000; // 24 hours in milliseconds

  if (now - loginUser.createdAt > resetDuration) {
    // Reset the login attempts and unlock the account
    loginUser.tries = 0;
    loginUser.isLocked = false;
    loginUser.lockTime = null;
    await loginUser.save();
  }
};


// Function to check if the account is locked due to too many failed attempts
const checkIfLocked = async (loginUser) => {
  const now = new Date();
  const lockDuration = 30 * 1000; // 30 seconds in milliseconds

  if (loginUser.isLocked) {
    const timeDifference = now - loginUser.lockTime;

    if (timeDifference > lockDuration) {
      // Reset the lock if 30 seconds have passed
      loginUser.tries = 0;
      loginUser.isLocked = false;
      loginUser.lockTime = null;
      await loginUser.save();
    } else {
      // Account is still locked
      return {
        isLocked: true,
        message: `Account locked due to too many failed login attempts. Please try again after 30 seconds. Locked at: ${loginUser.lockTime}`,
      };
    }
  }

  return { isLocked: false };
};


const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ data: 'Username is required', code: 400 });
    }
    const userToDelete = await User.findOne({ username: String(username) });
    const userIdToDelete = userToDelete.userId; // Assuming 'userId' is the field you're using for IDs

    // Ensure that the username is a string and not an object
    const deletedUser = await User.findOneAndDelete({ username: String(username) });
    await User.updateMany(
      { userId: { $gt: userIdToDelete } }, // Find all users with userId greater than the deleted user's ID
      { $inc: { userId: -1 } } // Decrement userId by 1
    );
    if (!deletedUser) {
      return res.status(404).json({ data: 'User not found', code: 404 });
    }
    const currentSequence = await Counter.findById('userId');

    if (currentSequence) {
      // Decrement the sequence value (if you need to maintain continuity)
      await Counter.findByIdAndUpdate(
        'userId',
        { $inc: { sequence_value: -1 } }, // Decrement the sequence value by 1
        { new: false }
      );
    }

    res.status(200).json({ data: 'User has been deleted successfully', code: 201 });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ data: 'An error occurred while deleting the user', code: 500 });
  }
};






exports.postUser = postUser;
exports.getAllUsers = getAllUsers;
exports.getUser = getUser;
exports.deleteUser = deleteUser;