import { Pipe, PipeTransform } from '@angular/core';
import { DocumentVariable } from "../Models/documentVariable";
import { HeaderMapper } from "../Models/headerMapper";

@Pipe({ name: 'variable' })
export class VariablePipe implements PipeTransform {
    transform(value: DocumentVariable[], args: HeaderMapper): any {
        if (!(value && args)) return value;


        return value.filter(x => x.AdditionalCSVHeaderID == args.CSVHeaderID);
    }
}