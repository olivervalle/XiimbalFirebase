import BusinessDetails from "../components/business/BusinessDetails";
import { ErrorBoundary } from "../components/ui/error-boundary";

export default function BusinessDetailsPage() {
  return (
    <ErrorBoundary>
      <BusinessDetails />
    </ErrorBoundary>
  );
}
