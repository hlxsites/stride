export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // setup variants
  const variants = [...block.classList];
  if (variants.includes('dark')) {
    const buttons = block.querySelectorAll('.button');
    buttons.forEach((button) => {
      button.classList.remove('primary');
      button.classList.add('secondary');
    });
  }

  if (variants.includes('multi-img')) {
    const imgCols = block.querySelectorAll('.columns-img-col');
    imgCols.forEach((imgCol) => {
      // unwrap pictures
      const pics = imgCol.querySelectorAll('picture');
      imgCol.innerHTML = '';
      pics.forEach((pic, i) => {
        imgCol.append(pic);
        if (!i) pic.classList.add('expanded');
      });
    });
  }
}
