export default (name: string, selector: string, sass: boolean = true) => {
  return `import { Component, OnInit } from '@angular/core';

@Component({
  selector: '${selector}',
  templateUrl: './${selector}.component.html',
  styleUrls: ['./${selector}.component.` + (sass ? 'scss' : 'css') + `']
})
export class ${name}Component implements OnInit {

  constructor() { }

  ngOnInit() { }

}
`;
};
