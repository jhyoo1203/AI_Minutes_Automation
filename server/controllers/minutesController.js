const redis = require('redis');
const minutesModel = require('../models/minutesModel');
const redisClient = redis.createClient();

redisClient.connect().catch(console.error);

exports.getAllMinutes = async (req, res) => {
  try {
    const minutes = await minutesModel.getAllMinutes();
    res.json(minutes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching minutes' });
  }
};

exports.saveTempMinutes = async (req, res) => {
  const { id, title, department, timeStart, timeEnd, place, item, content, decision, attendees } = req.body;
  const tempMinutes = {
    id,
    title,
    department,
    timeStart,
    timeEnd,
    place,
    item,
    content,
    decision,
    attendees
  };
  try {
    await redisClient.set(`tempMinutes:${id}`, JSON.stringify(tempMinutes));
    res.status(200).json({ message: 'Temporary minutes saved to Redis' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving temporary minutes' });
  }
};

exports.saveFinalMinutes = async (req, res) => {
  const { id } = req.body;
  try {
    const tempMinutesData = await redisClient.get(`tempMinutes:${id}`);
    if (!tempMinutesData) {
      return res.status(404).json({ error: 'Temporary minutes not found' });
    }

    const tempMinutes = JSON.parse(tempMinutesData);

    const newMinutes = await minutesModel.createMinutes(tempMinutes);

    await redisClient.del(`tempMinutes:${id}`);
    res.status(201).json(newMinutes);
  } catch (error) {
    res.status(500).json({ error: 'Error saving final minutes' });
  }
};
