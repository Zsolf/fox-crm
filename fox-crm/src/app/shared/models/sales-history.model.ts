import  Firebase  from "firebase";

type TimeStamp = Firebase.firestore.Timestamp;

export interface IHistory{
    id?: string;
    createdAt: TimeStamp;
    createdBy: string;
    name: string;
    salesId: string;
    description: {dataName: string, oldData: string, newData: string}[];
}
