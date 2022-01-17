import React, { useEffect, useState } from 'react';
import cron from 'cron';
import axios from 'axios';
import './App.css';
import {IndexerStatus} from './types';
import Card from 'react-bootstrap/Card';
import { ProgressBar } from 'react-bootstrap';

const DATA_FEED = process.env.DATA_FEED || 'http://localhost:8080/statuses'

const App = () => {

  const [statuses, setStatuses] = useState([] as IndexerStatus[]);

  const [job] = useState(new cron.CronJob("0/30 * * * * *", async ()=>{
    console.log(":task:");
    const statuses: IndexerStatus[] = await (await axios.get(DATA_FEED)).data;
    setStatuses(statuses);
  }));

  useEffect(() => {
    job.start();
  }, []);

  return (
    <div className="App d-flex align-content-stretch flex-wrap">
    {statuses.map((status, idx) => (
      <div className='p-2' key={idx}>
        <Card
          bg={status.inSync ? 'success': 'warning'}
          key={idx}
          text={'dark'}
          style={{ width: '18rem' }}
          className="mb-2"
        >
          <Card.Header>{status.network}</Card.Header>
          <Card.Body>
            <Card.Title>{status.inSync ? 'Synced': 'Sync in progress'}</Card.Title>
            <Card.Text>
              {status.lastComplete} / {status.chainHeight}
            </Card.Text>
            <ProgressBar variant="info" animated={!status.inSync} now={progressPct(status)} label={`${progressPct(status).toFixed(2)}%`}/>
          </Card.Body>
        </Card>
      </div>
    ))}
    </div>
  );
}

const progressPct = (status: IndexerStatus): number => {
  const pct =  100 * status.lastComplete / status.chainHeight;
  return Math.floor(pct * 100) / 100;
}

export default App;
