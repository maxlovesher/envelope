// An image that splits into offset, colour-shifted slices on hover or focus.
export default function Glitch({ src, alt, className = '' }) {
  return (
    <div className={`glitch ${className}`} style={{ '--src': `url(${src})` }} tabIndex={0} data-cursor="Boop">
      <img src={src} alt={alt} />
      <span className="glitch-layer" aria-hidden="true" />
      <span className="glitch-layer" aria-hidden="true" />
    </div>
  )
}
