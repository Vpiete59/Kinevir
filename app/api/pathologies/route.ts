import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const slug = searchParams.get('slug');

    if (slug) {
      const { data, error } = await supabaseAdmin
        .from('pathologies')
        .select('*, body_regions(*)')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return NextResponse.json(data);
    }

    let query = supabaseAdmin
      .from('pathologies')
      .select('*, body_regions(*)')
      .eq('published', true);

    if (region) {
      query = query.eq('region_id', region);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pathologies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      region_name,
      short_description,
      detailed_description,
      symptoms = [],
      causes = [],
      treatments = [],
      exercises = [],
      prevention_tips = [],
      severity = 'moderate',
      image_url,
      published = true,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    let region_id = null;
    if (region_name) {
      const { data: region } = await supabaseAdmin
        .from('body_regions')
        .select('id')
        .eq('name', region_name)
        .maybeSingle();

      region_id = region?.id || null;
    }

    const slug = generateSlug(name);

    const { data: existingPathology } = await supabaseAdmin
      .from('pathologies')
      .select('id, slug')
      .eq('slug', slug)
      .maybeSingle();

    let pathologyData;

    if (existingPathology) {
      const { data, error } = await supabaseAdmin
        .from('pathologies')
        .update({
          name,
          region_id,
          short_description,
          detailed_description,
          symptoms,
          causes,
          treatments,
          exercises,
          prevention_tips,
          severity,
          image_url,
          published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingPathology.id)
        .select('*, body_regions(*)')
        .single();

      if (error) throw error;
      pathologyData = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('pathologies')
        .insert({
          name,
          slug,
          region_id,
          short_description,
          detailed_description,
          symptoms,
          causes,
          treatments,
          exercises,
          prevention_tips,
          severity,
          image_url,
          published,
        })
        .select('*, body_regions(*)')
        .single();

      if (error) throw error;
      pathologyData = data;
    }

    return NextResponse.json(pathologyData, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create pathology' },
      { status: 500 }
    );
  }
}
