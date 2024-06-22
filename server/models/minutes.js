const { PrismaClient } = require("@prisma/client");
const redis = require("redis");
const OpenAI = require("openai");
const fs = require("fs");
const speech = require("@google-cloud/speech");
const prisma = new PrismaClient();

const client = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().catch(console.error);

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

const createMinutes = async (data, userId) => {
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
  } = data;

  try {
    const newMinutes = await prisma.$transaction(async (prisma) => {
      const createdMinutes = await prisma.minutes.create({
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
              id: parseInt(userId),
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
                      },
                    },
                  };
                } else {
                  return {
                    attendee: {
                      create: {
                        name: attendee.name,
                      },
                    },
                  };
                }
              })
            ),
          },
        },
      });

      return createdMinutes;
    });

    return newMinutes;
  } catch (error) {
    console.error("Failed to create minutes:", error);
    throw new Error("Failed to create minutes");
  } finally {
    await prisma.$disconnect();
  }
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
  const tempMinutes = await callGpt35(transcription);
  return { tempMinutes };
};

const callGpt35 = async (transcription) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `${transcription}\n이 내용을 다음 양식에 맞게 요약해줘. 다른 말은 아예 하지마. 내용이 없거나 모르는 항목은 빈칸으로 비워둬.\n
          model Minutes {
            title       String
            department  String
            timeStart   DateTime
            timeEnd     DateTime
            place       String
            item        String
            content     String
            decision    String
            attendees   MinutesAttendees[]
          } 이 prisma 스키마를 참고해서 내용을 작성해줘. json 형식으로 반환해줘.`,
        },
      ],
    });

    // JSON 문자열을 JavaScript 객체로 파싱
    const minutesData = JSON.parse(completion.choices[0].message.content);
    console.log("GPT-3.5-Turbo response >>> ", minutesData);

    // JavaScript 객체를 Redis에 저장
    await redisClient.set("tempMinutes", JSON.stringify(minutesData));
    return minutesData;
  } catch (error) {
    console.error("callGpt35() error >>> ", error);
    return null;
  }
};

const getTempMinutes = async () => {
  try {
    const tempMinutes = await redisClient.get("tempMinutes");
    if (tempMinutes) {
      return JSON.parse(tempMinutes);
    } else {
      console.log("No tempMinutes found in Redis.");
      return null;
    }
  } catch (error) {
    console.error("getTempMinutes() error >>> ", error);
    return null;
  }
};

const deleteTempMinutes = async () => {
  try {
    await redisClient.del("tempMinutes");
    console.log("Successfully deleted tempMinutes from Redis.");
  } catch (error) {
    console.error("deleteTempMinutes() error >>> ", error);
  }
};

module.exports = {
  getAllMinutes,
  getMinutes,
  getMinutesByUserId,
  createMinutes,
  transcription,
  getTempMinutes,
  deleteTempMinutes,
};
