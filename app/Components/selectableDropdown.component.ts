import { Component, Output, Input, EventEmitter, trigger, transition, style, animate } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MandatoryHeader } from "../Models/mandatoryHeader";
import { HeaderMapper } from "../Models/HeaderMapper";
import { DocumentVariable } from "../Models/documentVariable";

import { PreparationService } from "../Services/preparation.service";

@Component({
    moduleId: module.id,
    selector: 'selectable-Dropdown',
    templateUrl: '../Views/Publipostage/selectableDropdown.component.html'
})
export class SelectableDropdown {

    @Input('mandatoryHeaders') mandatoryHeaders: MandatoryHeader[];
    @Input('headerMapper') headerMapper: HeaderMapper;
    @Input('documentVariables') documentVariables: DocumentVariable[];
    @Input('index') index: number;

    @Output('mappers') mappers: EventEmitter<HeaderMapper[]> = new EventEmitter<HeaderMapper[]>();
    @Output('avaliableHeaders') avaliableHeaders: EventEmitter<MandatoryHeader[]> = new EventEmitter<MandatoryHeader[]>();
    @Output('availableVariables') availableVariables: EventEmitter<DocumentVariable[]> = new EventEmitter<DocumentVariable[]>();
    
	@BlockUI('selectable-dropdown2') blockUIDropdown2: NgBlockUI;
	@BlockUI('selectable-dropdown3') blockUIDropdown3: NgBlockUI;
    collapse: boolean;
	
    constructor(private preparationService: PreparationService) {
        
        //alert("Hello");
    }

    ngOnInit() {
        this.collapse = this.headerMapper.Collapsed;
	}
	changeMandatory(event: Event, mapper: HeaderMapper) {
		
		this.blockUIDropdown2.start();
		this.blockUIDropdown3.start();

        let checkedItemID = +event.currentTarget["value"];

        let selectedVariable = this.documentVariables.find(x => x.DocumentVariableID == checkedItemID);

        if (event.currentTarget["id"].indexOf("mandatory") !== -1) {
            if (mapper.MandatoryHeaderID != null && mapper.MandatoryHeaderID == checkedItemID) {
                mapper.MandatoryHeaderID = null;
            }
            else {
                mapper.MandatoryHeaderID = checkedItemID;
            }
        }
        else if (event.currentTarget["id"].indexOf("custom") !== -1) {
            if (event.target["checked"]) {
                this.documentVariables.find(x => x.DocumentVariableID == checkedItemID).AdditionalCSVHeaderID = mapper.CSVHeaderID;                
                selectedVariable.AdditionalCSVHeaderID = mapper.CSVHeaderID;
                mapper.DocumentVariables.concat(selectedVariable);                
            }
            else {
                mapper.DocumentVariables.filter(x => x.DocumentVariableID === checkedItemID);
                this.documentVariables.find(x => x.DocumentVariableID == checkedItemID).AdditionalCSVHeaderID = null;
            }            
        }
        var response = null;
        response = this.preparationService.insertHeaderMapper(mapper, selectedVariable);
        response.subscribe(response => {
            let mappers: HeaderMapper[] = response["Mappers"];
            let headers: MandatoryHeader[] = response["MandatoryHeaders"];
            let variables: DocumentVariable[] = response["DocumentVariables"];
            mappers.find(x => x.MandatoryHeaderMapperID == mapper.MandatoryHeaderMapperID).Collapsed = true;
            this.mappers.emit(mappers);
            this.avaliableHeaders.emit(headers);
            this.availableVariables.emit(variables);
			this.blockUIDropdown2.stop();
			this.blockUIDropdown3.stop();
        })
    }
    
    isMatched(variable: DocumentVariable) {
        if (this.headerMapper != null && this.headerMapper.DocumentVariables != null) {
            return this.headerMapper.DocumentVariables.some(v => v.AdditionalCSVHeaderID == variable.AdditionalCSVHeaderID);
        }        
    }

    showSelected(mapper: HeaderMapper): string {
        if (mapper != null && mapper.MandatoryHeaderID != null) {            
            return this.mandatoryHeaders.find(x => x.MandatoryHeaderID == mapper.MandatoryHeaderID).MandatoryHeaderName;
        }
        else {
            if (mapper.DocumentVariables.length > 0) {
                return mapper.DocumentVariables[0].VariableName;
            }
            else {
				return "Sélectionner le champs";
            }
            
        }
    }

}

