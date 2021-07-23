const Modal = {
    open() {
        //Abrir Modal
        //Adicionar a class active ao modal
        document.
            querySelector(".modal-overlay")
            .classList
            .add("active")

    },
    close() {
        // Fechar Modal
        // Remover a class active do Modal
        document
            .querySelector(".modal-overlay")
            .classList
            .remove("active")
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    },
}

const transactions = [
    {
        description: "Luz",
        amount: -50000,
        date: "23/01/2021",
    },
    {
        description: "Website",
        amount: 500000,
        date: "23/01/2021",
    },
    {
        description: "Internet",
        amount: -20000,
        date: "23/01/2021",
    },
]

// Somar as entradas e saidas, sendo demonstrado o saldo

const Transactions = {
    all: Storage.get(),
    
    add(transaction){
        Transactions.all.push(transaction);

        App.reload()
    },

    remove(index) {
        Transactions.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;
        //somar as entradas
        //verificar > 0, se maior, somar a uma variavel e retornar
        Transactions.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        return income;
    },
    expenses() {
        let expense = 0;
        //somar as saidas
        //verificar > 0, se menor, somar a uma variavel e retornar
        Transactions.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        return expense;
    },
    saldo() {
        // entradas - saidas
        return Transactions.incomes() + Transactions.expenses()
    }
}

//  Substituir as transacoes do objeto do JS passar para  HTML

const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),
    
    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)
        
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transactions.remove(${index})" src="./assets/minus.svg" alt="remover transação">
            </td>
        `

        return html
    },

    updateBalance(){
        document
            .getElementById("incomeDisplay")
            .innerHTML = Utils.formatCurrency(Transactions.incomes())
        document
            .getElementById("expenseDisplay")
            .innerHTML = Utils.formatCurrency(Transactions.expenses())
        document
            .getElementById("totalDisplay")
            .innerHTML = Utils.formatCurrency(Transactions.saldo())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";

    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100

        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const {description, amount, date } = Form.getValues()

        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
                throw new Error("Por favor, preenha todos os campos")
        }
    },

    formatValues() {
        let {description, amount, date } = Form.getValues()
        
        amount = Utils.formatAmount(amount)
        
        date = Utils.formatDate(date)
        
        return {
            description,
            amount,
            date
        }
    },

    saveTransaction(transaction) {
        Transactions.add(transaction)
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()


        try {
            // verificar se todas as informacoes foram preenchidas
            Form.validateFields()
            // formatar os dados para salva
            const transaction = Form.formatValues()
            //salvar 
            Form.saveTransaction(transaction)
            // apagar os dados do formulario + atualizar a aplicacao (App.reload)
            Form.clearFields()
            // modal feche
            Modal.close()
            
        } catch (error) {
            alert(error.message)
        }
        
    }
}

const App = {
    init () {

        Transactions.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(Transactions.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },

}

App.init()
