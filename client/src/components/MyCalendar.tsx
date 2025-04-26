import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, stringOrDate } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import "../index.css"; // Add your theme styles if needed

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

const MyCalendar: React.FC = () => {
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("User not logged in");

      const response = await axios.get("https://second-brain-backend-tdy4.onrender.com/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      interface ApiEvent {
        _id: string;
        title: string;
        start: string;
        end: string;
      }

      const formattedEvents: Event[] = response.data.map((event: ApiEvent) => ({
        id: event._id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const addEvent = async (newEvent: { title: string; start: Date; end: Date }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("User not logged in");

      const response = await axios.post("https://second-brain-backend-tdy4.onrender.com/events", newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents([...events, { ...newEvent, id: response.data._id }]);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("User not logged in");

      await axios.delete(`https://second-brain-backend-tdy4.onrender.com/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleSelectSlot = ({
    start,
    end,
  }: {
    start: stringOrDate;
    end: stringOrDate;
    slots: (Date | string)[];
    action: "select" | "click" | "doubleClick";
  }) => {
    const title = window.prompt("Enter a title for the event:");
    if (title) {
      addEvent({
        title,
        start: new Date(start as string | Date),
        end: new Date(end as string | Date),
      });
    }
  };

  const handleSelectEvent = (event: Event) => {
    const confirmDelete = window.confirm(`Delete event "${event.title}"?`);
    if (confirmDelete) deleteEvent(event.id);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white px-4 sm:px-6 md:px-12 lg:px-24 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        User Schedule Manager
      </h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div style={{ height: "80vh" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            views={["month", "week", "day"]}
            popup
            className="custom-calendar"
          />
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;

