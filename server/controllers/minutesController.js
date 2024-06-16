const minutesModel = require("../models/minutes");
const redisClient = require("../models/redisClient");

exports.getAllMinutes = async (req, res) => {
  try {
    const minutes = await minutesModel.getAllMinutes();
    res.json(minutes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching minutes" });
  }
};

exports.getMinutes = async (req, res) => {
  const { id } = req.params;
  try {
    const minutes = await minutesModel.getMinutes(id);
    res.json(minutes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching minutes" });
  }
};

exports.getMinutesByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const minutes = await minutesModel.getMinutesByUserId(userId);
    res.json(minutes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching minutes" });
  }
};

exports.getAllTempMinutes = async (req, res) => {
  try {
    const tempMInutes = await redisClient.getAllTempMinutes();
    res.json(tempMInutes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching temporary minutes from Redis" });
  }
};

exports.getTempMinutes = async (req, res) => {
  const { id } = req.params;
  try {
    const tempMinutes = await redisClient.getTempMinutes(id);
    res.json(tempMinutes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching temporary minutes from Redis" });
  }
};

exports.saveTempMinutes = async (req, res) => {
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
  } = req.body;
  const tempMinutes = {
    title,
    department,
    timeStart,
    timeEnd,
    place,
    item,
    content,
    decision,
    attendees,
  };
  try {
    await redisClient.saveTempMinutes(tempMinutes);
    console.log(
      `Temporary minutes saved to Redis: ${JSON.stringify(tempMinutes)}`
    );
    res.status(200).json({ message: "Temporary minutes saved to Redis" });
  } catch (error) {
    console.error("Error saving temporary minutes to Redis:", error);
    res.status(500).json({ error: "Error saving temporary minutes" });
  }
};

exports.saveFinalMinutes = async (req, res) => {
  try {
    const tempMinutesData = await redisClient.get(`tempMinutes`);
    if (!tempMinutesData) {
      return res.status(404).json({ error: "Temporary minutes not found" });
    }

    const tempMinutes = JSON.parse(tempMinutesData);

    const newMinutes = await minutesModel.createMinutes(tempMinutes);

    await redisClient.del(`tempMinutes`);
    res.status(201).json(newMinutes);
  } catch (error) {
    res.status(500).json({ error: "Error saving final minutes" });
  }
};

exports.saveMinutes = async (req, res) => {
  const {
    id,
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
  } = req.body;
  const minutes = {
    id,
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
  };
  console.log("Saving minutes:", minutes);
  try {
    const newMinutes = await minutesModel.createMinutes(minutes);
    res.status(201).json(newMinutes);
  } catch (error) {
    console.error("Error saving minutes:", error);
    res.status(500).json({ error: "Error saving minutes" });
  }
};

exports.transcription = async (req, res) => {
  const { file } = req;
  try {
    const transcriptionResult = await minutesModel.transcription(file);
    res.json(transcriptionResult);
  } catch (error) {
    res.status(500).json({ error: "Error transcribing audio" });
  }
};