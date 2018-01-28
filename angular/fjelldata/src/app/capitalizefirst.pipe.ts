import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizefirst'
})
export class CapitalizefirstPipe implements PipeTransform {

  // transform(input: string): string {
  //   return input.length === 0 ? '' :
  //     input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ));
  // }

  transform(input: string): string {
    if (input.length === 0){
      return '';
    }
    input = input.toLowerCase();
    // console.log(input);
    return input.replace(/(^|[\s-])\S/g, function (match) {
      return match.toUpperCase();
    });
  }
}




// transform(value: string, args: any[]): string {
//     if (value === null) return 'Not assigned';
//     return value.charAt(0).toUpperCase() + value.slice(1);
//   }
