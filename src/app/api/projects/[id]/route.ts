import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { name } = await request.json();

    const project = await prisma.project.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    await prisma.project.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 