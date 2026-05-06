const NAMESPACE = "lempreinte-sondage-v1"; // Change de nom pour tester un nouveau compteur

async function loadVotes() {
    const keys = ['cafe', 'chaussures'];
    
    for (const key of keys) {
        try {
            // Utilisation de countapi.it (plus stable)
            const response = await fetch(`https://countapi.it/get/${NAMESPACE}/${key}`);
            const data = await response.json();
            
            // Si la clé n'existe pas encore, l'API renvoie parfois une erreur ou 0
            const value = data.value || 0;
            document.getElementById(`count-${key}`).innerText = `${value} votes`;
        } catch (error) {
            console.error(`Erreur chargement ${key}:`, error);
            document.getElementById(`count-${key}`).innerText = "0 votes";
        }
    }
}

async function castVote(key) {
    if (localStorage.getItem(`voted-${NAMESPACE}`)) {
        alert("Vous avez déjà voté pour ce sondage !");
        return;
    }

    try {
        const response = await fetch(`https://countapi.it/hit/${NAMESPACE}/${key}`);
        const data = await response.json();
        
        document.getElementById(`count-${key}`).innerText = `${data.value} votes`;
        localStorage.setItem(`voted-${NAMESPACE}`, 'true');
        
        // Animation légère pour confirmer le clic
        const card = document.querySelector(`[onclick="castVote('${key}')"]`);
        card.style.borderColor = "#00ff00";
        setTimeout(() => card.style.borderColor = "rgba(0,0,0,0.1)", 1000);

    } catch (error) {
        alert("Le service de vote est temporairement indisponible.");
    }
}

// On lance le chargement dès que la page est prête
document.addEventListener('DOMContentLoaded', loadVotes);