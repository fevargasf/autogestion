import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-instructivo',
  templateUrl: './instructivo.component.html',
  styles: [
  ]
})
export class InstructivoComponent implements OnInit {
  name = 'Instructivo Autogestión';
  url: string = 'https://www.youtube.com/embed/qNCN-aOjH4g';
  urlSafe: SafeResourceUrl;
  isVisible = false;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }
}
