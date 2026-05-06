const NAMESPACE = "lempreinte-sondage-2026"; // Change ceci pour chaque nouveau sondage

// Fonction pour charger les votes au chargement de la page
async function loadVotes() {
    ['cafe', 'chaussures'].forEach(async (key) => {
        const response = await fetch(`https://api.countapi.xyz/get/${NAMESPACE}/${key}`);
        const data = await response.json();
        document.getElementById(`count-${key}`).innerText = `${data.value || 0} votes`;
    });
}

// Fonction pour voter
async function castVote(key) {
    // Optionnel : empêcher de voter plusieurs fois (via localStorage)
    if (localStorage.getItem('hasVoted')) {
        alert("Vous avez déjà voté pour ce sondage !");
        return;
    }

    const response = await fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${key}`);
    const data = await response.json();
    
    // Mise à jour visuelle immédiate
    document.getElementById(`count-${key}`).innerText = `${data.value} votes`;
    
    // Bloquer le vote futur
    localStorage.setItem('hasVoted', 'true');
    
    // Petit effet visuel
    alert("Merci pour votre vote !");
}

// Initialisation
loadVotes();