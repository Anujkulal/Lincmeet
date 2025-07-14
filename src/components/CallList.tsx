"use client";

import { useGetCalls } from '@/hooks/useGetCalls';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { toast } from 'sonner';

const CallList = ({type}: {type: 'ended' | 'upcoming' | 'recordings'}) => {
    const {endedCalls, upcomingCalls, callRecordings, isLoading} = useGetCalls();
    const [recordings, setRecordings] = useState<CallRecording[]>([])

    const router = useRouter();

    const getCalls = () => {
        switch(type){
            case "ended":
                return endedCalls;
            case "recordings":
                return recordings;
            case "upcoming":
                return upcomingCalls;
            default:
                return [];
        }
    }

    const getNoCallsMessage = () => {
        switch(type){
            case "ended":
                return "No previous calls found";
            case "recordings":
                return "No recordings found";
            case "upcoming":
                return "No upcoming calls found";
            default:
                return '';
        }
    }

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const callData = await Promise.all(callRecordings.map((meeting) => meeting.queryRecordings()));
                const recordings = callData.filter(call => call.recordings.length > 0).flatMap(call => call.recordings);
                setRecordings(recordings); 
            } catch (error) {
                toast.error(`Try again later: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }

        }
        if(type === "recordings") fetchRecordings();
    }, [type, callRecordings])

    const calls = getCalls();
    // console.log(calls);
    const noCallsMessage = getNoCallsMessage();

    if(isLoading) return <Loader />

    // Helper functions for meeting data
    const getMeetingTitle = (meeting: Call | CallRecording): string => {
        if("state" in meeting){
            return meeting.state?.custom?.description?.substring(0, 26) || "Personal Meeting";
        }
        else return meeting.filename?.substring(0, 20) || "Recording";
    }

    const getMeetingDate = (meeting: Call | CallRecording): string => {
        if("state" in  meeting) { 
            return meeting.state?.startedAt?.toLocaleString() || "No Date available";
        }
        else return meeting.start_time?.toLocaleString() || "No Date available";
    }

    const getMeetingKey = (meeting: Call | CallRecording): string => {
        if("id" in meeting) {
            return meeting.id;
        }
         else return meeting.filename || `recording-${Date.now()}`;
    }

    // const handleMeetingClick = useCallback(() => {
    //     if(type === "recordings"){
    //         const recordingUrl = 
    //     }
    // }, [type, router]);

  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
        {calls && calls.length > 0 ? (
                calls.map((meeting: Call | CallRecording) => (
                    <MeetingCard
                    key={getMeetingKey(meeting)}
                    icon={
                        type === 'ended' ? '/icons/previous.svg' : type==='upcoming' ? '/icons/upcoming.svg' : '/icons/recordings.svg'
                    }
                    title={getMeetingTitle(meeting)}
                    date={getMeetingDate(meeting)}
                    isPreviousMeeting={type === 'ended'}
                    buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                    buttonText = {type === 'recordings' ? "Play" : "Start"}
                    handleClick = {type==="recordings" ? () => router.push(`${(meeting as CallRecording).url}`) : () => router.push(`/meeting/${(meeting as Call).id}`)}
                    link={type === 'recordings' ? (meeting as CallRecording).url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`}
                    />
                ))
            ) : (
                <h1 className='text-2xl font-bold text-white'>{noCallsMessage}</h1>
            )
        }
    </div>
  )
}

export default CallList;