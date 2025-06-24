import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const listingSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.string(),
  condition: z.string(),
  location: z.string(),
  images: z.array(z.string().url()),
});

// GET marketplace listings
// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const category = searchParams.get('category');
//     const minPrice = searchParams.get('minPrice');
//     const maxPrice = searchParams.get('maxPrice');
//     const condition = searchParams.get('condition');
//     const location = searchParams.get('location');
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');

//     let query = supabase
//       .from('marketplace_items')
//       .select(`
//         *,
//         profiles:seller_id (
//           id,
//           username,
//           avatar_url,
//           full_name
//         )
//       `);

//     if (category) {
//       query = query.eq('category', category);
//     }
//     if (minPrice) {
//       query = query.gte('price', parseFloat(minPrice));
//     }
//     if (maxPrice) {
//       query = query.lte('price', parseFloat(maxPrice));
//     }
//     if (condition) {
//       query = query.eq('condition', condition);
//     }
//     if (location) {
//       query = query.textSearch('location', location);
//     }

//     // Add pagination
//     const from = (page - 1) * limit;
//     const to = from + limit - 1;
//     query = query.range(from, to).order('created_at', { ascending: false });

//     const { data: listings, error } = await query;

//     if (error) throw error;

//     return NextResponse.json(listings);
//   } catch (error) {
//     console.error('Marketplace GET error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch listings' },
//       { status: 500 }
//     );
//   }
// }

// POST new marketplace listing
// export async function POST(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const json = await request.json();
//     const validatedData = listingSchema.parse(json);

//     const { data: listing, error } = await supabase
//       .from('marketplace_items')
//       .insert([
//         {
//           ...validatedData,
//           seller_id: session.user.id,
//         }
//       ])
//       .select(`
//         *,
//         profiles:seller_id (
//           id,
//           username,
//           avatar_url,
//           full_name
//         )
//       `)
//       .single();

//     if (error) throw error;

//     return NextResponse.json(listing, { status: 201 });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: 'Invalid listing data', details: error.errors },
//         { status: 400 }
//       );
//     }

//     console.error('Marketplace POST error:', error);
//     return NextResponse.json(
//       { error: 'Failed to create listing' },
//       { status: 500 }
//     );
//   }
// }

// All marketplace API routes are disabled in production except auth and feed.
