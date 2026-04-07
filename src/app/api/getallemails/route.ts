import { NextResponse } from 'next/server';
import { emailStore } from "@/mock-data/emailStore"; 

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function GET() {
    try {
        const allEmails = emailStore.map((email: any) => {
            
            const username = email.to ? (email.to.includes('@') ? email.to : `${email.to}@mailhey.com`) : 'unknown@mailhey.com';
            
           
            return {
                id: email.id || Math.random().toString(),
                sender: email.from || email.sender || "System",
                subject: email.subject || "(No Subject)",
                body: email.body || email.text || email.content || email.snippet || "",
                createdAt: email.createdAt || email.date_received || email.date || new Date().toISOString(),
                username: username 
            };
        });

        
        allEmails.sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
        });

        return NextResponse.json({
            status: "success",
            data: allEmails 
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
            }
        });

    } catch (error) {
        console.error("Fetch Error:", error);
        return NextResponse.json(
            { status: "error", message: "Failed to fetch system emails" }, 
            { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
        );
    }
}