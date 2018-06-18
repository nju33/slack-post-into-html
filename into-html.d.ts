declare module 'slack-file-contents-into-html' {
  declare type Type = 'h1' | 'h2' | 'h3' | 'p' | 'ul' | 'ol' | 'pre'
  declare interface Child {
    type: Type;
    text: string;
    links: {[url: string]: [number, number]},
    formats: {[inline: string]: number[]},
  }

  declare function intoHtml(children: Child[]): string;
  export default intoHtml;
}
