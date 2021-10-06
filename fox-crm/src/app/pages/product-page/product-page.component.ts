import { Component, OnInit } from '@angular/core';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { IProduct } from 'src/app/shared/models/product.model';

@Component({
  selector: 'fcrm-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {

  constructor(private fbService: FirebaseBaseService) { }

  products: IProduct[];

  added: boolean;

  displayedColumns: string[];

  ngOnInit(): void {
    this.products = []
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
    }).unsubscribe

    
  }

  getRow(row: IProduct){
    console.log(row)
  }


}
