document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".sidebar .nav a");

    window.addEventListener("scroll", () => {
        let scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            if (
            scrollPos >= section.offsetTop &&
            scrollPos < section.offsetTop + section.offsetHeight
            ) {
            const id = section.getAttribute("id");
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("active");
                }
            });
            }
        });
    });
});

document.querySelectorAll('.sidebar .nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});
  