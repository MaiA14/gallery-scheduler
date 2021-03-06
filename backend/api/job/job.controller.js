const jobService = require('./job.service');
const schedulerService = require('../scheduler/scheduler.service');
const {  fetchUrlsData } = require('../gallery/gallery.controller');

const getJobs = async(req, res) => {
    try {
        const jobs = await jobService.query(req.query);
        res.json(jobs);
    } catch (e) {
        console.error(e);
    }
}

const addJob = async(req, res) => {
    let subject = req.body.subject;
    let seconds = req.body.seconds;
    try {
        const gif = await fetchUrlsData(subject);
        const job = { subject: subject, seconds: seconds, gif: gif };
        await jobService.add(job);
        res.send(job);
        schedulerService.addJob(seconds, job._id, job.gif, subject);  
    } catch (e) {
        console.error(e);
    }
}

const deleteJob = async(req, res) => {
    try {
        schedulerService.cancelJob(req.params.id);
        await jobService.remove(req.params.id);
        res.end();
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    getJobs,
    addJob,
    deleteJob
}