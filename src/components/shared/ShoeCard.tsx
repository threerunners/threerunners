import type { Shoe } from '@/types/shoe'
import type { HubShoeRecommendation, SpokeShoeRecommendation } from '@/types/cms'

type ShoeRec = HubShoeRecommendation | SpokeShoeRecommendation

interface ShoeCardProps {
  shoe: Shoe
  recommendation: ShoeRec
  variant: 'hub' | 'spoke'
  affiliateUrl?: string
  bestPrice?: { price: number; retailer: string; lastChecked: string } | null
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13 }}>
      <path d="M12 2l2.39 4.84L20 7.66l-4 3.9.95 5.5L12 14.77 7.05 17.06 8 11.56 4 7.66l5.61-.82L12 2z"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ width: 13, height: 13 }}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ width: 13, height: 13 }}>
      <line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}>
      <path d="M7 17L17 7M9 7h8v8"/>
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}>
      <path d="M5 12h14M13 5l7 7-7 7"/>
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}>
      <circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: 14, height: 14 }}>
      <path d="M5 21V8l7-5 7 5v13M9 21v-7h6v7"/>
    </svg>
  )
}

function BannerIcon({ type }: { type: 'top' | 'alt' }) {
  if (type === 'top') return <HomeIcon />
  return <StarIcon />
}

