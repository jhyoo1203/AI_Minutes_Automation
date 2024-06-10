const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const saltRounds = 10;

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

module.exports = {
  getAllUsers,
  getUser,
  getUserIncludeMinutes,
  createUser,
};
