// Storage controller

// Item Controller
const ItemCtrl = (function() {
  // item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // data structure / state
  const data = {
    items: [
      // { id: 0, name: "Steak Dinner", calories: 1200 },
      // { id: 1, name: "Cookie", calories: 400 },
      // { id: 2, name: "Eggs", calories: 300 }
    ],
    currentItem: null,
    totalCalories: 0
  };
  // public methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      // create id
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // calories to number
      calories = parseInt(calories);

      //create new item
      newItem = new Item(ID, name, calories);

      //add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = null;
      data.items.forEach(function(item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      // calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function(id) {
      // get ids
      const ids = data.items.map(function(item) {
        return item.id;
      });

      /// get index
      const index = ids.indexOf(id);

      // remove item
      data.items.splice(index, 1);
    },
    clearAllItems() {
      data.items = [];
    },
    setCurrentItem(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;

      // loop through items and add calories
      data.items.forEach(function(item) {
        total += item.calories;
      });

      // set total cal in data structure
      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  };
})();

// UI controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    listItems: '#item-list li',
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  };
  return {
    populateItemList: function(items) {
      let html = "";

      items.forEach(function(item) {
        html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                </li>`;
      });
      // insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    addListItem: function(item) {
      // show the list 
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement("li");
      // add class
      li.className = "collection-item";
      // add id
      li.id = `item-${item.id}`;
      // add html
      li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            `;
      // inser item
      document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // turn nodelist into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            `;
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`
      const item = document.querySelector(itemID);
      item.remove();
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(function(item) {
        item.remove();
      });
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// app controller
const App = (function(ItemCtrl, UICtrl) {
  // load event listeners
  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();

    // add item event
    document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

    // disable submit on enter
    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    })

    // edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // item update event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // item delete event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // clear all event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  };

  // add item submit
  const itemAddSubmit = function(e) {
    // get form input from UI Controller
    const input = UICtrl.getItemInput();

    //check for name and calorioe input
    if (input.name !== "" && input.calories !== "") {
      // add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      //clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // update item submit
  const itemUpdateSubmit = function(e) {
    // get item input 
    const input = UICtrl.getItemInput();

    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // delete button event
  const itemDeleteSubmit = function(e) {
    // get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    //delete from UI
    UICtrl.deleteListItem(currentItem.id);

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  //clear all items
  const clearAllItemsClick = function() {
    // Delete all items from structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    // remove from ui
    UICtrl.removeItems();

    UICtrl.hideList();

  }

  //click edit item
  const itemEditClick = function(e) {
    if (e.target.classList.contains('edit-item')) {
      const listID = e.target.parentNode.parentNode.id;

      const listIDarray = listID.split('-');

      const id = parseInt(listIDarray[1]);

      const itemToEdit = ItemCtrl.getItemById(id);

      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  // public methods
  return {
    init: function() {
      // clear edit state
      UICtrl.clearEditState();
      // fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // populate list with items
        UICtrl.populateItemList(items);
      }

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
      
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

// Initialize App
App.init();
