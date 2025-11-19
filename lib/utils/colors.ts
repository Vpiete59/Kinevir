/**
 * Color mapping from old Kinevir palette to new website palette
 *
 * Old palette:
 * - teal: #457484
 * - peach: #f39d61
 * - beige: #f2cdbb
 * - orange: #c44c24
 * - brown: #6d250a
 *
 * New palette (from kinevir.com):
 * - light-blue: #8ecae6
 * - medium-blue: #219ebc
 * - dark-blue: #023047
 * - bright-yellow: #ffb703
 * - orange: #fb8500
 * - light-gray: #F2F5F7
 * - dark-gray: #424242
 */

export const colorMap = {
  // Primary brand color: old teal -> new medium-blue
  'kinevir-teal': 'kinevir-medium-blue',
  'text-kinevir-teal': 'text-kinevir-medium-blue',
  'bg-kinevir-teal': 'bg-kinevir-medium-blue',
  'border-kinevir-teal': 'border-kinevir-medium-blue',
  'hover:bg-kinevir-teal': 'hover:bg-kinevir-medium-blue',
  'from-kinevir-teal': 'from-kinevir-medium-blue',
  'to-kinevir-teal': 'to-kinevir-medium-blue',

  // Secondary accent: old peach -> new light-blue
  'kinevir-peach': 'kinevir-light-blue',
  'text-kinevir-peach': 'text-kinevir-light-blue',
  'bg-kinevir-peach': 'bg-kinevir-light-blue',
  'border-kinevir-peach': 'border-kinevir-light-blue',
  'from-kinevir-peach': 'from-kinevir-light-blue',
  'to-kinevir-peach': 'to-kinevir-light-blue',

  // Neutral/background: old beige -> new light-gray
  'kinevir-beige': 'kinevir-light-gray',
  'text-kinevir-beige': 'text-kinevir-light-gray',
  'bg-kinevir-beige': 'bg-kinevir-light-gray',
  'border-kinevir-beige': 'border-kinevir-light-gray',

  // Alert/action: old orange -> new orange
  'kinevir-orange': 'kinevir-orange',
  'text-kinevir-orange': 'text-kinevir-orange',
  'bg-kinevir-orange': 'bg-kinevir-orange',
  'border-kinevir-orange': 'border-kinevir-orange',

  // Dark text: old brown -> new dark-blue
  'kinevir-brown': 'kinevir-dark-blue',
  'text-kinevir-brown': 'text-kinevir-dark-blue',
  'bg-kinevir-brown': 'bg-kinevir-dark-blue',
  'border-kinevir-brown': 'border-kinevir-dark-blue',
} as const;

export type OldColor = keyof typeof colorMap;
export type NewColor = typeof colorMap[OldColor];

/**
 * Get the new color class for a given old color class
 */
export function getNewColor(oldColor: string): string {
  return colorMap[oldColor as OldColor] || oldColor;
}

/**
 * Replace all old color classes in a className string
 */
export function migrateColorClasses(className: string): string {
  let result = className;

  Object.entries(colorMap).forEach(([oldColor, newColor]) => {
    const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
    result = result.replace(regex, newColor);
  });

  return result;
}
