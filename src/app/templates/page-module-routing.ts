export default (name: string, file: string) => {
  return `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ${name}Component } from './${file}.component';

const ${name}Routes: Routes = [
  {
    path: '',
    component: ${name}Component
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(${name}Routes)
  ],
  declarations: [
    ${name}Component
  ]
})
export class ${name}Module { }
`;
};
