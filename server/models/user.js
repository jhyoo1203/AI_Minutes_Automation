const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("redis");
const prisma = new PrismaClient();
const saltRounds = 10;

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().catch(console.error);

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const getUser = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });
};

const getUserIdByToken = async (token) => {
  return await redisClient.get(token);
}

const getUserIncludeMinutes = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      minutes: true,
    },
  });
};

const createUser = async (data) => {
  const { name, email, password } = data;
  return await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, saltRounds),
    },
  });
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid password");

  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });

  await redisClient.set(token, user.id, "EX", 3600);

  return { user, token };
};

const verifyToken = async (token) => {
  const userId = await redisClient.get(token);
  if (!userId) throw new Error("Invalid or expired token");

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });
  if (!user) throw new Error("User not found");

  return user;
};

const logoutUser = async (token) => {
  const reply = await redisClient.del(token);
  if (reply !== 1) throw new Error("Logout failed");

  return { message: "Logout successful" };
};

module.exports = {
  getAllUsers,
  getUser,
  getUserIdByToken,
  getUserIncludeMinutes,
  createUser,
  loginUser,
  verifyToken,
  logoutUser,
};
