/* ====================================================================
   AVSDevOps — Production JavaScript
   Mobile nav, Currency toggle, FAQ accordion, Form handling
   ==================================================================== */

(function () {
  'use strict';

  // ─── Mobile Navigation ───
  const MobileNav = {
    init() {
      const hamburger = document.getElementById('nav-hamburger');
      const menu = document.getElementById('mobile-menu');
      if (!hamburger || !menu) return;
      hamburger.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }
  };

  // ─── Currency Toggle ───
  const CurrencyToggle = {
    init() {
      document.querySelectorAll('[data-currency]').forEach(btn => {
        btn.addEventListener('click', () => {
          const currency = btn.dataset.currency;
          document.querySelectorAll('[data-currency]').forEach(b => b.classList.toggle('active', b.dataset.currency === currency));
          document.querySelectorAll('[data-price-block]').forEach(block => {
            const priceEl = block.querySelector('[data-inr]');
            if (!priceEl) return;
            const symbol = priceEl.getAttribute(`data-${currency}-symbol`);
            const amount = priceEl.getAttribute(`data-${currency}`);
            priceEl.textContent = `${symbol}${amount}`;
          });
        });
      });
    }
  };

  // ─── FAQ Accordion ───
  const FAQ = {
    init() {
      document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = btn.closest('.faq-item');
          const wasOpen = item.classList.contains('open');
          // Close all
          document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
          // Toggle current
          if (!wasOpen) item.classList.add('open');
        });
      });
    }
  };

  // ─── Contact Form ───
  const ContactForm = {
    init() {
      const form = document.getElementById('contact-form');
      if (!form) return;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const entries = Object.fromEntries(data.entries());
        // Show success
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Message Sent!';
        btn.style.background = 'rgb(var(--success))';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 3000);
        console.log('Form submission:', entries);
      });
    }
  };

  // ─── Active Nav Link ───
  const ActiveNav = {
    init() {
      const path = window.location.pathname;
      document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === path || (path === '/' && href === '/') || (path === '/index.html' && href === '/')) {
          link.classList.add('active');
        }
      });
    }
  };

  // ─── Scroll Animations ───
  const ScrollReveal = {
    init() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll('.reveal').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });
    }
  };

  // ─── Init All ───
  document.addEventListener('DOMContentLoaded', () => {
    MobileNav.init();
    CurrencyToggle.init();
    FAQ.init();
    ContactForm.init();
    ActiveNav.init();
    ScrollReveal.init();
  });
})();
