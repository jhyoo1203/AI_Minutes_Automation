const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const speech = require("@google-cloud/speech");
const prisma = new PrismaClient();

const client = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const getAllMinutes = async () => {
  return await prisma.minutes.findMany({
    include: {
      attendees: {
        include: {
          attendee: true,
        },
      },
    },
  });
};

const getMinutes = async (id) => {
  return await prisma.minutes.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      attendees: {
        include: {
          attendee: true,
        },
      },
    },
  });
};

const getMinutesByUserId = async (userId) => {
  return await prisma.minutes.findMany({
    where: {
      userId: parseInt(userId),
    },
    include: {
      attendees: {
        include: {
          attendee: true,
        },
      },
    },
  });
};

const createMinutes = async (data) => {
  const {
    title,
    department,
    timeStart,
    timeEnd,
    place,
    item,
    content,
    decision,
    attendees,
    userId,
  } = data;
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
      user: {
        connect: {
          id: userId,
        },
      },
      attendees: {
        create: await Promise.all(
          attendees.map(async (attendee) => {
            const existingAttendee = await prisma.attendees.findUnique({
              where: { name: attendee.name },
            });
            if (existingAttendee) {
              return {
                attendee: {
                  connect: {
                    id: existingAttendee.id,
                    name: attendee.name,
                    department: attendee.department,
                  },
                },
              };
            } else {
              return {
                attendee: {
                  create: {
                    id: attendee.id,
                    name: attendee.name,
                    department: attendee.department,
                  },
                },
              };
            }
          })
        ),
      },
    },
  });
};

const transcription = async (file) => {
  const audioBytes = fs.readFileSync(file.path).toString("base64");
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: "LINEAR16",
    sampleRateHertz: 16000,
    languageCode: "ko-KR",
  };
  const request = {
    audio: audio,
    config: config,
  };
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log(`Transcription: ${transcription}`);

  return { transcription };
};


module.exports = {
  getAllMinutes,
  getMinutes,
  getMinutesByUserId,
  createMinutes,
  transcription,
};
