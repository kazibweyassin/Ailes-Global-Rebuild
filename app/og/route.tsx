import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams?.get('title') || 'Ailes Global'
    const description = searchParams?.get('description') || 'Premium Study Abroad & Scholarship Consulting for African Students'
    const type = searchParams?.get('type') || 'default'

    const accentColor = '#E8A020'
    const accentLight = '#F5C55A'
    const bgTop = type === 'scholarship' ? '#0A1020' : '#080D1A'
    const bgBottom = type === 'scholarship' ? '#0E1729' : '#120A04'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(160deg, ${bgTop} 0%, ${bgBottom} 100%)`,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
          }}
        >
          {/* Radial glow */}
          <div style={{
            position: 'absolute',
            top: '-100px', left: '50%',
            transform: 'translateX(-50%)',
            width: '800px', height: '500px',
            borderRadius: '50%',
            background: `radial-gradient(ellipse, rgba(232,160,32,0.14) 0%, transparent 65%)`,
          }} />

          {/* Brand name */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '32px',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: accentColor,
            }} />
            <div style={{
              fontSize: '16px', fontWeight: 700, color: accentLight,
              letterSpacing: '0.18em', textTransform: 'uppercase',
            }}>
              AILES GLOBAL
            </div>
          </div>

          {/* Title */}
          <div style={{
            display: 'flex',
            fontSize: title.length > 50 ? '48px' : '60px',
            fontWeight: 700,
            color: '#FDF8F0',
            textAlign: 'center',
            maxWidth: '980px',
            lineHeight: '1.1',
            marginBottom: '24px',
            padding: '0 60px',
          }}>
            {title}
          </div>

          {/* Description */}
          <div style={{
            display: 'flex',
            fontSize: '24px',
            color: '#C4CFDF',
            fontWeight: 300,
            textAlign: 'center',
            maxWidth: '860px',
            lineHeight: '1.5',
            padding: '0 60px',
            opacity: 0.85,
          }}>
            {description}
          </div>

          {/* Gold accent bar */}
          <div style={{
            width: '120px', height: '4px',
            background: `linear-gradient(90deg, ${accentColor}, ${accentLight})`,
            borderRadius: '2px',
            marginTop: '44px',
          }} />
        </div>
      ),
      { width: 1200, height: 630 }
    )
  } catch (error) {
    console.error('OG image generation error:', error)
    return new Response('Failed to generate OG image', { status: 500 })
  }
}
