import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dslPath = path.join(process.cwd(), './sample-dsl.yml');
    const yamlContent = fs.readFileSync(dslPath, 'utf8');
    return new NextResponse(yamlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/yaml',
      },
    });
  } catch (error) {
    console.error('Failed to read sample DSL:', error);
    return new NextResponse('Error loading sample DSL', { status: 500 });
  }
}