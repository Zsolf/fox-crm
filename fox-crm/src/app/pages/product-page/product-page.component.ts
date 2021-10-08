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


  added: boolean;

  displayedColumns: string[];


  ngOnInit(): void {
    const editForm = (e) => new FormGroup({
      name: new FormControl(e.name,Validators.required),
      description: new FormControl(e.description),
      code: new FormControl(e.code,Validators.required),
      size: new FormControl(e.size),
      color: new FormControl(e.color, Validators.required),
      madeOf: new FormControl(e.madeOf,Validators.required),
      price: new FormControl(e.price, Validators.required)
    });

    
    this.products = []
    this.emptyProduct = [{
      currentData: {} as IProduct, 
      originalData: {} as IProduct, 
      editable: false, 
      validator: editForm({} as IProduct)}]
    this.getProducts()
    this.added = false; 
    this.displayedColumns = ['code','name','color','size','madeOf','price']
  }

  addProduct() {
    this.fbService.add("products",this.products[0])
  }

  ngDoCheck(){
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
