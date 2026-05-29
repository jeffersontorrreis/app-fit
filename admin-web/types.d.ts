// Declaração de tipo para imports de CSS (side-effect e módulos)
declare module '*.css' {
  const styles: { [className: string]: string };
  export default styles;
}
