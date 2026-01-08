const API_URL = "http://localhost:5000/api/subs";
const categoryColors = {
  Entertainment: "rgba(255, 45, 85, 0.4)",
  Fitness: "rgba(52, 199, 89, 0.4)",
  Work: "rgba(255, 149, 0, 0.4)",
  Utilities: "rgba(0, 122, 255, 0.4)",
};
async function fetchSubscriptions() {
  try {
    const response = await fetch(API_URL);
    const subs = await response.json();
    displaySubs(subs);
    updateTotal(subs);
  } catch (error) {
    console.error("Error fetching subs:", error);
  }
}

function displaySubs(subs) {
  const subList = document.getElementById("sub-list");
  subList.innerHTML = "";

  subs.forEach((sub) => {
    const date = new Date(sub.renewalDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
    const glowColor = categoryColors[sub.category] || "rgba(99, 102, 241, 0.4)";

    const subJsonString = JSON.stringify(sub).replace(/'/g, "&apos;");

    subList.innerHTML += `
            <div class="group flex items-center justify-between p-6 rounded-3xl glass-card hover:bg-white/[0.04] transition-all duration-500"
                 style="--hover-glow: ${glowColor}">
                <div class="flex items-center gap-6">
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-bold border transition-all duration-500"
                         style="background: ${glowColor.replace("0.4", "0.1")}; 
                                color: ${glowColor.replace("0.4", "1")}; 
                                border-color: ${glowColor.replace(
                                  "0.4",
                                  "0.2"
                                )};
                                box-shadow: 0 0 20px ${glowColor.replace(
                                  "0.4",
                                  "0.15"
                                )};">
                        ${sub.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h3 class="text-white font-medium tracking-tight text-lg">${
                          sub.name
                        }</h3>
                        <p class="text-[9px] text-slate-500 uppercase tracking-[0.2em] mt-1">
                            <span style="color: ${glowColor.replace(
                              "0.4",
                              "1"
                            )}">${sub.category}</span> • Due ${date}
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-8">
                    <span class="text-xl font-bold text-white tracking-tighter">$${sub.price.toFixed(
                      2
                    )}</span>
                    <div class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick='openEditModal(${subJsonString})' class="p-2 text-slate-600 hover:text-blue-400 transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 5.232z"></path></svg>
                        </button>
                        <button onclick="deleteSub('${
                          sub._id
                        }')" class="p-2 text-slate-600 hover:text-red-400 transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
            </div>`;
  });
}

async function deleteSub(id) {
  if (!confirm("Are you sure you want to delete this subscription?")) return;
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (response.ok) fetchSubscriptions();
  } catch (error) {
    console.error("Error deleting sub:", error);
  }
}

function openEditModal(sub) {
    document.getElementById('edit-id').value = sub._id;
    document.getElementById('edit-name').value = sub.name;
    document.getElementById('edit-category').value = sub.category;
    document.getElementById('edit-price').value = sub.price;
    document.getElementById('edit-renewalDate').value = new Date(sub.renewalDate).toISOString().split('T')[0];

    const container = document.getElementById('edit-form-container');
    container.classList.remove('hidden');
    container.classList.add('flex');
}

function closeEditModal() {
    const container = document.getElementById('edit-form-container');
    container.classList.add('hidden');
    container.classList.remove('flex');
}

document.getElementById('edit-sub-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const updatedSub = {
        name: document.getElementById('edit-name').value,
        category: document.getElementById('edit-category').value,
        price: parseFloat(document.getElementById('edit-price').value),
        renewalDate: document.getElementById('edit-renewalDate').value,
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedSub),
        });

        if (response.ok) {
            fetchSubscriptions();
            closeEditModal();
        } else {
            const error = await response.json();
            console.error('Error updating subscription:', error.message);
            alert(`Error updating subscription: ${error.message}`);
        }
    } catch (error) {
        console.error('Error updating subscription:', error);
        alert('An error occurred while updating the subscription.');
    }
});

document.getElementById("sub-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const newSub = {
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    price: parseFloat(document.getElementById("price").value),
    renewalDate: document.getElementById("renewalDate").value,
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSub),
  });

  if (response.ok) {
    fetchSubscriptions();
    e.target.reset();
    document.getElementById("form-container").classList.add("hidden");
  }
});

function updateTotal(subs) {
  const total = subs.reduce((sum, sub) => sum + sub.price, 0);
  document.getElementById("total-cost").innerText = `$${total.toFixed(2)}`;
}

fetchSubscriptions();