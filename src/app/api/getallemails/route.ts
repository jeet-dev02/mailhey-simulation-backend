
import { NextResponse } from 'next/server';
import { emailStore } from "@/mock-data/emailStore"; 

// Add this to handle preflight CORS requests from the browser
export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*', // Allows any port to access this API
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function GET() {
    try {
        const userTally: Record<string, number> = {};

        emailStore.forEach((email: any) => {
            if (!email.to) return;
            const username = email.to.includes('@') ? email.to : `${email.to}@mailhey.com`;
            if (userTally[username]) {
                userTally[username]++;
            } else {
                userTally[username] = 1;
            }
        });

        const aggregatedData = Object.keys(userTally).map((username) => ({
            username: username,
            emailCount: userTally[username]
        }));

        // ADD THE CORS HEADERS HERE TOO
        return NextResponse.json({
            status: "success",
            data: aggregatedData
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
            }
        });

    } catch (error) {
        console.error("Aggregation Error:", error);
        return NextResponse.json(
            { status: "error", message: "Failed to aggregate system emails" }, 
            { 
                status: 500,
                headers: { 'Access-Control-Allow-Origin': '*' }
            }
        );
    }
}