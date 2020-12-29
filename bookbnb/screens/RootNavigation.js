/* Este módulo funciona como singleton del navigationRef que es una referencia
 * a el NavigationContainer, de esta forma podemos navegar a cualquier parte de la
 * aplicación desde cualquier lugar
 */

import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
