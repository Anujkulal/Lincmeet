"use client";

import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { toast } from "sonner";

type CallType = "ended" | "upcoming" | "recordings";

interface CallListProps {
  type: CallType;
}

export const getMeetingDate = (meeting: Call | CallRecording): string => {
    // console.log("meeting date:::", meeting);
    if ('state' in meeting) {
      // It's a Call
      return meeting.state?.startsAt?.toLocaleString() || "No date available";
    } else {
      // It's a CallRecording
      return meeting.start_time?.toLocaleString() || "No date available";
    }
  };

const CallList: React.FC<CallListProps> = ({ type }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState(false);
  const router = useRouter();

  // Memoized calls getter
  const calls = useMemo(() => {
    switch (type) {
      case "ended":
        return endedCalls || [];
      case "recordings":
        return recordings;
      case "upcoming":
        return upcomingCalls || [];
      default:
        return [];
    }
  }, [type, endedCalls, upcomingCalls, recordings]);

  // Memoized no calls message
  const noCallsMessage = useMemo(() => {
    const messages = {
      ended: "No previous calls found",
      recordings: "No recordings found",
      upcoming: "No upcoming calls found"
    };
    return messages[type] || '';
  }, [type]);

  // Fetch recordings with better error handling
  const fetchRecordings = useCallback(async () => {
    if (type !== "recordings" || !callRecordings?.length) return;

    setIsLoadingRecordings(true);
    try {
      const callData = await Promise.all(
        callRecordings.map((meeting) => meeting.queryRecordings())
      );
      
      const validRecordings = callData
        .filter(call => call.recordings?.length > 0)
        .flatMap(call => call.recordings);
      
      setRecordings(validRecordings);
    } catch (error) {
      console.error("Error fetching recordings:", error);
      toast.error("Failed to load recordings. Please try again later.");
      setRecordings([]);
    } finally {
      setIsLoadingRecordings(false);
    }
  }, [type, callRecordings]);

  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  // Helper functions for meeting data
  const getMeetingTitle = (meeting: Call | CallRecording): string => {
    if ('state' in meeting) {
      // It's a Call
      return meeting.state?.custom?.description?.substring(0, 26) || "Personal Meeting";
    } else {
      // It's a CallRecording
      return meeting.filename?.substring(0, 20) || "Recording";
    }
  };

  

  const getMeetingKey = (meeting: Call | CallRecording): string => {
    if ('id' in meeting) {
      return meeting.id;
    } else {
      return meeting.filename || `recording-${Date.now()}`;
    }
  };

  // Handle meeting click
  const handleMeetingClick = useCallback((meeting: Call | CallRecording) => {
    if (type === "recordings") {
      const recordingUrl = (meeting as CallRecording).url;
      if (recordingUrl) {
        router.push(recordingUrl);
      } else {
        toast.error("Recording URL not available");
      }
    } else {
      const meetingId = (meeting as Call).id;
      if (meetingId) {
        router.push(`/meeting/${meetingId}`);
      } else {
        toast.error("Meeting ID not available");
      }
    }
  }, [type, router]);

  // Generate meeting link
  const getMeetingLink = (meeting: Call | CallRecording): string => {
    if (type === 'recordings') {
      return (meeting as CallRecording).url || '';
    } else {
      const meetingId = (meeting as Call).id;
      return meetingId ? `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}` : '';
    }
  };

  // Show loading state
  // return should only be called at the lower level of the component to avoid early returns error "Error: Rendered fewer hooks than expected"
  if (isLoading || isLoadingRecordings) { 
    return <Loader />;
  }

  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={getMeetingKey(meeting)}
            icon={
              type === 'ended' 
                ? '/icons/previous.svg' 
                : type === 'upcoming' 
                  ? '/icons/upcoming.svg' 
                  : '/icons/recordings.svg'
            }
            title={getMeetingTitle(meeting)}
            date={getMeetingDate(meeting)}
            isPreviousMeeting={type === 'ended'}
            buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
            buttonText={type === 'recordings' ? "Play" : "Start"}
            handleClick={() => handleMeetingClick(meeting)}
            link={getMeetingLink(meeting)}
          />
        ))
      ) : (
        <div className="col-span-full flex items-center justify-center py-12">
          <h1 className='text-2xl font-bold text-white text-center'>
            {noCallsMessage}
          </h1>
        </div>
      )}
    </div>
  );
};

export default CallList;
