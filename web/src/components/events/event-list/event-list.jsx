import { useEffect, useState } from "react";
import EventItem from "../event-item/event-item";
import * as IronBriteApi from '../../../services/api-service';

function EventList({ className = '', city, max }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log(`RELOADING... ${{ city, max }}`);
    IronBriteApi.listEvents({ city, limit: max })
      .then((events) => setEvents(events))
      .catch((error) => console.error(error))
  }, [city, max]);

  const handleEventDeletion = (event) => {
    const filteredEvents = events.filter((e) => e.id !== event.id);
    setEvents(filteredEvents);
  }

  return (
    <div className={`d-flex flex-wrap gap-3 ${className}`}>
      {events.map((event) => (
        <EventItem key={event.id} event={event} onDelete={handleEventDeletion}/>
      ))} 
    </div>
  );
}

export default EventList;