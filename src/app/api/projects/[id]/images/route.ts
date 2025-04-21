import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(
  request: Request,
  { params }: RouteParams
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { imagePath } = await request.json();

    const project = await prisma.project.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        images: {
          push: imagePath,
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error adding image to project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 