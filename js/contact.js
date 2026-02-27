/* ========================================
   KREON PROJECTS — Contact Form JS
   WhatsApp Redirect on Submit
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const WHATSAPP_NUMBER = '919608219713';

    // ---- Pre-fill from URL params (from calculator page) ----
    const params = new URLSearchParams(window.location.search);
    if (params.get('project')) {
        const sel = document.getElementById('projectType');
        if (sel) sel.value = params.get('project');
    }
    if (params.get('msg')) {
        const msg = document.getElementById('message');
        if (msg) msg.value = params.get('msg');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validate()) return;

        const name = document.getElementById('fullName').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const email = document.getElementById('email').value.trim();
        const projectType = document.getElementById('projectType').value;
        const message = document.getElementById('message').value.trim();

        // Build WhatsApp message
        let waMsg = `Hi Kreon Projects! 👋\n\n`;
        waMsg += `*Name:* ${name}\n`;
        waMsg += `*Mobile:* +91 ${mobile}\n`;
        waMsg += `*Email:* ${email}\n`;
        if (projectType) waMsg += `*Project Type:* ${projectType}\n`;
        if (message) waMsg += `*Message:* ${message}\n`;
        waMsg += `\nI'd like to discuss my interior design project. Please get back to me!`;

        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;

        // Show success state
        showSuccess();

        // Open WhatsApp in new tab
        setTimeout(() => {
            window.open(waUrl, '_blank');
        }, 800);
    });

    function validate() {
        let valid = true;

        // Name
        const name = document.getElementById('fullName');
        const nameErr = document.getElementById('nameError');
        if (!name.value.trim()) {
            setError(name, nameErr, 'Please enter your name');
            valid = false;
        } else if (name.value.trim().length < 2) {
            setError(name, nameErr, 'Name must be at least 2 characters');
            valid = false;
        } else {
            clearError(name, nameErr);
        }

        // Mobile
        const mobile = document.getElementById('mobile');
        const mobileErr = document.getElementById('mobileError');
        const mobileVal = mobile.value.trim();
        if (!mobileVal) {
            setError(mobile, mobileErr, 'Please enter your mobile number');
            valid = false;
        } else if (!/^[6-9]\d{9}$/.test(mobileVal)) {
            setError(mobile, mobileErr, 'Enter a valid 10-digit Indian mobile number');
            valid = false;
        } else {
            clearError(mobile, mobileErr);
        }

        // Email
        const email = document.getElementById('email');
        const emailErr = document.getElementById('emailError');
        if (!email.value.trim()) {
            setError(email, emailErr, 'Please enter your email');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            setError(email, emailErr, 'Enter a valid email address');
            valid = false;
        } else {
            clearError(email, emailErr);
        }

        return valid;
    }

    function setError(input, errEl, msg) {
        input.classList.add('error');
        errEl.textContent = msg;
    }

    function clearError(input, errEl) {
        input.classList.remove('error');
        errEl.textContent = '';
    }

    function showSuccess() {
        const formWrap = document.querySelector('.contact-form-wrap');
        formWrap.innerHTML = `
      <div class="form-success">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <h3>Thank You, ${document.getElementById('fullName').value}!</h3>
        <p>Redirecting you to WhatsApp…</p>
        <p style="margin-top:var(--sp-md);font-size:var(--fs-small)">If WhatsApp doesn't open automatically, <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" style="color:var(--clr-accent);text-decoration:underline">click here</a>.</p>
      </div>
    `;
    }

    // ---- Real-time validation on blur ----
    document.getElementById('fullName')?.addEventListener('blur', () => {
        const name = document.getElementById('fullName');
        const err = document.getElementById('nameError');
        if (name.value.trim() && name.value.trim().length >= 2) clearError(name, err);
    });

    document.getElementById('mobile')?.addEventListener('blur', () => {
        const m = document.getElementById('mobile');
        const err = document.getElementById('mobileError');
        if (/^[6-9]\d{9}$/.test(m.value.trim())) clearError(m, err);
    });

    document.getElementById('email')?.addEventListener('blur', () => {
        const e = document.getElementById('email');
        const err = document.getElementById('emailError');
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.value.trim())) clearError(e, err);
    });

    // ---- Mobile: allow only digits ----
    document.getElementById('mobile')?.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
});
