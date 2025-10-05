const User = require("../models/User");
const jwt = require('jsonwebtoken');

const registerUser =async(req,res) => {
 const {username,phone,password,address} = req.body;

 if(!username,!phone,!password,!address){
    return res.status(400).json({message:"All filds are required"});
 }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
   // Phone number length check
  if (!/^[0-9]{10}$/.test(phone)) {
    return res.status(400).json({ message: "Phone number must be 10 digits" });
  }

 try {
    // Check if user exists
    const checkUser = await User.findOne({phone});
    if(checkUser){
        return res.status(400).json({message:"User already exists"})
    };

    // Create new user
    const user = await User.create({username,phone,password,address});

      // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

     res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username, phone: user.phone },
      token,
    });
 } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
 }
}


//login logic
const loginUser = async(req,res) =>{
  const {phone,password} = req.body;

  if(!phone || !password){
   return res.status(400).json({message:"phone and password are required"});
  }

  try {
   //check User exists
   const user = await User.findOne({phone});
   if(!user){
      return res.status(400).json({ message: "User not found" });
   } 
      // Simple password check (no hashing yet)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
     // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
      res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, phone: user.phone, role: user.role },
      token,
    });
  } catch (error) {
   console.error(error);
   res.status(500).json({ message: "Server error" });
  }
}

//getUserInfo
const getUserInfo = async (req, res) => {
  try {
    // req.user.id middleware se aata hai
    const user = await User.findById(req.user.id).select("-password"); // password hide
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User info fetched successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// update address
const updatedaddress = async (req, res) => {
  try {
    const userId = req.user.id; // token से आएगा
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { address },
      { new: true } // updated document return करेगा
    ).select("-password"); // password hide

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Address updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//updated password
const updatedpassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // 1. Check fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Match new + confirm
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // 3. Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. Check old password
    if (user.password !== oldPassword) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // 5. Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {registerUser,loginUser,getUserInfo,updatedaddress,updatedpassword}