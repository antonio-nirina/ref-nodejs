import { Component } from "@angular/core";
@Component({
    selector: "page-not-found",
    template: `
 <div class="text-center mt-20 mb-20">
	<img src="../Images/404-gfx-new.png" class="img-responsive inline-block"  />
 </div>
 `
})
export class PageNotFoundComponent {
    title = "Page not Found";
}