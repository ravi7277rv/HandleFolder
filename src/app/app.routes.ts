import { Routes } from '@angular/router';
import { UploadFolderComponent } from './upload-folder/upload-folder.component';

export const routes: Routes = [
    { path: '', redirectTo:'uploadfolderfile', pathMatch:'full'},
    { path: 'uploadfolderfile', component: UploadFolderComponent}
];
