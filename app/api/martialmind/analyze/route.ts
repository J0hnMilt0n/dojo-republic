import { NextRequest, NextResponse } from 'next/server';

// Backend API URL - to be configured via environment variable
const AI_BACKEND_URL = process.env.MARTIALMIND_API_URL || 'http://localhost:8000';

// Maximum file size: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Helper to check content length before processing
function getContentLength(request: NextRequest): number {
  const contentLength = request.headers.get('content-length');
  return contentLength ? parseInt(contentLength, 10) : 0;
}

export async function POST(request: NextRequest) {
  // Check content-length header first to reject oversized requests early
  const contentLength = getContentLength(request);
  if (contentLength > MAX_FILE_SIZE) {
    return NextResponse.json(
      { 
        error: 'File too large',
        message: `Video file exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit. Please upload a smaller video.`,
        details: `Request size: ${(contentLength / (1024 * 1024)).toFixed(2)}MB`
      },
      { status: 413 }
    );
  }

  try {
    const formData = await request.formData();
    const videoFile = formData.get('video');

    if (!videoFile || !(videoFile instanceof File)) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Validate file size (max 100MB)
    if (videoFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 100MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi'];
    if (!allowedTypes.includes(videoFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only MP4, MOV, and AVI are supported' },
        { status: 400 }
      );
    }

    // Forward the video to the AI backend
    const backendFormData = new FormData();
    backendFormData.append('video', videoFile);

    const response = await fetch(`${AI_BACKEND_URL}/analyze-video`, {
      method: 'POST',
      body: backendFormData,
      // Set a timeout for long-running AI processing
      signal: AbortSignal.timeout(120000), // 2 minutes timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Backend Error:', errorText);
      
      return NextResponse.json(
        { error: 'AI analysis failed. Please try again later.' },
        { status: 500 }
      );
    }

    const result = await response.json();

    // Validate response structure
    if (!result.score || !result.injury_risk || !Array.isArray(result.issues)) {
      console.error('Invalid response structure from AI backend');
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('MartialMind API Error:', error);

    // Check if it's a request body size error (413 from Next.js)
    if (error instanceof Error && error.message.includes('body')) {
      return NextResponse.json(
        { 
          error: 'File too large',
          message: 'The uploaded video file is too large. Please upload a video under 100MB.',
          hint: process.env.VERCEL ? 'Vercel serverless functions have a 4.5MB limit. Consider using direct upload to storage.' : undefined
        },
        { status: 413 }
      );
    }

    // Check if it's a timeout error
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Video analysis timed out. Please try with a shorter video.' },
        { status: 504 }
      );
    }

    // Check if AI backend is unreachable
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'AI service is currently unavailable. Please try again later.',
          dev_note: 'Make sure the MartialMind AI backend is running'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const response = await fetch(`${AI_BACKEND_URL}/health`, {
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      return NextResponse.json({ 
        status: 'operational',
        backend: 'connected'
      });
    } else {
      return NextResponse.json({ 
        status: 'degraded',
        backend: 'error'
      }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json({ 
      status: 'down',
      backend: 'unreachable',
      message: 'AI backend is not running'
    }, { status: 503 });
  }
}
