export default (name: string, file: string) => {
  return `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ${name}Component } from './${file}.component';

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
