const jalonsList = document.getElementById("jalonsList");
const messagesTable = document.querySelector("#messagesTable tbody");
const rdvList = document.getElementById("rdvList");
const autresList = document.getElementById("autresList");
const uploadJson = document.getElementById("uploadJson");
const loadBtn = document.getElementById("loadBtn");

let llmData = null;

// --- Fonction render ---
function renderModules() {
  // --- Jalons ---
  jalonsList.innerHTML = "";
  if(llmData?.jalons){
    llmData.jalons.forEach(j => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${j.titre}</strong> (${j.datePrévue})`;
      if(j.sousActions?.length){
        const subUl = document.createElement("ul");
        j.sousActions.forEach(s => {
          const subLi = document.createElement("li");
          const cb = document.createElement("input");
          cb.type="checkbox";
          cb.checked = s.statut==="fait";
          cb.addEventListener("change", ()=> s.statut = cb.checked ? "fait":"à faire");
          subLi.appendChild(cb);
          subLi.appendChild(document.createTextNode(s.texte));
          subUl.appendChild(subLi);
        });
        li.appendChild(subUl);
      }
      jalonsList.appendChild(li);
    });
  }

  // --- Messages ---
  messagesTable.innerHTML = "";
  if(llmData?.messages){
    llmData.messages.forEach((m,i)=>{
      const tr = document.createElement("tr");
      const tdSend = document.createElement("td");
      const cb = document.createElement("input");
      cb.type="checkbox";
      cb.checked = m.envoyé;
      cb.addEventListener("change", ()=> m.envoyé = cb.checked);
      tdSend.appendChild(cb);
      tr.appendChild(tdSend);
      tr.appendChild(document.createElement("td")).textContent = m.destinataire;
      tr.appendChild(document.createElement("td")).textContent = m.sujet;
      tr.appendChild(document.createElement("td")).textContent = m.texte;
      messagesTable.appendChild(tr);
    });
  }

  // --- RDV ---
  rdvList.innerHTML = "";
  if(llmData?.rdv){
    llmData.rdv.forEach(r=>{
      const li = document.createElement("li");
      li.innerHTML = `<strong>${r.titre}</strong> - ${r.date} (${r.durée}) - Participants: ${r.participants.join(", ")})`;
      rdvList.appendChild(li);
    });
  }

  // --- Autres ressources ---
  autresList.innerHTML = "";
  if(llmData?.autresModules){
    llmData.autresModules.forEach(m=>{
      const li = document.createElement("li");
      li.innerHTML = `<strong>${m.titre}</strong>`;
      if(m.items?.length){
        const subUl = document.createElement("ul");
        m.items.forEach(it=>{
          const subLi = document.createElement("li");
          const a = document.createElement("a");
          a.href = it.lien;
          a.textContent = it.nom;
          a.target="_blank";
          subLi.appendChild(a);
          subUl.appendChild(subLi);
        });
        li.appendChild(subUl);
      }
      autresList.appendChild(li);
    });
  }
}

// --- Charger JSON ---
loadBtn.addEventListener("click", ()=>{
  const file = uploadJson.files[0];
  if(!file){ alert("Choisis un fichier JSON LLM !"); return; }
  const reader = new FileReader();
  reader.onload = e=>{
    try{
      llmData = JSON.parse(e.target.result);
      renderModules();
    }catch(err){ console.error(err); alert("Fichier JSON invalide !"); }
  };
  reader.readAsText(file);
});
