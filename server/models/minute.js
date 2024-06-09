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
        create: await Promise.all(attendees.map(async attendee => {
          const existingAttendee = await prisma.attendees.findUnique({ where: { name: attendee.name }});
          if (existingAttendee) {
            return { 
              attendee: {
                connect: {
                  id: existingAttendee.id,
                  name: attendee.name,
                  department: attendee.department
                }
              }
             };
          } else {
            return {
              attendee: {
                create: {
                  id: attendee.id,
                  name: attendee.name,
                  department: attendee.department
                }
              }
            };
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
