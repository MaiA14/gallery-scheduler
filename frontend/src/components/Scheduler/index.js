import React, { useState, useEffect, useRef } from "react";
import schedulerService from '../../services/schedulerService';
import SocketService from "../../services/socketService";
import Masonry from '../Masonry';
import { Photo, Close } from './styles';
import swal from 'sweetalert';

const Scheduler = () => {
    let [sub, setSubject] = useState("");
    let [seconds, setSeconds] = useState("");
    let [email, setEmail] = useState("");
    let [numOfGifs, setNumOfGifs] = useState("");
    let [favSubjeces, setfavSubjects] = useState([]);
    const [photos, setPhotos] = useState([]);
    const initialRender = useRef(true);
    const invalidImgs = useRef({});

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
        sub = sub.replace(/\s/g, '');
        seconds = seconds.replace(/\s/g, '');
            if (isNaN(seconds) || !seconds || !sub || !email) {
              swal(`Please enter a valid input`);
            }
             else {
                try {
                  numOfGifs = numOfGifs === '' ? null : numOfGifs;
                  const job = { subject: sub, seconds, email, numOfGifs };
                  const jobData = await schedulerService.addJob(job);
                  setfavSubjects(jobData.userSubjects);
                  setSubject('');
                  setSeconds('');
                  setEmail('');
                  setNumOfGifs('');
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

    const hasImageData = (img) => {
      if (img && img.image && img.image.width)
        return img;
      else {
        if (invalidImgs.current[img.id] === undefined) {
          invalidImgs.current[img.id] = true;
        }
      }
    }

    const Photos = () => (
        <Masonry>
          {photos.map((imgData, index) => (
            hasImageData(imgData) && 
            <Photo style={{  width: `${(imgData.image.width  / 2) + 26}px`,
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
                <input type="text" placeholder="subject"
                  name="sub" className="form-input"
                  onChange={e => setSubject(e.target.value)} value={sub}/>
                <input type="text" placeholder="seconds" autoComplete="off" 
                  name="seconds" className="form-input"
                  onChange={e => setSeconds(e.target.value)} value={seconds}/>
                <input type="email" placeholder="email" autoComplete="off" 
                  name="email" className="form-input"
                  onChange={e => setEmail(e.target.value)} value={email}/>
                <input type="number" placeholder="number of gifs per job" autoComplete="off" 
                  name="numOfGifs" className="form-input"
                  onChange={e => setNumOfGifs(e.target.value)} value={numOfGifs}/>
                <button className="app-button" onClick={onJobAdd}>Add a job</button>
              </div>
            </form>
            {/* {invalidImgs.length > 0 && <div>No results for this Subjects</div>} */}
            {favSubjeces.length !== 0 && <div className="user-subject-container">
              <h3>User Subjects:</h3>
              {favSubjeces.map((subject) =>
            <div className="subject">{subject}</div>)}
            </div>}
            <Photos/>
          </React.Fragment>
        );
      };

export default Scheduler;