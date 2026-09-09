import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MyTrip from './pages/MyTrip';
import AddItinerary from './pages/AddItinerary';
import TravelAssistant from './pages/TravelAssistant';
import RiskMonitor from './pages/RiskMonitor';
import Disruptions from './pages/Disruptions';
import Dependencies from './pages/Dependencies';
import WhatIf from './pages/WhatIf';
import RecoveryPlans from './pages/RecoveryPlans';
import RecoveryMonitor from './pages/RecoveryMonitor';
import Profile from './pages/Profile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="my-trip" element={<MyTrip />} />
        <Route path="add" element={<AddItinerary />} />
        <Route path="assistant" element={<TravelAssistant />} />
        <Route path="risk" element={<RiskMonitor />} />
        <Route path="disruptions" element={<Disruptions />} />
        <Route path="dependencies" element={<Dependencies />} />
        <Route path="what-if" element={<WhatIf />} />
        <Route path="recovery" element={<RecoveryPlans />} />
        <Route path="recovery-monitor" element={<RecoveryMonitor />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
