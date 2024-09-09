
var User = require('../models/auth-models.js');
const bcrypt = require('bcrypt');
const getNextSequenceValue = require('../Utility/nextId.js');
const Counter = require('../models/counter-models.js');
const saltRounds = 10;
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const postUser = async (req, res) => {
  console.log('Request body:', req.body);

  try {
    const { fullName, username, password, email, phone, role } = req.body;

    // Check if all required fields are provided
    if (!username || !password || !email || !phone || !role) {
      return res.status(400).json({ data: 'All required fields must be provided', code: 400 });
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




// Get all users
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


// Get user by username and password
const getUser = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    console.log(`Received request to get user: ${username}`);

    // Find the user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log(`User not found: ${username}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`User found: ${username}`);

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log(`Invalid password for user: ${username}`);
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log(`Password match for user: ${username}`);
    
    // Successful response
    res.status(200).json(user);
    
  } catch (error) {
    console.error('Error in getUser function:', error.message);
    res.status(500).json({ message: "An error occurred while processing the request" });
  }
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




// פונקציה לשליחת מייל לשחזור סיסמה
const sendPasswordResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',  // 'Gmail' לא מתוארת ב-nodemailer, השתמש ב-'gmail'
    auth: {
      user: 'tasbih.ab274@gmail.com',
      pass: 'ajet ovda likn gxuk'  // השתמש בסיסמת אפליקציה אם יש לך אימות דו-שלבי
    }
  });
  const mailOptions = {
    from: 'tasbih.ab274@gmail.com',

    ///?? 
    to:email ,
    subject: 'Password Reset',
    text: `You requested a password reset. Use the following code to reset your password: ${token}`


  };
  console.log(`Sending email to: ${mailOptions.to}`);
  console.log(`From email: ${mailOptions.from}`);
  

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};




// פונקציה לטיפול בבקשה לשחזור סיסמה
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email)
    if (!email) {
      return res.status(400).json({ data: 'Email is required', code: 400 });
    }


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ data: 'User not found', code: 404 });
    }



    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // שעה אחת
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ data: 'Password reset email has been sent', code: 200 });
  } catch (error) {
    console.error('Error in forgotPassword function:', error.message);
    res.status(500).json({ data: 'An error occurred while processing the request', code: 500 });
  }
};







// פונקציה לטיפול בשינוי הסיסמה
const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ data: 'All fields are required', code: 400 });
    }

    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ data: 'Invalid token or token has expired', code: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ data: 'Password has been reset successfully', code: 200 });
  } catch (error) {
    console.error('Error in resetPassword function:', error.message);
    res.status(500).json({ data: 'An error occurred while resetting the password', code: 500 });
  }
};



exports.postUser = postUser;
exports.getAllUsers = getAllUsers;
exports.getUser = getUser;
exports.deleteUser = deleteUser;
exports.resetPassword = resetPassword ;
exports.forgotPassword=forgotPassword;