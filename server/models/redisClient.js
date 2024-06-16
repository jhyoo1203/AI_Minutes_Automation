const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

redisClient.connect().catch(console.error);

const saveTempMinutes = async (tempMinutes) => {
    console.log(`Saving temporary minutes to Redis`, tempMinutes); // 저장할 데이터 로그
    try {
        await redisClient.set("tempMinutes", JSON.stringify(tempMinutes));
    } catch (err) {
        console.error(`Error saving temporary minutes to Redis`, err); // 예외 출력
        throw err;
    }
};

const getTempMinutes = async () => {
    try {
        const tempMinutes = await redisClient.get("tempMinutes");
        console.log('Fetched tempMinutes:', tempMinutes); // get 값 출력 로그
        return JSON.parse(tempMinutes);
    } catch (err) {
        console.error(`Error fetching tempMinutes:`, err);
        throw err;
    }
};

module.exports = {
    saveTempMinutes,
    getTempMinutes
};
