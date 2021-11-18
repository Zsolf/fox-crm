import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IProduct } from 'src/app/shared/models/product.model';

@Component({
  selector: 'fcrm-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {product: IProduct}) { }

  product: IProduct;

  isDelete: boolean;
  isEdit: boolean;
  isDeleteCorrect: boolean;
  delete: string;
  editRemainingText: number;

  deleteForm = new FormGroup({ 
    code: new FormControl("")
  });

  editForm = new FormGroup({
    id: new FormControl(this.data.product.id),
    name: new FormControl(this.data.product.name,Validators.required),
    description: new FormControl(this.data.product.description, Validators.maxLength(500)),
    code: new FormControl(this.data.product.code,[Validators.required,Validators.maxLength(15)]),
    size: new FormControl(this.data.product.size),
    color: new FormControl(this.data.product.color,[Validators.required, Validators.maxLength(15)]),
    madeOf: new FormControl(this.data.product.madeOf, [Validators.required, Validators.maxLength(30)]),
    price: new FormControl(this.data.product.price, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(15),])
  });

  ngOnInit(): void {
    this.isDelete = false;
    this.isEdit = false;
    this.isDeleteCorrect = false;
    this.delete = "delete"
    this.product = this.data.product;
    this.valueChange();
  }

  resetDialog(){
    this.isDelete = false;
    this.isEdit = false;
  }

  ngDoCheck(){
   if(this.deleteForm.get("code").value.toUpperCase() == this.product.code.toUpperCase()){
      this.isDeleteCorrect = true;
   }else{
     this.isDeleteCorrect = false;
   }
  }

  valueChange(){
    this.editRemainingText = this.editForm.get("description").value.length
  }


}
