const userModel = require("../models/user");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getUser(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

exports.getUserIncludeMinutes = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getUserIncludeMinutes(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = {
    name,
    email,
    password,
  };
  try {
    const user = await userModel.createUser(data);
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};
