import  Firebase  from "firebase";
type TimeStamp = Firebase.firestore.Timestamp;

export interface ITask{
    id?: string;
    salesId: string;
    responsibleId: string;
    title: string;
    createdAt: TimeStamp;
    createdBy: string;
    dueTo: TimeStamp;
    companyId: string;
    saleStatus: string;
    description: string;
}