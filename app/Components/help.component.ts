import { Component } from '@angular/core';
import { AuthenticationService } from '../Services/index';

declare var $: any;
@Component({
	selector: 'help-section',
	templateUrl: './src/app/Views/Publipostage/help.component.html'
})

//******* HELP STEP NUMBERS *******//
//        HOME  0 - 29
//export enum AddressesModalState {
//    ERROR = -1,
//    NOT_INITIALIZED = 0,
//    PREVIEW_ADDRESSES = 1,
//    COMPLETED = 2,
//    SELECT_LETTER_TYPE = 3,
//    SELECT_SENDER = 4,
//    SELECT_METHOD = 5,
//    UPLOAD_FILE = 6,
//    SELECT_GROUPS = 7,
//    FIX_ADDRESSES = 8,
//    CUSTOM_FIELDS_ASSOCIATION = 9,
//    FILL_IN_CUSTOM_FIELDS = 10,
//    MAPP_HEADERS = 11
//}
//        MES MAILING 30 - 49
//
//        MES ADRESSES EXPEDITEURS 50 - 69
//              
//        MES MAILING  DEST 70 - 89
//              
//        DEVIS 90 - 109
//              
//        AIDE 110 - 129
//             
//                .......

export class HelpComponent {

    openSubText: boolean;
    helpStep: number;
    titleHandle: string;
    hideIntro1: boolean;
    hideIntro2: boolean;


    constructor(private auth: AuthenticationService) {
        this.openSubText = false;
        this.helpStep = 0;
        this.titleHandle = "En résumé";
        this.hideIntro1 = false;
        this.hideIntro2 = true;
	}


    ngOnInit() {
        this.auth.observeStepHelp.subscribe(
            (value: number) => {
                this.helpStep = value;
                //console.log("HELP COMPONENT, NUMBER STEP " + this.helpStep);
                switch (this.helpStep)
                {
                    case 0: {
                        this.titleHandle = "En résumé";
                        this.setOpenSubtitle("");
                        break;
                    }
                    case 1: {
                        this.titleHandle = "Prévisualisation";
                        this.setOpenSubtitle("Help8");
                        break;
                    }
                    case 2: {
                        this.titleHandle = "Options des plis";
                        this.setOpenSubtitle("Help9");
                        break;
                    }
                    case 3: {
                        this.titleHandle = "Type d'affranchissement";
                        this.setOpenSubtitle("Help3");
                        break;
                    }
                    case 4: {
                        this.titleHandle = "Choisissez l'expéditeur";
                        this.setOpenSubtitle("Help6");
                        break;
                    }
                    case 5: {
                        this.titleHandle = "Sélectionnez méthode";
                        this.setOpenSubtitle("Help4");
                        break;
                    }
                    case 6: {
                        this.titleHandle = "Importer les adresses";
                        this.setOpenSubtitle("Help4a");
                        break;
                    }
                    case 7: {
                        this.titleHandle = "des groupes";
                        this.setOpenSubtitle("Help4b");
                        break;
                    }
                    case 8: {
                        this.titleHandle = "Corriger les adresses";
                        this.setOpenSubtitle("Help7a");
                        break;
                    }
                    case 9: {
                        this.titleHandle = "step 9";
                        this.setOpenSubtitle("");
                        break;
                    }
                    case 10: {
                        this.titleHandle = "les champs personnalisés";
                        this.setOpenSubtitle("Help5b");
                        break;
                    }
                    case 11: {
						this.titleHandle = "colonne de titre";
                        this.setOpenSubtitle("Help5a");
                        break;
					}
					case 20: {
						this.titleHandle = "Previsualiser";
						this.setOpenSubtitle("Help10");
						break;
					}
					case 21: {
						this.titleHandle = "Publipostage soumis";
						this.setOpenSubtitle("Help13");
						break;
					}
                    default: {
                        this.titleHandle = "En résumé";
                        this.setOpenSubtitle("");
                        break;
                    }
                } 
            }
        );



		$('.open-help-subitem').on('click', function () {
			if ($(this).parents('li').hasClass('opened')) {
				$(this).parents('li').removeClass('opened');
			}
			else {
				$('.help-item-intro').find('li').removeClass('opened');
				$(this).parents('li').addClass('opened');
			}
		});

		

	//	$('.open-help-subitem').on('click', function () {
	//		$(this).siblings('.help-subitem').removeClass('opened');
	//	});
	}

    setOpenSubtitle(id) {
        let elements = document.getElementById("HelpList").children;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].id == id) {
                if (!elements[i].classList.contains('opened')) {
                    elements[i].classList.add('opened');
                }
            }
            else {
                elements[i].classList.remove('opened');
            }            
        }
        if (id != null && id != "")
        {
            this.hideIntro1 = true;
            this.hideIntro2 = false;
        }
        
        //if (id == "Help4")
        //{
        //    document.getElementById("Help4a").classList.add('opened');
        //    document.getElementById("Help4b").classList.add('opened');
        //}

    }

}
