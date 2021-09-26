import { Timestamp } from "rxjs";

export interface IComment{
    id?: string;
    text: string;
    createdBy: string;
    createdAt: Timestamp<number>;
}