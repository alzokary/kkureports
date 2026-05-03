// site.js — General utilities for KKUPMO

// Mobile sidebar toggle via overlay
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const toggle = document.getElementById('sidebarToggle');
        const wrapper = document.querySelector('.pmo-wrapper');
        if (!toggle || !wrapper) return;

        toggle.addEventListener('click', function () {
            if (window.innerWidth < 992) {
                wrapper.classList.toggle('sidebar-open');
            } else {
                wrapper.classList.toggle('sidebar-collapsed');
            }
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function (e) {
            if (window.innerWidth < 992 &&
                wrapper.classList.contains('sidebar-open') &&
                !e.target.closest('.pmo-sidebar') &&
                !e.target.closest('#sidebarToggle')) {
                wrapper.classList.remove('sidebar-open');
            }
        });
    });
})();
