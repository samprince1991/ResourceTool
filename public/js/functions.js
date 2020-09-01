'use strict'
let auth = "Bearer " + localStorage.getItem('accessToken')
let productTable = document.getElementById("productTable")
let opsTable = document.getElementById("opsTable")
let addProductForm = document.getElementById("addProductForm")
let addOperationsForm = document.getElementById("addOperationsForm")
let addEventsForm = document.getElementById("addEventsForm")
let calenderView = document.getElementById("calenderView")
let logoutElement = document.getElementById("logoutElement");
let loginSignUpElement = document.getElementById("loginSignUpElement");
let dashboardStatistics = document.getElementById("dashboardStatistics")
let categoryElement = document.getElementById("categoryElement")
let allAssignmentOfEvent = document.getElementById("allAssignmentOfEvent")
let operationsTable = document.getElementById("operationsTable");
let changeProductStatuFrom = document.getElementById("changeProductStatusModal");
async function getAllProducts(model) {
    try {
        let response = await axios({
            url: '/products/all',
            method: 'post',
            data: { model: model },
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            }
        })
        if (response.status == 200) {
            return response.data.allProducts
        }
        return response.data
    }
    catch (err) {
        return err
    }
}
async function getAllOperations() {
    try {
        let response = await axios({
            url: '/operations/all',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            }
        })
        if (response.status == 200) {
            return response.data.allOperations
        }
        return response.data
    }
    catch (err) {
        return err
    }
}
async function getAllEvents(eventId) {
    try {
        let response = await axios({
            url: '/events/all',
            method: 'get',
            data: { eventId: eventId },
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            }
        })
        if (response.status == 200) {
            return response.data.allEvents
        }
        return response.data
    }
    catch (err) {
        return err
    }
}
async function getAllDictionarys(name) {
    try {
        let response = await axios({
            url: '/dictionarys/all',
            method: 'post',
            data: { name: name },
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            }
        })
        if (response.status == 200) {
            return response.data.allDictionarys
        }
        return response.data
    }
    catch (err) {
        return err
    }
}
async function getAllUsers() {
    try {
        let response = await axios({
            url: '/users/all',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            }
        })
        if (response.status == 200) {
            return response.data.allUsers
        }
        return response.data
    }
    catch (err) {
        return err
    }
}
async function getDashboardData() {
    try {
        let response = await axios({
            url: '/dashboard/getStatistics',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            }
        })
        if (response.status == 200) {
            document.querySelector("#dashboardStatistics #totalProducts").innerHTML = response.data.dashboardStatistics.totalProducts
            document.querySelector("#dashboardStatistics #totalOperations").innerHTML = response.data.dashboardStatistics.totalOperations
            document.querySelector("#dashboardStatistics #totalUsers").innerHTML = response.data.dashboardStatistics.totalUsers
        }
        return response.data
    }
    catch (err) {
        document.querySelector("#dashboardStatistics #totalProducts").innerHTML = "N/A"
        document.querySelector("#dashboardStatistics #totalOperations").innerHTML = "N/A"
        document.querySelector("#dashboardStatistics #totalUsers").innerHTML = "N/A"
    }


}
async function getAllProductCatgories() {
    try {
        let response = await axios({
            url: '/products/categories',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            }
        })
        if (response.status == 200) {
            return response.data.allCategories
        }
        return response.data
    }
    catch (err) {
        return err
    }
}
async function getAllProductManufacturer(category) {
    try {
        let response = await axios({
            url: '/products/manufacturer',
            method: 'post',
            data: { category: category },
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            },
        })
        if (response.status == 200) {
            return response.data.allManufacturer
        }
        return response.data
    }
    catch (err) {
        return err
    }
}
async function getAllProductModels(manufacturer) {
    try {
        let response = await axios({
            url: '/products/models',
            method: 'post',
            data: { manufacturer: manufacturer },
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            },
        })
        if (response.status == 200) {
            return response.data.allModels
        }
        return response.data
    }
    catch (err) {
        return err
    }
}


