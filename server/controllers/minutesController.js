const minutesModel = require("../models/minutes");
const userModel = require("../models/user");

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

exports.getTempMinutes = async (req, res) => {
  try {
    const tempMinutes = await minutesModel.getTempMinutes();
    res.json(tempMinutes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching temp minutes" });
  }
};

exports.saveMinutes = async (req, res) => {
  const { token, minutesData } = req.body;
  try {
    const userId = await userModel.getUserIdByToken(token);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!minutesData) {
      return res.status(400).json({ error: "Minutes data is required" });
    }

    await minutesModel.deleteTempMinutes();
    const newMinutes = await minutesModel.createMinutes(minutesData, userId);

    res.status(201).json(newMinutes);
  } catch (error) {
    console.error("Error saving minutes:", error);
    res.status(500).json({ error: "Error saving minutes", details: error.message });
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