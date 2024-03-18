import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InternshipsComponent } from './internships/internships.component';
import { ResbuilderComponent } from './resbuilder/resbuilder.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'internships', component: InternshipsComponent },
    { path: 'resume-builder', component: ResbuilderComponent },
];
