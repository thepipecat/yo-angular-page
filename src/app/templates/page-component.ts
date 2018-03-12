export default (name: string, selector: string, sass: boolean, file: string) => {
  return `import { Component, OnInit } from '@angular/core';

@Component({
  selector: '${selector}',
  templateUrl: './${file}.component.html',
  styleUrls: ['./${file}.component.` + (sass ? 'scss' : 'css') + `']
})
export class ${name}Component implements OnInit {

  constructor() { }

  ngOnInit() { }

}
`;
};
