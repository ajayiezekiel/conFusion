import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { Comment } from '../shared/comment';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
      state('shown', style({
        transform: 'scale(1.0)',
        opacity: 1
      })),
      
      state('hidden', style({
        transform: 'scale(0.5)',
        opacity: 0
      })),
      
      transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {
  
  dish: Dish;
  dishCopy: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  theComment: Comment;
  comments: Comment[];
  visibility = 'shown';
  @ViewChild('cform') commentFormDirective;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Author Name is required.',
      'minlength':     'Author Name must be at least 2 characters long.'
    },

    'comment': {
      'required':      'Comment is required.'
    }
  }; 

  constructor(private dishservice: DishService,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private location: Location,
              @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.createForm();

    this.dishservice.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
    // this.route.params
    //   .pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    //   .subscribe(dish => { this.dish = dish; this.dishCopy = dish; this.setPrevNext(dish.id); },
    //     errmess => this.errMess = <any>errmess);

    this.route.params
      .pipe(switchMap((params: Params) => { 
        this.visibility = 'hidden'; 
        return this.dishservice.getDish(params['id']); 
    }))
      .subscribe(dish => { this.dish = dish; this.dishCopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess);
  }

  createForm(): void {
    let d = new Date;
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)] ],
      rating: 5,
      comment: ['', Validators.required],
      date: d.toISOString()
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  onSubmit() {
    this.theComment = this.commentForm.value;
    this.theComment.date = new Date().toISOString();
    console.log(this.theComment);
    this.dishCopy.comments.push(this.theComment);
    this.dishservice.putDish(this.dishCopy)
      .subscribe(dish => {this.dish = dish; this.dishCopy = dish; },
        errmess => { this.dish = null; this.dishCopy = null; this.errMess = <any>errmess; });
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      author: '', 
      rating: 5,
      comment: '',
    });
    
  }


}
