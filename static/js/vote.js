const API_URL = "https://sheetdb.io/api/v1/y5myrxo97fe49";

async function loadVotes() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // On parcourt les données reçues de Google Sheet
        data.forEach(item => {
            const countElement = document.getElementById(`count-${item.id}`);
            if (countElement) {
                // On s'assure que votes est un nombre, sinon 0
                countElement.innerText = `${item.votes || 0} votes`;
            }
        });
    } catch (e) {
        console.error("Erreur de lecture SheetDB:", e);
    }
}

async function castVote(id) {
    if (localStorage.getItem('hasVoted')) {
        alert("Vous avez déjà voté !");
        return;
    }

    try {
        // 1. Récupérer la valeur actuelle pour cet ID
        const res = await fetch(`${API_URL}/search?id=${id}`);
        const currentData = await res.json();
        
        if (currentData.length === 0) throw new Error("ID non trouvé");

        const oldVotes = parseInt(currentData[0].votes) || 0;
        const newVotes = oldVotes + 1;

        // 2. Mettre à jour la ligne dans Google Sheet
        // SheetDB utilise l'ID dans l'URL pour savoir quelle ligne modifier
        const updateRes = await fetch(`${API_URL}/id/${id}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: { "votes": newVotes }
            })
        });

        if (updateRes.ok) {
            // 3. Mise à jour visuelle si l'API a répondu OK
            document.getElementById(`count-${id}`).innerText = `${newVotes} votes`;
            localStorage.setItem('hasVoted', 'true');
            
            // Petit feedback visuel
            const card = document.getElementById(`count-${id}`).parentElement;
            card.style.borderColor = "#0070e0";
        }

    } catch (e) {
        console.error("Erreur lors du vote:", e);
        alert("Petit problème technique, réessayez !");
    }
}

document.addEventListener('DOMContentLoaded', loadVotes);