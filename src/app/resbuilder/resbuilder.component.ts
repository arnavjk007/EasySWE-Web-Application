import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-resbuilder',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './resbuilder.component.html',
  styleUrl: './resbuilder.component.css'
})
export class ResbuilderComponent implements OnInit {

  //creates form 
  resumeBuilderForm!: FormGroup;
  data: any;

  //form constructor & HTTP constructor 
  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  //creates form variables
  ngOnInit(): void {
    this.resumeBuilderForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: '',
      linkedin: '',
      github: '',
      frameworks: '',
      languages: '',
      devtools: '',
      libraries:'',
      projectBlocks: this.formBuilder.array([this.buildProjectBlock()]),
      experienceBlocks: this.formBuilder.array([this.buildExperienceBlock()]),
      educationBlocks: this.formBuilder.array([this.buildEducationBlock()]),
    });
  }

  // creates own form for experience section
  buildExperienceBlock(): FormGroup {
    return this.formBuilder.group({
      title: ['', [Validators.required]],
      company: ['', [Validators.required]],
      location: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      desc1: ['', [Validators.required]],
      desc2: ['', [Validators.required]],
      desc3: ['', [Validators.required]],
    });
  }

  // creates own form for project section
  buildProjectBlock(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      skills: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      desc1: ['', [Validators.required]],
      desc2: ['', [Validators.required]],
      desc3: ['', [Validators.required]]
    });
  }
  
  // creates own form for education section
  buildEducationBlock(): FormGroup {
    return this.formBuilder.group({
      university: ['', [Validators.required]],
      degree: ['', [Validators.required]],
      major: ['', [Validators.required]],
      location: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      gpa: ['', [Validators.required]],
      coursework: ['', [Validators.required]],
    });
  }

  // get functions allow us to access the input data from the form 
  get experienceBlocks(): FormArray {
    return this.resumeBuilderForm.get('experienceBlocks') as FormArray;
  }

  get projectBlocks(): FormArray {
    return this.resumeBuilderForm.get('projectBlocks') as FormArray;
  }

  get educationBlocks(): FormArray {
    return this.resumeBuilderForm.get('educationBlocks') as FormArray;
  }

  //adds an experienceBlock onclick
  addExperience() {
    this.experienceBlocks.insert(0, this.buildExperienceBlock());
  }

  //deletes experienceBlock onclick
  delExperience() {
    if (this.experienceBlocks.length > 1) {
      this.experienceBlocks.removeAt(0);
    }
  }
  //adds a projectBlock onclick
  addProject() {
    this.projectBlocks.insert(0, this.buildProjectBlock());
  }

  //deletes a projectBlock onclick
  delProject() {
    if (this.projectBlocks.length > 1) {
      this.projectBlocks.removeAt(0);
    }
  }

  //adds educationBlock onclick
  addEducation() {
    this.educationBlocks.insert(0, this.buildEducationBlock());
  }

  //deletes educationBlock onclick
  delEducation() {
    if (this.educationBlocks.length > 1) {
      this.educationBlocks.removeAt(0);
    }
  }

  // present functions are old, not necessary, ditched the idea 
  presentProject() {
    this.resumeBuilderForm.value.projectBlocks.endDate = 'Present';
  }

  presentExperience() {
    this.resumeBuilderForm.value.experienceBlocks.endDate = 'Present';
  }

  // same headers to pass CORS errors
  httpOptions = {
    headers: new HttpHeaders({ 
      'Access-Control-Allow-Origin':'*',
    })
  };

  //function that is called once form is submitted
  onSubmit(data: any) {
    this.http.post("https://easyswe-be-4ooer6jk5a-uw.a.run.app/resume", data.value, this.httpOptions)
    .subscribe((result: any) => {
      //opens a new blank window
      const win = window.open('', 'PRINT')
      //writes HTML resume template in that window
      win?.document.write(result.toString())

    })

    return false;
  }

}
