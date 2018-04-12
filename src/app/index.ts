import * as fs from 'fs';
import * as Generator from 'yeoman-generator';
import * as upper from 'uppercamelcase';
import * as mkdirp from 'mkdirp';

import * as ComponentTpl from './templates/page-component';
import * as ComponentInlineTpl from './templates/page-component-inline';
import * as ModuleTpl from './templates/page-module';
import * as ModuleRoutingTpl from './templates/page-module-routing';
import * as SpecTpl from './templates/page-spec';
import * as HtmlTpl from './templates/page-html';

class GeneratorAngularPage extends Generator {
  private defaultPagePrefix: string = 'page-';

  private buildConfig: {
    appPrefix: string;
    appSource: string;
    id: string;
    routing: string;
    scss: string;
    spec: string;
    inline: string;
  };

  constructor(args: string | string[], opts: {}) {
    super(args, opts);

    this.SetupGenerator();
  }

  protected SetupGenerator(): void {
    this.option('prefix', {
      type: String,
      default: this.defaultPagePrefix
    });
    this.option('routing', {
      type: Boolean,
      default: true
    });
    this.option('sass', {
      type: Boolean,
      default: true
    });
    this.option('spec', {
      type: Boolean,
      default: true
    });
    this.option('inline', {
      type: Boolean,
      default: false
    });
  }

  protected Prompt(): void {
    let askID: Generator.Question = {
      name: 'id',
      message: `Page id: (will be prefixed with "${this.options['prefix']}")`
    };
    let askAllFine: Generator.Question = {
      type: 'confirm',
      name: 'ok',
      message: 'This is all correct?'
    };

    this.prompt([askID]).then(answers => {
      if (!answers.id || /^\s*$/.test(answers.id)) {
        this.log('Page id is required.');

        this.Create();

        return;
      }

      try {
        let angularConfig = fs.readFileSync(this.destinationRoot() + '/.angular-cli.json', 'utf8');
        let angular = JSON.parse(angularConfig);

        this.buildConfig = {
          appPrefix: angular.apps[0].prefix + '-',
          appSource: angular.apps[0].root + '/' + angular.apps[0].prefix + '/',
          id: this.options['prefix'] + answers.id,
          routing: this.options['routing'] ? 'yes' : 'no',
          scss: this.options['sass'] ? 'yes' : 'no',
          spec: this.options['spec'] ? 'yes' : 'no',
          inline: this.options['inline'] ? 'yes' : 'no'
        };

        if (angular.defaults) {
          if ('styleExt' in angular.defaults) {
            this.buildConfig.scss = angular.defaults.styleExt == 'scss' ? 'yes' : 'no';
          }

          if ('component' in angular.defaults) {
            if ('spec' in angular.defaults.component) {
              this.buildConfig.spec = angular.defaults.component.spec ? 'yes' : 'no';
            }

            this.buildConfig.inline = angular.defaults.component.inlineStyle || angular.defaults.component.inlineTemplate ? 'yes' : 'no';
          }
        }
      } catch (ex) {
        // Angular.io config not found?

        this.buildConfig = {
          appPrefix: 'app-',
          appSource: '',
          id: this.options['prefix'] + answers.id,
          routing: this.options['routing'] ? 'yes' : 'no',
          scss: this.options['sass'] ? 'yes' : 'no',
          spec: this.options['spec'] ? 'yes' : 'no',
          inline: this.options['inline'] ? 'yes' : 'no'
        };
      }

      this.log('Page info:', JSON.stringify(this.buildConfig, ['id', 'routing', 'scss', 'spec', 'inline'], 2));

      this.prompt([askAllFine]).then(answers => {
        if (answers.ok) {
          this.Create();
        } else {
          this.Prompt();
        }
      });
    });
  }

  protected Create(): void {
    let pageSelector: string = this.buildConfig.appPrefix + this.buildConfig.id;
    let pageName: string = upper(this.buildConfig.id);
    let fileName: string = this.buildConfig.id;
    let destDir: string = this.destinationPath(this.buildConfig.appSource + this.buildConfig.id);

    let hasRoute: boolean = this.buildConfig.routing == 'yes';
    let hasSass: boolean = this.buildConfig.scss == 'yes';
    let hasSpec: boolean = this.buildConfig.spec == 'yes';
    let isInline: boolean = this.buildConfig.inline == 'yes';

    let moduleContent: string;
    let componentContent: string;

    mkdirp(destDir, () => {
      if (hasRoute) {
        moduleContent = ModuleRoutingTpl.default(pageName, fileName);
      } else {
        moduleContent = ModuleTpl.default(pageName, fileName);
      }

      if (isInline) {
        componentContent = ComponentInlineTpl.default(pageName, pageSelector);
      } else {
        let htmlContent: string = HtmlTpl.default(pageName, pageSelector);
        let cssContent: string = '';

        componentContent = ComponentTpl.default(pageName, pageSelector, hasSass, fileName);

        this.fs.write(destDir + '/' + fileName + '.component.html', htmlContent);

        if (hasSass) {
          this.fs.write(destDir + '/' + fileName + '.component.scss', cssContent);
        } else {
          this.fs.write(destDir + '/' + fileName + '.component.css', cssContent);
        }
      }

      if (hasSpec) {
        let specContent: string = SpecTpl.default(pageName, fileName);

        this.fs.write(destDir + '/' + fileName + '.spec.ts', specContent);
      }

      this.fs.write(destDir + '/' + fileName + '.module.ts', moduleContent);
      this.fs.write(destDir + '/' + fileName + '.component.ts', componentContent);
    });
  }
}

module.exports = class extends GeneratorAngularPage {
  public prompting(): void {
    this.Prompt();
  }
};
