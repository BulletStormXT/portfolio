document.addEventListener("DOMContentLoaded", function () {
  const pdfContainers = document.querySelectorAll(".pdf-lazy");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const container = entry.target;
          const src = container.getAttribute("data-src");

          if (src) {
            const iframe = document.createElement("iframe");
            iframe.src = src;
            iframe.width = "100%";
            iframe.height = "500px";
            iframe.style.border = "none";

            container.appendChild(iframe);
            obs.unobserve(container); // nur einmal laden
          }
        }
      });
    },
    {
      rootMargin: "100px", // lädt schon kurz bevor es sichtbar wird
    }
  );

  pdfContainers.forEach((container) => observer.observe(container));
});
