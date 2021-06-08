import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'countdownFormatFrench'
})
export class CountdownFormatFrenchPipe implements PipeTransform {
    transform(value: string) {
        if (value)
        {
            var parts = value.split('/');
            return (parts[0] + "h " + parts[1] + "mn " + parts[2] + "s");
        }
        else
        {
            return "";
        }
    }
}