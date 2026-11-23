/**
 * Attendance & Live Punch Service
 * Manages daily clock-in/out, live digital timer, simulated geofence verification,
 * and monthly calendar records.
 */

export function getAttendanceStats() {
  return {
    todayStatus: 'Present',
    clockInTime: '09:02 AM',
    clockOutTime: null,
    totalWorkSeconds: 5 * 3600 + 42 * 60 + 18, // 05h 42m 18s
    attendanceRate: 98.4,
    daysPresent: 21,
    daysAbsent: 0,
    halfDays: 1,
    officeLocation: 'San Francisco HQ (Verified Geofence)'
  };
}

export function getMonthlyHeatmap() {
  // Returns last 30 days status
  const days = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday

    let status = 'present';
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      status = 'weekend';
    } else if (i === 12) {
      status = 'leave';
    } else if (i === 5) {
      status = 'halfday';
    } else if (i === 20) {
      status = 'holiday';
    }

    days.push({
      date: d.toISOString().split('T')[0],
      day: d.getDate(),
      status
    });
  }

  return days;
}

export function getWhoIsInToday() {
  return [
    { name: 'Sarah Chen', role: 'Design Lead', inAt: '08:55 AM', status: 'In Office', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { name: 'Marcus Vance', role: 'Frontend Engineer', inAt: '09:12 AM', status: 'Remote', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { name: 'Elena Rostova', role: 'VP Engineering', inAt: '08:30 AM', status: 'In Office', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
    { name: 'David Kim', role: 'Engineering Manager', inAt: '09:00 AM', status: 'In Office', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
    { name: 'Jessica Taylor', role: 'Head of People', inAt: '09:15 AM', status: 'In Office', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' },
    { name: 'Arjun Mehta', role: 'DevOps Lead', inAt: '01:50 PM', status: 'Remote', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' }
  ];
}

export default {
  getAttendanceStats,
  getMonthlyHeatmap,
  getWhoIsInToday
};