export default function ShoeCard({ shoe, recommendation, variant, affiliateUrl = '#', bestPrice }: ShoeCardProps) {
  const isTop = recommendation.bannerType === 'top'
  const spokeRec = variant === 'spoke' ? (recommendation as SpokeShoeRecommendation) : null
  const hubRec = variant === 'hub' ? (recommendation as HubShoeRecommendation) : null
  const rideFeel = recommendation.rideFeel || hubRec?.rideFeel || spokeRec?.rideFeel

  const priceTier = spokeRec?.priceTier || (bestPrice
    ? bestPrice.price < 150 ? '££' : bestPrice.price < 200 ? '£££' : '££££'
    : '£££')

  const verdict = spokeRec?.verdict || shoe.editorial.verdict
  const whyThisWorks = recommendation.whyThisWorks
  const isTopCard = isTop

  return (
    <article style={{
      position: 'relative',
      background: isTopCard
        ? 'linear-gradient(180deg, #f4fbf6 0%, #ffffff 60%)'
        : 'var(--paper)',
      border: isTopCard ? '1px solid var(--orange-200)' : '1px solid var(--ink-150)',
      borderRadius: 'var(--radius-lg)',
      padding: '50px 22px 22px',
      display: 'flex', flexDirection: 'column', gap: 14,
      boxShadow: isTopCard
        ? '0 1px 2px rgba(15, 23, 42, .04), 0 18px 40px -20px rgba(1, 42, 46, .35)'
        : 'var(--shadow-sm)',
    }}>
      {/* Banner */}
      <div style={{
        position: 'absolute', top: -1, left: -1, right: -1,
        padding: '7px 14px', fontSize: 11.5, fontWeight: 700,
        letterSpacing: '.08em', textTransform: 'uppercase',
        borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)',
        display: 'flex', alignItems: 'center', gap: 8,
        ...(isTopCard
          ? { background: 'var(--orange-200)', color: 'var(--orange-500)' }
          : { background: '#fff', color: 'var(--ink-700)', borderBottom: '1px solid var(--ink-150)' }
        ),
      }}>
        <span style={{ color: isTopCard ? 'var(--orange-500)' : 'var(--orange-500)' }}>
          <BannerIcon type={recommendation.bannerType} />
        </span>
        {recommendation.bannerLabel}
      </div>

      {/* Rank + Price */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {spokeRec ? (
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--ink-900)', color: 'var(--orange-200)',
            display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13,
          }}>#{spokeRec.rank}</div>
        ) : (
          <div className="rank-badge">{`#${['top', 'alt'][['top', 'alt'].indexOf(recommendation.bannerType)] === 'top' ? 1 : 2}`}</div>
        )}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '.02em' }}>
            {priceTier}
          </div>
          {spokeRec?.priceChecked && (
            <div style={{ fontSize: 10.5, color: 'var(--ink-400)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 10, height: 10 }}>
                <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
              </svg>
              {spokeRec.priceChecked}
            </div>
          )}
        </div>
      </div>

      {/* Shoe image */}
      <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img
          src={shoe.media.primaryImage}
          alt={shoe.media.altText}
          width={300}
          height={150}
          style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain' }}
        />
      </div>

      {/* Brand + Name */}
      <div>
        <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-500)', fontWeight: 600 }}>
          {shoe.brand}
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', margin: '2px 0 0', color: 'var(--ink-900)' }}>
          {shoe.name}
        </h3>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {recommendation.tags.map((tag, idx) => (
          <span key={idx} style={{
            fontSize: 11.5, fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-pill)',
            background: idx === 0 ? 'var(--orange-50)' : 'var(--ink-100)',
            color: idx === 0 ? 'var(--orange-700)' : 'var(--ink-700)',
          }}>{tag}</span>
        ))}
      </div>

      {/* Verdict */}
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          fontSize: 11.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
          color: 'var(--orange-600)', marginBottom: 4,
        }}>
          <StarIcon /> The verdict
        </div>
        <p style={{ fontSize: 13.5, color: 'var(--ink-700)', fontStyle: 'italic', lineHeight: 1.55, margin: 0 }}>
          &ldquo;{verdict}&rdquo;
        </p>
      </div>

      {/* Ride feel bars (always shown) */}
      {rideFeel && (
        <div style={{ background: 'var(--ink-50)', borderRadius: 'var(--radius)', padding: 14 }}>
          <div style={{ fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-500)', fontWeight: 600, marginBottom: 10 }}>
            Ride feel
          </div>
          {[
            { name: 'Cushion', value: rideFeel.cushion },
            { name: 'Response', value: rideFeel.response },
            { name: 'Stability', value: rideFeel.stability },
          ].map(bar => (
            <div key={bar.name} style={{ display: 'grid', gridTemplateColumns: '78px 1fr', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 11.5, color: 'var(--ink-700)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>
                {bar.name}
              </div>
              <div style={{ height: 6, background: 'var(--bar-bg)', borderRadius: 999, overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', background: 'var(--orange-400)', borderRadius: 999, width: `${bar.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Features */}
      {recommendation.features && recommendation.features.length > 0 && (
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12.5, color: 'var(--ink-700)' }}>
          {recommendation.features.map((feature, idx) => (
            <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: feature.positive ? 'var(--green-600)' : 'var(--red-700)' }}>
              {feature.positive ? <CheckIcon /> : <CrossIcon />}
              {feature.label}
            </span>
          ))}
        </div>
      )}

      {/* Real talk tags (spoke only) */}
      {spokeRec?.realTalkTags && (
        <div style={{ background: 'var(--ink-50)', borderRadius: 'var(--radius)', padding: 14 }}>
          <div style={{ fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-500)', fontWeight: 600, marginBottom: 10 }}>
            Real talk
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {spokeRec.realTalkTags.map((tag, idx) => (
              <span key={idx} style={{ fontSize: 13, color: 'var(--ink-800)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--orange-500)', flexShrink: 0 }} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {/* Affiliate CTA opens in new tab with rel="noopener nofollow" to prevent window.opener access and signal affiliate intent */}
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener nofollow"
          style={{
            flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            background: 'var(--orange-500)', color: 'var(--orange-200)',
            padding: '11px 16px', borderRadius: 10, fontSize: 13.5, fontWeight: 600,
            border: 0, cursor: 'pointer', textDecoration: 'none',
          }}
        >
          Check price <ArrowIcon />
        </a>
        <a
          href="#"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            background: 'transparent', color: 'var(--ink-700)',
            border: '1px solid var(--ink-200)',
            padding: '11px 16px', borderRadius: 10, fontSize: 13.5, fontWeight: 600,
            cursor: 'pointer', textDecoration: 'none',
          }}
        >
          Full review <ArrowRightIcon />
        </a>
      </div>

      {/* Why this works */}
      {whyThisWorks && (
        <div style={{
          background: isTopCard ? 'var(--orange-50)' : 'var(--ink-50)',
          borderRadius: 'var(--radius)', padding: '12px 14px', marginTop: 'auto',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase',
            color: isTopCard ? 'var(--orange-700)' : 'var(--ink-600)', fontWeight: 700, marginBottom: 6,
          }}>
            <InfoIcon />
            {variant === 'spoke' ? 'Why this works for a first marathon' : 'Why this works for you'}
          </div>
          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-700)', lineHeight: 1.55 }}>
            {whyThisWorks}
          </p>
        </div>
      )}
    </article>
  )
}
