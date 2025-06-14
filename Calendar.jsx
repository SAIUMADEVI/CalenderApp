import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './Calendar.css';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs('2025-06-01'));
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample events data
  useEffect(() => {
    setEvents([
      {
        id: 1,
        title: "Team Meeting",
        date: "2025-06-15",
        startTime: "09:00",
        endTime: "10:30",
        color: "#6366f1"
      },
      {
        id: 2,
        title: "Client Review",
        date: "2025-06-18",
        startTime: "14:00",
        endTime: "15:30",
        color: "#10b981"
      }
    ]);
  }, []);

  const renderHeader = () => (
    <div className="calendar-header">
      <button onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))} className="nav-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h2>{currentMonth.format('MMMM YYYY')}</h2>
      <button onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))} className="nav-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );

  const renderDays = () => {
    const monthStart = currentMonth.startOf('month');
    const startDay = monthStart.day();
    const daysInMonth = currentMonth.daysInMonth();
    
    const days = [];
    
    // Previous month days
    for (let i = 0; i < startDay; i++) {
      days.push(
        <div key={`prev-${i}`} className="calendar-day other-month">
          {monthStart.subtract(startDay - i, 'day').date()}
        </div>
      );
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = currentMonth.date(i).format('YYYY-MM-DD');
      const dayEvents = events.filter(e => e.date === date);
      const isToday = currentMonth.date(i).isSame(dayjs(), 'day');
      const isWeekend = [0, 6].includes(currentMonth.date(i).day());

      days.push(
        <div 
          key={`day-${i}`} 
          className={`calendar-day ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''}`}
          onClick={() => {
            setSelectedDate(date);
            setIsModalOpen(true);
          }}
        >
          <div className="day-number">{i}</div>
          <div className="events-container">
            {dayEvents.map(event => (
              <div 
                key={event.id}
                className="calendar-event"
                style={{ 
                  backgroundColor: event.color,
                  borderLeft: `3px solid ${darkenColor(event.color, 20)}`
                }}
              >
                <span className="event-time">{event.startTime}</span>
                <span className="event-title">{event.title}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Next month days
    const totalDaysToShow = 42; // 6 weeks
    const nextMonthDays = totalDaysToShow - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push(
        <div key={`next-${i}`} className="calendar-day other-month">
          {i}
        </div>
      );
    }
    
    return days;
  };

  const darkenColor = (color, percent) => {
    // Simple color darkening function
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1)}`;
  };

  const handleAddEvent = (newEvent) => {
    setEvents([...events, newEvent]);
    setIsModalOpen(false);
  };

  return (
    <div className="calendar-app">
      {renderHeader()}
      
      <div className="weekdays-row">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {renderDays()}
      </div>
      
      {isModalOpen && (
        <EventModal 
          date={selectedDate} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleAddEvent}
        />
      )}
    </div>
  );
};

const EventModal = ({ date, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState('#6366f6');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: Date.now(),
      title,
      date,
      startTime,
      endTime,
      color
    });
  };

  return (
    <div className="modal-overlay">
      <div className="event-modal">
        <div className="modal-header">
          <h3>Add Event - {dayjs(date).format('ddd, MMM D')}</h3>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event name"
              required
            />
          </div>
          <div className="time-pickers">
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(c => (
                <div
                  key={c}
                  className={`color-option ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary">Save Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Calendar;