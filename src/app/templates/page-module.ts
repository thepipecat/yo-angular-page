export default (name: string, selector: string) => {
  return `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ${name}Component } from './${selector}.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ${name}Component
  ]
})
export class ${name}Module { }
`;
};
