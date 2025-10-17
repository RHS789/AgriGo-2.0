import WeatherCard from '../components/dashboard/WeatherCard.jsx';
import CropHealthChart from '../components/dashboard/CropHealthChart.jsx';
import ResourceStats from '../components/dashboard/ResourceStats.jsx';
import ActivityTimeline from '../components/dashboard/ActivityTimeline.jsx';
import MarketTrends from '../components/dashboard/MarketTrends.jsx';
import CommunityTips from '../components/dashboard/CommunityTips.jsx';
import DashboardTopBar from '../components/dashboard/DashboardTopBar.jsx';
import DashboardFooter from '../components/dashboard/DashboardFooter.jsx';

export default function Dashboard() {
  return (
    <main className="page space-y-6">
      <DashboardTopBar />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <WeatherCard />
          <CropHealthChart />
          <MarketTrends />
        </div>
        <div className="space-y-6">
          <ResourceStats />
          <ActivityTimeline />
          <CommunityTips />
        </div>
      </div>
      <DashboardFooter />
    </main>
  );
}
