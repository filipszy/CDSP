import {Status} from './status.enum';

export interface Request {
  Id: number;
  RequestName: string;
  Requestor: number;
  GoodEnding: string;
  Description: string;
  NeedStoryteller: boolean;
  Storyteller: number;
  WantedCharacters: string;
  Deadline: string;
  Budget: number;
  Status: Status;
}
