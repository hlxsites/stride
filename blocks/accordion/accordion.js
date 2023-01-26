export default async function decorate(block) {
  [...block.children].forEach((row, i) => {
    const h2s = row.querySelectorAll('h2');
    const button = document.createElement('button');
    button.className = 'accordion-button';
    button.id = `button${i + 1}`;
    button.setAttribute('type', 'button');
    button.setAttribute('aria-expanded', !i);
    button.setAttribute('aria-controls', `content${i + 1}`);
    button.addEventListener('click', () => {
      // eslint-disable-next-line eqeqeq
      const expanded = button.getAttribute('aria-expanded') == 'true';
      block.querySelectorAll('.accordion-button').forEach((btn) => btn.setAttribute('aria-expanded', false));
      button.setAttribute('aria-expanded', !expanded);
    });
    h2s.forEach((h2) => button.append(h2));
    row.prepend(button);
    const content = row.querySelector('div');
    content.id = `content${i + 1}`;
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', `button${i + 1}`);
    content.className = 'accordion-content';
  });
}
