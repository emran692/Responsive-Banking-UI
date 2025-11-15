let state = {
    balance: 0,
    txns: [],
    action: "deposit"
};

const balanceEl = document.getElementById("balance");
const amountInput = document.getElementById("amount");
const historyList = document.getElementById("historyList");

const depositBtn = document.getElementById("depositBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const submitBtn = document.getElementById("submitBtn");

const clearBtn = document.getElementById("clearBtn");
const resetBtn = document.getElementById("resetBtn");
const exportBtn = document.getElementById("exportBtn");


// ----------------------------------
// SELECT ACTION
// ----------------------------------
function selectAction(action) {
    state.action = action;

    if (action === "deposit") {
        depositBtn.style.opacity = "1";
        withdrawBtn.style.opacity = "0.6";

        submitBtn.classList.remove("submit-withdraw");
        submitBtn.classList.add("submit-deposit");

    } else {
        withdrawBtn.style.opacity = "1";
        depositBtn.style.opacity = "0.6";

        submitBtn.classList.remove("submit-deposit");
        submitBtn.classList.add("submit-withdraw");
    }
}

depositBtn.onclick = () => selectAction("deposit");
withdrawBtn.onclick = () => selectAction("withdraw");


// ----------------------------------
// RENDER UI
// ----------------------------------
function render() {
    balanceEl.textContent = "₹" + state.balance.toFixed(2);

    historyList.innerHTML = "";

    state.txns.slice().reverse().forEach(tx => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.innerHTML = `
            <span>${tx.type}</span>
            <span>${new Date(tx.ts).toLocaleString()}</span>
            <strong>₹${tx.amount}</strong>
        `;
        historyList.appendChild(div);
    });
}


// ----------------------------------
// SUBMIT BUTTON
// ----------------------------------
submitBtn.onclick = () => {
    let amt = parseFloat(amountInput.value);

    if (isNaN(amt) || amt <= 0) {
        alert("Enter a valid amount.");
        return;
    }

    if (state.action === "withdraw" && amt > state.balance) {
        alert("Insufficient balance.");
        return;
    }

    if (state.action === "deposit") {
        state.balance += amt;
    } else {
        state.balance -= amt;
    }

    state.txns.push({
        type: state.action,
        amount: amt,
        ts: new Date().toISOString()
    });

    amountInput.value = "";
    render();
};


// ----------------------------------
// EXTRA BUTTONS
// ----------------------------------
clearBtn.onclick = () => {
    state.txns = [];
    render();
};

resetBtn.onclick = () => {
    state.balance = 0;
    state.txns = [];
    render();
};

exportBtn.onclick = () => {
    if (state.txns.length === 0) return alert("No transactions");

    let rows = [["Type", "Amount", "Timestamp"], ...state.txns.map(t => [t.type, t.amount, t.ts])];
    let csv = rows.map(r => r.join(",")).join("\n");

    let blob = new Blob([csv], { type: "text/csv" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "transactions.csv";
    a.click();
};


// ----------------------------------
// INITIAL LOAD
// ----------------------------------
selectAction("deposit");
render();
