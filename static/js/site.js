// Mobile menu toggle and early-access form handling.
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  for (const form of document.querySelectorAll('form[data-signup]')) {
    const status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (form.dataset.configured !== 'true') {
        status.textContent = 'Sign-up is not connected yet. Set formAction in site.config.json to enable it.';
        status.className = 'form-status text-amber-300';
        return;
      }
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      status.textContent = 'Sending…';
      status.className = 'form-status text-slate-400';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        status.textContent = "Thanks, we'll be in touch shortly.";
        status.className = 'form-status text-emerald-300';
      } catch {
        status.textContent = 'Something went wrong. Please try again.';
        status.className = 'form-status text-rose-300';
      } finally {
        button.disabled = false;
      }
    });
  }
});
