import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../Services/admin.service';
import { DataService } from '../../../Services/data.service';
import { CommonModule } from '@angular/common';
import { SourceFile } from '../../../Interfaces/source-file';
import { DeleteSourcefRequest } from '../../../Interfaces/delete-sourcef-request';

@Component({
  selector: 'app-source-files',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './source-files.component.html',
  styleUrl: './source-files.component.css'
})
export class SourceFilesComponent implements OnInit{
  createForm: FormGroup;
  message: string = '';
  listSourceFiles: any[] = [];
  showCreateForm: boolean = false;

  constructor(
    private dataService: DataService,
    private adminService: AdminService,
    private formBuilder: FormBuilder
  ) {
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      link: ['', [Validators.required]]
    });

}

ngOnInit(): void {
  this.getSourceFiles();
}

getSourceFiles() {
  this.dataService.getSourceFiles().subscribe({
    next: (data) => {
      this.listSourceFiles = data.sourceFiles.map((sourceFile: any) => ({
        ...sourceFile,
        isEditing: false // Add editing state to each sourceFile
      }));
    },
    error: (error) => {
      this.message = error.message;
      console.error("Error fetching source files:", this.message);
    }
  });
}

toggleCreateSourceFileForm() {
  this.showCreateForm = !this.showCreateForm;
  this.createForm.reset();
}

createSourceFile() {
  if (this.createForm.invalid) {
    this.createForm.markAllAsTouched();
    return;
  }

  const newSourceFile: SourceFile = { 
    id: '', // Set this if server assigns an ID
    name: this.createForm.get('name')?.value,
    link: this.createForm.get('link')?.value
  };

  this.adminService.createSourceFile(newSourceFile).subscribe({
    next: (data) => {
      this.listSourceFiles.push({ ...data, isEditing: false });
      this.toggleCreateSourceFileForm();
    },
    error: (error) => {
      this.message = error.message;
      console.error("Error creating source file:", this.message);
    }
  });
}

enableEditSourceFile(sourceFile: any) {
  sourceFile.isEditing = true;
}

saveSourceFileUpdate(sourceFile: any) {
  const request : SourceFile = {
    id: sourceFile.id,
    name: sourceFile.name,
    link: sourceFile.link
  };

  this.adminService.updateSourceFile(request).subscribe({
    next: (data) => {
      console.log(data);
      sourceFile.isEditing = false;
      console.log("Source file updated:", request);
    },
    error: (error) => {
      this.message = error.message;
      console.error("Error updating source file:", this.message);
    }
  });
}

cancelEditSourceFile(sourceFile: any) {
  sourceFile.isEditing = false;
  this.getSourceFiles(); // Re-fetch to revert unsaved changes
}

deleteSourceFile(id: string) {

  const request : DeleteSourcefRequest = {
    sourceFileId : id
  }

  this.adminService.deleteSourceFile(request).subscribe({
    next: () => {
      this.listSourceFiles = this.listSourceFiles.filter(sf => sf.id !== id);
      console.log("Source file deleted:", id);
    },
    error: (error) => {
      this.message = error.message;
      console.error("Error deleting source file:", this.message);
    }
  });
}

}
