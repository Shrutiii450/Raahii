// Monitoring Service Abstraction
// Connects to demo/simulated state while providing an extensible API layer for real backend integration.

class MonitoringService {
  constructor() {
    this.lastChecked = new Date();
    this.isChecking = false;
  }

  getLastCheckedSecondsAgo(fromTime = this.lastChecked) {
    const diffMins = Math.floor((new Date() - fromTime) / 1000);
    return Math.max(0, diffMins);
  }

  async refresh() {
    this.isChecking = true;
    await new Promise((resolve) => setTimeout(resolve, 900));
    this.lastChecked = new Date();
    this.isChecking = false;
    return {
      success: true,
      timestamp: this.lastChecked,
      status: 'JOURNEY UPDATED',
    };
  }

  getInitialActivityFeed(bookings = []) {
    const now = new Date();
    const formatAgo = (minutesAgo) => {
      const d = new Date(now.getTime() - minutesAgo * 60000);
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    };

    const flight = bookings.find((b) => b.type === 'flight');
    const hotel = bookings.find((b) => b.type === 'hotel');

    return [
      {
        id: 1,
        time: formatAgo(3),
        text: `${flight ? flight.name : 'Flight AI-204'} checked`,
        detail: 'Flight status confirmed on schedule · Terminal T3',
        status: 'ok',
      },
      {
        id: 2,
        time: formatAgo(14),
        text: 'Weather conditions evaluated',
        detail: 'Clear skies along Delhi → Jaipur corridor',
        status: 'simulated',
      },
      {
        id: 3,
        time: formatAgo(28),
        text: `${hotel ? hotel.name : 'Hotel Oberoi'} reservation verified`,
        detail: 'Standard check-in window 15:00 confirmed',
        status: 'ok',
      },
      {
        id: 4,
        time: formatAgo(45),
        text: 'Connection dependency analyzed',
        detail: 'Airport exit buffer: 30 mins (Tight buffer flagged)',
        status: 'warn',
      },
    ];
  }
}

export const monitoringService = new MonitoringService();
