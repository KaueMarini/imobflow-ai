import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Tratamento de CORS (Preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { xmlUrl } = await req.json()

    if (!xmlUrl) {
      return new Response(JSON.stringify({ error: 'URL é obrigatória' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log(`Iniciando Streaming do XML: ${xmlUrl}`)

    // Faz a requisição para o CRM
    const upstreamResponse = await fetch(xmlUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/xml, text/xml, */*; q=0.01'
      }
    })

    if (!upstreamResponse.ok) {
      throw new Error(`O servidor de origem respondeu com erro: ${upstreamResponse.status}`)
    }

    // --- O PULO DO GATO (Streaming) ---
    // Em vez de esperar baixar tudo com .text(), nós passamos o 'body' direto.
    // Isso cria um túnel direto entre o CRM e o seu Frontend.
    return new Response(upstreamResponse.body, {
      status: 200,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/xml' // Importante avisar que é XML
      },
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})