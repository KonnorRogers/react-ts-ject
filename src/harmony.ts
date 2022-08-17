import * as React from 'react';
import { createScope, partnerCenterTheme, button, card, searchBox } from '@harmony/enablers/react';

// Create a Harmony Enabler scope
export const scope = createScope({
  theme: partnerCenterTheme,
  reactInstance: React,
});

// Generate React components
export const Button = scope.forReact(button);
export const Card = scope.forReact(card);
export const SearchBox = scope.forReact(searchBox);
