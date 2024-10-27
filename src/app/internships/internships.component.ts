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
  // variable to store the returned internship data from the web scraping function in the backend
  listofjobs: any;

  // added HTTPheaders to avoid CORS error
  httpOptions = {
    headers: new HttpHeaders({ 
      'Access-Control-Allow-Origin':'*',
    })
  };
  //initialize listofjobs as an array to hold internship data (company, date, location, role, link)
  constructor(private http: HttpClient) {
    this.listofjobs=[];
  }

  //call function to get data
  ngOnInit(): void {
    this.getData()
  }

  //method to call backend and retrieve returned data
  getData() {
    //gets JSON from backend (which is always running on link below)
    //http://127.0.0.1:5000
    //"https://easyswe-be-4ooer6jk5a-uw.a.run.app"
    
    //this.http.get("https://easyswe-be-4ooer6jk5a-uw.a.run.app", this.httpOptions).subscribe((result:any) =>
    this.http.get("https://flask-backend-sage.vercel.app/?vercelToolbarCode=_s_rAquqTBXO--P", this.httpOptions).subscribe((result:any) =>
    {
      //result has all the data we need and we are transferring it over to the variable in this file so it can be iterated over in the HTML file 
      this.listofjobs=result;
    });
  }
}
