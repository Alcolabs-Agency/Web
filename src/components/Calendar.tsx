import Image from 'next/image';

const Calendar = () => {
  return (
    <section className="relative w-full h-[579px] flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/BgCalendar.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="opacity-100"
        />
      </div>

      <div className="relative z-10 w-full mx-auto flex justify-end items-start">
        <div className="bg-white rounded-lg shadow-lg p-8 w-2/3">
          <iframe
            src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2ikaQl6EbM5OcLjvW5ma-2mF8aJVXk4N7avO1VkHrthgNkpvSotxHtEahBXxrVjQxzAegLvx_C?gv=true"
            style={{ border: 0 }}
            width="100%"
            height="393"
            frameBorder="0"
            scrolling="yes"
            title="Google Calendar Scheduling"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Calendar;
