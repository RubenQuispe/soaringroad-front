import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageComponent } from '../page.component';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { ArticleService } from '../../service/article.service';
import PagePath from '../../util/pagepath';
import { RequestService } from '../../service/common/request.service';
import { markdown } from 'markdown';
import { Article } from '../../entity/article';

@Component({
  selector: 'app-articlepage',
  templateUrl: './articlepage.component.html',
  styleUrls: ['./articlepage.component.scss'],
  providers: [ArticleService, Navigator]
})
export class ArticlepageComponent extends PageComponent implements OnInit {

  article: Article;
  safeBody: SafeHtml;

  constructor(private router: Router, private activedRouter: ActivatedRoute, private articleService: ArticleService,
    private domSanitizer: DomSanitizer) {
    super();
  }

  ngOnInit() {
    const articleId = this.activedRouter.snapshot.params['id'];
    if (!articleId) {
      this.router.navigate([PagePath.ERROR_PAGE]);
    }
    const info = this.articleService.get(articleId);
    if (!info) {
      this.router.navigate([PagePath.ERROR_PAGE]);
      return;
    }
    info.subscribe(body => {
      this.article = body;
      if (!this.article) {
        this.router.navigate([PagePath.ERROR_PAGE]);
        return;
      }
      this.safeBody = this.domSanitizer.bypassSecurityTrustHtml(markdown.toHTML(this.article.content));

    });
  }

}
