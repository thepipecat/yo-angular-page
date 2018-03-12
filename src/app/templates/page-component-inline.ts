import * as html from './page-html';

export default (name: string, selector: string) => {
  return `import { Component, OnInit } from '@angular/core';

@Component({
  selector: '${selector}',
  template: '` + html.default(name, selector) + `',
  style: ['']
})
export class ${name}Component implements OnInit {

  constructor() { }

  ngOnInit() { }

}
`;
};
