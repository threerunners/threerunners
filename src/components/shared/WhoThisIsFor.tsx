interface WhoThisIsForProps {
  body: string
  label?: string
}

export default function WhoThisIsFor({ body, label = 'Who this is for' }: WhoThisIsForProps) {
  const paragraphs = body.split('\n').filter(p => p.trim())
  return (
    <div style={{
      marginTop: 36,
      padding: '22px 24px',
      borderLeft: '3px solid var(--orange-500)',
      background: 'var(--paper)',
      borderRadius: '0 var(--radius) var(--radius) 0',
    }}>
      <div style={{
        fontSize: 11.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
        color: 'var(--orange-700)', marginBottom: 8,
      }}>
        {label}
      </div>
      {paragraphs.map((para, idx) => (
        <p key={idx} style={{
          margin: idx > 0 ? '8px 0 0' : 0,
          fontSize: 15.5, color: 'var(--ink-700)', lineHeight: 1.6,
        }}
          dangerouslySetInnerHTML={{ __html: para.replace(/<strong>/g, '<strong style="color:var(--ink-900);font-weight:600;">') }}
        />
      ))}
    </div>
  )
}
