import React from 'react';
import {hydrateRoot} from 'react-dom/client';
import {App} from './App.mjs';
const data=JSON.parse(document.getElementById('initial-data').textContent);
hydrateRoot(document.getElementById('root'),React.createElement(App,data));
