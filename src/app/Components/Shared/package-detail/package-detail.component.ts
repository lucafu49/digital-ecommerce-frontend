import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.css'
})
export class PackageDetailComponent implements AfterViewInit {
  isExpandable = false;
  isExpanded = false;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const descriptionElement = this.elementRef.nativeElement.querySelector('.description');
    if (descriptionElement.scrollHeight > 80) { // Altura límite (ajustable)
      this.isExpandable = true;
    }
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

}
