import '~/sass/detail-card.scss';

import Flickity from 'flickity';

window.addEventListener('DOMContentLoaded', () => {
  (function initDetailSlider() {
    const _detailSlider = document.querySelector('.detail-slider');
    const flktyLangingSlider = new Flickity(_detailSlider, {
      // options
      cellAlign: 'center',
      // contain: true,
      autoPlay: true
    });
  })();
});
