const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllMinutes = async () => {
  return await prisma.minutes.findMany({
    include: {
      attendees: {
        include: {
          attendee: true
        }
      }
    }
  });
};

const createMinutes = async (data) => {
  const { title, department, timeStart, timeEnd, place, item, content, decision, attendees } = data;
  return await prisma.minutes.create({
    data: {
      title,
      department,
      timeStart: new Date(timeStart),
      timeEnd: new Date(timeEnd),
      place,
      item,
      content,
      decision,
      attendees: {
        create: attendees.map(attendee => ({
          attendee: {
            connectOrCreate: {
              where: { name: attendee.name },
              create: { name: attendee.name, department: attendee.department }
            }
          }
        }))
      }
    }
  });
};

module.exports = {
  getAllMinutes,
  createMinutes
};
