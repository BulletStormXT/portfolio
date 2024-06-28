// Funktion zum Berechnen des Alters
function calculateAge() {
  const birthDate = new Date("1982-08-27"); // Mein Geburtsdatum
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

// Aktualisieren des Alters im HTML-Element
const ageElement = document.getElementById("alter");
ageElement.textContent = calculateAge();
