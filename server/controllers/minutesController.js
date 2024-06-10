const minutesModel = require('../models/minute');
const redisClient = require('../models/redisClient');

exports.getAllMinutes = async (req, res) => {
  try {
    const minutes = await minutesModel.getAllMinutes();
    res.json(minutes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching minutes' });
  }
};

exports.getMinutes = async (req, res) => {
  const { id } = req.params;
  try {
    const minutes = await minutesModel.getMinutes(id);
    res.json(minutes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching minutes' });
  }
};

exports.getAllTempMinutes = async (req, res) => {
  try {
    const tempMInutes = await redisClient.getAllTempMinutes();
    res.json(tempMInutes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching temporary minutes from Redis' });
  }
};

exports.getTempMinutes = async (req, res) => {
  const { id } = req.params;
  try {
    const tempMinutes = await redisClient.getTempMinutes(id);
    res.json(tempMinutes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching temporary minutes from Redis' });
  }
}

exports.saveTempMinutes = async (req, res) => {
  const { id, title, department, timeStart, timeEnd, place, item, content, decision, attendees, userId } = req.body;
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
    attendees,
    userId
  };
  try {
    await redisClient.saveTempMinutes(id, tempMinutes);
    console.log(`Temporary minutes saved to Redis: ${JSON.stringify(tempMinutes)}`);
    res.status(200).json({ message: 'Temporary minutes saved to Redis' });
  } catch (error) {
    console.error('Error saving temporary minutes to Redis:', error);
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


exports.saveMinutes = async (req, res) => {
  const { id, title, department, timeStart, timeEnd, place, item, content, decision, attendees, userId } = req.body;
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
    userId
  };
  console.log('Saving minutes:', minutes);
  try {
    const newMinutes = await minutesModel.createMinutes(minutes);
    res.status(201).json(newMinutes);
  } catch (error) {
    console.error('Error saving minutes:', error);
    res.status(500).json({ error: 'Error saving minutes' });
  }
};