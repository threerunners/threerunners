interface EditorialSectionProps {
  eyebrow?: string
  title: string
  titleItalic?: string
  body: string
  attribution: string
}

export default function EditorialSection({
  eyebrow = "Editor's take",
  title,
  titleItalic,
  body,
  attribution,
}: EditorialSectionProps) {
  const paragraphs = body.split('\n\n').filter(p => p.trim())

  return (
    <div style={{
      background: 'var(--ink-900)', color: '#ecebe7',
      borderRadius: 'var(--radius-lg)', padding: '40px 44px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Mint glow accent top-right */}
      <div style={{
        position: 'absolute', top: 24, right: 28, width: 80, height: 80, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(157, 255, 197, .35) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        fontSize: 11.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase',
        color: 'var(--orange-200)', marginBottom: 14, position: 'relative',
      }}>
        {eyebrow}
      </div>

      <h3 style={{
        fontFamily: 'inherit', fontSize: 28, lineHeight: 1.2, fontWeight: 700,
        letterSpacing: '-0.015em', margin: '0 0 20px', maxWidth: '24ch', color: 'white',
        position: 'relative',
      }}>
        {title}{' '}
        {titleItalic && (
          <em style={{ fontStyle: 'normal', color: 'var(--orange-200)' }}>{titleItalic}</em>
        )}
      </h3>

      {paragraphs.map((para, idx) => (
        <p key={idx} style={{
          fontSize: 15.5, lineHeight: 1.7, margin: idx < paragraphs.length - 1 ? '0 0 14px' : 0,
          maxWidth: '62ch', color: '#cfcdc6', position: 'relative',
        }}>
          {para}
        </p>
      ))}

      <div style={{
        marginTop: 36, paddingTop: 24,
        borderTop: '1px solid rgba(255,255,255,.14)',
        fontSize: 14, color: 'var(--orange-200)', fontWeight: 500, fontStyle: 'italic',
        display: 'block', position: 'relative',
      }}>
        <div style={{
          width: 32, height: 2, background: 'var(--orange-500)',
          marginBottom: 14, borderRadius: 2,
        }} />
        {attribution}
      </div>
    </div>
  )
}
