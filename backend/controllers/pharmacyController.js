import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import Pharmacy from "../models/pharmacy.js"

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV !== "production" ? "fallback_local_secret_key" : null);

if (!JWT_SECRET) {
    throw new Error("FATAL: JWT_SECRET is required in production but is missing from environment variables.");
}

export const signup = async (req, res) => {
  try {
    const { user_name, owner_name, city, phone_number, password } = req.body;

    if (!user_name || !owner_name || !city || !phone_number || !password) {
      return res.status(400).json({ message: "Invalid Entry" });
    }

    // ── Input Validation ──────────────────────────────────────────────────
    if (password.length < 8) {
      return res.status(400).json({
        error: "Validation failed",
        details: [{ field: "password", message: "Password must be at least 8 characters" }]
      });
    }

    if (!/^\d+$/.test(phone_number)) {
      return res.status(400).json({
        error: "Validation failed",
        details: [{ field: "phone_number", message: "Phone number must contain only digits" }]
      });
    }

    if (phone_number.length !== 10) {
      return res.status(400).json({
        error: "Validation failed",
        details: [{ field: "phone_number", message: "Phone number must be exactly 10 digits" }]
      });
    }
    // ─────────────────────────────────────────────────────────────────────

    // Check if user already exists
    const existingPharmacy = await Pharmacy.findOne({ user_name });
    if (existingPharmacy) {
      return res
        .status(400)
        .json({ message: "Pharmacy name already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user
    const pharmacy = new Pharmacy({
      user_name,
      owner_name,
      city,
      phone_number,
      password: hashedPassword,
    });
    await pharmacy.save();

    // Generate JWT
    const token = jwt.sign(
      { id: pharmacy._id, user_name: pharmacy.user_name, role: pharmacy.role },
      JWT_SECRET,
      { expiresIn: "3h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.json({
      message: "Pharmacy registered successfully",
      token,
      pharmacy: {
        id: pharmacy._id,
        user_name: pharmacy.user_name,
        owner_name: pharmacy.owner_name,
        city: pharmacy.city,
        phone_number: pharmacy.phone_number,
        role: pharmacy.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req,res) => {
    console.log("Login request received:", req.body);

  const { user_name, password } = req.body;

  if (!user_name || !password) {
    console.log("Missing credentials");
    return res.status(400).json({ message: "Invalid credentials" });
  }

  try {
    // Find user by user_name
    const pharmacy = await Pharmacy.findOne({ user_name });
    console.log("Found pharmacy:", pharmacy ? "Yes" : "No");

    if (!pharmacy) {
      console.log("Pharmacy not found");
      return res
        .status(400)
        .json({ message: "Pharmacy is not registered. Please sign up." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, pharmacy.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: pharmacy._id, user_name: pharmacy.user_name, role: pharmacy.role },
      JWT_SECRET,
      { expiresIn: "3h" }
    );

    console.log("Login successful, sending response");
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.json({
      message: "Pharmacy logged in successfully",
      token,
      pharmacy: {
        id: pharmacy._id,
        user_name: pharmacy.user_name,
        owner_name: pharmacy.owner_name,
        city: pharmacy.city,
        phone_number: pharmacy.phone_number,
        role: pharmacy.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req,res) => {
    try {
    const { user_name } = req.query;
    if (!user_name)
      return res.status(400).json({ message: "user_name is required" });

    // Verify user can only access their own profile
    if (req.user.user_name !== user_name) {
      return res.status(403).json({ message: "Access denied" });
    }

    const pharmacy = await Pharmacy.findOne({ user_name });
    if (!pharmacy)
      return res.status(404).json({ message: "Pharmacy not found" });
    res.json(pharmacy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDetails = async (req,res) => {
    try {
    const { pharmacy_id } = req.query;
    if (!pharmacy_id)
      return res.status(400).json({ message: "pharmacy_id is required" });

    const pharmacy = await Pharmacy.findById(pharmacy_id);
    if (!pharmacy)
      return res.status(404).json({ message: "Pharmacy not found" });

    // Return only necessary fields for map display
    res.json({
      _id: pharmacy._id,
      user_name: pharmacy.user_name,
      address: pharmacy.address,
      city: pharmacy.city,
      state: pharmacy.state,
      pincode: pharmacy.pincode,
      latitude: pharmacy.latitude,
      longitude: pharmacy.longitude,
      opening_hours: pharmacy.opening_hours,
      closing_hours: pharmacy.closing_hours,
      phone_number: pharmacy.phone_number,
      location_url: pharmacy.location_url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req,res) => {
try {
    const { user_name } = req.body;
    if (!user_name)
      return res.status(400).json({ message: "user_name is required" });

    // Verify user can only update their own profile
    // Use req.user.user_name to find the pharmacy (current user_name from token)
    const currentUserName = req.user.user_name;
    if (currentUserName !== user_name) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if user_name is being changed
    const newUserName = req.body.new_user_name;
    if (newUserName && newUserName !== currentUserName) {
      // Check if new user_name already exists
      const existingPharmacy = await Pharmacy.findOne({ user_name: newUserName });
      if (existingPharmacy) {
        return res.status(400).json({ message: "Pharmacy name already exists" });
      }
    }

    const allowed = [
      "license_number",
      "address",
      "city",
      "state",
      "pincode",
      "opening_hours",
      "closing_hours",
      "phone_number",
      "latitude",
      "longitude",
      "location_url",
    ];
    const update = {};
    for (const key of allowed) if (key in req.body) update[key] = req.body[key];
    
    // Handle user_name update separately if new_user_name is provided
    if (newUserName && newUserName !== currentUserName) {
      update.user_name = newUserName;
    }

    const pharmacy = await Pharmacy.findOneAndUpdate(
      { user_name: currentUserName },
      { $set: update },
      { new: true }
    );
    if (!pharmacy)
      return res.status(404).json({ message: "Pharmacy profile not found" });
    res.json({ message: "Profile updated", pharmacy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};