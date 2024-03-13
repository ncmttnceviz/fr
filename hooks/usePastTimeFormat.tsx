import { DateTime, DurationLikeObject, Interval } from "luxon";
import { useEffect, useMemo } from "react";

const times = [
  { title: "yıl", time: "years" },
  { title: "ay", time: "months" },
  { title: "hafta", time: "weeks" },
  { title: "gün", time: "days" },
  { title: "saat", time: "hours" },
  { title: "dakika", time: "minutes" },
];
export default function usePastTimeFormat(time: string, changeProp: any) {
  const created_at = DateTime.fromISO(time);
  return useMemo(() => {
    const now = DateTime.now();
    const diff = Interval.fromDateTimes(created_at, now);
    const minimum = diff.length(times.slice(-1)[0].time as keyof DurationLikeObject);
    if(minimum >= 1) {
      for (let i = 0; i < times.length; i++) {
        const time = times[i];
        const len = diff.length(time.time as keyof DurationLikeObject);
        if (len >= 1) {
          return `${Math.floor(len)} ${time.title} önce`;
        }
      }
    }
    return "az önce";
  }, [changeProp]);
}