async function loadProductData(params) {
    NProgress.start();
    try {
        let response = await axios({
            method: 'post',
            url: '/products/all',
        });
        if (response.status === 200) {
            params.success(response.data.allProducts)
        }
    }
    catch (error) {
        params.error(error);
    }
    NProgress.done();
}
async function loadOperationsData(params) {
    try {
        let response = await axios({
            method: 'post',
            url: '/operations/all',
            data: { operationsId: params.data.operationsId, eventId: params.data.eventId }
        });

        console.log(`response is ${JSON.stringify(response.data.allOperations)}`)
        if (response.status === 200) {
            params.success(response.data.allOperations)
        }
    }
    catch (error) {
        params.error(error);
    }
}
async function loadEventsData(params) {
    try {
        let response = await axios({
            method: 'get',
            url: '/events/all'
        });
        if (response.status === 200) {
            params.success(response.data.allEvents)
        }
    }
    catch (error) {
        params.error(error);
    }
}
async function loadDictionary(params) {
    if (params.data.filterName) {
        try {
            let response = await axios({
                method: 'post',
                url: 'dictionarys/all',
                data: { name: params.data.filterName }
            });
            if (response.status === 200) {
                params.success(response.data.allDictionarys[0].values)
            }
        }
        catch (error) {
            params.error(error);
        }
    }
    else {
        params.error("No filter found");
    }
}



function queryParamsProductStatus(params) {
    params.filterName = "productStatus"
    return params
}
function queryParamsEventStatus(params) {
    params.filterName = "eventStatus"
    return params
}
function queryParamsAssignmentStatus(params) {
    params.filterName = "assignmentStatus"
    return params
}
function queryParamsAddAssignmentTable(params) {
    params.eventId = $('#addOperationsForm #eventId').val()
    return params
}
function operationsEventFormatter(value, row, index) {
    return [
        // '<a class="like px-1" href="javascript:void(0)" title="Like">',
        // '<i class="fa fa-pen"></i>',
        // '</a>  ',
        // '<a class="remove px-1" href="javascript:void(0)" title="Remove">',
        // '<i class="fa fa-trash"></i>',
        // '</a>',
        `<a   data-toggle="modal"   data-opsid="${row._id}"  data-target="#operationsActionModal"  class="return px-1 btn btn-sm btn-primary" href="javascript:void(0)" title="Remove">
        Return
        </a>`
    ].join('')
}
window.operationsEvent = {
    // 'click .like': function (e, value, row, index) {
    //     alert('You click like action, row1: ' + JSON.stringify(row))
    // },
    // 'click .remove': function (e, value, row, index) {
    //     alert("Remove even1t")
    // },
    'click .return': function (e, value, row, index) {
        // alert("return even1t")
    }
}
function productOperateFormatter(value, row, index) {
    return [
        `<div>
        <button type="button" class=" editstatus btn btn-secondary"  data-toggle="modal" data-target="#changeProductStatusModal"  data-productid="${row._id}">Edit Status</button>
        <button type="button" class=" remove btn btn-danger" >Delete</button>
        <button type="button" class=" view btn btn-info" >View</button>
        </div>`,
    ].join('')
}
window.productOperateEvents = {
    'click .editstatus': function (e, value, row, index) {
        // buildProductDiv();
        buildProductListDiv();
        //$('#changeProductStatusModal').modal('show');
    },
    'click .remove': function (e, value, row, index) {
        deleteProduct(row._id);
    },
    'click .view': function (e, value, row, index) {
        toastr.success("View event")
    }
}
function operateFormatter(value, row, index) {
    return [
        '<a class="like px-1" href="javascript:void(0)" title="Like">',
        '<i class="fa fa-pen"></i>',
        '</a>  ',
        '<a class="remove px-1" href="javascript:void(0)" title="Remove">',
        '<i class="fa fa-trash"></i>',
        '</a>'
    ].join('')
}
window.operateEvents = {
    'click .like': function (e, value, row, index) {
        alert('You click like action, row: ' + JSON.stringify(row))
    },
    'click .remove': function (e, value, row, index) {
        alert("Remove event")
    }
}

