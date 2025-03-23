import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-email-editor',
  templateUrl: './email-editor.component.html',
  styleUrls: ['./email-editor.component.css'],
  imports: [FormsModule]
})
export class EmailEditorComponent implements AfterViewInit {
  @Input() set url(value: string) {
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
  iframeUrl!: SafeResourceUrl;
  json: string = '';
  html: string = '';

  @ViewChild('iframeRef') iframeRef!: ElementRef;

  constructor(private sanitizer: DomSanitizer) {}

  ngAfterViewInit() {
    const iframe = this.iframeRef.nativeElement;
    console.log(iframe);
    if (window.integrator) {
      window.integrator.addIframe(iframe);
      iframe.addEventListener('watch.json', (e:any) => {
        this.json = e.detail;
      });
      iframe.addEventListener('watch.html', (e:any) => {
        this.html = e.detail;
      });
    }
  }

  onIframeLoad() {
    console.log('editor loaded');
  }

  getJsonTemplate() {
    return this.iframeRef.nativeElement.sendMessage({ method: 'getJson' }).then((response: any) => {
      console.log("Response from child:", response);
      return response;
    }).catch((err: any) => console.error(err));
  }
  getHtmlTemplate() {
    return this.iframeRef.nativeElement.sendMessage({ method: 'getHtml' }).then((response: any) => {
      console.log("Response from child:", response);
      return response;
    }).catch((err: any) => console.error(err));
  }
  toggleSamples() {
    return this.iframeRef.nativeElement.sendMessage({ method: 'toggleSamples' }).then((response: any) => {
      console.log("Response from child:", response);
      return response;
    }).catch((err: any) => console.error(err));
  }
  toggleInspector() {
    return this.iframeRef.nativeElement.sendMessage({ method: 'toggleInspector' }).then((response: any) => {
      console.log("Response from child:", response);
      return response;
    }).catch((err: any) => console.error(err));
  }
  loadTemplate(jsonText: String) {
    return this.iframeRef.nativeElement.sendMessage({
      method: 'loadTemplate',
      args: [jsonText]
    }).then((response: any) => {
      console.log("Response from child:", response);
      return response
    }).catch((err: any) => console.error(err));
  }
}