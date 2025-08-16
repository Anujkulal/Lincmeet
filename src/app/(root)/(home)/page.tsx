"use client"

import MeetingTypeList from '@/components/MeetingTypeList';
import React from 'react'
import { getMeetingDate } from '@/components/CallList';
import { useGetCalls } from '@/hooks/useGetCalls';

const Home = () => {
  const { upcomingCalls } = useGetCalls();

  // Get the first upcoming meeting (if any)
  const nextMeeting = upcomingCalls && upcomingCalls.length > 0 ? upcomingCalls[0] : null;
  const nextMeetingDate = nextMeeting ? getMeetingDate(nextMeeting) : "No upcoming meeting";

  // console.log("nextmeeting:::", nextMeetingDate)

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = (new Intl.DateTimeFormat('en-US', { dateStyle: "full" })).format(now);
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className="h-[300px] w-full flex flex-col bg-cover rounded-[20px]" style={{backgroundImage: "url('/images/hero-background.png')"}}>
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className='glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal' >Upcoming meeting at: {nextMeetingDate}</h2>
          <div className="flex flex-col gap-2">
            <h1 className='text-4xl font-extrabold lg:text-7xl'>
              {time}
            </h1>
            <p className='text-lg font-medium text-sky-200 lg:text-2xl'> {date} </p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  )
}

export default Home