async function deleteProduct(productId) {
    try {
        let response = await axios({
            url: `/products/${productId}`,
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            }
        })
        if (response.status == 200) {
            toastr.success(response.data.details)
        }
        else {
            toastr.success(response.data.details)
        }
        $('#productTable').bootstrapTable('refresh')
    }
    catch (err) {
        toastr.error(err.response.data.details.message)
    }
}

async function addProductAction() {
    try {
        let statusInput = document.querySelector("#addProductForm #status");
        let bodyFormData = new FormData(); // Currently empty
        bodyFormData.append("name", document.querySelector("#addProductForm #name").value)
        bodyFormData.append("serialNo", document.querySelector("#addProductForm #serialNo").value)
        bodyFormData.append("assetTag", document.querySelector("#addProductForm #assetTag").value)
        bodyFormData.append("model", document.querySelector("#addProductForm #model").value)
        bodyFormData.append("vendor", document.querySelector("#addProductForm #vendor").value)
        bodyFormData.append("category", document.querySelector("#addProductForm #category").value)
        bodyFormData.append("location", document.querySelector("#addProductForm #location").value)
        bodyFormData.append("manufacturer", document.querySelector("#addProductForm #manufacturer").value)
        bodyFormData.append("purchaseCost", document.querySelector("#addProductForm #purchaseCost").value)
        bodyFormData.append("purchaseDate", document.querySelector("#addProductForm #purchaseDate").value)
        bodyFormData.append("warrenty", document.querySelector("#addProductForm #warrenty").value)
        bodyFormData.append("status", statusInput.options[statusInput.selectedIndex].value)
        bodyFormData.append("image", document.querySelector("#addProductForm #image").value)
        bodyFormData.append("description", document.querySelector("#addProductForm #description").value)
        let response = await axios({
            method: 'post',
            url: '/products',
            data: JSON.stringify(Object.fromEntries(bodyFormData.entries())),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            }
        });
        if (response.status === 200) {
            toastr.success(JSON.stringify(response.data.details))
            addProductForm.reset();
            $('.selectpicker').selectpicker('render');
        }
    }
    catch (error) {
        toastr.error(JSON.stringify(error.response.data.details.message))
    }
}
async function addOperationsAction() {
    try {
        let statusInput = document.querySelector("#addOperationsForm #status");
        let productInput = document.querySelector("#addOperationsForm #productId");
        let userInput = document.querySelector("#addOperationsForm #assignedUserId");
        let eventInput = document.querySelector("#addOperationsForm #eventId");
        let bodyFormData = new FormData(); // Currently empty
        bodyFormData.append("productId", productInput.options[productInput.selectedIndex].value)
        bodyFormData.append("assignedUserId", userInput.options[userInput.selectedIndex].value)
        bodyFormData.append("eventId", eventInput.options[eventInput.selectedIndex].value)
        bodyFormData.append("status", statusInput.options[statusInput.selectedIndex].value)
        bodyFormData.append("description", document.querySelector("#addOperationsForm #description").value)
        bodyFormData.append("dateIn", document.querySelector("#addOperationsForm #dateIn").value)
        bodyFormData.append("dateOut", document.querySelector("#addOperationsForm #dateOut").value)
        let response = await axios({
            method: 'post',
            url: '/operations',
            data: JSON.stringify(Object.fromEntries(bodyFormData.entries())),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            }
        });
        if (response.status === 200) {
            // $('.selectpicker').selectpicker('refresh');
            toastr.success(JSON.stringify(response.data.details))
            addOperationsForm.reset();
            $('.selectpicker').selectpicker('render');
            $('#eventDetails').collapse("hide");
            // $('#operationsTable').bootstrapTable('refresh')
            // $('#operationsTable').bootstrapTable()
            // buildUserDivForOperationsForm();
            // buildProductsDivForOperationsForm();
            // $('.selectpicker').selectpicker('refresh');
            // addOperationsForm.reset();
            // $("#addOperationsForm").trigger('reset')
        }
    }
    catch (error) {
        toastr.error(error.response.data.details.message)
    }
}
async function addEventsAction() {
    try {
        let statusInput = document.querySelector("#addEventsForm #status");
        let bodyFormData = new FormData(); // Currently empty
        bodyFormData.append("name", document.querySelector("#addEventsForm #name").value)
        bodyFormData.append("location", document.querySelector("#addEventsForm #location").value)
        bodyFormData.append("category", document.querySelector("#addEventsForm #category").value)
        bodyFormData.append("budget", document.querySelector("#addEventsForm #budget").value)
        bodyFormData.append("dateIn", document.querySelector("#addEventsForm #dateIn").value)
        bodyFormData.append("dateOut", document.querySelector("#addEventsForm #dateOut").value)
        bodyFormData.append("status", statusInput.options[statusInput.selectedIndex].value)
        bodyFormData.append("description", document.querySelector("#addEventsForm #description").value)
        let response = await axios({
            method: 'post',
            url: '/events',
            data: JSON.stringify(Object.fromEntries(bodyFormData.entries())),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            }
        });
        if (response.status === 200) {
            toastr.success(JSON.stringify(response.data.details))
            addEventsForm.reset();
        }
    }
    catch (error) {
        toastr.error(JSON.stringify(error.response.data.details.message))
    }
}
async function updateOperationsAction() {
    try {
        let statusInput = document.querySelector("#operationsActionModal #status");
        let bodyFormData = new FormData(); // Currently empty
        bodyFormData.append("status", statusInput.options[statusInput.selectedIndex].value)
        bodyFormData.append("opsId", document.querySelector("#operationsActionModal #opsId").value)
        bodyFormData.append("remarks", document.querySelector("#operationsActionModal #remarks").value)
        let response = await axios({
            method: 'put',
            url: '/operations/updateStatus',
            data: JSON.stringify(Object.fromEntries(bodyFormData.entries())),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            }
        });
        if (response.status === 200) {
            toastr.success(JSON.stringify(response.data.details))
            $('#operationsTable').bootstrapTable('refresh')
        }
    }
    catch (error) {
        toastr.error(JSON.stringify(error.response.data.details.message))
    }
}
async function updateProductsAction() {
    try {
        let statusInput = document.querySelector("#changeProductStatusModal #status");
        let bodyFormData = new FormData(); // Currently empty
        bodyFormData.append("status", statusInput.options[statusInput.selectedIndex].value)
        bodyFormData.append("productId", document.querySelector("#changeProductStatusModal #productId").value)
        bodyFormData.append("remarks", document.querySelector("#changeProductStatusModal #remarks").value)
        let response = await axios({
            method: 'put',
            url: '/products/updateStatus',
            data: JSON.stringify(Object.fromEntries(bodyFormData.entries())),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            }
        });
        if (response.status === 200) {
            toastr.success(JSON.stringify(response.data.details))
            $('#productTable').bootstrapTable('refresh')
        }
    }
    catch (error) {
        toastr.error(JSON.stringify(error.response.data.details.message))
    }
}

