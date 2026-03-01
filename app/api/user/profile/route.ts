import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const profileUpdateSchema = z.object({
  name:        z.string().max(100).optional(),
  phone:       z.string().max(20).optional(),
  country:     z.string().max(100).optional(),
  gender:      z.string().max(20).optional(),
  dateOfBirth: z.string().optional(),
  image:       z.string().url("image must be a valid URL").max(500).optional(),
})

// GET /api/user/profile - Get current user profile
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        dateOfBirth: true,
        gender: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = profileUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    const { name, phone, country, dateOfBirth, gender, image } = parsed.data

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(country && { country }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(gender && { gender }),
        ...(image && { image }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        dateOfBirth: true,
        gender: true,
        image: true,
        role: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({ 
      message: "Profile updated successfully",
      user: updatedUser 
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
