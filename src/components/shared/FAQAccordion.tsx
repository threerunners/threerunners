'use client'

import { useState } from 'react'
import type { FAQ } from '@/types/cms'

interface FAQAccordionProps {
  heading?: string
  subheading?: string
  faqs: FAQ[]
  variant?: 'hub' | 'spoke'
}

export default function FAQAccordion({ heading, subheading, faqs, variant = 'hub' }: FAQAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  if (variant === 'spoke') {
    return (
      <div>
        {heading && (
          <h2 style={{
            fontFamily: 'inherit', fontWeight: 700, fontSize: 28, lineHeight: 1.15,
            letterSpacing: '-0.015em', margin: '0 0 28px', color: 'var(--ink-900)',
          }}>
            <em style={{ fontStyle: 'normal', color: 'var(--orange-600)' }}>Things</em>{' '}
            {heading.replace('Things ', '')}
          </h2>
        )}
        <div>
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              style={{
                background: 'var(--paper)', border: '1px solid var(--ink-200)',
                borderRadius: 'var(--radius)', padding: '16px 22px', marginBottom: 10,
              }}
              open={openIdx === idx}
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              <summary
                style={{
                  cursor: 'pointer', fontSize: 15, fontWeight: 600,
                  listStyle: 'none', color: 'var(--ink-900)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  letterSpacing: '-0.005em',
                }}
              >
                {faq.question}
                <span style={{
                  fontSize: 22, color: 'var(--orange-500)', flexShrink: 0,
                  transform: openIdx === idx ? 'rotate(45deg)' : 'none',
                  transition: 'transform .15s ease', lineHeight: 1,
                }}>+</span>
              </summary>
              <div style={{ paddingTop: 14, color: 'var(--ink-700)', fontSize: 14.5, lineHeight: 1.65 }}>
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    )
  }

  // Hub variant
  return (
    <section id="faq">
      {heading && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 6px' }}>{heading}</h2>
          {subheading && <p style={{ color: 'var(--ink-500)', fontSize: 14, margin: '0 0 26px' }}>{subheading}</p>}
        </div>
      )}
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            style={{
              background: 'var(--paper)', border: '1px solid var(--ink-150)',
              borderRadius: 'var(--radius)', padding: '14px 18px', marginBottom: 10,
            }}
          >
            <summary style={{
              cursor: 'pointer', fontSize: 14.5, fontWeight: 500, color: 'var(--ink-800)',
              listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              {faq.question}
              <span style={{
                display: 'inline-block', width: 12, height: 12,
                borderRight: '1.6px solid var(--ink-500)', borderBottom: '1.6px solid var(--ink-500)',
                transform: 'rotate(45deg)', transition: 'transform .15s ease',
                marginLeft: 12, marginTop: -6, flexShrink: 0,
              }} />
            </summary>
            <div style={{ paddingTop: 12, color: 'var(--ink-600)', fontSize: 13.5, lineHeight: 1.6 }}>
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
