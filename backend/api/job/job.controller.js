const jobService = require('./job.service');
const schedulerService = require('../scheduler/scheduler.service');
const { getRndGif } = require('../gallery/gallery.controller');

const getJobs = async(req, res) => {
    try {
        const jobs = await jobService.query(req.query);
        res.json(jobs);
    } catch (e) {
        console.error(e);
    }
}

const fetchUserSubjects = async (email) => {
    try {
        const user = await jobService.getUserByEmail(email);
        const userSubjects = user.map(user => user.subject);
        const occurences = await jobService.getUserSubsOccourences(userSubjects);
        return occurences;
    }
    catch(e) {
        console.error(e);
    }
}

const addJob = async (req, res) => {
    let subject = req.body.subject;
    let seconds = req.body.seconds;
    let email = req.body.email;
    try {
        const gif = await getRndGif(subject);
        const job = { subject: subject, seconds: seconds, email: email, gif: gif };
        await jobService.add(job);
        const userSubjects = await fetchUserSubjects(email);
        res.send({userSubjects, job});
        schedulerService.addJob(seconds, job._id, job.gif);
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