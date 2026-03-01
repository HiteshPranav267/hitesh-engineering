import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 🚨 Add the IP addresses you want to block here! 🚨
// Example: ['192.168.1.1', '203.0.113.42']
const BLOCKED_IPS: string[] = [
    "222.167.175.134",
];

export function middleware(request: NextRequest) {
    // 1. Get the visitor's IP address
    // Vercel puts the client IP in the x-forwarded-for header
    let clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown';

    // x-forwarded-for might return a list like "client, proxy1, proxy2"
    if (clientIp.includes(',')) {
        clientIp = clientIp.split(',')[0].trim();
    }

    // 2. Check if the IP is in our blocked list
    if (BLOCKED_IPS.includes(clientIp)) {
        // 3. If they are blocked, show them a custom message
        return new NextResponse(
            `
            <html>
                <head>
                    <title>Access Denied</title>
                    <style>
                        body {
                            background-color: #0d1117;
                            color: #ff4444;
                            font-family: inherit;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            text-align: center;
                            padding: 20px;
                        }
                        h1 { font-size: 3rem; margin-bottom: 10px; }
                        p { color: #8b949e; font-size: 1.2rem; }
                        .container {
                            border: 1px solid #ff444430;
                            padding: 40px;
                            border-radius: 12px;
                            background: #ff444405;
                            max-width: 600px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>⛔ Access Denied</h1>
                        <p>You have been permanently blocked from accessing this website.</p>
                        <p style="font-size: 0.8rem; margin-top: 30px; color: #484f58;">
                            Your IP (${clientIp}) has been logged and flagged.
                        </p>
                    </div>
                </body>
            </html>
            `,
            {
                status: 403,
                headers: { 'Content-Type': 'text/html' },
            }
        );
    }

    // 4. If they are NOT blocked, let them through normally
    return NextResponse.next();
}

// 5. Tell the middleware to run on EVERY page/route
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
