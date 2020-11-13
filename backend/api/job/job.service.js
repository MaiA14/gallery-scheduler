const dbService = require("../../services/db.service");
const ObjectId = require("mongodb").ObjectId;


const query = async() => {
    const collection = await dbService.getCollection("job_collection");
    try {
        const jobs = await collection.find().toArray();
        return jobs;
    } catch (e) {
        console.error("ERROR: cannot find jobs");
        throw e;
    }
}

const add = async(job) => {
    const collection = await dbService.getCollection('job_collection')
    try {
        await collection.insertOne(job);
        return job;
    } catch (e) {
        console.error(`ERROR: cannot insert job`)
        throw e;
    }
}

const remove = async(jobId) => {
    const collection = await dbService.getCollection("job_collection");
    try {
        return await collection.deleteOne({ _id: ObjectId(jobId) });
    } catch (e) {
        console.error(`ERROR: cannot remove job ${jobId}`);
        throw e;
    }
}

module.exports = {
    query,
    add,
    remove
};