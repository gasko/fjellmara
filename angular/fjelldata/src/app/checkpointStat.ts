import { Runner } from './runner';
import { Passing } from './passing';

export class CheckpointStat {
  tot_runners: number;
  fastest_runners_m: Runner[];
  fastest_runners_f: Runner[];
  fastest_time: string;
  fastest_time_sec: number;
  slowest_time: string;
  slowest_time_sec: number;
  stddev: string;
  stddev_sec: number;
  avg_time: string;
  avg_time_sec: number;
  numberofraces: number;
  years: number[];
  passings:Passing[];
}
