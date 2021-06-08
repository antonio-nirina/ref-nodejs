import { Pipe, PipeTransform } from '@angular/core';
import { Country } from "../Models/country";

@Pipe({ name: 'country' })
export class CountryPipe implements PipeTransform {
    transform(value: number, args: Country[]): any {
        if (!(value && args)) return value;

        return args.find(x => x.CountryID == value).CountryName;
    }
}