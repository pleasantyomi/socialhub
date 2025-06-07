import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET marketplace listings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const filters: any = {};
    if (category) filters.category = category;
    if (minPrice) filters.price = { gte: parseFloat(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, lte: parseFloat(maxPrice) };

    const listings = await prisma.marketplaceListing.findMany({
      where: filters,
      include: {
        seller: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// CREATE a new marketplace listing
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const listing = await prisma.marketplaceListing.create({
      data: {
        title: json.title,
        description: json.description,
        price: json.price,
        category: json.category,
        images: json.images,
        sellerId: session.user.id,
      },
      include: {
        seller: true,
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
