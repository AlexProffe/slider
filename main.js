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
    console.log(slideIndex);
    const leftItems = Math.abs(position / itemWidth);

    position +=
      leftItems > slidesPerSlide
        ? itemWidth * slidesPerSlide
        : itemWidth * leftItems;

    moveWrapper();
    rangeCheck();
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
    console.log(slideIndex);
    const leftItems =
      itemsCount - (Math.abs(position / itemWidth) + slidesPerPage);
    position -=
      leftItems > slidesPerSlide
        ? itemWidth * slidesPerSlide
        : itemWidth * leftItems;
    moveWrapper();
    rangeCheck();
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
}

slider("slider", {
  wrapperSelector: ".slider-wrapper",
  itemSelector: ".slider-item",
  prevArrow: "prev",
  nextArrow: "next",
  slidesPerSlide: 1,
  slidesPerPage: 2,
  autoSlide: false,
  timeout: 8000,
  loop: false,
});
