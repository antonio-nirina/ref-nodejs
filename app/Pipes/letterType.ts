import { Pipe, PipeTransform } from '@angular/core';
import { LetterType } from "../Models/letterType";

@Pipe({ name: 'letterType' })
export class LetterTypePipe implements PipeTransform {
    transform(value: number, args: LetterType[]): any {
        if (!(value && args)) return value;


        return args.find(x => x.LetterTypeID == value).LetterTypeName;
    }
}