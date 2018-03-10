import * as fs from 'fs';
import * as Generator from 'yeoman-generator';
import * as upper from 'uppercamelcase';

import * as ComponentTpl from './templates/page-component';
import * as ComponentInlineTpl from './templates/page-component';
import * as ModuleTpl from './templates/page-module';
import * as ModuleRoutingTpl from './templates/page-module-routing';
import * as HtmlTpl from './templates/page-html';

class GeneratorAngularPage extends Generator {

  private pageId: string;

  constructor(args: string | string[], opts: {}) {
    super(args, opts);

    this.SetupGenerator();
  }

  protected SetupGenerator(): void {
    this.option('routing', {
      type: Boolean
    });
    this.option('sass', {
      type: Boolean
    });
    this.option('inline', {});
  }

  protected Prompt(): void {
    let askID: Generator.Question = {
      name: 'id',
      message: 'Page id: (my-page-name)'
    };
    let askAllFine: Generator.Question = {
      type: 'confirm',
      name: 'ok',
      message: 'This is all correct?'
    };

    this.prompt([askID])
      .then(answers => {
        this.log('New page info:', JSON.stringify({
          'id': answers.id,
          'routing': !this.options['no-routing'] ? 'yes' : 'no',
          'scss': !this.options['no-sass'] ? 'yes' : 'no',
          'inline': this.options['inline'] ? 'yes' : 'no'
        }, null, 2));

        this.pageId = answers.id;

        this.prompt([askAllFine])
          .then(answers => {
            if (answers.ok) {
              this.Create();
            } else {
              this.Prompt();
            }
          });
      });
  }

  protected Create(): void {
    let pageSelector: string = 'page-' + this.pageId;
    let destDir: string = this.destinationPath(pageSelector);

    fs.mkdir(destDir, err => {
      if (err == null) {
        let pageName: string = upper(pageSelector);
        let moduleContent: string;
        let componentContent: string;

        if (!this.options['no-routing']) {
          moduleContent = ModuleTpl.default(pageName, pageSelector);
        } else {
          moduleContent = ModuleRoutingTpl.default(pageName, pageSelector);
        }

        if (!this.options['inline']) {
          let htmlContent: string = HtmlTpl.default(pageName, pageSelector);
          let cssContent: string = '';

          componentContent = ComponentTpl.default(pageName, pageSelector);

          this.fs.write(destDir + '/' + pageSelector + '.component.html', htmlContent);

          if (!this.options['no-sass']) {
            this.fs.write(destDir + '/' + pageSelector + '.component.scss', cssContent);
          } else {
            this.fs.write(destDir + '/' + pageSelector + '.component.css', cssContent);
          }
        } else {
          componentContent = ComponentInlineTpl.default(pageName, pageSelector);
        }

        this.fs.write(destDir + '/' + pageSelector + '.module.ts', moduleContent);
        this.fs.write(destDir + '/' + pageSelector + '.component.ts', componentContent);
      }
    });
  }
}

module.exports = class extends GeneratorAngularPage {
  public prompting(): void {
    this.Prompt();
  }
};
