import { useEffect, useState } from "react";
import EventItem from "../event-item/event-item";
import eventsData from "../../../data/events.json";

function EventList({ className = '' }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(eventsData);
  }, []);

  return (
    <div className={`d-flex ${className} flex-wrap gap-3`}>
      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))} 
    </div>
  );
}

export default EventList;