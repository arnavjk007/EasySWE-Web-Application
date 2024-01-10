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

  resumeBuilderForm!: FormGroup;
  data: any;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

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

  get experienceBlocks(): FormArray {
    return this.resumeBuilderForm.get('experienceBlocks') as FormArray;
  }

  get projectBlocks(): FormArray {
    return this.resumeBuilderForm.get('projectBlocks') as FormArray;
  }

  get educationBlocks(): FormArray {
    return this.resumeBuilderForm.get('educationBlocks') as FormArray;
  }

  addExperience() {
    this.experienceBlocks.insert(0, this.buildExperienceBlock());
  }

  delExperience() {
    if (this.experienceBlocks.length > 1) {
      this.experienceBlocks.removeAt(0);
    }
  }

  addProject() {
    this.projectBlocks.insert(0, this.buildProjectBlock());
  }

  delProject() {
    if (this.projectBlocks.length > 1) {
      this.projectBlocks.removeAt(0);
    }
  }

  addEducation() {
    this.educationBlocks.insert(0, this.buildEducationBlock());
  }

  delEducation() {
    if (this.educationBlocks.length > 1) {
      this.educationBlocks.removeAt(0);
    }
  }

  presentProject() {
    this.resumeBuilderForm.value.projectBlocks.endDate = 'Present';
  }

  presentExperience() {
    this.resumeBuilderForm.value.experienceBlocks.endDate = 'Present';
  }

  httpOptions = {
    headers: new HttpHeaders({ 
      'Access-Control-Allow-Origin':'*',
    })
  };

  onSubmit(data: any) {
    //console.log(data);
    this.http.post("https://easyswe-be-4ooer6jk5a-uw.a.run.app/resume", data.value, this.httpOptions)
    .subscribe((result: any) => {
      //console.log(result)
      //console.log(data.value.experienceBlocks)
      const win = window.open('', 'PRINT')
      win?.document.write(result.toString())

    })

    return false;
  }

}
