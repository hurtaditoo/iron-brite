import { useParams } from "react-router-dom";
import { PageLayout } from "../components/layouts";
import { EventDetail } from "../components/events";

function EventDetailPage() {
  const { id } = useParams();

  return (
    <PageLayout title={<h1>HOLI</h1>}>
      <EventDetail id={id} />
    </PageLayout>
  )
}

export default EventDetailPage;