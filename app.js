// Book class 
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class
class UI {
    static displayBooks() {

        const books = Store.getBooks(); 

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td class="title">${book.title}</td>
        <td class="author">${book.author}</td>
        <td class="isbn">${book.isbn}</td>
        <td class="text-end"><a href="#" class="btn btn-info btn-sm btn-primary edit">Edit</a>
        <a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);

    }

    static deleteBook(el) {
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static editBook(el){
        
        const btn = el;
        const row = btn.parentElement.parentElement;
        
        const tdT = row.querySelector('.title');
        const tdA = row.querySelector('.author');
        const tdI = row.querySelector('.isbn');
        if(el.textContent === 'Edit'){
            const list = document.querySelector('#book-list');
            console.log(el);
            console.log(row);
            // console.log(td); 
            const inputT = document.createElement('input');
            inputT.type = 'text';
            inputT.value = tdT.textContent;
            inputT.style.width = "15vw";
            
            const inputA = document.createElement('input');
            inputA.type = 'text';
            inputA.value = tdA.textContent;
            inputA.style.width = "15vw";
            
            const inputI = document.createElement('input');
            inputI.type = 'text';
            inputI.value = tdI.textContent;
            inputI.style.width = "15vw";
            tdT.innerHTML='';
            tdT.appendChild(inputT);
            
            tdA.innerHTML='';
            tdA.appendChild(inputA);
            
            tdI.innerHTML='';
            tdI.appendChild(inputI);
            // input.setAttribute('style', 'color="white"');
            // input.style.margin = "0";
            // input.style.height = el.offsetHeight - (el.clientTop * 2) + "px";
            // console.log(el.offsetWidth);
            // console.log(el.clientLeft);
            // console.log(input.style.width);
            
            
            Store.removeBook(el.parentElement.previousElementSibling.firstChild.value);
            
            btn.textContent ="Save";
        } else if(el.textContent === 'Save'){
            const inputT = row.querySelector('.title').firstChild;
            const inputA = row.querySelector('.author').firstChild;
            const inputI = row.querySelector('.isbn').firstChild;
            
            tdT.innerHTML='';
            tdT.textContent = inputT.value;
            
            tdA.innerHTML='';
            tdA.textContent = inputA.value;
            
            tdI.innerHTML='';
            tdI.textContent = inputI.value;

            
            btn.textContent ="Edit";

            // get edited values
            const title = inputT.value;
            const author = inputA.value;
            const isbn = inputI.value;
            
            // instantiate book
            const book = new Book(title, author, isbn);
            
            // add book to store
            Store.addBook(book);

            UI.showAlert('Book Saved', 'info');


        }

    }

    static showAlert(message, className){
        const div = document.createElement('div');
        const alert = document.querySelector('.alertDiv');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
//         const container = document.querySelector('.container');
//         const form = document.querySelector('#book-form');
//         container.insertBefore(div, form);
        alert.appendChild(div);

        setTimeout(() => document.querySelector('.alert').remove(),2000);
    }
    static clearFields () {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';

    }
};

// store class 
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


// e: display books 
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// e: add a book 
document.querySelector('#book-form').addEventListener('submit', (e) => {

    //prevent actual sumbit 
    e.preventDefault();

    // get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // validate
    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    }
    else {

    // instantiate book
    const book = new Book(title, author, isbn);
    
    //add book to UI 
    UI.addBookToList(book);

    // add book to store
    Store.addBook(book)


    // success msg
    UI.showAlert('Book Added', 'success');

    // clear fields
    UI.clearFields();

    }
});

// e:remove & edit a book 

document.querySelector('#book-list').addEventListener('click', (e)=> {

    if (e.target.classList.contains('delete')){
    UI.deleteBook(e.target);
  
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  
    
    UI.showAlert('Book Removed', 'success');
    }
    else if(e.target.classList.contains('edit')) {
        UI.editBook(e.target);
  
    }
  });
