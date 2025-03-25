// src/components/SimpleCalendar.js
import React, { useState } from 'react';
import './SimpleCalendar.css';

// Constants for static data
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const SimpleCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the current month, year, and today's date
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const today = new Date();

  // Calculate the number of days in the current month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Calculate the day of the week for the 1st of the month
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Check if a given day is today
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // Check if a given day is a weekend
  const isWeekend = (day) => {
    const dayOfWeek = new Date(year, month, day).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  };

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Render the calendar days
  const renderDays = () => {
    const days = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const daysArray = [];

    // Add empty slots for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(
        <div
          key={`empty-${i}`}
          className="calendar-day empty"
          aria-hidden="true"
        ></div>
      );
    }

    // Add the days of the month
    for (let day = 1; day <= days; day++) {
      const isTodayClass = isToday(day) ? 'today' : '';
      const isWeekendClass = isWeekend(day) ? 'weekend' : '';
      daysArray.push(
        <div
          key={day}
          className={`calendar-day ${isTodayClass} ${isWeekendClass}`}
          role="button"
          tabIndex={0}
          onClick={() => console.log(`Clicked on ${day} ${MONTH_NAMES[month]} ${year}`)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              console.log(`Clicked on ${day} ${MONTH_NAMES[month]} ${year}`);
            }
          }}
          aria-label={`${day} ${MONTH_NAMES[month]} ${year}${isToday(day) ? ', Today' : ''}`}
        >
          {day}
        </div>
      );
    }

    return daysArray;
  };

  return (
    <div className="simple-calendar">
      <div className="calendar-header">
        <button
          onClick={handlePrevMonth}
          aria-label={`Go to previous month, ${MONTH_NAMES[month === 0 ? 11 : month - 1]} ${month === 0 ? year - 1 : year}`}
        >
          ←
        </button>
        <span>{`${MONTH_NAMES[month]} ${year}`}</span>
        <button
          onClick={handleNextMonth}
          aria-label={`Go to next month, ${MONTH_NAMES[month === 11 ? 0 : month + 1]} ${month === 11 ? year + 1 : year}`}
        >
          →
        </button>
      </div>
      <div className="calendar-grid">
        {DAY_NAMES.map((dayName, index) => (
          <div
            key={`day-name-${index}`}
            className="calendar-day-name"
            aria-hidden="true"
          >
            {dayName}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default SimpleCalendar;