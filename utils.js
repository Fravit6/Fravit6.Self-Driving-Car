/**
 * Questa funzione ritorna un valore compreso tra A (se t=0) e B (se t=1)
 * @param {*} t decide quanto il parametro B deve influire nel risultato finale
 */
function lerp(A, B, t) {
  return A + (B - A) * t
}
