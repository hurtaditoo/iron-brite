import { useLocation } from "react-router-dom";
import { EventList } from "../components/events";
import { PageLayout } from "../components/layouts";

function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get('city');
  const max = queryParams.get('max');
  console.log(max);

  return (
    <PageLayout>
      <h3 className="fw-light">What's on in {city}</h3>
      <EventList city={city} max={max} />
    </PageLayout>
  )
}

export default SearchPage;