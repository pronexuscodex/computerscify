/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}
