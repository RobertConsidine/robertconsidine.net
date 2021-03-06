import { Component,
         OnInit,
         Input,
         ElementRef,
         ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';

import { File } from '../types';
import { FileService } from '../file.service';
import { base64ArrayBuffer } from '../base64';
import { SUCCESS_SNACKBAR_OPTIONS, ERROR_SNACKBAR_OPTIONS } from '../utils';

interface FileToUpload {
  fullName: string;
  name: string;
  extension: string;
  file: any;
}

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.styl']
})
export class AttachmentsComponent implements OnInit {
  @Input() documentId: string;
  @ViewChild('fileInput') fileInput: ElementRef;
  displayedColumns: string[] = [
    'name',
    'extension',
    'url',
    'action'
  ];
  fileToUpload: FileToUpload = {
    fullName: null,
    name: null,
    extension: null,
    file: null
  };
  files$: Observable<File[]>;

  constructor(private fileService: FileService,
              private snackbar: MatSnackBar) { }

  ngOnInit() {}

  ngOnChanges() {
    if (this.documentId) {
      this.files$ = this.fileService.getFiles(this.documentId);
    }
  }

  getUrl(id: string): string {
    return this.fileService.getUrl(id);
  }

  chooseFile() {
    this.fileInput.nativeElement.click();
  }

  copyLink(id: string) {
    const elem = document.getElementById("link-" + id) as HTMLInputElement;
    elem.select();
    document.execCommand("copy");

    this.snackbar.open('Link copied', 'Dismiss', SUCCESS_SNACKBAR_OPTIONS);
  }

  deleteFile(id: string) {
    this.fileService.deleteFile(this.documentId, id)
      .pipe(take(1)).subscribe(() => {
        this.snackbar.open('Attachment removed', 'Dismiss',
                           SUCCESS_SNACKBAR_OPTIONS);
      }, () => {
        this.snackbar.open('Error removing attachment', 'Dismiss',
                           ERROR_SNACKBAR_OPTIONS);
      });
  }

  upload() {
    const reader = new FileReader();
    reader.readAsArrayBuffer(this.fileToUpload.file);

    reader.onload = (e: any) => {
      const data = base64ArrayBuffer(e.target.result);

      this.fileService.uploadFile({
        documentId: this.documentId,
        data: data,
        name: this.fileToUpload.name,
        extension: this.fileToUpload.extension
      })
      .pipe(take(1)).subscribe(() => {
        this.snackbar.open('File uploaded', 'Dismiss',
                           SUCCESS_SNACKBAR_OPTIONS);
      }, () => {
        this.snackbar.open('Error uploading file', 'Dismiss',
                           ERROR_SNACKBAR_OPTIONS);
      });
    }
  }

  onFileSelected() {
    const files = this.fileInput.nativeElement.files;
    if (files.length > 0) {
      const file = files[0];
      const parts = file.name.split('.');

      this.fileToUpload.file = file;
      this.fileToUpload.fullName = file.name;
      this.fileToUpload.name = parts[0];
      if (parts.length > 1) {
        this.fileToUpload.extension = parts[parts.length - 1];
      }
    }
  }
}
