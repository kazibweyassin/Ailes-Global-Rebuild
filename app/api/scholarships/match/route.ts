import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateMatchScoreSimple as calculateMatchScore } from "@/lib/matching-engine"

// POST /api/scholarships/match - Match scholarships with provided profile data
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const profile = body.profile

    if (!profile) {
      return NextResponse.json({ error: "Profile data required" }, { status: 400 })
    }

    // Get all active scholarships
    const scholarships = await prisma.scholarship.findMany({
      where: {
        deadline: {
          gte: new Date() // Only future deadlines
        }
      }
    })

    // Calculate match scores
    const matches = scholarships.map((scholarship: any) => {
      const { score, reasons, missing } = calculateMatchScore(profile, scholarship)
      return {
        scholarship,
        matchScore: score,
        matchReasons: reasons,
        missingRequirements: missing
      }
    })

    // Sort by match score
    matches.sort((a: any, b: any) => b.matchScore - a.matchScore)

    return NextResponse.json({ 
      matches: matches.slice(0, 50), // Return top 50
      totalMatches: matches.length,
      perfectMatches: matches.filter((m: any) => m.matchScore === 100).length,
      goodMatches: matches.filter((m: any) => m.matchScore >= 80).length
    })
  } catch (error) {
    console.error("Scholarship matching error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET /api/scholarships/match - Get AI-matched scholarships for logged-in user
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get all active scholarships
    const scholarships = await prisma.scholarship.findMany({
      where: {
        deadline: {
          gte: new Date() // Only future deadlines
        }
      }
    })

    // Calculate match scores
    const matches = scholarships.map((scholarship: any) => {
      const { score, reasons, missing } = calculateMatchScore(user, scholarship)
      return {
        scholarship,
        matchScore: score,
        matchReasons: reasons,
        missingRequirements: missing
      }
    })

    // Sort by match score
    matches.sort((a: any, b: any) => b.matchScore - a.matchScore)

    // Save top matches to database for later reference
    const topMatches = matches.slice(0, 20).filter((m: any) => m.matchScore >= 50)
    
    await Promise.all(
      topMatches.map((match: any) =>
        prisma.scholarshipMatch.upsert({
          where: {
            userId_scholarshipId: {
              userId: user.id,
              scholarshipId: match.scholarship.id
            }
          },
          create: {
            userId: user.id,
            scholarshipId: match.scholarship.id,
            matchScore: match.matchScore,
            matchReasons: match.matchReasons,
            missingRequirements: match.missingRequirements
          },
          update: {
            matchScore: match.matchScore,
            matchReasons: match.matchReasons,
            missingRequirements: match.missingRequirements
          }
        })
      )
    )

    return NextResponse.json({ 
      matches: matches.slice(0, 50), // Return top 50
      totalMatches: matches.length,
      perfectMatches: matches.filter((m: any) => m.matchScore === 100).length,
      goodMatches: matches.filter((m: any) => m.matchScore >= 80).length
    })
  } catch (error) {
    console.error("Scholarship matching error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
