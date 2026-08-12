'use server'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const creatTicket = async(newTicket) => {
    const res = await fetch(`${baseUrl}/api/tickets`, {
        method: 'POST',
        headers: {
            'Content-type' : 'application/json',
        },
        body: JSON.stringify(newTicket),
    })
    return res.json()
}