import { useEffect, useState } from "react";
import * as IronBriteApi from '../../../services/api-service';

function EventDetail({ id }) {
  const [event, setEvent] = useState();

  useEffect(() => {
    IronBriteApi.getEvent(id)
      .then((event) => setEvent(event))
      .catch((error) => console.error(error));
  }, [id]);


  if (!event) {
    return null;
  } else {
    return (
      <>{event.title}</>
    )
  }
}

export default EventDetail;