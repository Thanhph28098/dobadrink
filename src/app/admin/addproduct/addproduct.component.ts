import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
@Component({
   selector: 'app-addproduct',
   templateUrl: './addproduct.component.html',
   styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {
   public productForm!: FormGroup

   categories!: any[]

   constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {}

   ngOnInit() {
      this.http.get('https://angular-service.onrender.com/api/categories').subscribe((data: any) => {
         this.categories = data.categories
         console.log(data)
      })
      const whitespaceValidator = (control: AbstractControl): { [key: string]: any } | null => {
         const value = control.value;
         if (value && value.trim().length === 0) {
           return { 'whitespace': true };
         }
         return {
       
         };
       }
      this.productForm = this.formBuilder.group({
         name: new FormControl ('', [Validators.required, Validators.minLength(3), whitespaceValidator]),
         price: new FormControl ('', [Validators.required, Validators.min(1)]),
         image: ['', Validators.required],
         categoryId: ['', Validators.required],
         desc: ['', Validators.required]
      })
   }

   addProduct() {

      if (this.productForm.invalid) {
         this.productForm.markAllAsTouched()
         this.productForm.updateValueAndValidity()
         return
      }
      // Thực hiện thêm sản phẩm
      const product = this.productForm.value
      console.log(this.productForm)

      const apiUrl = `https://angular-service.onrender.com/api/products/`
      this.http
         .post(apiUrl, product, {
            headers: {
               authorization: 'Bearer' + localStorage.getItem('token')
            }
         })
         .subscribe((res: any) => {
            console.log(res)
            this.router.navigate(['admin/products'])
         })
   }
}
