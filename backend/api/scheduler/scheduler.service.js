const { sendJob } = require('../socket/socket.service');
var cron = require('node-cron');
const { getRndGif } = require('../gallery/gallery.controller');
let jobMap = {};

const addJob = async (seconds, jobId, gif, subject) => {
  const job = cron.schedule(`*/${seconds} * * * * *`,async ()=>{
      if (gif !== null) {
        let rndGif = await getRndGif(subject);
        sendJob(JSON.stringify({ image: rndGif, id: jobId }));
        console.info(`job ${jobId}`);
      }
  });

  jobMap[jobId] = job;
}

const gifPerJobs = (seconds, jobId, numOfGifs, gif, subject) => {
  let i = 0;
  const job = cron.schedule(`*/${seconds} * * * * *`,async ()=>{
      if (gif !== null) {
        let rndGif = await getRndGif(subject);
        sendJob(JSON.stringify({ image: rndGif, id: jobId }));
        console.info(`job ${jobId}`);
      }

      i++;
      if (i > numOfGifs - 1)
        cancelJob(jobId);  
  });

  jobMap[jobId] = job;
}

const cancelJob = (jobId) => {
    console.info('stop', jobId)
    let currentJob = jobMap[jobId];
    if (currentJob !== undefined) {
        currentJob.stop();
    }
}

module.exports = {
    addJob, cancelJob, gifPerJobs
}