import Register from "../model/Register.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";


export const getRegistrations = async (req, res) => {
  try {
    const users = await Register.find()
      .select(
        "fullname email mobile gender address profile_picture terms createdAt",
      )
      .sort({ createdAt: -1 });


    res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching registrations" });
  }
};


export const updateRegistration = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), message: "Validation failed" });
  }
  try {
    const { id } = req.params;
    const { fullname, email, mobile, gender, address, terms } = req.body;


    const existingUser = await Register.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "Registration not found" });
    }


    if (email && email !== existingUser.email) {
      const duplicateEmail = await Register.findOne({ email });
      if (duplicateEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
    }


    const updateData = {
      fullname,
      email,
      mobile,
      gender,
      address,
      terms: typeof terms === "string" ? terms === "true" : Boolean(terms),
      updatedAt: new Date(),
    };


    if (req.file) {
      updateData.profile_picture = req.file.filename;
    }


    const updatedUser = await Register.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select(
      "fullname email mobile gender address profile_picture terms createdAt",
    );


    return res.status(200).json({
      message: "Registration updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating registration:", error);
    return res
      .status(500)
      .json({ message: "Server error while updating registration" });
  }
};


export const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await Register.findByIdAndDelete(id);


    if (!deletedUser) {
      return res.status(404).json({ message: "Registration not found" });
    }


    return res
      .status(200)
      .json({ message: "Registration deleted successfully" });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return res
      .status(500)
      .json({ message: "Server error while deleting registration" });
  }
};


export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), msg: "Validation failed" });
  }


  try {
    const {
      fullname,
      email,
      mobile,
      gender,
      address,
      password,
      confirmPassword,
      terms,
    } = req.body;


    const profile_picture = req.file ? req.file.filename : null;
    const newUser = new Register({
      fullname,
      email,
      mobile,
      gender,
      address,
      password,
      confirmPassword,
      terms,
      profile_picture,
    });


    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }


    await newUser.save();
    // In a real application, you would hash the password before saving and not return the user object directly


    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};


export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), message: "Validation failed" });
  }


  try {
    const { email, password } = req.body;


    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }


    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        profile_picture: user.profile_picture,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};





