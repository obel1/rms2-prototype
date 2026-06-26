import { PageHeader, Card } from "../components/ui";

export default function Placeholder({ title, screenNumber }) {
  return (
    <div>
      <PageHeader title={title} subtitle="Coming next in the prototype build" />
      <div className="px-8 pb-8">
        <Card className="px-6 py-10 text-center">
          <div className="text-xs uppercase tracking-wider text-brand-600 font-semibold">
            Screen {screenNumber}
          </div>
          <div className="mt-2 text-lg font-medium text-navy-900">
            {title} — pending review of Screen 1
          </div>
          <div className="mt-2 text-sm text-navy-500 max-w-md mx-auto">
            This route is reserved. Tell Claude to proceed past the Dashboard
            review and this screen will be built out next.
          </div>
        </Card>
      </div>
    </div>
  );
}
