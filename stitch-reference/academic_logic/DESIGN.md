---
name: Academic Logic
colors:
  surface: '#fef8f7'
  surface-dim: '#dfd9d8'
  surface-bright: '#fef8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f2f1'
  surface-container: '#f3ecec'
  surface-container-high: '#ede7e6'
  surface-container-highest: '#e7e1e0'
  on-surface: '#1d1b1b'
  on-surface-variant: '#4d4635'
  inverse-surface: '#323030'
  inverse-on-surface: '#f6efef'
  outline: '#7f7663'
  outline-variant: '#d0c5af'
  surface-tint: '#745b00'
  primary: '#745b00'
  on-primary: '#ffffff'
  primary-container: '#f2c94c'
  on-primary-container: '#6b5400'
  inverse-primary: '#ebc246'
  secondary: '#6c5195'
  on-secondary: '#ffffff'
  secondary-container: '#d2b3ff'
  on-secondary-container: '#5c4184'
  tertiary: '#536166'
  on-tertiary: '#ffffff'
  tertiary-container: '#c1d0d6'
  on-tertiary-container: '#4b595e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe08b'
  primary-fixed-dim: '#ebc246'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#584400'
  secondary-fixed: '#eddcff'
  secondary-fixed-dim: '#d7baff'
  on-secondary-fixed: '#27084d'
  on-secondary-fixed-variant: '#54397b'
  tertiary-fixed: '#d6e5eb'
  tertiary-fixed-dim: '#bac9cf'
  on-tertiary-fixed: '#101d22'
  on-tertiary-fixed-variant: '#3b494e'
  background: '#fef8f7'
  on-background: '#1d1b1b'
  surface-variant: '#e7e1e0'
typography:
  display-lg:
    fontFamily: Kodchasan
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Kodchasan
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Kodchasan
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
spacing:
  baseline: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  max-content-width: 1280px
---

## Brand & Style

This design system employs a **Restrained Neo-Brutalist** aesthetic, merging the structural integrity of academic publishing with the functional clarity of modern developer tools. The personality is intellectually rigorous yet accessible, designed to evoke a sense of focus, reliability, and technical mastery.

The visual language is defined by purposeful spacing, hairline borders, and a stark refusal of unnecessary ornamentation. It prioritizes content hierarchy and readability, ensuring that complex computer science concepts remain the primary focus. High-contrast interactions and a tactile "printed" quality provide the credibility required for a professional learning environment.

## Colors

The palette is anchored by **Warm Canvas** (#F6F4EE) to reduce eye strain during long-form reading, contrasted against **Ink** (#171515) for authoritative typography. 

- **Learning Gold** is the high-utility primary action color, reserved strictly for progression-based triggers like "Run Code" or "Continue Lesson."
- **Knowledge Lavender** categorizes conceptual or research-heavy content.
- **Focus Blue** provides a calming backdrop for utilitarian states like information callouts and PDF viewers.
- **Coral Accent** is used sparingly for brand-specific highlights or critical alerts.

The system supports a professional dark mode where the canvas shifts to a deep charcoal, maintaining the same semantic use of functional colors.

## Typography

Typography follows a strict hierarchy to manage cognitive load. **Kodchasan** is utilized for the wordmark and major display headings to provide a distinctive, geometric character. **Inter** serves as the workhorse for all UI elements and body copy, chosen for its exceptional legibility at small sizes.

For technical education, **JetBrains Mono** (Professional Monospace) is mandated for all code blocks and inline technical terms. Line heights for body text are intentionally generous (1.5x - 1.6x) to facilitate "vertical scanning" of dense information.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. Spacing is based on a 4px/8px modular scale to ensure mathematical alignment across all components.

- **Content Constraints:** Long-form reading containers are capped at 720px width to maintain an ideal line length (CPL).
- **Responsive Behavior:** Transitions from desktop sidebars to mobile bottom-sheets/drawers are required for complex navigation or code settings.
- **Neo-Brutalist Spacing:** Use hard 1px or 2px borders (Ink) to define regions instead of relying on shadows, creating a structured, blueprint-like feel.

## Elevation & Depth

This system rejects soft shadows in favor of **Tonal Layering** and **Bold Outlines**. 

Depth is communicated through "offset stacking." For example, a card might have a solid 2px border and a 4px hard offset shadow of the same color, creating a physical "lift" without blurring. 

- **Surface 0:** Main Canvas (#F6F4EE).
- **Surface 1:** Inset containers (Focus Blue or white) with 1px borders.
- **Surface 2:** Active modals or dropdowns with a hard offset "shadow" (Ink color at 100% opacity, no blur).
- **Glassmorphism:** Reserved exclusively for sticky headers/modals to maintain context of the content scrolling beneath, using a high-intensity backdrop blur (20px).

## Shapes

The design system uses **Sharp (0px)** corners for all primary structural elements (containers, code blocks, input fields) to reinforce the neo-brutalist and academic aesthetic. 

Small exceptions are made for "Learning Gold" action buttons, which may use a subtle 2px radius only if necessary for accessibility affordance, though sharp corners are preferred to maintain the system's architectural integrity.

## Components

### Buttons
Primary buttons (Learning Gold) feature a 2px Ink border. Hover states must not change dimensions; instead, they utilize a slight color shift or the appearance of the hard-offset shadow. Minimum height is 44px for touch targets.

### Code Blocks
Encased in a 1px Ink border with a subtly different background (e.g., 5% darker than canvas). Includes a persistent "Copy" label-button in the top-right corner.

### Inputs & Controls
Input fields use 1px Ink borders that thicken to 2px on focus. The focus state must be highly visible, utilizing the Focus Blue as a secondary halo.

### Cards & Lists
Cards use a "Knowledge Lavender" or "Focus Blue" top-border (4px) to categorize content types. Lists in long-form content utilize custom bullets styled as geometric square markers.

### Modals & Drawers
On mobile, use bottom-anchored sheets for settings and navigation. Desktop modals use sticky headers/footers to ensure "Save" or "Close" actions are always accessible regardless of scroll depth.