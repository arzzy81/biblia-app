export interface BibleChapter {
  book: string;
  chapter: number;
  text: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

// API Endpoint configuration
const BIBLE_API_ENDPOINT = 'https://llm-chat-app-template.lucasmoreira-comercial.workers.dev/bible';

export function validateBibleText(text: string): ValidationResult {
  // Basic validation
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      error: 'Nenhum texto retornado',
    };
  }

  // Check for verse numbering
  const hasVerseNumbers = /\d+\.\s/.test(text) || /\d+\s/.test(text);
  if (!hasVerseNumbers) {
    return {
      isValid: true,
      warning: 'O texto pode estar sem numeração padrão de versículos.',
    };
  }

  return { isValid: true };
}

export async function fetchBibleChapter(
  book: string,
  chapter: number
): Promise<string> {
  try {
    const response = await fetch(BIBLE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        book: book,
        chapter: chapter,
        translation: 'ARC',
      }),
    });

    if (!response.ok) {
      // Handle HTTP errors
      if (response.status === 400) {
        throw new Error('Requisição inválida. Verifique o livro e capítulo.');
      }
      if (response.status === 404) {
        throw new Error('Capítulo não encontrado. Verifique se o livro e capítulo existem.');
      }
      if (response.status === 500) {
        throw new Error('Erro no servidor. Tente novamente mais tarde.');
      }
      if (response.status === 503) {
        throw new Error('Serviço temporariamente indisponível. Tente novamente em instantes.');
      }
      
      throw new Error(`Erro ao buscar capítulo (${response.status})`);
    }

    const data = await response.json();
    
    if (!data.text) {
      throw new Error('Resposta inválida da API: campo "text" não encontrado');
    }

    return data.text;
  } catch (error) {
    console.error('Erro ao buscar capítulo:', error);
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Sem conexão com a internet ou API indisponível');
    }
    
    throw error;
  }
}