import  Firebase  from "firebase";

type TimeStamp = Firebase.firestore.Timestamp;

export interface IComment{
    id?: string;
    text: string;
    createdBy: string;
    createdAt: TimeStamp;
}