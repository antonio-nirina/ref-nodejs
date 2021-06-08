import { Component, Output, ContentChildren, QueryList, AfterContentInit, EventEmitter } from '@angular/core';
import { Tab } from './tab';

@Component({
    selector: 'tabsSender',
    template: 
    `
    <ul  class="nav nav-tabs hidden-xs">
        <li *ngFor="let tab of tabs; let i = index" (click)="selectTab(tab)" [ngClass]="{'prevent tabs-links':true}" [class.active]="tab.active">
        <a href="javascript:;" *ngIf="i==0">Expéditeur principal</a>
        </li>

        <li *ngFor="let tab of tabs; let i = index" (click)="selectTab(tab)" [ngClass]="{'prevent tabs-links':true}" [class.active]="tab.active">
        <a href="javascript:;" *ngIf="activeMiddleTabs.includes(i)">Expéditeur {{i+1}}</a>
        </li>

        <li *ngFor="let tab of tabs; let i = index" (click)="selectTab(tab)" [ngClass]="{'prevent tabs-links':true}" [class.active]="tab.active">
        <a href="javascript:;" *ngIf="i==tabs.length-1">+ Nouvel expéditeur</a>
        </li>

        <li class="pull-right">
        <a href="javascript:;" class="dropdown-toggle mt-4" data-toggle="dropdown"> <span class="icon icon-arrow-gray"> </span></a>
        <ul class="dropdown-menu dropdown-menu-right" (change)="select(ddSenderAddress.value)" #ddSenderAddress>
            <li *ngFor="let tab of tabs; let i = index" (click)="selectTab(tab)" [ngClass]="{'prevent tabs-links':true}" [class.active]="tab.active">
                <a href="javascript:;" *ngIf="i<tabs.length-1">{{tab.title}}</a>
            </li>
        </ul>
        </li>


      <div class="clear"></div>
    </ul>
    <div class="tab-content">
        <ng-content></ng-content>
    </div>
  `,
    styles: ['a.disabled {color: gray;cursor: not-allowed;text-decoration: underline;pointer-events: none;}']
})
export class TabsSender implements AfterContentInit {
    @ContentChildren(Tab) tabs: QueryList<Tab>;
    activeMiddleTabs: number[];
    @Output() tabChanged: EventEmitter<number> = new EventEmitter<number>();

    ngAfterContentInit() {

        this.activeMiddleTabs = [];
        // get all active tabs
        let activeTabs = this.tabs.filter((tab) => tab.active);

        // if there is no active tab set, activate the first
        if (activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
    }

    selectTab(tab: Tab) {

        let tabArray: Array<Tab> = this.tabs.toArray();
       
        this.tabs.toArray().forEach(tab => tab.active = false);

        // activate the tab the user has clicked on.
        tab.active = true;

        let indexactive = tabArray.findIndex(x => x.active == true); 

        this.tabs.toArray().forEach((x, i) => {

            if (x == this.tabs.first || x == this.tabs.last) {
                x.visible = true;
                this.tabChanged.emit(indexactive);
                return;
            }

            x.visible = false;


        });

        tab.visible = true;

        if (this.activeMiddleTabs.length == 0) {
            if (tabArray.length > 2) {
                tabArray[1].visible = true;
                this.activeMiddleTabs.push(1);
            }
        }

        if (this.activeMiddleTabs.length == 1) {
            if (tabArray.length > 3) {
                if (this.activeMiddleTabs.includes(1))
                {
                    tabArray[2].visible = true;
                    this.activeMiddleTabs.push(2);
                }
                else
                {
                    tabArray[1].visible = true;
                    this.activeMiddleTabs.push(1);
                }
            }
        }
 

        if (tabArray.length > 4)
        {
            if (!(this.activeMiddleTabs.includes(indexactive) || indexactive == 0 || indexactive == tabArray.length - 1) || this.activeMiddleTabs.includes(tabArray.length - 1)) {
                this.activeMiddleTabs.length = 0;

                let firstMiddleIndex = indexactive;
                if (firstMiddleIndex == 0)
                {
                    firstMiddleIndex = 1;
                    tabArray[1].visible = true;
                }

                this.activeMiddleTabs.push(firstMiddleIndex);
                var nextIndex = firstMiddleIndex + 1;
                if (nextIndex == tabArray.length - 1) {
                    nextIndex = indexactive - 1;
                }
                tabArray[nextIndex].visible = true;
                this.activeMiddleTabs.push(nextIndex);
            }
            else
            {
                tabArray[this.activeMiddleTabs[0]].visible = true;
                tabArray[this.activeMiddleTabs[1]].visible = true;
            }
        }

        this.tabChanged.emit(indexactive);
    }

}
