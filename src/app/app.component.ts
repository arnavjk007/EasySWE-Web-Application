import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule, 
    RouterLink, 
    RouterLinkActive, 
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'easySWE';

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const newFav = '/assets/easyswe.ico';
    const link: any = document.querySelector('link[rel="icon"]');
    link.href = newFav;
  }
}


