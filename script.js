document.addEventListener("DOMContentLoaded", () => {
    const expenseList = document.getElementById("ep-list");

    let selectCategory = "";

    
    window.renderExpenseSection = function (category) {
        selectCategory = category;

        document.getElementById("expenses").innerText = `Expenses for ${category}`;


        document.getElementById("ep-list").style.display = "block";

        showExpenses(); 
    };

    function showExpenses() {
        fetch("http://localhost:3000/expenses")
            .then(response => response.json())
            .then(data => {
                expenseList.innerHTML = ""; 

                
                const filteredExpenses = data.filter(expense => expense.category === selectCategory);
                
                if (filteredExpenses.length === 0) {
                    expenseList.innerHTML = "";
                } else {
                    filteredExpenses.forEach(expense => addExpenseToPage(expense));
                }
            })
            
    }

    function addExpense() {
        const naming = document.getElementById("name").value;

        const amounting = document.getElementById("amount").value;

        if (!naming || !amounting || !selectCategory) {
            alert("Please fill out all the fields.");
            return;
        }

        const newExpense = {
            category: selectCategory,
            amount: parseFloat(amounting),
            description: naming,
        };

        fetch("http://localhost:3000/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newExpense),
        })
            .then(response => response.json())
            .then(() => {
                showExpenses(); 
                document.getElementById("name").value = "";
                document.getElementById("amount").value = "";
            })
    }

    function addExpenseToPage(expense) {
        const li = document.createElement("li");
        li.innerHTML = `${expense.description} - 
            <button onclick='editExpense(${expense.id}, "${expense.description}", ${expense.amount})'>Edit</button>
            <button onclick='deleteExpense(${expense.id})'>Delete</button>`;

        expenseList.appendChild(li);
    }
    function showSummary() {
        fetch("http://localhost:3000/expenses")
            .then(response => response.json())
            .then(data => {
                const total = data.reduce((sum, exp) => sum + exp.amount, 0);
                document.getElementById("summary").innerText = `Total Expenses: $${total}`;
            })
            
    }
});
