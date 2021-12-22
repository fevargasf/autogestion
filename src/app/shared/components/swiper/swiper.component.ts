import {Component, OnInit} from '@angular/core';
import SwiperCore, {A11y, Navigation, Pagination, Scrollbar,} from 'swiper/core';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss']
})
export class SwiperComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  public closeModal(): void {

  }


  public onSwiper(swiper): void {
    console.log(swiper);
  }

  public onSlideChange(): void {
    console.log('slide change');
  }
}
