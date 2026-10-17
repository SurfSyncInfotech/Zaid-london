$(function () {
    initTestimonialSlider();
    initAnimateData();
    initNavLink();
    initCounter();
    initSidebar();
    initSidebarDropdown();
    initSidebarMenu();
    initMultiSelectDropdown();
});

/* ==========================
   TESTIMONIAL SLIDER
========================== */
function initTestimonialSlider() {
    const $slider = $("#testimonial-slider");
    const $slides = $(".testimonial-slide");
    const totalSlides = $slides.length;
    let currentIndex = 0;

    function updateSlider() {
        $slider.css("transform", `translateX(-${currentIndex * 100}%)`);
        $slides.removeClass("active").eq(currentIndex).addClass("active");
        $(".testimonial-nav-btn").removeClass("active").eq(currentIndex).addClass("active");
    }

    $("#testimonial-wrapper").on("click", "#next", function () {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    });

    $("#testimonial-wrapper").on("click", "#prev", function () {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

    $("#testimonial-wrapper").on("click", ".testimonial-nav-btn", function () {
        currentIndex = $(this).index();
        updateSlider();
    });

    updateSlider();
}

/* ==========================
   CUSTOM DROPDOWN
========================== */
function initCustomDropdown() {
    $(document).on("click", ".dropdown-select", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $container = $(this).closest(".dropdown-container");
        $(".dropdown-container").not($container).removeClass("active");
        $(".fa-caret-down").not($(this).find(".fa-caret-down")).removeClass("rotate");

        $container.toggleClass("active");
        $(this).find(".fa-caret-down").toggleClass("rotate");
    });

    $(document).on("click", ".dropdown-option", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $option = $(this);
        const $container = $option.closest(".dropdown-container");

        $container.find(".selected-text")
            .text($option.text().trim())
            .addClass("has-value");

        $container.find(".dropdown-value")
            .val($option.data("value"))
            .trigger("change");

        $container.find(".dropdown-option").removeClass("selected");
        $option.addClass("selected");

        $container.removeClass("active");
        $container.find(".fa-caret-down").removeClass("rotate");
    });

    $(document).on("click", function (e) {
        if (!$(e.target).closest(".dropdown-container").length) {
            $(".dropdown-container").removeClass("active");
            $(".fa-caret-down").removeClass("rotate");
        }
    });
}

/* ==========================
   ANIMATE ON SCROLL
========================== */
function initAnimateData() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const $el = $(entry.target);
            setTimeout(() => {
                $el.addClass($el.data("animate")).css("opacity", 1);
                observer.unobserve(entry.target);
            }, $el.data("delay") || 0);
        });
    }, { threshold: 0.1 });

    $("[data-animate]").each(function () {
        observer.observe(this);
    });
}

/* ==========================
   MULTI SELECT DROPDOWN
========================== */
function initMultiSelectDropdown() {
    function update($dropdown) {
        const values = [];
        const $options = $dropdown.find(".dd-multi__option.active");

        $options.each(function () {
            values.push($(this).data("value"));
        });

        $dropdown.find(".dd-multi__value").val(values.join(","));
        renderChips($dropdown);
    }

    function renderChips($dropdown) {
        const $chips = $dropdown.find(".dd-multi__chips");
        const $active = $dropdown.find(".dd-multi__option.active");

        $chips.empty();

        if (!$active.length) {
            $chips.append('<span class="placeholder">Treatment Select</span>');
            return;
        }

        $active.each(function () {
            $chips.append(`
                <span class="dd-multi__chip">
                    ${$(this).text()}
                    <button type="button" data-value="${$(this).data("value")}">&times;</button>
                </span>
            `);
        });
    }

    $(document).on("click", ".dd-multi__select", function (e) {
        e.stopPropagation();
        $(".dd-multi").not($(this).closest(".dd-multi")).removeClass("active");
        $(this).closest(".dd-multi").toggleClass("active");
    });

    $(document).on("click", ".dd-multi__option", function (e) {
        e.stopPropagation();
        $(this).toggleClass("active");
        update($(this).closest(".dd-multi"));
    });

    $(document).on("click", ".dd-multi__chips button", function (e) {
        e.stopPropagation();
        const $dropdown = $(this).closest(".dd-multi");
        $dropdown.find(`.dd-multi__option[data-value="${$(this).data("value")}"]`)
            .removeClass("active");
        update($dropdown);
    });

    $(document).on("click", function () {
        $(".dd-multi").removeClass("active");
    });
}

/* ==========================
   NAV ACTIVE LINK
========================== */
function initNavLink() {
    const currentUrl = location.href;
    $(".navbar-nav a, .sidebar-menu a").each(function () {
        if (this.href === currentUrl) {
            $(this).addClass("active")
                .closest(".dropdown, .sidebar-dropdown")
                .addClass("active")
                .find(".sidebar-dropdown-menu")
                .addClass("active");
        }
    });
}

/* ==========================
   COUNTER
========================== */
function initCounter() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting || $(entry.target).data("counted")) return;

            const $el = $(entry.target).data("counted", true);
            const target = $el.data("target");
            let start = 0;

            function step() {
                start += Math.ceil(target / 40);
                if (start >= target) return $el.text(target);
                $el.text(start);
                requestAnimationFrame(step);
            }

            step();
        });
    }, { threshold: 0.5 });

    $(".counter").each(function () {
        observer.observe(this);
    });
}

/* ==========================
   SIDEBAR
========================== */
function initSidebar() {
    $(document).on("click", ".nav-btn", function () {
        $(".sidebar-overlay").addClass("active");
        setTimeout(() => $(".sidebar").addClass("active"), 200);
    });

    $(document).on("click", ".close-btn-sidebar, .sidebar-overlay", function () {
        $(".sidebar").removeClass("active");
        setTimeout(() => $(".sidebar-overlay").removeClass("active"), 200);
    });
}

/* ==========================
   SIDEBAR DROPDOWN
========================== */
function initSidebarDropdown() {
    $(document).on("click", ".sidebar-dropdown-btn", function () {
        const $menu = $(this).parent().next(".sidebar-dropdown-menu");
        $(".sidebar-dropdown-menu").not($menu).removeClass("active");
        $menu.toggleClass("active");
    });
}

/* ==========================
   SIDEBAR MENU ACTIVE
========================== */
function initSidebarMenu() {
    const url = location.href;
    $(".sidebar-menu a").each(function () {
        if (this.href === url) {
            $(this).closest("li").addClass("active");
        }
    });
}