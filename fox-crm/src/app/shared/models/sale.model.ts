import  Firebase  from "firebase";

type TimeStamp = Firebase.firestore.Timestamp;

export interface ISale{
    id?: string;
    saleId: string;
    status: string; //
    companyId: string; //
    responsibleId: string; //
    expectedDate: TimeStamp; //
    products: string[]; //
    createdAt: TimeStamp;   //
    createdBy: string;      //
    closingDate: TimeStamp 
    expectedIncome: number;  //
    closingIncome: number;
    concerns: string;       //
    closingReason: string;
    customerType: string; //once only or returner 
    surveyInfo: string;     //
    progressInfo: string;   //
    comeFrom: string; //advertisement, from other customer
}