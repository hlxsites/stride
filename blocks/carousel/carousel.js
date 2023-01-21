export default async function decorate(block) {
  // setup button navigation
  const buttons = document.createElement('div');
  buttons.className = 'carousel-buttons';
  block.parentElement.prepend(buttons);
  block.addEventListener('scroll', () => {
    [...block.children].forEach((slide, j) => {
      const { left } = slide.getBoundingClientRect();
      // when slide is 50% visible, update selected button
      if (left < (window.innerWidth / 2)) {
        const btns = [...buttons.children];
        btns.forEach((b) => b.classList.remove('selected'));
        btns[j].classList.add('selected');
      }
    });
  });

  // separate slides into images and text
  [...block.children].forEach((row, i) => {
    const classes = ['image', 'text'];
    classes.forEach((c, j) => {
      const col = row.children[j];
      if (col) col.classList.add(`carousel-${c}`);
      if (col && c === 'text') {
        // reset to secondary buttons
        const btns = col.querySelectorAll('.button');
        btns.forEach((btn) => {
          btn.classList.remove('primary');
          btn.classList.add('secondary');
        });
      }
    });
    // create slide button
    const button = document.createElement('button');
    if (!i) button.classList.add('selected');
    button.addEventListener('click', () => {
      block.scrollTo({
        top: 0,
        left: row.offsetLeft - row.parentNode.offsetLeft,
        behavior: 'smooth',
      });
    });
    buttons.append(button);
  });
}
