const { sendJob } = require('../socket/socket.service');
const { getRndGif } = require('../gallery/gallery.controller');
var cron = require('node-cron');

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