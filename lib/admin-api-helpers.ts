/**
 * Helpers pour les appels API depuis les pages admin
 * Gestion centralisée des erreurs et des réponses
 */

export async function saveContentToAPI(payload: any): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    console.log("Admin API: Sending PUT request to /api/content");
    console.log("Admin API: Payload keys:", Object.keys(payload));
    
    const response = await fetch("/api/content", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
      },
      credentials: "include", // Important pour inclure les cookies
      body: JSON.stringify(payload),
    });
    
    console.log("Admin API: Response status:", response.status);
    console.log("Admin API: Response headers:", Object.fromEntries(response.headers.entries()));
    
    // Vérifier le Content-Type de la réponse
    const contentType = response.headers.get("content-type");
    console.log("Admin API: Response Content-Type:", contentType);
    
    // Lire le texte de la réponse d'abord
    const responseText = await response.text();
    console.log("Admin API: Response text (first 500 chars):", responseText.substring(0, 500));
    
    if (response.ok) {
      if (contentType && contentType.includes("application/json")) {
        try {
          const result = JSON.parse(responseText);
          console.log("Admin API: Save successful");
          return { success: true, data: result };
        } catch (jsonError) {
          console.error("Admin API: Error parsing JSON response:", jsonError);
          console.error("Admin API: Full response text:", responseText);
          return { 
            success: false, 
            error: `Réponse invalide du serveur (JSON parse error): ${responseText.substring(0, 200)}` 
          };
        }
      } else {
        console.error("Admin API: Response is not JSON, Content-Type:", contentType);
        console.error("Admin API: Full response text:", responseText);
        return { 
          success: false, 
          error: `Le serveur a retourné une réponse non-JSON (${contentType || 'unknown'}): ${responseText.substring(0, 200)}` 
        };
      }
    } else {
      // Erreur HTTP
      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = JSON.parse(responseText);
          console.error("Admin API: Save failed:", errorData);
          return { 
            success: false, 
            error: errorData.error || errorData.details || `Erreur ${response.status}: ${response.statusText}` 
          };
        } catch (jsonError) {
          console.error("Admin API: Error parsing error response:", jsonError);
          console.error("Admin API: Full error response text:", responseText);
          return { 
            success: false, 
            error: `Erreur ${response.status} ${response.statusText} (JSON parse error): ${responseText.substring(0, 200)}` 
          };
        }
      } else {
        console.error("Admin API: Error response is not JSON, Content-Type:", contentType);
        console.error("Admin API: Full error response text:", responseText);
        return { 
          success: false, 
          error: `Erreur ${response.status} ${response.statusText}: ${responseText.substring(0, 200)}` 
        };
      }
    }
  } catch (error) {
    console.error("Admin API: Network or other error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erreur réseau inconnue" 
    };
  }
}

