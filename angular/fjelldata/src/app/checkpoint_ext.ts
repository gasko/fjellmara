import { Time } from './time';
import { Position } from './position';

export class CheckpointExt {
  name: string;
  timepassed: Time;
  timeofday: string;
  cpOrder: number;
  position: Position;
}