async function buildDivsForAddOperations() {
    getAllUsers().then(data => {
        let stringBuilder = "";
        data.forEach(user => {
            stringBuilder += `<option value = "${user._id}">${user.fullName} </option>`
        })
        document.querySelector("#addOperationsForm #assignedUserId").innerHTML = stringBuilder;
        $('.selectpicker').selectpicker('refresh');
    })
    getAllProductCatgories().then(data => {
        let productCategoryStringBuilder = "";
        data.forEach(category => {
            productCategoryStringBuilder += `<option value = "${category}">${category}</option>`
        })
        document.querySelector("#addOperationsForm #productCategory").innerHTML = productCategoryStringBuilder;
        $('.selectpicker').selectpicker('refresh');
    })
    getAllDictionarys("assignmentStatus").then(data => {
        let stringBuilder = "";
        data[0].values.forEach(value => {
            stringBuilder += `  <option data-content="<span class='badge badge-${value.cssClass.class}'>${value.name}</span>">${data[0]._id},${value._id}</option>`
        })
        document.querySelector("#addOperationsForm #status").innerHTML = stringBuilder;
        $('.selectpicker').selectpicker('refresh');
    })
}
$('#addOperationsForm #productCategory').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
    var selected = $(e.currentTarget).val();
    getAllProductManufacturer($('#addOperationsForm #productCategory').val()).then(data => {
        let productManufacturerStringBuilder = "";
        data.forEach(manufacturer => {
            productManufacturerStringBuilder += `<option value = "${manufacturer}">${manufacturer}</option>`
        })
        document.querySelector("#addOperationsForm #productManufacturer").innerHTML = productManufacturerStringBuilder;
        document.querySelector("#addOperationsForm #productModel").innerHTML = "";
        document.querySelector("#addOperationsForm #productId").innerHTML = "";
        $('.selectpicker').selectpicker('refresh');
    })
});
$('#addOperationsForm #productManufacturer').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
    var selected = $(e.currentTarget).val();
    getAllProductModels($('#addOperationsForm #productManufacturer').val()).then(data => {
        // getAllProductManufacturer($('#addOperationsForm #productManufacturer').val()).then(data => {
        let productModelStringBuilder = "";
        data.forEach(model => {
            productModelStringBuilder += `<option value = "${model}">${model}</option>`
        })
        document.querySelector("#addOperationsForm #productModel").innerHTML = productModelStringBuilder;
        document.querySelector("#addOperationsForm #productId").innerHTML = "";
        $('.selectpicker').selectpicker('refresh');
    })
});
$('#addOperationsForm #productModel').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
    var selected = $(e.currentTarget).val();
    getAllProducts($('#addOperationsForm #productModel').val()).then(data => {
        let productBrandStringBuilder = "";
        data.forEach(product => {
            let statusObj = product.status.group.values.find(o => o._id === product.status.item);
            // productBrandStringBuilder += `<option value = "${product._id}">${product.assetTag} -  ${statusObj.name}</option>`
            productBrandStringBuilder += `  <option data-content="${product.assetTag} <span class='badge badge-${statusObj.cssClass.class}'>${statusObj.name}</span>">${product._id}</option>`
        })
        document.querySelector("#addOperationsForm #productId").innerHTML = productBrandStringBuilder;
        $('.selectpicker').selectpicker('refresh');
    })
});
function buildEventDivForAddOperations() {
    let eventSelector = document.querySelector("#addOperationsForm #eventId")
    getAllEvents().then(data => {
        let stringBuilder = "";
        data.forEach(event => {
            stringBuilder += `<option value = "${event._id}"> ${event.name} </option>`
        })
        eventSelector.innerHTML = stringBuilder;
        $('.selectpicker').selectpicker('refresh');
    })
}
function buildProductListDiv() {
    getAllDictionarys("productStatus").then(data => {
        let stringBuilder = "";
        data[0].values.forEach(value => {
            // stringBuilder += `  <option data-content="<span class='badge badge-${value.cssClass.class}'>${value.name}</span>">${value.name}</option>`
            stringBuilder += `  <option data-content="<span class='badge badge-${value.cssClass.class}'>${value.name}</span>">${data[0]._id},${value._id}</option>`
        })
        document.querySelector("#addProductForm #status").innerHTML = stringBuilder;
        $('.selectpicker').selectpicker('refresh');
    })
}
function buildAddProductDiv() {
    buildProductListDiv();
    const datePickerOptions = { enableTime: true }
    $("#addProductForm #purchaseDate").flatpickr(datePickerOptions);
}
function buildDivForAddEvent() {
    getAllDictionarys("eventStatus").then(data => {
        let stringBuilder = "";
        data[0].values.forEach(value => {
            stringBuilder += `  <option data-content="<span class='badge badge-${value.cssClass.class}'>${value.name}</span>">${data[0]._id},${value._id}</option>`
        })
        document.querySelector("#addEventsForm #status").innerHTML = stringBuilder;
        $('.selectpicker').selectpicker('refresh');
    })
}
$('#addOperationsForm #eventId').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
    var selected = $(e.currentTarget).val();
    // var selectedText = $(e.currentTarget).text;
    let selectedText = $(e.currentTarget).children("option").filter(":selected").text()
    $('#eventDetails').collapse("show");
    let stringBuilder =
        `
        <h4 class="mb-4">
        <strong>Assigned Products -  ${selectedText} </strong>
      </h4>
        <div class="card-body">
    
        <form>
        <table id="operationsTable" 
        data-toggle="table" 
        data-pagination="true" 
        data-search="true"
        data-buttons-align="right" 
        data-show-refresh="true" 
        data-buttons-class="primary" 
        data-id-field="_id"
        data-select-item-name="_id" 
        data-click-to-select="true" 
        data-ajax="loadOperationsData" 
        data-query-params="queryParamsAddAssignmentTable"
        data-toolbar="#remove" 
        data-filter-control="true"
        class="table table-borderless">
          <thead>
            <tr>
              <!-- <th data-field="state" data-checkbox="true" data-field="_id"></th> -->
              <th data-sortable="true" data-field="product.name" >Product Name</th>
              <th data-sortable="true"  data-formatter="formatDateforTable" data-field="dateIn">From
              </th>
              <th data-sortable="true" data-formatter="formatDateforTable"  data-field="dateOut">To
              </th>
              <th data-sortable="true" data-field="assignedTo.username">Assigned To
              </th>
              <th data-sortable="true" 
              
              data-formatter="formatStatusforTable" 
              data-search-formatter="false" 
              data-field="status"
               >Status</th>
              <th data-sortable="true" data-field="description">Description</th>
              <th data-field="operate" data-formatter="productOperateFormatter" data-events="operateEvents">
                Actions</th>
            </tr>
          </thead>
        </table>
        </form>
        </p>
      </div>
  `
    allAssignmentOfEvent.innerHTML = stringBuilder;
    $('#operationsTable').bootstrapTable()
});
function formatDateforTable(value, row, index) {
    return moment(value).format('DD/MM/YYYY');
}
function formatStatusforTable(value, row, index) {
    let statusObj = value.group.values.find(o => o._id === value.item);
    return `<div class="badge badge-${statusObj.cssClass.class}"> ${statusObj.name}</div>`
}
function formatStatusforDictionaryTable(value, row, index) {
    // let statusObj = value.group.values.find(o => o._id === value.item);
    // return `<div class="badge badge-${statusObj.cssClass.class}"> ${statusObj.name}</div>`
    return `<div class="badge badge-${value.class} "> ${value.color}</div>`
}

