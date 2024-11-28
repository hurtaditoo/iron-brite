import { useEffect, useState } from "react";
import EventItem from "../event-item/event-item";
import eventsData from "../../../data/events.json";

function EventList({ className = '', city, max }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log("RELOADING...");
    const filteredEvents = city ? 
      eventsData.filter((event) => event.city === city) : 
      eventsData;
    const tackedEvents = max != undefined ?
      filteredEvents.slice(0, max) :
      filteredEvents;
    setEvents(tackedEvents);
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