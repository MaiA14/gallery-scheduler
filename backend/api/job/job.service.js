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

async function getUserByEmail(email) {
    const collection = await dbService.getCollection('job_collection');
  
    try {
      const user = await collection.find({ email }).toArray();
      return user;
    } catch (e) {
      console.error(`ERROR: while finding user ${email}`);
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


const getUserSubsOccourences = async (userSubjects) => {
    const data = await userSubjects;
    var mapSubjects = {}, i, value;
    for (i = 0; i < data.length; i++) {
        value = data[i];
        if (typeof mapSubjects[value] === "undefined") {
            mapSubjects[value] = 1;
        } else {
            mapSubjects[value]++;
        }
    }
    return Object.entries(mapSubjects)
    .sort((a, b) => b[1]-a[1]) 
    .map(v => v[0]); 
}

module.exports = {
    query,
    add,
    remove,
    getUserByEmail,
    getUserSubsOccourences
};