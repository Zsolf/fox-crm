import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService } from 'primeng/api';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { IProduct } from 'src/app/shared/models/product.model';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';

@Component({
  selector: 'fcrm-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
  animations: [
    trigger('fadeAnimation', [

      state('in', style({opacity: 1})),

      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),

      transition(':leave',
        animate(600, style({opacity: 0})))
    ])
  ]
})
export class ProductPageComponent implements OnInit {

  constructor(private fbService: FirebaseBaseService, public dialog: MatDialog, private messageService: MessageService) { }

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
      code: new FormControl(e.code,[Validators.required,Validators.maxLength(15)]),
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
      code: this.emptyProduct[0].validator.get("code").value.toUpperCase(),
      size: this.emptyProduct[0].validator.get("size").value.toLowerCase(),
      color: this.emptyProduct[0].validator.get("color").value.toLowerCase(),
      madeOf: this.emptyProduct[0].validator.get("madeOf").value.toLowerCase(),
      price: Number(this.emptyProduct[0].validator.get("price").value)
    })
    this.messageService.add({severity:'success', summary:'Sikeres létrehozás'});
    this.cancelAddField();

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
      this.sortData(this.sort)
    }).unsubscribe    
  }

  getRow(row: IProduct){
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '500px',
      data: {product: row}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result == "delete"){
        this.fbService.delete("products",row.id);
        this.messageService.add({severity:'success', summary:'Sikeres törlés'});
      }
      if(result instanceof Object){
        this.fbService.update("products",result.id,result)
        this.messageService.add({severity:'success', summary:'Sikeres mentés'});
      }
    });

  }

  sortData(sort: Sort) {
    const data = this.dataSource;
    if (!sort.active || sort.direction === '') {
      this.dataSource = data;
      return;
    }
  
    this.dataSource = new MatTableDataSource(this.dataSource.data.slice().sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'code': return this.compareString(a.code, b.code, isAsc);
        case 'name': return this.compareString(a.name, b.name, isAsc);
        case 'color': return this.compareString(a.color, b.color, isAsc);
        case 'madeOf': return this.compareString(a.madeOf, b.madeOf, isAsc);
        case 'price': return this.compareNumber(a.price, b.price, isAsc);
        case 'size': return this.compareString(a.size, b.size, isAsc);
        default: return 0;
      }
    }))
  }
  
  compareNumber(a: number, b: number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
  compareString(a: string, b: string, isAsc: boolean) {
    return a.localeCompare(b, 'hu') * (isAsc ? 1 : -1);
  }


}
