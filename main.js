const defaultOptions = {
  wrapperSelector: ".slider-wrapper",
  itemSelector: ".slider-item",
  prevArrow: "prev",
  nextArrow: "next",
  slidesPerSlide: 2,
  slidesPerPage: 5,
};

function slider(selector, options = {}) {
  const mergedOptions = { ...defaultOptions, ...options };
  const {
    wrapperSelector,
    itemSelector,
    prevArrow,
    nextArrow,
    slidesPerPage,
    slidesPerSlide,
    timeout,
    autoSlide,
    loop,
  } = mergedOptions;
  const prevArrowButton = document.getElementById(prevArrow);
  const nextArrowButton = document.getElementById(nextArrow);

  const swipePositions = {};

  const slider = document.getElementById(selector);

  const wrapper = slider.querySelector(wrapperSelector);
  const items = wrapper.querySelectorAll(itemSelector);
  const itemsCount = items.length;
  let sliderWidth, itemWidth, position, isEnd, isStart, intervalID, slideIndex = 0;

  generatePreviewItems();

  const previewWrapperArray =  Array.from(slider.querySelector('.slider-preview').children);

  togglePreviewItemClick();

  function togglePreviewItemClick() {
    previewWrapperArray[slideIndex].classList.add('active');

    previewWrapperArray.forEach((previewItem, index, array) => {
      previewItem.addEventListener('click', () => {
        selectSlide(index);
      });
    });

  }

  function clearPreviewItemsActive() {
    previewWrapperArray.forEach(item => item.classList.remove('active'));
    previewWrapperArray[slideIndex].classList.add('active');
  }


  function generatePreviewItems() {
    const previewItemsCount = calculatePreviewItemsCount();
    
    const previewItemsWrapper = createElementWithOptions('div');
    previewItemsWrapper.classList.add('slider-preview');

    slider.insertAdjacentElement('beforeend', previewItemsWrapper);

    for (let i = 0; i < previewItemsCount; i++) {
      const previewItem = createElementWithOptions('span');
      previewItem.classList.add('slider-preview__item');

      previewItemsWrapper.insertAdjacentElement('beforeend', previewItem);
    }
  }

  const caluclateSliderItemWidth = () => {
    const previousWidth = itemWidth;

    sliderWidth = slider.offsetWidth;
    itemWidth = sliderWidth / slidesPerPage;
    items.forEach((item) => (item.style.width = `${itemWidth}px`));
    const newPosition = isNaN(position / previousWidth)
      ? 0
      : (position / previousWidth) * itemWidth;
    position = newPosition;
    wrapper.classList.add("no-anim");
    moveWrapper();

    setTimeout(() => {
      wrapper.classList.remove("no-anim");
    }, 0);
  };

  caluclateSliderItemWidth();

  window.addEventListener("resize", caluclateSliderItemWidth);

  prevArrowButton.addEventListener("click", () => {
    if (autoSlide) {
      clearInterval(intervalID);
      triggerAutoSlide();
    }
    calculateDescendingDirection();
  });

  function calculateDescendingDirection() {
    slideIndex--;
  
    const leftItems = Math.abs(position / itemWidth);

    position +=
      leftItems > slidesPerSlide
        ? itemWidth * slidesPerSlide
        : itemWidth * leftItems;

    moveWrapper();
    rangeCheck();
    clearPreviewItemsActive();
  }

  nextArrowButton.addEventListener("click", () => {
    if (autoSlide) {
      clearInterval(intervalID);
      triggerAutoSlide();
    }
    calculateAscendingDirection();
  });

  function calculateAscendingDirection() {
    slideIndex++;
    const leftItems =
      itemsCount - (Math.abs(position / itemWidth) + slidesPerPage);
    position -=
      leftItems > slidesPerSlide
        ? itemWidth * slidesPerSlide
        : itemWidth * leftItems;
    moveWrapper();
    rangeCheck();
    clearPreviewItemsActive();
  }

  function moveWrapper() {
    wrapper.style.transform = `translateX(${position}px)`;
  }

  function rangeCheck() {
    if (position === 0) {
      prevArrowButton.setAttribute("disabled", true);
      isStart = true;
      isEnd = false;
    } else {
      prevArrowButton.removeAttribute("disabled");
    }

    const rightEdgePosition = (itemsCount - slidesPerPage) * itemWidth;
    if (Math.abs(position) === rightEdgePosition) {
      nextArrowButton.setAttribute("disabled", true);
      isStart = false;
      isEnd = true;
    } else {
      nextArrowButton.removeAttribute("disabled");
    }
  }

  rangeCheck();

  wrapper.addEventListener(
    "touchstart",
    (event) => {
      swipePositions.startPosition = event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  wrapper.addEventListener("touchend", (event) => {
    const endPosition = event.changedTouches[0].clientX;
    const { startPosition } = swipePositions;
    const difference = startPosition - endPosition;
    if (Math.abs(difference) < 50) {
      return;
    }

    difference > 0
      ? calculateAscendingDirection()
      : calculateDescendingDirection();
  });

  function triggerAutoSlide() {
    intervalID = setInterval(() => {
      isStart = isStart ?? true;
      if (autoSlide && !loop) {
        isNoLoopSliderTurnEnd();
        return;
      } else if (autoSlide && loop) {
        isStart
          ? calculateAscendingDirection()
          : calculateDescendingDirection();
      }
    }, timeout ?? 5000);
  }

  function isNoLoopSliderTurnEnd() {
    return isEnd 
        ? clearInterval(intervalID)
        : calculateAscendingDirection();
  }

  autoSlide && triggerAutoSlide();

  function calculatePreviewItemsCount() {
    return itemsCount - slidesPerPage + 1;
  }

  function createElementWithOptions(elementName, options) {
    return Object.assign(document.createElement(elementName), options);
  }

  function selectSlide(index) {
    if(Math.abs(index - slideIndex) > 2) {
      wrapper.classList.add("long-anim");
    }

    if (autoSlide) {
      clearInterval(intervalID);
      triggerAutoSlide();
    }
   

    slideIndex = index;
    position = slideIndex * itemWidth * -1;
    moveWrapper();
    rangeCheck();

    clearPreviewItemsActive();
    setTimeout(() => {
      wrapper.classList.remove("long-anim");
    }, 0)
  }
}

slider("slider", {
  wrapperSelector: ".slider-wrapper",
  itemSelector: ".slider-item",
  prevArrow: "prev",
  nextArrow: "next",
  slidesPerSlide: 1,
  slidesPerPage: 2,
  autoSlide: true,
  timeout: 8000,
  loop: true,
});
