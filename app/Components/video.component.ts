import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
	selector: 'video-tutorial',
	templateUrl: './src/app/Views/Publipostage/video.component.html'
})

export class VideoComponent {

	//constructor() {
	//    SimplePageScrollConfig.defaultScrollOffset = 0;
	//}
	
	constructor() {
		
	}

	autoPlayYouTubeModal() {
		var trigger = $('#play-video');
	trigger.click(function () {
		var theModal = $(this).data("target"),
			videoSRC = $(this).attr("data-theVideo"),
			videoSRCauto = videoSRC + "?autoplay=1";
		$(theModal + ' iframe').attr('src', videoSRCauto);
		$(theModal + ' button.close').click(function () {
			$(theModal + ' iframe').attr('src', videoSRC);
		});
		$(theModal).click(function () {
			$(theModal + ' iframe').attr('src', videoSRC);
		});
	});
	}
	ngOnInit() {
		this.autoPlayYouTubeModal();
		//if (this.auth.loggedIn()) {
		//    this.auth.startupTokenRefresh();
		//}
	}
	
	//goTo(location: string): void {
	//	window.location.hash = location;
	//}
}