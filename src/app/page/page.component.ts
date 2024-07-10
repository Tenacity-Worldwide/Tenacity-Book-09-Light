import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import * as $ from 'jquery';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PageComponent {
  loadState: 'loading' | 'success' | 'error' = 'loading';
  zoom = 1;
  @ViewChild('container') container!: ElementRef;

  private _pageId: number = 1;
  private resizeDebounceTimeout: any;

  get pageId(): number {
    return this._pageId;
  }
  @Input() set pageId(value: number) {
    this._pageId = value;
    this.updateZoom();
    this.loadContent();
  }

  loadContent() {
    this.loadState = 'loading';
    fetch(`/assets/pages/${this.pageId}.html`)
      .then((response) => response.text())
      .then((html) => {
        this.container.nativeElement.innerHTML = html;
        this.loadState = 'success';

        const mediaElements = $(this.container.nativeElement).find(
          'audio, video'
        );
        mediaElements.on({
          play: function (e: Event) {
            mediaElements.each(function (_index, element: any) {
              if (element != e.target) element.pause();
            });
          },
        });

        $(this.container.nativeElement)
          .find('iframe')
          .on('load', (event) => {
            const iframe = event.target;
            iframe.contentDocument!.documentElement.style.height = 'auto';
          });
      })
      .catch((err) => {
        this.loadState = 'error';
        console.error(err);
      });
  }

  handleDoubleClick() {
    if (!environment.production && this.loadState == 'success')
      this.loadContent();
  }

  @HostListener('window:resize')
  onResize() {
    clearTimeout(this.resizeDebounceTimeout);
    this.resizeDebounceTimeout = setTimeout(() => {
      this.updateZoom();
    }, 1000);
  }

  updateZoom() {
    const pageWidth = this._pageId == 1 ? 955.91 : 677.27;
    this.zoom = Math.min(
      this._pageId == 1 ? 1 : 1.5,
      window.innerWidth / pageWidth
    );
  }
}
