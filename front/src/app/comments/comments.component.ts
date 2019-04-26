import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';

import { Comment } from '../types';
import { ArticleService } from '../articles.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.styl']
})
export class CommentsComponent implements OnInit {
  @Input() articleId: string;
  comments: Observable<Comment[]>;
  comment: string = "";
  errMsg: string = "";
  private captchaToken: string = "";

  constructor(private authService: AuthService,
              private articleService: ArticleService,
              private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.comments = this.articleService.getComments(this.articleId);
  }

  captchaComplete(token: string) {
    this.captchaToken = token;
    this.changeDetector.detectChanges();
  }

  formReady(): boolean {
    return this.comment.length > 0 && this.captchaToken.length > 0;
  }

  submit() {
    this.articleService.postComment(this.articleId, this.comment)
      .subscribe(
        () => {},
        () => {
          this.errMsg = "Error posting comment";
        })
  }
}
