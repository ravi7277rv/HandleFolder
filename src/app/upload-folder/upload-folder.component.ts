import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { HttpClientModule } from '@angular/common/http';
import { FileFolderServiceService } from '../services/file-folder-service.service';



@Component({
  selector: 'app-upload-folder',
  standalone: true,
  imports: [CommonModule,HttpClientModule],
  providers:[FileFolderServiceService],
  templateUrl: './upload-folder.component.html',
  styleUrl: './upload-folder.component.scss'
})
export class UploadFolderComponent implements OnInit {

  UploadedFiles: any = [];

  constructor( private _ffServices: FileFolderServiceService) {}

  ngOnInit(): void {}


  // converting the file size in gb or mb
  // convertFileSize(sizeInBytes: number) {
  //   const kilobyte = 1024;
  //   const megabyte = kilobyte * 1024;
  //   const gigabyte = megabyte * 1024;
  //   if (sizeInBytes >= gigabyte) {
  //     return (sizeInBytes / gigabyte).toFixed(2) + ' GB';
  //   } else if (sizeInBytes >= megabyte) {
  //     return (sizeInBytes / megabyte).toFixed(2) + ' MB';
  //   } else if (sizeInBytes >= kilobyte) {
  //     return (sizeInBytes / kilobyte).toFixed(2) + ' KB';
  //   } else {
  //     return sizeInBytes + ' bytes';
  //   }
  // }


  // utils for formatting date
  //  formatDate(date:number) {
  //   const day = String(new Date(date).getDate()).padStart(2, '0');
  //   const month = String(new Date(date).getMonth() + 1).padStart(2, '0'); // Months are zero-based
  //   const year = new Date(date).getFullYear();

  //   return `${day}-${month}-${year}`;
  // }
 



  async handleSelectFolder(event: Event) {
    const inputElements = event.target as HTMLInputElement
    const files = inputElements.files;
    let fileUrl;
    const formData = new FormData();

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        // console.log(files[1])
        const file = files[i];
        // const fileName = file.name;
        fileUrl = file.webkitRelativePath;


        // const fileSizeInBytes = file.size;
        // const fileSize = this.convertFileSize(fileSizeInBytes)
        // const fileExtension = file.name.split('.').pop();
        // const lastModifiedDate = file.lastModified;
        // const modifiedDate = this.formatDate(lastModifiedDate);
        // console.log(modifiedDate)

        // const modifiedDate = `${new Date(lastModifiedDate).getDate()}/${new Date(lastModifiedDate).getMonth() + 1}/${new Date(lastModifiedDate).getFullYear()}`;
        // const modifiedDate = new Date(lastModifiedDate).toISOString().split('T')[0];

        // this.UploadedFiles.push({
        //   name: fileName,
        //   size: fileSize,
        //   extension: fileExtension,
        //   // createdDate:createDate,
        //   lastModified: modifiedDate,
        //   filePath: fileUrl
        // })
        formData.append('files[]',file);
        // formData.append('fileName[]',fileName);
        formData.append('fileUrl[]',fileUrl);
        

      }
    }

    this._ffServices.uploadArrayOfFiles(formData).subscribe({
      next:(data:any) => {
        console.log(data);
        this.UploadedFiles = data.data
      },
      error:(error) => {
        console.log(error);
      }
    })

    
  }


  // 

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('exportTableData'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    XLSX.writeFile(wb, 'table_data.xlsx');
  }



}



