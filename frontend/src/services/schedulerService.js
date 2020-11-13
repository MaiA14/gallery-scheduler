import HttpService from './httpService.js'

const query = () => {
  return HttpService.get('job');
}

const addJob = (job) => {
    return HttpService.post(`job/`, job);
}

const deleteJob = (jobId) => {
    return HttpService.delete(`job/${jobId}`).then(res => res.data);
}

export default {
  query,
  addJob,
  deleteJob,
}