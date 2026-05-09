/// <reference types="next" />
/// <reference types="next/image-types/global" />

// CSS module declarations
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
  export = content
}

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}