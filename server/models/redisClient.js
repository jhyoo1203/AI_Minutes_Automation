const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

redisClient.connect().catch(console.error);

const saveTempMinutes = async (id, tempMinutes) => {
    console.log(`Saving temporary minutes to Redis: ${id}`, tempMinutes); // 저장할 데이터 로그
    try {
        await redisClient.set(`tempMinutes:${id}`, JSON.stringify(tempMinutes));
    } catch (err) {
        console.error(`Error saving temporary minutes to Redis: ${id}`, err); // 예외 출력
        throw err;
    }
};

const getAllTempMinutes = async (req, res) => {
    console.log('getAllTempMinutes function called'); // 함수 호출 로그

    try {
        const keys = await redisClient.keys('tempMinutes:*');
        console.log('Fetched keys:', keys); // keys 값 출력 로그

        if (keys.length === 0) {
            console.log('No keys found');
            return res.json([]);
        }

        const promises = keys.map(async (key) => {
            try {
                const value = await redisClient.get(key);
                console.log(`Fetched value for key ${key}:`, value); // get 값 출력 로그
                return JSON.parse(value);
            } catch (err) {
                console.error(`Error fetching value for key ${key}:`, err);
                throw err;
            }
        });

        const tempMinutes = await Promise.all(promises);
        console.log('Fetched tempMinutes:', tempMinutes); // 최종 결과 출력 로그
        return tempMinutes;
    } catch (err) {
        console.error('Error fetching tempMinutes:', err);
        res.status(500).json({ error: 'Error fetching temporary minutes from Redis' });
    }
};

const getTempMinutes = async (id) => {
    console.log(`getTempMinutes function called with id: ${id}`); // 함수 호출 로그

    try {
        const tempMinutes = await redisClient.get(`tempMinutes:${id}`);
        console.log('Fetched tempMinutes:', tempMinutes); // get 값 출력 로그
        return JSON.parse(tempMinutes);
    } catch (err) {
        console.error(`Error fetching tempMinutes for id ${id}:`, err);
        throw err;
    }
};

module.exports = {
    saveTempMinutes,
    getAllTempMinutes,
    getTempMinutes
};
