/**
 * Capitaliza solo la primera letra del texto
 * Respeta excepciones para palabras especiales (Dios, Jesús, Espíritu Santo, etc.)
 */
export function capitalizeTitle(text) {
  if (!text) return text;

  // Palabras especiales que siempre deben tener la primera letra mayúscula
  const specialWords = [
    'dios',
    'jesús',
    'jesus',
    'espíritu',
    'espiritu',
    'santo',
    'iglesia',
    'señor',
    'senor',
    'cristo',
    'padre',
    'hijo',
    'espíritu santo',
    'espiritu santo',
    'jesucristo',
    'cristo jesús',
    'cristo jesus'
  ];

  // Convertir a minúsculas primero
  let result = text.toLowerCase().trim();

  // Capitalizar la primera letra
  result = result.charAt(0).toUpperCase() + result.slice(1);

  // Ahora aplicar capitalizaciones especiales para palabras clave
  specialWords.forEach((word) => {
    // Crear regex que busque la palabra de forma independiente
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      // Capitalizar la primera letra de cada palabra en el match
      return match
        .split(/(\s+)/)
        .map((w) => {
          if (w.trim()) {
            return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
          }
          return w;
        })
        .join('');
    });
  });

  return result;
}
