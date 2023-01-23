export default function decorate(block) {
  const stats = block.querySelectorAll(':scope div > div');
  stats.forEach((stat, i) => {
    // wrap stat content
    const content = stat.querySelectorAll('h2 ~ *');
    const wrapper = document.createElement('div');
    wrapper.className = 'stat-content';
    wrapper.append(...content);
    stat.append(wrapper);
    // rewrite more semantically appropriate title
    const h2 = stat.querySelector('h2');
    const title = document.createElement('p');
    title.className = 'stat-title';
    title.innerHTML = h2.innerHTML;
    h2.replaceWith(title);
    // set mouse hover effect
    if (!i) stat.setAttribute('data-active', true);
    stat.addEventListener('mouseenter', () => {
      stats.forEach((s) => s.removeAttribute('data-active'));
      stat.setAttribute('data-active', true);
    });
  });
}
