import  Firebase  from "firebase";

type TimeStamp = Firebase.firestore.Timestamp;

export interface ISale{
    id?: string;
    status: string;
    companyId: string;
    responsibleId: string;
    expectedDate: TimeStamp;
    products: string[];
    createdAt: TimeStamp;
    createdBy: string;
    closingDate: string;
    expectedIncome: string;
    closingIncome: string;
    concerns: string;
    closingReason: string;
    customerType: string; //once only or returner 
    info: string;
    comeFrom: string; //advertisement, from other customer
}