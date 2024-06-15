const { PrismaClient } = require("@prisma/client");
const OpenAI = require("openai");
const fs = require("fs");
const speech = require("@google-cloud/speech");
const prisma = new PrismaClient();

const client = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const openai = new OpenAI(process.env.OPENAI_API_KEY);

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
  callGpt35(transcription);
  return { transcription };
};

const callGpt35 = async (transcription) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `${transcription}\n이 내용을 다음 양식에 맞게 요약해줘. 다른 말은 아예 하지마. 없으면 빈칸으로 남겨둬.\n
          1. 제목: \n
          2. 시작시간: \n
          3. 종료시간: \n
          4. 장소: \n
          5. 안건: \n
          6. 내용: \n
          7. 결정사항: \n
          8. 참석자:`,
        },
      ],
    });
    console.log("response >>> ", completion.choices[0]);
    return completion.choices[0];
  } catch (error) {
    console.error("callGpt35() error >>> ", error);
    return null;
  }
};

module.exports = {
  getAllMinutes,
  getMinutes,
  getMinutesByUserId,
  createMinutes,
  transcription,
};
