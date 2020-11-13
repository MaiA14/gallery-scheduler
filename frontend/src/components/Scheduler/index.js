import React, { useState, useEffect, useRef } from "react";
import schedulerService from '../../services/schedulerService';
import SocketService from "../../services/socketService";
import Masonry from '../Masonry';
import { Photo, Close } from './styles';
import swal from 'sweetalert';

const Scheduler = () => {

    const [sub, setSubject] = useState("");
    const [seconds, setSeconds] = useState("");
    const [photos, setPhotos] = useState([]);
    const initialRender = useRef(true);

    useEffect(() => {
      if (initialRender.current) {
        initialRender.current = false;
      } else {
        localStorage.setItem('photos', JSON.stringify(photos));
      }
    }, [photos]);

    useEffect(() => {
        SocketService.setup();
        SocketService.emit("join gallery", 'photo');
        SocketService.on("add photo", (photo) => {
          setPhotos(photos => [...photos, JSON.parse(photo)]);
        });
    }, [])

    useEffect(() => {
        const photosStorage = JSON.parse(localStorage.getItem('photos'));
        if (photosStorage) {
            setPhotos(photosStorage);
        }
    }, []);

    const onJobAdd = async(e) => {
        e.preventDefault();
            if (isNaN(seconds) || seconds === '') {
              swal(`Please enter a valid input in seconds`);
            } else {
                try {
                  const job = { subject: sub, seconds: seconds };
                  await schedulerService.addJob(job);
                  swal(`Job is added:\n Subject: ${sub}\n Seconds: ${seconds}`);
                  setSubject('');
                  setSeconds('');
                } catch (e) {
                  console.error(e);
              }
            }
          };

    const onCancelJob = async (photo) => {
        try {
            const jobId = photo.target.dataset.id
            setPhotos([...photos.filter((photo) => photo.id !== jobId)]);
            schedulerService.deleteJob(jobId)
        } catch (e) {
            console.error(e);
        }
    };

    const Photos = () => (
        <Masonry>
          {photos.map((imgData, index) => (
            <Photo style={{  width: `${(imgData.image.width / 2) + 26}px`,
            height: `${(imgData.image.height / 2) + 26}px`,}}>
              <Close onClick={onCancelJob} data-id={imgData.id}>x</Close>
              <img style={{
                width: `${imgData.image.width / 2}px`,
                height: `${imgData.image.height / 2}px`,
                margin: '16px',
                border: '1px solid lightgray',
                borderRadius: '8px' }}
                key={imgData.id + index} alt='' src={imgData.image.url} />
            </Photo>
          ))}
        </Masonry>
      )
    
      return (
        <React.Fragment>
          <div className="header">Gallery scheduler</div>
          <div className="container">
            <div className="app-desc">Schedule gifs by entering subject and seconds</div>
            </div>
            <form>
              <div className="inputs-wrapper">
                <input type="text" placeholder="subject" name="sub" className="form-input"
                onChange={e => setSubject(e.target.value)} value={sub}></input>
                <input type="text" placeholder="seconds" autoComplete="off" 
                name="seconds" className="form-input"
                onChange={e => setSeconds(e.target.value)} value={seconds}></input>
                <button className="app-button" onClick={onJobAdd}>Add a job</button>
              </div>
            </form>
            <Photos/>
          </React.Fragment>
        );
      };

export default Scheduler;