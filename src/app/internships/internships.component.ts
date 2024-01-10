import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-internships',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './internships.component.html',
  styleUrl: './internships.component.css'
})
export class InternshipsComponent implements OnInit {
  listofjobs: any;

  httpOptions = {
    headers: new HttpHeaders({ 
      'Access-Control-Allow-Origin':'*',
    })
  };

  constructor(private http: HttpClient) {
    this.listofjobs=[];
  }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this.http.get("https://easyswe-be-4ooer6jk5a-uw.a.run.app", this.httpOptions).subscribe((result:any) =>
    {
      this.listofjobs=result;
    });
  }
}
