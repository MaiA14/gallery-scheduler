const { sendJob } = require('../socket/socket.service');
var cron = require('node-cron');

let jobMap = {};

const addJob = (seconds, jobId, gif) => {
  const job = cron.schedule(`*/${seconds} * * * * *`,()=>{
      sendJob(JSON.stringify({ image: gif, id: jobId }));
      console.info(`job ${jobId}`);
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
    addJob, cancelJob
}