// document.addEventListener("DOMContentLoaded", function () {
const app = document.getElementById("app");

const typewriter = new Typewriter(app, {
  loop: true,
});

typewriter
  .typeString("Full-Stack Web-Entwickler")
  .pauseFor(2500)
  .deleteAll()
  .pauseFor(500)
  .typeString("MERN-Stack Entwickler")
  .pauseFor(2500)
  .deleteAll()
  .pauseFor(500)
  .typeString("Open Source Mitwirkender")
  .pauseFor(2500)
  .deleteAll()
  .pauseFor(500)
  .typeString("Software Entwickler")
  .pauseFor(2500)
  .deleteAll()
  .pauseFor(500)
  .typeString("Fachinformatiker für Systemintegration")
  .pauseFor(2500)
  .deleteAll()
  .pauseFor(500)
  .typeString("Microsoft Certified Professional (MCP)")
  .pauseFor(2500)
  .deleteAll()
  .pauseFor(500)
  .typeString("System-Administrator")
  .pauseFor(2500)
  .deleteAll()
  .pauseFor(500)
  .typeString("Netzwerk-Administrator")
  .pauseFor(2500)
  .deleteAll()
  .pauseFor(500)
  .typeString("Linux-Administrator")
  .pauseFor(2500)
  .deleteAll()
  .pauseFor(500)
  .start();
// });
// Start the typewriter

//! the old original one
//   typewriter
//   .typeString("Full Stack Web Developer")
//   .pauseFor(2500)
//   .deleteAll()
//   .typeString("Strings can be removed")
//   .pauseFor(2500)
//   .deleteChars(7)
//   .typeString("<strong>altered!</strong>")
//   .pauseFor(2500)
//   .start();
