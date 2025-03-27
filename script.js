document.addEventListener("DOMContentLoaded", () => {
    const expenseList = document.getElementById("expenses-section");
   const summarySection = document.getElementById("summary-section");
    let selectedCategory = "";

    
    window.renderExpenseSection = function (category) {
        selectedCategory = category;

        
        document.getElementById("category-heading").innerHTML = `<h2>Expenses for ${category}</h2>`;

        showExpenses();
    };

    
    function showExpenses() {
        fetch("http://localhost:3000/expenses")

            .then(response => response.json())

            .then(data => {
                expenseList.innerHTML = "";

                const filteredExpenses = data.filter(expense => expense.category === selectedCategory);
                  if (filteredExpenses.length === 0) {
                    expenseList.innerHTML = "<p>No expenses available for this category.</p>";
                } else {
                    filteredExpenses.forEach(expense => addExpenseToUI(expense));
                }
            })
    }
    function addExpenseToUI(expense) {
        const div = document.createElement("div");
        div.classList.add("expense-item");

        div.innerHTML = `
            <span>${expense.description}</span>
            <button onclick='promptExpenseAmount("${expense.description}")'>Add Expense</button>
        `;
        expenseList.appendChild(div);
    }
    window.promptExpenseAmount = function (description) {
        const amount = prompt(`Enter amount for "${description}":`);
        if (amount && !isNaN(amount ) && amount  > 0 )  {
                addExpenseToSummary(description, parseFloat(amount));
        } else {
        alert("Please enter a valid amount.");
        }
    };   
    function addExpenseToSummary(description, amount) {
        const summaryItem = document.createElement("div");
            summaryItem.classList.add("summary-item");

        summaryItem.innerHTML = `
            <span>${description}: $${amount}</span>
            <button onclick='editExpense(this, "${description}")'>Edit</button>
            <button onclick='deleteExpense(this)'>Delete</button>
        `;
        summarySection.appendChild(summaryItem);
        updateTotal();
    }
    window.editExpense = function (button, description) {
        const newAmount = prompt(`Enter new amount for "${description}":`);
        if (newAmount && !isNaN ( newAmount) &&  newAmount >  0)  {
             button.parentElement.querySelector("span").innerText = `${description}: $${newAmount}`;
        updateTotal();
        } else {
                alert("Please enter a valid amount.");
        }
    };
    window.deleteExpense = function (button) {
        button.parentElement.remove();
        updateTotal();
    };

    function updateTotal() {
        let total = 0;
        document.querySelectorAll(".summary-item span").forEach(item => {
            
            const amount = parseFloat(item.innerText.split("$")[1]);
            total += amount;
        });
        summarySection.innerHTML = `<h2>Total Expenses: $${total}</h2>` + summarySection.innerHTML;
    }
});
