import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { IProduct } from 'src/app/shared/models/product.model';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';

@Component({
  selector: 'fcrm-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {

  constructor(private fbService: FirebaseBaseService, public dialog: MatDialog) { }

  @ViewChild(MatSort) sort: MatSort;

  products: IProduct[];
  dataSource : MatTableDataSource<IProduct>
  emptyProduct: Array<any>;
  productForm;

  editActivated: boolean;
  added: boolean;
  formInvalid: boolean;

  displayedColumns: string[];


  ngOnInit(): void {
    this.productForm = (e) => new FormGroup({
      name: new FormControl(e.name,Validators.required),
      description: new FormControl(e.description, Validators.maxLength(500)),
      code: new FormControl(e.code,[Validators.required,Validators.maxLength(10)]),
      size: new FormControl(e.size),
      color: new FormControl(e.color,[Validators.required, Validators.maxLength(15)]),
      madeOf: new FormControl(e.madeOf, [Validators.required, Validators.maxLength(30)]),
      price: new FormControl(e.price, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(15),])
    });

    this.editActivated= false;
    this.products = []
    this.emptyProduct = [{
      currentData: {} as IProduct, 
      originalData: {} as IProduct, 
      editable: false, 
      validator: this.productForm({} as IProduct)}]
    this.getProducts()
    this.added = false; 
    this.formInvalid = true;
    this.displayedColumns = ['code','name','color','size','madeOf','price']
  }

  addProduct() {
    this.fbService.add("products",{
      id: "",
      name: this.emptyProduct[0].validator.get("name").value,
      description: this.emptyProduct[0].validator.get("description").value,
      code: this.emptyProduct[0].validator.get("code").value,
      size: this.emptyProduct[0].validator.get("size").value,
      color: this.emptyProduct[0].validator.get("color").value,
      madeOf: this.emptyProduct[0].validator.get("madeOf").value,
      price: Number(this.emptyProduct[0].validator.get("price").value)
    })

    this.emptyProduct = [{
      currentData: {} as IProduct, 
      originalData: {} as IProduct, 
      editable: false, 
      validator: this.productForm({} as IProduct)
    }]

  }

  cancelAddField(){
    this.emptyProduct = [{
      currentData: {} as IProduct, 
      originalData: {} as IProduct, 
      editable: false, 
      validator: this.productForm({} as IProduct)
    }]

    this.editActivated= false;
  }

  ngDoCheck(){
    this.formInvalid = this.emptyProduct[0].validator.invalid
  }

  getProducts(){
    this.fbService.getAll("products").subscribe(result =>{
      this.products = result;
      this.dataSource = new MatTableDataSource(this.products)
      this.dataSource.sort = this.sort;
    }).unsubscribe

    
  }

  getRow(row: IProduct){
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '500px',
      data: {product: row}
    });
  }


}
