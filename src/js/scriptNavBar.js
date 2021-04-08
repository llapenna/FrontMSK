            var navLinks = document.querySelectorAll('.nav-item');
            var menuToggle = document.getElementById('navbarSupportedContent');
            var bsCollapse = new bootstrap.Collapse(menuToggle);
            navLinks.forEach(function (myfunct) {myfunct.addEventListener('click',function () { bsCollapse.toggle(); })});
            