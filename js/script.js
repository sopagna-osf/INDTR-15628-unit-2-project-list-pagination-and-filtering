/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination
******************************************/
   
// Study guide for this project - https://drive.google.com/file/d/1OD1diUsTMdpfMDv677TfL1xO2CEkykSz/view?usp=sharing

const rowPerPage = 10;
const pageDiv = document.querySelector('.page');
const studentListUL = document.querySelector('.student-list');
const paginationDiv = createElement('div', 'className', 'pagination');

pageDiv.appendChild(paginationDiv);

/**
 * Create new DOM element
 * 
 * @param {String} tagName Tag name of element
 * @param {...String} attributes Attributes for the element
 */
function createElement(tagName, attributes) {
   const element = document.createElement(tagName);

   for (let i = 1; i < arguments.length; i += 2) {
      let key = arguments[i];
      let value = arguments[i + 1] || '';
      if (key) {
         element[key] = value;
      }
   }

   return element;
}

/**
 * Show student list base on provided list and page number
 * 
 * @param {HTMLCollection|Array} students List of Student DOM
 * @param {Number} [page=1] Page number to show
 */
function showPage(students, page) {
   page = page || 1;
   const startIndex = (page - 1) * rowPerPage;
   const endIndex = page * rowPerPage - 1;

   for (let i = 0; i < students.length; i++) {
      if (i >= startIndex && i <= endIndex) {
         students[i].style.display = '';
      }
      else {
         students[i].style.display = 'none';
      }
   }
}

/**
 * Create pagination buttons
 * 
 * @param {Number} studentCount 
 */
function appendPageLinks(students) {
   const totalPage = Math.ceil(students.length / rowPerPage);
   const ul = document.createElement('ul');
   const linkEventHandler = e => {
      e.preventDefault();
      const activeLink = paginationDiv.querySelector('a.active');

      if (activeLink) {
         activeLink.className = '';
      }

      e.target.className = 'active';
      showPage(students, parseInt(e.target.textContent));
   };

   for (let i = 1; i <= totalPage; i++) {
      const li = document.createElement('li');
      const link = createElement('a', 'href', '#', 'className', i == 1 ? 'active' : '', 'textContent', i);
      link.addEventListener('click', linkEventHandler);
      li.appendChild(link);
      ul.appendChild(li);
   }

   for (let i = 0; i < paginationDiv.children.length; i++) {
      paginationDiv.removeChild(paginationDiv.children[i]);
   }
   paginationDiv.appendChild(ul);
}

/**
 * Create search component for students
 * 
 * @param {HTMLCollection|Array} students List of student DOM
 */
function createSearchComponent(students) {
   const pageHeaderDiv = document.querySelector('.page-header');
   const studentSearchDiv = createElement('div', 'className', 'student-search');
   const searchInput = createElement('input', 'placeholder', 'Search for students...');
   const searchButton = createElement('button', 'textContent', 'Search');
   const search = (searchText) => {
      const regExp = new RegExp(searchText, 'ig');
      const searchResults = [];

      for (let i = 0; i < students.length; i++) {
         let name = students[i].querySelector('h3').textContent || '';
         let email = students[i].querySelector('.email').textContent || '';
         if (regExp.test(name) || regExp.test(email)) {
            students[i].style.display = '';
            searchResults.push(students[i]);
         }
         else {
            students[i].style.display = 'none';
         }

         regExp.lastIndex = 0;
      }

      showPage(searchResults);
      appendPageLinks(searchResults);

      let msgDiv = pageDiv.querySelector('.no-result');
      if (searchResults.length == 0 && !msgDiv) {
         msgDiv = createElement('div', 'className', 'no-result', 'textContent', 'No results');
         pageDiv.insertBefore(msgDiv, studentListUL);
      }
      else if (searchResults.length > 0 && msgDiv) {
         pageDiv.removeChild(msgDiv);
      }
   };

   studentSearchDiv.appendChild(searchInput);
   studentSearchDiv.appendChild(searchButton);
   pageHeaderDiv.appendChild(studentSearchDiv);

   searchButton.addEventListener('click', e => {
      e.preventDefault();
      search(searchInput.value);
   });

   searchInput.addEventListener('keyup', e => {
      search(e.target.value);
   });
}

showPage(studentListUL.children, 1);
appendPageLinks(studentListUL.children);
createSearchComponent(studentListUL.children);