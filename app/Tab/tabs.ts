import { Component, ContentChildren, QueryList, AfterContentInit, Input } from '@angular/core';
import { Tab } from './tab';

@Component({
    selector: 'tabs',
    template: 
    `<div class="steps">
<ng-container *ngIf="allowClickOnTabs">
      <a *ngFor="let tab of tabs; let i = index" (click)="selectTab(tab)" [ngClass]="{'prevent tabs-links':true}">
        <div [class.active]="tab.active" class="step"><span class="prev-arrow"></span>{{tab.title}}<span [class.next-arrow]="tab.visible" [hidden]="tab.visible" ></span></div>
      </a>
</ng-container>
<ng-container *ngIf="!allowClickOnTabs">
      <a *ngFor="let tab of tabs; let i = index" [ngClass]="{'prevent tabs-links':false}">
        <div [class.active]="tab.active" class="step"><span class="prev-arrow"></span>{{tab.title}}<span [class.next-arrow]="tab.visible" [hidden]="tab.visible" ></span></div>
      </a>
</ng-container>
        <div class="clear"></div>
    </div>
    <div class="step-box">
        <ng-content></ng-content>
    </div>
  `,
    styles: ['a.disabled {color: gray;cursor: not-allowed;text-decoration: underline;pointer-events: none;}']
})
export class Tabs implements AfterContentInit {

    @ContentChildren(Tab) tabs: QueryList<Tab>;
    @Input('allowClickOnTabs') allowClickOnTabs: boolean;

    // contentChildren are set
    ngAfterContentInit() {
        // get all active tabs
        let activeTabs = this.tabs.filter((tab) => tab.active);

        // if there is no active tab set, activate the first
        if (activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
    }

    selectTab(tab: Tab) {
        // deactivate all tabs
        //if (tab.isDisabled == true)
        //    return;
        let tabArray: Array<Tab> = this.tabs.toArray();
       
        this.tabs.toArray().forEach(tab => tab.active = false);        

        this.tabs.toArray().forEach(tab => tab.visible = true);
        // activate the tab the user has clicked on.
        tab.active = true;

        let indexactive = tabArray.findIndex(x => x.active == true);
       
        if (indexactive > 0)
        {
            let indexprevious = indexactive - 1;
            let tabprethodni = tabArray[indexprevious];
            tabprethodni.visible = false;
        }

       
    }

}
