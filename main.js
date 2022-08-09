const defaultOptions = {
    wrapperSelector: '.slider-wrapper',
    itemSelector: '.slider-item',
    prevArrow: 'prev',
    nextArrow: 'next',
    slidesPerSlide: 2,
    slidesPerPage: 5,
};

function slider(selector, options = {}) {
    const mergedOptions = {...defaultOptions, ...options};
    const { wrapperSelector, itemSelector, prevArrow, nextArrow, slidesPerPage, slidesPerSlide } = mergedOptions;
    const prevArrowButton = document.getElementById(prevArrow);
    const nextArrowButton = document.getElementById(nextArrow);

    const swipePositions = {};

    const slider = document.getElementById(selector);
  

    const wrapper = slider.querySelector(wrapperSelector);
    const items =   wrapper.querySelectorAll(itemSelector);
    const itemsCount = items.length;

    let sliderWidth, itemWidth, position;

    const caluclateSliderItemWidth = () => {
        const previousWidth = itemWidth;
       
        sliderWidth = slider.offsetWidth;
        itemWidth = sliderWidth / slidesPerPage;
        items.forEach(item => item.style.width = `${itemWidth}px`);
        const newPosition = isNaN(position / previousWidth) ? 0 : (position / previousWidth) * itemWidth;
        position = newPosition;
        wrapper.classList.add('no-anim');
        moveWrapper();
        setTimeout(() => {wrapper.classList.remove('no-anim')}, 0);
    }

    caluclateSliderItemWidth();

    window.addEventListener('resize', caluclateSliderItemWidth);

    prevArrowButton.addEventListener('click', calculateDescendingDirection);

    function calculateDescendingDirection() {
        const leftItems = Math.abs(position / itemWidth);

        position += leftItems > slidesPerSlide
            ? itemWidth * slidesPerSlide
            : itemWidth * leftItems;

        moveWrapper();
        rangeCheck();
    };

    nextArrowButton.addEventListener('click', calculateAscendingDirection);

    function calculateAscendingDirection() {
        const leftItems = itemsCount - (Math.abs(position / itemWidth) + slidesPerPage);
        position -= leftItems > slidesPerSlide 
            ? itemWidth * slidesPerSlide
            : itemWidth * leftItems;
        moveWrapper();
        rangeCheck();
    }

    function moveWrapper() {
        wrapper.style.transform = `translateX(${position}px)`;
    }

    function rangeCheck() {
        position === 0
            ? prevArrowButton.setAttribute('disabled', true)
            : prevArrowButton.removeAttribute('disabled');

        const rightEdgePosition = (itemsCount - slidesPerPage) * itemWidth;

        Math.abs(position) === rightEdgePosition
            ? nextArrowButton.setAttribute('disabled', true)
            : nextArrowButton.removeAttribute('disabled');  
    }

    rangeCheck();

    wrapper.addEventListener('touchstart', event => {
       swipePositions.startPosition = event.changedTouches[0].clientX;
    }, {passive: true});

    wrapper.addEventListener('touchend', event => {
        const endPosition = event.changedTouches[0].clientX;
        const { startPosition } = swipePositions;
        const difference = startPosition - endPosition;
        if(Math.abs(difference) < 50) {
            return;
        }
       
        difference > 0 
            ? calculateAscendingDirection()
            : calculateDescendingDirection();
    })
}   

slider('slider', {
    wrapperSelector: '.slider-wrapper',
    itemSelector: '.slider-item',
    prevArrow: 'prev',
    nextArrow: 'next',
    slidesPerSlide: 1,
    slidesPerPage: 2,
});