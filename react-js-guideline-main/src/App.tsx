import AppRoutes from './app/routes/AppRoutes';
import AppLayout from './shared/layouts/AppLayout';

export default function App(): JSX.Element {
  return (
    <AppLayout>
      <div className="app-content">

        <AppRoutes />
      </div>
    </AppLayout>
  );
}
