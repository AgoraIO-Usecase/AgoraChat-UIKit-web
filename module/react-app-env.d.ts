/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}

declare module '*.avif' {
  const src: string;
}

declare module '*.bmp' {
  const src: string;
}

declare module '*.gif' {
  const src: string;
}

declare module '*.jpg' {
  const src: string;
}

declare module '*.jpeg' {
  const src: string;
}

declare module '*.png' {
  const src: string;
}

declare module '*.webp' {
  const src: string;
}

declare module '*.svg' {
  import * as React from 'react';

  // export const ReactComponent: React.FunctionComponent<
  // 	React.SVGProps<SVGSVGElement> & { title?: string }
  // >;

  const src: string;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
}

declare module 'react-sticky';
