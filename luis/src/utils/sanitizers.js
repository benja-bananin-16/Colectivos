/**
 * Utilidades de validación y sanitización para el panel de administración.
 * Garantiza un formato homogéneo (XX-XX-XX para patentes y Title Case para nombres).
 */

/**
 * Formatea una patente en tiempo real o antes de guardar:
 * Siempre en mayúsculas y con guión cada dos caracteres: XX-XX-XX
 * @param {string} val 
 * @returns {string}
 */
export function formatPatente(val) {
  if (!val) return '';
  const limpia = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
  if (limpia.length <= 2) return limpia;
  if (limpia.length <= 4) return `${limpia.slice(0, 2)}-${limpia.slice(2)}`;
  return `${limpia.slice(0, 2)}-${limpia.slice(2, 4)}-${limpia.slice(4)}`;
}

/**
 * Valida si la patente cumple con el estándar de vehículos chileno:
 * 4 letras + 2 números (nuevo) o 2 letras + 4 números (antiguo).
 * @param {string} val 
 * @returns {boolean}
 */
export function isValidPatente(val) {
  if (!val) return false;
  const limpia = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (limpia.length !== 6) return false;
  const esNueva = /^[A-Z]{4}[0-9]{2}$/.test(limpia);
  const esAntigua = /^[A-Z]{2}[0-9]{4}$/.test(limpia);
  return esNueva || esAntigua;
}

/**
 * Sanitiza nombres propios a formato Title Case con espacios limpios.
 * @param {string} val 
 * @returns {string}
 */
export function formatNombre(val) {
  if (!val) return '';
  return val
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
}

/**
 * Formatea RUT chileno a XX.XXX.XXX-X.
 * @param {string} val 
 * @returns {string}
 */
export function formatRut(val) {
  if (!val) return '';
  const limpia = val.replace(/[^0-9kK]/g, '').toUpperCase();
  if (limpia.length < 2) return limpia;
  const cuerpo = limpia.slice(0, -1);
  const dv = limpia.slice(-1);
  const cuerpoFormateado = Number(cuerpo).toLocaleString('es-CL');
  return `${cuerpoFormateado}-${dv}`;
}
