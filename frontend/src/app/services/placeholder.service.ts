import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class PlaceholderService {
  constructor(private sanitizer: DomSanitizer) {}

  getPlaceholder(width: number, height: number, text: string = ''): SafeUrl {
    const displayText = text || 'Book';
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e8e8e8"/>
        <rect width="100%" height="100%" fill="url(#gradient)" opacity="0.5"/>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#d0d0d0;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f5f5f5;stop-opacity:1" />
          </linearGradient>
        </defs>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-size="12" font-weight="bold" font-family="Arial, sans-serif">
          ${this.escapeXml(displayText)}
        </text>
      </svg>
    `;
    const url = `data:image/svg+xml;base64,${btoa(svg)}`;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
