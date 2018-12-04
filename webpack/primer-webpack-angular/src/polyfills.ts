import 'core-js/es7';
import 'core-js/es7/reflect';
import { enableProdMode } from '@angular/core';
require('zone.js/dist/zone');

if (process.env.ENV === 'production') {
  // Production
  enableProdMode();
} else {
  // Development and test
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}