if (categoryElement) {
    $('#dictionaryAddModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var tile = button.data('title') // Extract info from data-* attributes
        var dictname = button.data('dictname') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        modal.find('.modal-title').text('Add new item to ' + tile)
        modal.find('.modal-body #dictionaryName').val(dictname)
    })
}
$('#changeProductStatusModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var productId = button.data('productid') // Extract info from data-* attributes
    var modal = $(this)
    modal.find('.modal-body #productId').val(productId)
})
if (dashboardStatistics) {
    getDashboardData();
}
if (addOperationsForm) {
    buildDivsForAddOperations()
    buildEventDivForAddOperations()
    const datePickerOptions = { enableTime: true }
    $("#addOperationsForm #dateIn").flatpickr(datePickerOptions);
    $("#addOperationsForm #dateOut").flatpickr(datePickerOptions);
    addOperationsForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        addOperationsAction();
    })
}
if (operationsTable) {
    //script for modal actions
    $('#operationsActionModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        let opsId = button.data('opsid') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        modal.find('.modal-body #opsId').val(opsId)
    })
    getAllDictionarys("assignmentStatus").then(data => {
        let stringBuilder = "";
        data[0].values.forEach(value => {
            stringBuilder += `  <option data-content="<span class='badge badge-${value.cssClass.class}'>${value.name}</span>">${data[0]._id},${value._id}</option>`
        })
        document.querySelector("#operationsActionModal #status").innerHTML = stringBuilder;
        $('.selectpicker').selectpicker('refresh');
    })
    document.querySelector("#operationsActionModal #changeAssignmentStatusButton").addEventListener("click", (e) => {
        e.preventDefault();
        updateOperationsAction();
        $('#operationsActionModal').modal('hide')
    })
}
if (calenderView) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + '/' + mm + '/' + dd;
    let calenderData = [];
    getAllUsers().then(data => {
        let stringBuilder = "";
        data.username.forEach(user => {
            stringBuilder += `<option value = "${user._id}">${user.username} </option>`
        })
        document.querySelector("#calenderHead #assignedUserId").innerHTML = stringBuilder;
        $('.selectpicker').selectpicker('refresh');
    })
    getAllOperations().then(operations => {
        if (operations) {
            operations.forEach(data => {
                let startDate = moment.utc(data.dateIn).local().format('YYYY-MM-DD HH:mm:ss');
                let endDate = moment.utc(data.dateOut).local().format('YYYY-MM-DD HH:mm:ss');
                if (data.product) {
                    calenderData.push(
                        {
                            title: data.product.name,
                            start: startDate,
                            end: endDate,
                            className: 'fc-event-success'
                        })
                }
                else {
                    calenderData.push(
                        {
                            title: "Product Not Found",
                            start: startDate,
                            end: endDate,
                            className: 'fc-event-success'
                        })
                }
            })
        }
        $('.calenderView')
            .fullCalendar({
                height: 800,
                header: {
                    left: 'prev, next',
                    center: 'title',
                    right: 'month, agendaWeek, agendaDay',
                },
                buttonIcons: {
                    prev: 'none fe fe-arrow-left',
                    next: 'none fe fe-arrow-right',
                    prevYear: 'none fe fe-arrow-left',
                    nextYear: 'none fe fe-arrow-right',
                },
                defaultDate: today,
                editable: true,
                eventLimit: true,
                viewRender: function (view, element) {
                    if (!('ontouchstart' in document.documentElement) && jQuery().jScrollPane) {
                        $('.fc-scroller').jScrollPane({
                            autoReinitialise: true,
                            autoReinitialiseDelay: 100,
                        })
                    }
                },
                events: calenderData,
                eventClick: function (calEvent, jsEvent, view) {
                    if (!$(this).hasClass('event-clicked')) {
                        $('.fc-event').removeClass('event-clicked')
                        $(this).addClass('event-clicked')
                    }
                },
            })
    })
}
if (addProductForm) {
    // buildDivForAddProduct();
    buildAddProductDiv();
    addProductForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        addProductAction();
    })
}
if (changeProductStatuFrom) {
    document.querySelector("#changeProductStatusModal #changeProductStatusButton").addEventListener("click", (e) => {
        e.preventDefault();
        updateProductsAction();
        $('#changeProductStatusModal').modal('hide')
    })
}
if (addEventsForm) {
    buildDivForAddEvent();
    const datePickerOptions = { enableTime: true }
    $("#addEventsForm #dateIn").flatpickr(datePickerOptions);
    $("#addEventsForm #dateOut").flatpickr(datePickerOptions);
    addEventsForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        addEventsAction();
    })
    $('.selectpicker').selectpicker('refresh');
}
