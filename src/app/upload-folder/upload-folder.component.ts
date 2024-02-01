import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload-folder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-folder.component.html',
  styleUrl: './upload-folder.component.scss'
})
export class UploadFolderComponent implements OnInit{

  UploadedFiles:any = [];

  constructor(){
    
  }

  ngOnInit(): void {
    
  }


  convertFileSize(sizeInBytes:number) {
    const kilobyte = 1024;
    const megabyte = kilobyte * 1024;
    const gigabyte = megabyte * 1024;

    if (sizeInBytes >= gigabyte) {
      return (sizeInBytes / gigabyte).toFixed(2) + ' GB';
    } else if (sizeInBytes >= megabyte) {
      return (sizeInBytes / megabyte).toFixed(2) + ' MB';
    } else if (sizeInBytes >= kilobyte) {
      return (sizeInBytes / kilobyte).toFixed(2) + ' KB';
    } else {
      return sizeInBytes + ' bytes';
    }
  }

  async handleSelectFolder(event:Event){
    const inputElements = event.target as HTMLInputElement
    const files = inputElements.files;

    if(files && files.length > 0){
      for( let i = 0; i< files.length; i++){
        const file = files[i];
        const fileName = file.name;
        const fileSizeInBytes = file.size;
        const fileSize = this.convertFileSize(fileSizeInBytes)
        const fileExtension = file.name.split('.').pop();
        const lastModifiedDate = file.lastModified;
        // const day = new Date(lastModifiedDate).getDate();
        // const month = new Date(lastModifiedDate).getMonth()
        // const year =  new Date(lastModifiedDate).getFullYear();

        /*
        this.getFileMetadata(file)
        .then((metadata) => {
          const creationDate = metadata?.modificationTime?.toLocaleString();
          console.log('File Name:', file.name);
          console.log('File Size:', fileSizeInKB + ' KB');
          console.log('File Extension:', fileExtension);
          console.log('Last Modified Date:', lastModifiedDate);
          console.log('Creation Date:', creationDate);
          console.log('File Path:', file.webkitRelativePath); // Obtain the relative path of each file
        })
        .catch((error) => {
          console.error('Error retrieving metadata:', error);
        });
    }
        */
        // let createdDate:any = " ";
        // this.getFileMetadata(file).then(
        //   createdDate = metadata?.modificationTime?.toLocaleString
        // )
        const modifiedDate = `${new Date(lastModifiedDate).getDate()}/${new Date(lastModifiedDate).getMonth() + 1}/${new Date(lastModifiedDate).getFullYear()}`;
        const fileUrl = file.webkitRelativePath;
        this.UploadedFiles.push({
          name:fileName,
          size:fileSize,
          extension:fileExtension,
          lastModified:modifiedDate,
          filePath:fileUrl
        })

      }
    }
  }

  

  // async  getFileMetadata(file: File): Promise<any> {
  //   if ('showOpenFilePicker' in window) {
  //     try {
  //       const fileHandle = await window.showOpenFilePicker({ file });
  //       const metadata = await fileHandle[0]?.getFile()?.getMetadata();
  //       return metadata;
  //     } catch (error) {
  //       console.error('Error getting file metadata:', error);
  //       return null;
  //     }
  //   } else {
  //     console.warn('File System Access API not supported.');
  //     return null;
  //   }
  // }

  exportToExcel(){
    const ws:XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('exportTableData'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'sheet1');
    XLSX.writeFile(wb,'table_data.xlsx');
  }


}

// interface Window {
//   showOpenFilePicker?: (options?: any) => Promise<FileSystemFileHandle[]>;
// }
